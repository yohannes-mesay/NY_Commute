
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { supabase } from "@/integrations/supabase/client";

interface TrafficChartProps {
  timeFilter: 'morning' | 'afternoon';
}

interface ChartDataPoint {
  date: string;
  duration: number;
  isPre: boolean;
}

interface RouteData {
  name: string;
  color: string;
  bgColor: string;
  data: ChartDataPoint[];
  avgDuration: number;
  changePercent: number;
}

export const TrafficChart = ({ timeFilter }: TrafficChartProps) => {
  const [processedData, setProcessedData] = useState<RouteData[]>([]);

  // Fetch commuting data from Supabase
  const { data: commutingData, isLoading, error } = useQuery({
    queryKey: ['commuting-data', timeFilter],
    queryFn: async () => {
      console.log('Fetching commuting data for timeFilter:', timeFilter);
      console.log('Supabase client:', supabase);
      
      // First, let's check if we can access the table at all
      const { data: testData, error: testError } = await supabase
        .from('CommutingData')
        .select('*')
        .limit(5);
      
      console.log('Test query result:', { testData, testError });
      
      // Now the main query
      const { data, error } = await supabase
        .from('CommutingData')
        .select('*')
        .eq('is_commuting_day', true)
        .eq('is_morning', timeFilter === 'morning')
        .not('duration_minutes', 'is', null)
        .order('date', { ascending: true });

      console.log('Main query result:', { data, error, dataLength: data?.length });

      if (error) {
        console.error('Error fetching commuting data:', error);
        throw error;
      }

      console.log('Fetched commuting data:', data?.length, 'records');
      console.log('Sample data:', data?.slice(0, 3));
      return data;
    }
  });

  // Process the data when it changes
  useEffect(() => {
    if (error) {
      console.error('Query error:', error);
      return;
    }

    if (!commutingData) {
      console.log('No commuting data available (undefined/null)');
      setProcessedData([]);
      return;
    }

    if (commutingData.length === 0) {
      console.log('No commuting data available (empty array)');
      setProcessedData([]);
      return;
    }

    console.log('Processing commuting data...', commutingData.length, 'records');

    // Group by route and calculate daily averages
    const routeGroups: { [key: string]: any[] } = {};
    
    commutingData.forEach(record => {
      const routeName = record.route_name || 'Unknown Route';
      if (!routeGroups[routeName]) {
        routeGroups[routeName] = [];
      }
      routeGroups[routeName].push(record);
    });

    console.log('Route groups:', Object.keys(routeGroups));

    // Define region mapping and colors
    const regionMapping: { [key: string]: { name: string; color: string; bgColor: string } } = {
      'New Jersey': { name: 'New Jersey', color: 'rgb(239, 68, 68)', bgColor: 'rgba(239, 68, 68, 0.1)' },
      'Connecticut': { name: 'Connecticut', color: 'rgb(34, 197, 94)', bgColor: 'rgba(34, 197, 94, 0.1)' },
      'Long Island': { name: 'Long Island', color: 'rgb(168, 85, 247)', bgColor: 'rgba(168, 85, 247, 0.1)' }
    };

    const processedRoutes: RouteData[] = [];

    Object.entries(routeGroups).forEach(([routeName, records]) => {
      // Try to map route to region (simple string matching)
      let regionInfo = regionMapping['New Jersey']; // default
      
      if (routeName.toLowerCase().includes('connecticut') || routeName.toLowerCase().includes('ct')) {
        regionInfo = regionMapping['Connecticut'];
      } else if (routeName.toLowerCase().includes('island') || routeName.toLowerCase().includes('li')) {
        regionInfo = regionMapping['Long Island'];
      } else if (routeName.toLowerCase().includes('jersey') || routeName.toLowerCase().includes('nj')) {
        regionInfo = regionMapping['New Jersey'];
      }

      // Group by date and calculate daily averages
      const dailyData: { [key: string]: { total: number; count: number; isPre: boolean } } = {};
      
      records.forEach(record => {
        const date = record.date;
        const duration = record.duration_minutes;
        const isPre = !record.congestion_pricing;
        
        if (!dailyData[date]) {
          dailyData[date] = { total: 0, count: 0, isPre };
        }
        
        dailyData[date].total += duration;
        dailyData[date].count += 1;
      });

      // Convert to chart data points
      const chartData: ChartDataPoint[] = Object.entries(dailyData)
        .map(([date, data]) => ({
          date,
          duration: Math.round(data.total / data.count),
          isPre: data.isPre
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      // Calculate average and change percentage
      const preData = chartData.filter(d => d.isPre);
      const postData = chartData.filter(d => !d.isPre);
      
      const preAvg = preData.length > 0 ? preData.reduce((sum, d) => sum + d.duration, 0) / preData.length : 0;
      const postAvg = postData.length > 0 ? postData.reduce((sum, d) => sum + d.duration, 0) / postData.length : 0;
      
      const changePercent = preAvg > 0 ? Math.round(((postAvg - preAvg) / preAvg) * 100) : 0;

      processedRoutes.push({
        name: regionInfo.name,
        color: regionInfo.color,
        bgColor: regionInfo.bgColor,
        data: chartData,
        avgDuration: Math.round((preAvg + postAvg) / 2),
        changePercent
      });
    });

    console.log('Processed routes:', processedRoutes.length);
    setProcessedData(processedRoutes);
  }, [commutingData, error]);

  const chartConfig = {
    duration: {
      label: "Duration (minutes)",
    },
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-slate-700/30 border-slate-600 p-4">
            <div className="h-48 flex items-center justify-center">
              <p className="text-gray-400">Loading data...</p>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-slate-700/30 border-slate-600 p-4">
            <div className="h-48 flex items-center justify-center">
              <p className="text-red-400">Error loading data: {error.message}</p>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (processedData.length === 0) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-slate-700/30 border-slate-600 p-4">
            <div className="h-48 flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-400">No data available</p>
                <p className="text-xs text-gray-500 mt-2">
                  Check console for debugging info
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {processedData.map((route) => (
        <Card key={route.name} className="bg-slate-700/30 border-slate-600 p-4">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-white">{route.name}</h3>
            <p className="text-sm text-gray-400 capitalize">{timeFilter} Commute</p>
          </div>
          
          <div className="h-48 mb-3">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={route.data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 10, fill: '#9CA3AF' }}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return `${date.getMonth() + 1}/${date.getDate()}`;
                    }}
                  />
                  <YAxis 
                    tick={{ fontSize: 10, fill: '#9CA3AF' }}
                    domain={['dataMin - 5', 'dataMax + 5']}
                  />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    labelFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleDateString();
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="duration" 
                    stroke={route.color}
                    strokeWidth={2}
                    dot={false}
                    connectNulls={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
          
          <div className="text-xs text-gray-500">
            <div className="flex justify-between">
              <span>Avg: ~{route.avgDuration} min</span>
              <span className={route.changePercent > 0 ? 'text-red-400' : 'text-green-400'}>
                Change: {route.changePercent > 0 ? '+' : ''}{route.changePercent}%
              </span>
            </div>
            <div className="mt-1 text-center">
              <span className="text-red-400">●</span> Pre-Jan 5 
              <span className="mx-2">|</span>
              <span className="text-blue-400">●</span> Post-Jan 5
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
