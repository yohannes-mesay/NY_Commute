import { useMemo } from "react";
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
} from "recharts";
import { useCommuteData } from "@/hooks/useCommuteData";
import type { CommuteDataRow } from "@/lib/api";

interface RollingAverageChartProps {
  timeFilter: "morning" | "afternoon";
  routeName: string;
  routeLabel?: string;
}

interface RollingDataPoint {
  date: string;
  preRollingAverage: number | null;
  postRollingAverage: number | null;
}

type CommutingRecord = CommuteDataRow & { duration_minutes: number };

const CONGESTION_PRICING_START_DATE = new Date("2025-01-05").getTime();

// US Federal Bank Holidays for 2024-2025
const FEDERAL_HOLIDAYS = new Set<string>([
  "2024-01-01", // New Year's Day
  "2024-01-15", // Martin Luther King Jr. Day
  "2024-02-19", // Presidents' Day
  "2024-05-27", // Memorial Day
  "2024-06-19", // Juneteenth
  "2024-07-04", // Independence Day
  "2024-09-02", // Labor Day
  "2024-10-14", // Columbus Day
  "2024-11-11", // Veterans Day
  "2024-11-28", // Thanksgiving
  "2024-12-25", // Christmas
  "2025-01-01", // New Year's Day
  "2025-01-20", // Martin Luther King Jr. Day
  "2025-02-17", // Presidents' Day
  "2025-05-26", // Memorial Day
  "2025-06-19", // Juneteenth
  "2025-07-04", // Independence Day
  "2025-09-01", // Labor Day
  "2025-10-13", // Columbus Day
  "2025-11-11", // Veterans Day
  "2025-11-27", // Thanksgiving
  "2025-12-25", // Christmas
]);

const parseDate = (dateString: string): Date => {
  try {
    const date = new Date(dateString);
    if (!Number.isNaN(date.getTime())) {
      return date;
    }
    const parts = dateString.split("/");
    if (parts.length === 3) {
      const month = parseInt(parts[0], 10);
      const day = parseInt(parts[1], 10);
      const year = parseInt(parts[2], 10);
      const fullYear = year < 100 ? 2000 + year : year;
      return new Date(fullYear, month - 1, day);
    }
    return new Date(0);
  } catch {
    return new Date(0);
  }
};

const formatDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const isWeekday = (date: Date): boolean => {
  const day = date.getDay();
  return day >= 1 && day <= 5; // Monday (1) through Friday (5)
};

const isFederalHoliday = (date: Date): boolean => {
  const dateStr = formatDateString(date);
  return FEDERAL_HOLIDAYS.has(dateStr);
};

const formatDate = (dateString: string): string => {
  try {
    const date = parseDate(dateString);
    if (date.getTime() === 0) {
      return dateString;
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

const computeRollingAverage = (
  records: CommutingRecord[]
): Map<string, number> => {
  // Filter to only weekdays and exclude federal holidays
  const weekdayRecords = records.filter((record) => {
    const date = parseDate(record.date);
    if (date.getTime() === 0) return false;
    return isWeekday(date) && !isFederalHoliday(date);
  });

  // Sort by date
  const sortedRecords = [...weekdayRecords].sort(
    (a, b) => parseDate(a.date).getTime() - parseDate(b.date).getTime()
  );

  const rollingMap = new Map<string, number>();

  // For each date, calculate rolling average of the last 7 weekdays
  sortedRecords.forEach((record, index) => {
    // Get the last 7 weekday records up to and including this date
    const window: number[] = [];
    for (let i = index; i >= 0 && window.length < 7; i--) {
      window.unshift(sortedRecords[i].duration_minutes);
    }
    // Only calculate average if we have at least one weekday
    if (window.length > 0) {
      const average = Math.round(
        window.reduce((sum, value) => sum + value, 0) / window.length
      );
      rollingMap.set(record.date, average);
    }
  });

  console.log("rollingMap", rollingMap);

  return rollingMap;
};

export const RollingAverageChart = ({
  timeFilter,
  routeName,
  routeLabel,
}: RollingAverageChartProps) => {
  const { data: commutingData, isLoading, error } = useCommuteData(timeFilter);

  const { chartData, description } = useMemo(() => {
    if (!commutingData) {
      return {
        chartData: [] as RollingDataPoint[],
        description: null as string | null,
      };
    }

    const validRecords = commutingData.filter(
      (record): record is CommutingRecord =>
        record.is_commuting_day === true && record.duration_minutes !== null
    );

    const routeRecords = validRecords.filter(
      (record) => (record.route_name || "Unknown Route") === routeName
    );

    const preRecords = routeRecords.filter(
      (record) => record.congestion_pricing !== true
    );
    const postRecords = routeRecords.filter(
      (record) => record.congestion_pricing === true
    );

    const preRolling = computeRollingAverage(preRecords);
    const postRolling = computeRollingAverage(postRecords);

    const allDates = Array.from(
      new Set([...preRolling.keys(), ...postRolling.keys()])
    ).sort((a, b) => parseDate(a).getTime() - parseDate(b).getTime());

    const combined: RollingDataPoint[] = allDates.map((date) => ({
      date,
      preRollingAverage: preRolling.get(date) ?? null,
      postRollingAverage: postRolling.get(date) ?? null,
    }));

    const label =
      routeRecords.length > 0
        ? routeRecords[0].routeids?.starting_point &&
          routeRecords[0].routeids?.finish_point
          ? `${routeRecords[0].routeids?.starting_point} → ${routeRecords[0].routeids?.finish_point}`
          : routeName
        : routeName;

    return { chartData: combined, description: label };
  }, [commutingData, routeName]);

  const chartConfig = {
    duration: {
      label: "Duration (minutes)",
    },
  };

  if (isLoading) {
    return (
      <div className="h-80 flex items-center justify-center text-sm text-gray-400">
        Loading rolling averages...
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-80 flex items-center justify-center text-sm text-red-400">
        Error loading data: {error.message}
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center text-sm text-gray-400">
        No rolling average data available for this route.
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="text-xs sm:text-sm text-gray-400 px-1 sm:px-0">
        {routeLabel || description}
      </div>
      <div className="h-64 sm:h-80 w-full overflow-x-auto">
        <div className="min-w-[600px] sm:min-w-0 h-full">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{
                  top: 10,
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
                />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  labelFormatter={(value) => formatDate(value as string)}
                />
                <Line
                  type="monotone"
                  dataKey="preRollingAverage"
                  stroke="#4A90E2"
                  strokeWidth={2}
                  dot={false}
                  connectNulls
                  name="Pre Rolling Average"
                />
                <Line
                  type="monotone"
                  dataKey="postRollingAverage"
                  stroke="#2DD4BF"
                  strokeWidth={2}
                  dot={false}
                  connectNulls
                  name="Post Rolling Average"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
};
