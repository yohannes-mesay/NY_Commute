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

const parseDate = (dateString: string): number => {
  try {
    const date = new Date(dateString);
    if (!Number.isNaN(date.getTime())) {
      return date.getTime();
    }
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

const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) {
      const parts = dateString.split("/");
      if (parts.length === 3) {
        const month = parseInt(parts[0], 10);
        const day = parseInt(parts[1], 10);
        const year = parseInt(parts[2], 10);
        const fullYear = year < 100 ? 2000 + year : year;
        return new Date(fullYear, month - 1, day).toLocaleDateString("en-US", {
          month: "numeric",
          day: "numeric",
          year: "numeric",
        });
      }
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

const computeRollingAverage = (records: CommutingRecord[]): Map<string, number> => {
  const sortedRecords = [...records].sort(
    (a, b) => parseDate(a.date) - parseDate(b.date)
  );

  const rollingMap = new Map<string, number>();
  const window: number[] = [];

  sortedRecords.forEach((record) => {
    window.push(record.duration_minutes);
    if (window.length > 7) {
      window.shift();
    }
    const average =
      window.length > 0
        ? Math.round(window.reduce((sum, value) => sum + value, 0) / window.length)
        : null;
    if (average !== null) {
      rollingMap.set(record.date, average);
    }
  });

  return rollingMap;
};

export const RollingAverageChart = ({
  timeFilter,
  routeName,
  routeLabel,
}: RollingAverageChartProps) => {
  const {
    data: commutingData,
    isLoading,
    error,
  } = useCommuteData(timeFilter);

  const { chartData, description } = useMemo(() => {
    if (!commutingData) {
      return { chartData: [] as RollingDataPoint[], description: null as string | null };
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
    ).sort((a, b) => parseDate(a) - parseDate(b));

    const combined: RollingDataPoint[] = allDates.map((date) => ({
      date,
      preRollingAverage: preRolling.get(date) ?? null,
      postRollingAverage: postRolling.get(date) ?? null,
    }));

    const label =
      routeRecords.length > 0
        ? routeRecords[0].routeids?.starting_point && routeRecords[0].routeids?.finish_point
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
    <div className="space-y-4">
      <div className="text-sm text-gray-400">
        {routeLabel || description}
      </div>
      <div className="h-80">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 20, left: 10, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: "#9CA3AF" }}
                tickFormatter={(value) => formatDate(value as string)}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#9CA3AF" }}
                domain={["dataMin - 10", "dataMax + 10"]}
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
  );
};

