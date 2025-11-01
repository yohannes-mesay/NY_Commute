import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import {
  Card,
  CardDescription,
  CardTitle,
  CardHeader,
  CardContent,
} from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import { getCommuteData, type CommuteDataRow } from "@/lib/api";

const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const timeRegex = /^(\d{1,2}):(\d{2})(?:\s?(AM|PM))?$/i;

const parseTimeToMinutes = (value: string): number => {
  const match = value.match(timeRegex);
  if (match) {
    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const period = match[3]?.toUpperCase();

    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;

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

const getCellStyle = (value: number | null) => {
  if (value === null) {
    return {
      backgroundColor: "rgba(148, 163, 184, 0.12)",
      color: "#94a3b8",
    };
  }

  const clamped = Math.max(-20, Math.min(20, value));
  const intensity = Math.min(1, Math.abs(clamped) / 20);
  const alpha = 0.18 + intensity * 0.55;

  if (clamped < 0) {
    return {
      backgroundColor: `rgba(45, 212, 191, ${alpha})`,
      color: "#0f766e",
    };
  }

  return {
    backgroundColor: `rgba(248, 113, 113, ${alpha})`,
    color: "#991b1b",
  };
};

type DayBucket = {
  preTotal: number;
  preCount: number;
  postTotal: number;
  postCount: number;
};

type HeatmapRow = {
  time: string;
  values: Record<string, number | null>;
};

type HeatmapSection = {
  label: string;
  rows: HeatmapRow[];
};

type HeatmapRoute = {
  routeName: string;
  startingPoint: string | null;
  finishPoint: string | null;
  sections: HeatmapSection[];
};

const buildHeatmap = (data: CommuteDataRow[]): HeatmapRoute[] => {
  const routeMap = new Map<
    string,
    {
      startingPoint: string | null;
      finishPoint: string | null;
      morning: Map<string, Map<string, DayBucket>>;
      afternoon: Map<string, Map<string, DayBucket>>;
    }
  >();

  data.forEach((record) => {
    const routeName = record.route_name || "Unknown Route";
    if (!routeMap.has(routeName)) {
      routeMap.set(routeName, {
        startingPoint: record.routeids?.starting_point ?? null,
        finishPoint: record.routeids?.finish_point ?? null,
        morning: new Map(),
        afternoon: new Map(),
      });
    }

    const routeEntry = routeMap.get(routeName)!;

    if (routeEntry.startingPoint === null && record.routeids?.starting_point) {
      routeEntry.startingPoint = record.routeids.starting_point;
    }

    if (routeEntry.finishPoint === null && record.routeids?.finish_point) {
      routeEntry.finishPoint = record.routeids.finish_point;
    }

    const periodMap = record.is_morning
      ? routeEntry.morning
      : routeEntry.afternoon;
    const timeKey = record.rounded_time || record.time || record.date;
    const dayKey = record.weekday || "Unknown";

    if (!timeKey) {
      return;
    }

    if (!periodMap.has(timeKey)) {
      periodMap.set(timeKey, new Map());
    }

    const timeBucket = periodMap.get(timeKey)!;

    if (!timeBucket.has(dayKey)) {
      timeBucket.set(dayKey, {
        preTotal: 0,
        preCount: 0,
        postTotal: 0,
        postCount: 0,
      });
    }

    const dayBucket = timeBucket.get(dayKey)!;

    if (record.congestion_pricing) {
      dayBucket.postTotal += record.duration_minutes ?? 0;
      dayBucket.postCount += record.duration_minutes !== null ? 1 : 0;
    } else {
      dayBucket.preTotal += record.duration_minutes ?? 0;
      dayBucket.preCount += record.duration_minutes !== null ? 1 : 0;
    }
  });

  const periods: Array<{
    key: "morning" | "afternoon";
    label: string;
  }> = [
    { key: "morning", label: "Morning" },
    { key: "afternoon", label: "Afternoon" },
  ];

  return Array.from(routeMap.entries()).map(([routeName, value]) => {
    const sections: HeatmapSection[] = periods
      .map(({ key, label }) => {
        const periodMap = value[key];
        if (periodMap.size === 0) {
          return null;
        }

        const rows: HeatmapRow[] = Array.from(periodMap.entries())
          .sort((a, b) => parseTimeToMinutes(a[0]) - parseTimeToMinutes(b[0]))
          .map(([time, dayMap]) => {
            const values: Record<string, number | null> = {};

            weekdays.forEach((day) => {
              const bucket = dayMap.get(day);

              if (bucket && bucket.preCount > 0 && bucket.postCount > 0) {
                const preAvg = bucket.preTotal / bucket.preCount;
                const postAvg = bucket.postTotal / bucket.postCount;
                values[day] = Number((postAvg - preAvg).toFixed(2));
              } else {
                values[day] = null;
              }
            });

            return {
              time: formatTimeLabel(time),
              values,
            };
          });

        return {
          label,
          rows,
        };
      })
      .filter((section): section is HeatmapSection => Boolean(section));

    return {
      routeName,
      startingPoint: value.startingPoint,
      finishPoint: value.finishPoint,
      sections,
    };
  });
};

export default function TimeHeatMap() {
  const {
    data: morningData,
    isLoading: isMorningLoading,
    isError: isMorningError,
  } = useQuery({
    queryKey: ["commuting-data", "heatmap", "morning"],
    queryFn: () => getCommuteData({ isMorning: true }),
    staleTime: 1000 * 60 * 5,
  });

  const {
    data: afternoonData,
    isLoading: isAfternoonLoading,
    isError: isAfternoonError,
  } = useQuery({
    queryKey: ["commuting-data", "heatmap", "afternoon"],
    queryFn: () => getCommuteData({ isMorning: false }),
    staleTime: 1000 * 60 * 5,
  });

  const isLoading = isMorningLoading || isAfternoonLoading;
  const hasError = isMorningError || isAfternoonError;

  const heatmapData = useMemo(() => {
    if (!morningData && !afternoonData) {
      return [];
    }

    const combined: CommuteDataRow[] = [
      ...(morningData ?? []),
      ...(afternoonData ?? []),
    ];

    return buildHeatmap(combined);
  }, [morningData, afternoonData]);

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-xl text-white">
          Change in Commute Duration by Time and Day of Week
        </CardTitle>
        <CardDescription className="text-gray-400">
          Average change in commute durations after congestion pricing (January
          5, 2025). Positive values (
          <span className="text-[#63BE7B]">green</span>) indicate reduced
          commute durations; negative values (
          <span className="text-[#F8696B]">red</span>) indicate longer durations
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid gap-4">
            {[...Array(4)].map((_, index) => (
              <Skeleton key={index} className="h-32 w-full bg-slate-700/60" />
            ))}
          </div>
        ) : hasError ? (
          <div className="h-48 bg-slate-700/30 rounded-lg flex items-center justify-center">
            <p className="text-red-400 text-sm">
              Unable to load heatmap data right now. Please try again later.
            </p>
          </div>
        ) : heatmapData.length === 0 ? (
          <div className="h-48 bg-slate-700/30 rounded-lg flex items-center justify-center">
            <p className="text-gray-400 text-sm">
              No commute data available for the selected period.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {heatmapData.map((route) => (
              <div key={route.routeName} className="space-y-3 w-full">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {route.startingPoint && route.finishPoint
                        ? `${route.startingPoint} → ${route.finishPoint}`
                        : route.routeName}
                    </h3>
                    <p className="text-xs text-gray-400">
                      Difference in average duration (post - pre) in minutes
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {route.sections.map((section) => (
                    <div
                      key={`${route.routeName}-${section.label}`}
                      className="bg-slate-900/40 border border-slate-700 rounded-lg overflow-hidden"
                    >
                      <div className="px-3 py-2 border-b border-slate-700/60 flex items-center justify-between">
                        <h4 className="text-xs font-semibold text-gray-200">
                          {section.label}
                        </h4>
                        <span className="text-[10px] text-gray-500">
                          Weekdays only
                        </span>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-[10px] text-gray-200 table-fixed">
                          <thead>
                            <tr>
                              <th className="sticky left-0 z-10 bg-slate-900/70 backdrop-blur px-2 py-1.5 text-left font-medium text-gray-400 border-b border-slate-700/60 w-20">
                                Time
                              </th>
                              {weekdays.map((day) => (
                                <th
                                  key={day}
                                  className="px-2 py-1.5 text-center font-medium text-gray-400 border-b border-slate-700/60"
                                >
                                  {day}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {section.rows.length === 0 ? (
                              <tr>
                                <td
                                  colSpan={weekdays.length + 1}
                                  className="px-3 py-6 text-center text-gray-500 text-xs"
                                >
                                  No data available
                                </td>
                              </tr>
                            ) : (
                              section.rows.map((row) => (
                                <tr key={`${section.label}-${row.time}`}>
                                  <td className="sticky left-0 z-10 bg-slate-900/70 backdrop-blur px-2 py-1.5 border-b border-slate-800/60 text-gray-300 font-medium">
                                    {row.time}
                                  </td>
                                  {weekdays.map((day) => {
                                    const value = row.values[day];
                                    const style = getCellStyle(value);

                                    return (
                                      <td
                                        key={`${section.label}-${row.time}-${day}`}
                                        className="px-2 py-1.5 border-b border-slate-800/60 text-center text-[10px] font-semibold transition-colors duration-200"
                                        style={style}
                                      >
                                        {value === null
                                          ? "—"
                                          : value.toFixed(2)}
                                      </td>
                                    );
                                  })}
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
