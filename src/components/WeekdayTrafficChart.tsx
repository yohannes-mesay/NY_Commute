import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { useCommuteData } from "@/hooks/useCommuteData";
import type { CommuteDataRow } from "@/lib/api";

type TimeFilter = "morning" | "afternoon";

type DayFilter =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

interface WeekdayTrafficChartProps {
  timeFilter: TimeFilter;
  dayFilter: DayFilter;
}

interface ChartDataPoint {
  time: string;
  preDuration: number | null;
  postDuration: number | null;
}

interface WeekdaySeries {
  weekday: string;
  data: ChartDataPoint[];
  preAvgDuration: number | null;
  postAvgDuration: number | null;
  changePercent: number | null;
}

interface RouteWeekdayData {
  name: string;
  startingPoint: string | null;
  finishPoint: string | null;
  weekdays: WeekdaySeries[];
}

type CommutingRecord = CommuteDataRow;

const timeRegex = /^(\d{1,2}):(\d{2})(?:\s?(AM|PM))?$/i;

const parseTimeToMinutes = (value: string): number => {
  const match = value.match(timeRegex);
  if (match) {
    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const period = match[3]?.toUpperCase();

    if (period === "PM" && hours !== 12) {
      hours += 12;
    }
    if (period === "AM" && hours === 12) {
      hours = 0;
    }

    return hours * 60 + minutes;
  }

  const parsedDate = Date.parse(value);
  if (!Number.isNaN(parsedDate)) {
    const date = new Date(parsedDate);
    return date.getHours() * 60 + date.getMinutes();
  }

  return Number.MAX_SAFE_INTEGER;
};

