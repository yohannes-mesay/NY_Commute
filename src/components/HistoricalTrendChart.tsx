import { useEffect, useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import type { TooltipProps } from "recharts";
import { useCommuteData } from "@/hooks/useCommuteData";
import type { CommuteDataRow } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

interface HistoricalTrendChartProps {
  timeFilter: "morning" | "afternoon";
  selectedRoute: string | null;
  routes: Array<{
    name: string;
    startingPoint: string | null;
    finishPoint: string | null;
  }>;
  onRoutesChange: (
    routes: Array<{
      name: string;
      startingPoint: string | null;
      finishPoint: string | null;
    }>
  ) => void;
}

interface DailyDataPoint {
  date: string;
  preDuration: number | null;
  postDuration: number | null;
  preTrend: number | null;
  postTrend: number | null;
}

interface RouteHistoricalData {
  routeName: string;
  startingPoint: string | null;
  finishPoint: string | null;
  data: DailyDataPoint[];
}

type CommutingRecord = CommuteDataRow;

// Linear regression helper
const calculateLinearRegression = (
  points: Array<{ x: number; y: number }>
): { slope: number; intercept: number } | null => {
  if (points.length < 2) return null;

  const n = points.length;
  const sumX = points.reduce((sum, p) => sum + p.x, 0);
  const sumY = points.reduce((sum, p) => sum + p.y, 0);
  const sumXY = points.reduce((sum, p) => sum + p.x * p.y, 0);
  const sumXX = points.reduce((sum, p) => sum + p.x * p.x, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  return { slope, intercept };
};

const formatDate = (dateString: string): string => {
  try {
    // Try ISO date string first
    let date = new Date(dateString);
    if (isNaN(date.getTime())) {
      // Try parsing as M/D/YY or M/D/YYYY format
      const parts = dateString.split("/");
      if (parts.length === 3) {
        const month = parseInt(parts[0], 10);
        const day = parseInt(parts[1], 10);
        const year = parseInt(parts[2], 10);
        const fullYear = year < 100 ? 2000 + year : year;
        date = new Date(fullYear, month - 1, day);
      }
      if (isNaN(date.getTime())) {
        return dateString;
      }
    }
    return date.toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
};

const parseDate = (dateString: string): number => {
  try {
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return date.getTime();
    }
    // Try parsing as M/D/YY format
    const parts = dateString.split("/");
    if (parts.length === 3) {
      const month = parseInt(parts[0], 10);
      const day = parseInt(parts[1], 10);
      const year = parseInt(parts[2], 10);
      const fullYear = year < 100 ? 2000 + year : year;
      return new Date(fullYear, month - 1, day).getTime();
    }
    return 0;
  } catch {
    return 0;
  }
};

export const HistoricalTrendChart = ({
  timeFilter,
  selectedRoute,
  routes,
  onRoutesChange,
}: HistoricalTrendChartProps) => {
  const [processedData, setProcessedData] = useState<RouteHistoricalData[]>([]);

  const { data: commutingData, isLoading, error } = useCommuteData(timeFilter);

  useEffect(() => {
    if (error) {
      return;
    }

    if (!commutingData) {
      setProcessedData([]);
      return;
    }

    type ValidRecord = CommutingRecord & { duration_minutes: number };

    const filteredRecords = commutingData.filter(
      (record): record is ValidRecord =>
        record.is_commuting_day === true && record.duration_minutes !== null
    );

    const groupedByRoute = filteredRecords.reduce(
      (acc, item) => {
        const routeKey = item.route_name || "Unknown Route";
        if (!acc[routeKey]) {
          acc[routeKey] = {
            records: [],
            startingPoint: item.routeids?.starting_point ?? null,
            finishPoint: item.routeids?.finish_point ?? null,
          };
        }
        acc[routeKey].records.push(item);
        if (acc[routeKey].startingPoint === null) {
          acc[routeKey].startingPoint = item.routeids?.starting_point ?? null;
        }
        if (acc[routeKey].finishPoint === null) {
          acc[routeKey].finishPoint = item.routeids?.finish_point ?? null;
        }
        return acc;
      },
      {} as Record<
        string,
        {
          records: ValidRecord[];
          startingPoint: string | null;
          finishPoint: string | null;
        }
      >
    );

    // Update routes list (only when data changes, not when selectedRoute changes)
    if (commutingData) {
      const routesList = Object.entries(groupedByRoute).map(
        ([name, { startingPoint, finishPoint }]) => ({
          name,
          startingPoint,
          finishPoint,
        })
      );
      onRoutesChange(routesList);
    }

    if (filteredRecords.length === 0) {
      setProcessedData([]);
      return;
    }

    const processedRoutes: RouteHistoricalData[] = [];

    Object.entries(groupedByRoute).forEach(
      ([routeName, { records, startingPoint, finishPoint }]) => {
        // Filter by selected route if specified
        if (selectedRoute && routeName !== selectedRoute) {
          return;
        }

        const dateBuckets: Record<
          string,
          {
            preTotal: number;
            preCount: number;
            postTotal: number;
            postCount: number;
          }
        > = {};

        records.forEach((record) => {
          const dateKey = record.date;
          if (!dateKey) {
            return;
          }

          if (!dateBuckets[dateKey]) {
            dateBuckets[dateKey] = {
              preTotal: 0,
              preCount: 0,
              postTotal: 0,
              postCount: 0,
            };
          }

          if (record.congestion_pricing) {
            dateBuckets[dateKey].postTotal += record.duration_minutes;
            dateBuckets[dateKey].postCount += 1;
          } else {
            dateBuckets[dateKey].preTotal += record.duration_minutes;
            dateBuckets[dateKey].preCount += 1;
          }
        });

        const dailyData: DailyDataPoint[] = Object.entries(dateBuckets)
          .map(([date, aggregate]) => ({
            date,
            preDuration:
              aggregate.preCount > 0
                ? Math.round(aggregate.preTotal / aggregate.preCount)
                : null,
            postDuration:
              aggregate.postCount > 0
                ? Math.round(aggregate.postTotal / aggregate.postCount)
                : null,
            preTrend: null,
            postTrend: null,
          }))
          .sort((a, b) => parseDate(a.date) - parseDate(b.date));

        // Calculate linear regression for pre-congestion data
        // Use indices since dates are already sorted chronologically
        const prePoints = dailyData
          .map((point, index) => ({
            x: index,
            y: point.preDuration,
          }))
          .filter((p): p is { x: number; y: number } => p.y !== null);

        const preRegression = calculateLinearRegression(prePoints);
        if (preRegression && prePoints.length > 0) {
          dailyData.forEach((point, index) => {
            if (prePoints.some((p) => p.x === index)) {
              point.preTrend =
                preRegression.slope * index + preRegression.intercept;
            }
          });
        }

        // Calculate linear regression for post-congestion data
        const postPoints = dailyData
          .map((point, index) => ({
            x: index,
            y: point.postDuration,
          }))
          .filter((p): p is { x: number; y: number } => p.y !== null);

        const postRegression = calculateLinearRegression(postPoints);
        if (postRegression && postPoints.length > 0) {
          dailyData.forEach((point, index) => {
            if (postPoints.some((p) => p.x === index)) {
              point.postTrend =
                postRegression.slope * index + postRegression.intercept;
            }
          });
        }

        processedRoutes.push({
          routeName,
          startingPoint,
          finishPoint,
          data: dailyData,
        });
      }
    );

    setProcessedData(processedRoutes);
  }, [commutingData, error, timeFilter, selectedRoute, onRoutesChange]);

  const chartConfig = {
    duration: {
      label: "Duration (minutes)",
    },
  };

  if (isLoading) {
    return (
      <div className="h-80 sm:h-96 flex items-center justify-center">
        <Skeleton className="h-full w-full bg-slate-700/60" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-80 sm:h-96 flex items-center justify-center">
        <p className="text-red-400 text-sm px-4 text-center">
          Error loading data: {error.message}
        </p>
      </div>
    );
  }

  if (processedData.length === 0) {
    return (
      <div className="h-80 sm:h-96 flex items-center justify-center">
        <p className="text-gray-400 text-sm">No data available</p>
      </div>
    );
  }

  // Render chart for the selected route or first route
  const routeToDisplay =
    processedData.find(
      (r) => !selectedRoute || r.routeName === selectedRoute
    ) || processedData[0];

  if (!routeToDisplay) {
    return (
      <div className="h-80 sm:h-96 flex items-center justify-center">
        <p className="text-gray-400 text-sm">No route data available</p>
      </div>
    );
  }

  return (
    <div className="h-80 sm:h-96 w-full overflow-x-auto">
      <div className="min-w-[600px] sm:min-w-0 h-full">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={routeToDisplay.data}
              margin={{
                top: 5,
                right: 10,
                left: 5,
                bottom: 60,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 9, fill: "#9CA3AF" }}
                tickFormatter={(value) => formatDate(value as string)}
                angle={-45}
                textAnchor="end"
                height={60}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 9, fill: "#9CA3AF" }}
                domain={["dataMin - 10", "dataMax + 10"]}
                width={40}
                label={{
                  value: "Duration (minutes)",
                  angle: -90,
                  position: "insideLeft",
                  style: { fill: "#9CA3AF", fontSize: 10 },
                }}
              />
              <ChartTooltip
                content={(props: TooltipProps<string, number>) => {
                  if (!props.payload) return null;
                  // Filter out the "Linear (Pre-Congestion Pricing)" and "Linear (Post-Congestion Pricing)" lines from tooltip
                  const filteredPayload = props.payload.filter(
                    (item) => item.dataKey !== "postTrend" && item.dataKey !== "preTrend"
                  );
                  return (
                    <ChartTooltipContent
                      {...props}
                      payload={filteredPayload}
                      labelFormatter={(value) => formatDate(value as string)}
                      formatter={(value, name, item) => {
                        return (
                          <div className="flex items-center justify-between gap-6 w-full">
                            <span className="text-muted-foreground">
                              {name}
                            </span>
                            <span className="font-mono font-medium tabular-nums text-foreground ml-4">
                              {typeof value === "number" ? value.toLocaleString() : value}
                            </span>
                          </div>
                        );
                      }}
                    />
                  );
                }}
                labelFormatter={(value) => formatDate(value as string)}
              />
              <Legend
                wrapperStyle={{ fontSize: "10px", color: "#9CA3AF" }}
                iconType="line"
                payload={[
                  {
                    value: "Pre-Congestion Pricing",
                    type: "line",
                    id: "preDuration",
                    color: "#4A90E2",
                  },
                  {
                    value: "Post-Congestion Pricing",
                    type: "line",
                    id: "postDuration",
                    color: "#2DD4BF",
                  },
                ]}
              />
              <Line
                type="monotone"
                dataKey="preDuration"
                stroke="#4A90E2"
                strokeWidth={2}
                dot={false}
                connectNulls
                name="Pre-Congestion Pricing"
              />
              <Line
                type="monotone"
                dataKey="postDuration"
                stroke="#2DD4BF"
                strokeWidth={2}
                dot={false}
                connectNulls
                name="Post-Congestion Pricing"
              />
              <Line
                type="linear"
                dataKey="preTrend"
                stroke="#4A90E2"
                strokeWidth={1.5}
                strokeDasharray="5 5"
                dot={false}
                connectNulls
                name="Linear (Pre-Congestion Pricing)"
              />
              <Line
                type="linear"
                dataKey="postTrend"
                stroke="#2DD4BF"
                strokeWidth={1.5}
                strokeDasharray="5 5"
                dot={false}
                connectNulls
                name="Linear (Post-Congestion Pricing)"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
};
