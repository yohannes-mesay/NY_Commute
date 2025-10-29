
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, TrendingUp, Award } from "lucide-react";

interface Results {
  daily: {
    driving: number;
    uber: number;
    luxury: number;
    njTransit: number;
    boxcar: number;
  };
  weekly: {
    driving: number;
    uber: number;
    luxury: number;
    njTransit: number;
    boxcar: number;
  };
  monthly: {
    driving: number;
    uber: number;
    luxury: number;
    njTransit: number;
    boxcar: number;
  };
  breakdown: {
    fuel: number;
    tolls: number;
    parking: number;
    congestion: number;
  };
  recommendation: {
    method: string;
    reason: string;
  };
}

interface CommuteResultsProps {
  results: Results;
}

export const CommuteResults = ({ results }: CommuteResultsProps) => {
  const dailyData = [
    { name: 'Driving', cost: results.daily.driving, fill: '#ef4444' },
    { name: 'Uber', cost: results.daily.uber, fill: '#f97316' },
    { name: 'Luxury Car', cost: results.daily.luxury, fill: '#8b5cf6' },
    { name: 'NJ Transit', cost: results.daily.njTransit, fill: '#3b82f6' },
    { name: 'Boxcar Bus', cost: results.daily.boxcar, fill: '#10b981' }
  ];

  const weeklyData = [
    { name: 'Driving', cost: results.weekly.driving, fill: '#ef4444' },
    { name: 'Uber', cost: results.weekly.uber, fill: '#f97316' },
    { name: 'Luxury Car', cost: results.weekly.luxury, fill: '#8b5cf6' },
    { name: 'NJ Transit', cost: results.weekly.njTransit, fill: '#3b82f6' },
    { name: 'Boxcar Bus', cost: results.weekly.boxcar, fill: '#10b981' }
  ];

  const monthlyData = [
    { name: 'Driving', cost: results.monthly.driving, fill: '#ef4444' },
    { name: 'Uber', cost: results.monthly.uber, fill: '#f97316' },
    { name: 'Luxury Car', cost: results.monthly.luxury, fill: '#8b5cf6' },
    { name: 'NJ Transit', cost: results.monthly.njTransit, fill: '#3b82f6' },
    { name: 'Boxcar Bus', cost: results.monthly.boxcar, fill: '#10b981' }
  ];

  const breakdownData = [
    { name: 'Fuel', value: results.breakdown.fuel, fill: '#ef4444' },
    { name: 'Tolls', value: results.breakdown.tolls, fill: '#f97316' },
    { name: 'Parking', value: results.breakdown.parking, fill: '#eab308' },
    { name: 'Congestion Fee', value: results.breakdown.congestion, fill: '#dc2626' }
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 p-3 rounded-lg border border-slate-600 shadow-lg">
          <p className="text-white font-medium">{label}</p>
          <p className="text-green-400">
            Cost: ${payload[0].value.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 p-3 rounded-lg border border-slate-600 shadow-lg">
          <p className="text-white font-medium">{payload[0].name}</p>
          <p className="text-green-400">
            ${payload[0].value.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      {/* Bar Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-lg">Daily Roundtrip Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={dailyData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#9ca3af', fontSize: 10 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="cost" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-lg">Weekly Roundtrip Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#9ca3af', fontSize: 10 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="cost" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-lg">Monthly Roundtrip Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthlyData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#9ca3af', fontSize: 10 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="cost" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row: Breakdown and Recommendation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-400" />
              Self-Driving Cost Breakdown
            </CardTitle>
            <CardDescription className="text-gray-400">
              Daily cost components for driving to NYC
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={breakdownData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: $${value.toFixed(2)}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {breakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-400" />
              Smart Recommendation
            </CardTitle>
            <CardDescription className="text-gray-400">
              Based on your preferences and priorities
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col justify-center h-64">
            <div className="text-center">
              <div className="mb-4">
                <h3 className="text-2xl font-bold text-white mb-2">
                  Your best commuting option is:
                </h3>
                <div className="text-3xl font-bold text-green-400 mb-4">
                  {results.recommendation.method}
                </div>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed">
                {results.recommendation.reason}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