const formatTimeLabel = (value: string): string => {
  const match = value.match(timeRegex);
  if (match) {
    let hours = parseInt(match[1], 10);
    const minutes = match[2];
    let period = (match[3] || "AM").toUpperCase();

    if (!match[3]) {
      period = hours >= 12 ? "PM" : "AM";
      if (hours === 0) {
        hours = 12;
      } else if (hours > 12) {
        hours -= 12;
      }
    }

    return `${hours}:${minutes} ${period}`;
  }

  const parsedDate = Date.parse(value);
  if (!Number.isNaN(parsedDate)) {
    return new Date(parsedDate).toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  return value;
};

const weekdays: DayFilter[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const WeekdayTrafficChart = ({
  timeFilter,
  dayFilter,
}: WeekdayTrafficChartProps) => {
  const [processedData, setProcessedData] = useState<RouteWeekdayData[]>([]);

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

    if (filteredRecords.length === 0) {
      setProcessedData([]);
      return;
    }

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

    const processedRoutes: RouteWeekdayData[] = [];

    Object.entries(groupedByRoute).forEach(
      ([routeName, { records, startingPoint, finishPoint }]) => {
        const weekdayMap: Record<string, ValidRecord[]> = {};

        records.forEach((record) => {
          const dayKey = record.weekday || "Unknown";
          if (!weekdayMap[dayKey]) {
            weekdayMap[dayKey] = [];
          }
          weekdayMap[dayKey].push(record);
        });

        const weekdaySeries: WeekdaySeries[] = weekdays.map((day) => {
          const dayRecords = weekdayMap[day] ?? [];

          const timeBuckets: Record<
            string,
            {
              preTotal: number;
              preCount: number;
              postTotal: number;
              postCount: number;
            }
          > = {};

          dayRecords.forEach((record) => {
            const timeKey = record.rounded_time || record.time || record.date;
            if (!timeKey) {
              return;
            }

            if (!timeBuckets[timeKey]) {
              timeBuckets[timeKey] = {
                preTotal: 0,
                preCount: 0,
                postTotal: 0,
                postCount: 0,
              };
            }

            if (record.congestion_pricing) {
              timeBuckets[timeKey].postTotal += record.duration_minutes;
              timeBuckets[timeKey].postCount += 1;
            } else {
              timeBuckets[timeKey].preTotal += record.duration_minutes;
              timeBuckets[timeKey].preCount += 1;
            }
          });

          const chartData: ChartDataPoint[] = Object.entries(timeBuckets)
            .map(([time, aggregate]) => ({
              time,
              preDuration:
                aggregate.preCount > 0
                  ? Math.round(aggregate.preTotal / aggregate.preCount)
                  : null,
              postDuration:
                aggregate.postCount > 0
                  ? Math.round(aggregate.postTotal / aggregate.postCount)
                  : null,
            }))
            .sort(
              (a, b) => parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time)
            );

          const preDurations = chartData
            .map((point) => point.preDuration)
            .filter((value): value is number => value !== null);

          const postDurations = chartData
            .map((point) => point.postDuration)
            .filter((value): value is number => value !== null);

          const preAvg =
            preDurations.length > 0
              ? Math.round(
                  preDurations.reduce((sum, value) => sum + value, 0) /
                    preDurations.length
                )
              : null;

          const postAvg =
            postDurations.length > 0
              ? Math.round(
                  postDurations.reduce((sum, value) => sum + value, 0) /
                    postDurations.length
                )
              : null;

          const changePercent =
            preAvg !== null && postAvg !== null && preAvg > 0
              ? Math.round(((postAvg - preAvg) / preAvg) * 100)
              : null;

          return {
            weekday: day,
            data: chartData,
            preAvgDuration: preAvg,
            postAvgDuration: postAvg,
            changePercent,
          };
        });

        processedRoutes.push({
          name: routeName,
          startingPoint,
          finishPoint,
          weekdays: weekdaySeries,
        });
      }
    );

    setProcessedData(processedRoutes);
  }, [commutingData, error, timeFilter]);

  const chartConfig = {
    duration: {
      label: "Duration (minutes)",
    },
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-slate-700/30 border-slate-600 p-4">
            <div className="h-48 flex items-center justify-center">
              <p className="text-red-400">
                Error loading data: {error.message}
              </p>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (processedData.length === 0) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
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

  const selectedDayLabel = dayFilter;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {processedData.map((route) => {
        const selectedWeekdaySeries = route.weekdays.find(
          (weekdaySeries) => weekdaySeries.weekday === dayFilter
        );

        return (
          <Card
            key={`${route.name}-${dayFilter}`}
            className="bg-slate-700/30 border-slate-600 p-4"
          >
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white">
                {route.startingPoint && route.finishPoint
                  ? `${route.startingPoint} → ${route.finishPoint}`
                  : route.name}
              </h3>
              <p className="text-sm text-gray-400">
                {selectedDayLabel} commute duration trends
              </p>
            </div>

            {selectedWeekdaySeries && selectedWeekdaySeries.data.length > 0 ? (
              <div className="h-56">
                <ChartContainer config={chartConfig} className="h-full w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={selectedWeekdaySeries.data}
                      margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                    >
                      <XAxis
                        dataKey="time"
                        tick={{ fontSize: 10, fill: "#9CA3AF" }}
                        tickFormatter={(value) =>
                          formatTimeLabel(value as string)
                        }
                      />
                      <YAxis
                        tick={{ fontSize: 10, fill: "#9CA3AF" }}
                        domain={["dataMin - 5", "dataMax + 5"]}
                      />
                      <ChartTooltip
                        content={<ChartTooltipContent />}
                        labelFormatter={(value) =>
                          formatTimeLabel(value as string)
                        }
                      />
                      <Line
                        type="monotone"
                        dataKey="preDuration"
                        stroke="#4A90E2"
                        strokeWidth={2}
                        dot={false}
                        connectNulls
                        name="Pre-congestion"
                      />
                      <Line
                        type="monotone"
                        dataKey="postDuration"
                        stroke="#2DD4BF"
                        strokeWidth={2}
                        dot={false}
                        connectNulls
                        name="Post-congestion"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            ) : (
              <div className="h-56 flex items-center justify-center text-sm text-gray-500">
                No data available for {selectedDayLabel}
              </div>
            )}

            {selectedWeekdaySeries && (
              <div className="mt-4 text-xs text-gray-400 space-y-1">
                <div className="flex justify-between">
                  <span className="flex items-center gap-1">
                    <span className="inline-block w-4 h-[3px] bg-[#4A90E2] rounded" />
                    Pre avg: {selectedWeekdaySeries.preAvgDuration ?? "-"} min
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="inline-block w-4 h-[3px] bg-[#2DD4BF] rounded" />
                    Post avg: {selectedWeekdaySeries.postAvgDuration ?? "-"} min
                  </span>
                </div>
                {selectedWeekdaySeries.changePercent !== null && (
                  <div
                    className={`text-right ${
                      selectedWeekdaySeries.changePercent > 0
                        ? "text-red-400"
                        : "text-green-400"
                    }`}
                  >
                    Change: {selectedWeekdaySeries.changePercent > 0 ? "+" : ""}
                    {selectedWeekdaySeries.changePercent}%
                  </div>
                )}
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
};
