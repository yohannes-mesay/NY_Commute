import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
  TooltipProps,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCommuteCostCalculator } from "@/hooks/useCostSalary";
import { Skeleton } from "@/components/ui/skeleton";
import { Payload } from "recharts/types/component/DefaultTooltipContent";

interface CostBarChartProps {
  commuteOrigin: string;
  commuteDaysPerWeek: number;
}

const MODE_COLORS: Record<string, string> = {
  njTransit: "#1f77b4",
  boxcar: "#ff7f0e",
  boxcarMember: "#ffbb78",
  selfDrive: "#2ca02c",
  uber: "#d62728",
  luxuryCar: "#9467bd",
};

const MODE_LABELS: Record<string, string> = {
  njTransit: "NJ Transit",
  boxcar: "Boxcar",
  boxcarMember: "Boxcar (Member)",
  selfDrive: "Self Drive",
  uber: "Uber",
  luxuryCar: "Luxury Car",
};

interface ChartDataItem {
  mode: string;
  label: string;
  value: number | null;
  color: string;
  isAvailable: boolean;
}

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-lg">
        <p className="text-white font-semibold mb-1">{data.label}</p>
        {data.isAvailable ? (
          <p className="text-green-400 text-sm font-medium">
            ${data.value?.toFixed(2)}
          </p>
        ) : (
          <p className="text-gray-400 text-sm italic">Not available</p>
        )}
      </div>
    );
  }
  return null;
};

export const CostBarChart = ({
  commuteOrigin,
  commuteDaysPerWeek,
}: CostBarChartProps) => {
  const { calculateCosts, isPending, error } = useCommuteCostCalculator();
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);

  useEffect(() => {
    if (!commuteOrigin || commuteDaysPerWeek <= 0) {
      setChartData([]);
      return;
    }

    calculateCosts(
      {
        commute_origin: commuteOrigin,
        commute_days_per_week: commuteDaysPerWeek,
      },
      {
        onSuccess: (data) => {
          const items: ChartDataItem[] = [
            {
              mode: "njTransit",
              label: MODE_LABELS.njTransit,
              value:
                typeof data.daily.njTransit === "number"
                  ? data.daily.njTransit * commuteDaysPerWeek
                  : null,
              color: MODE_COLORS.njTransit,
              isAvailable: typeof data.daily.njTransit === "number",
            },
            {
              mode: "boxcar",
              label: MODE_LABELS.boxcar,
              value:
                typeof data.daily.boxcar === "number"
                  ? data.daily.boxcar * commuteDaysPerWeek
                  : null,
              color: MODE_COLORS.boxcar,
              isAvailable: typeof data.daily.boxcar === "number",
            },
            {
              mode: "boxcarMember",
              label: MODE_LABELS.boxcarMember,
              value:
                typeof data.daily.boxcarMember === "number"
                  ? data.daily.boxcarMember * commuteDaysPerWeek
                  : null,
              color: MODE_COLORS.boxcarMember,
              isAvailable: typeof data.daily.boxcarMember === "number",
            },
            {
              mode: "selfDrive",
              label: MODE_LABELS.selfDrive,
              value:
                typeof data.daily.selfDrive === "number"
                  ? data.daily.selfDrive * commuteDaysPerWeek
                  : null,
              color: MODE_COLORS.selfDrive,
              isAvailable: typeof data.daily.selfDrive === "number",
            },
            {
              mode: "uber",
              label: MODE_LABELS.uber,
              value:
                typeof data.daily.uber === "number"
                  ? data.daily.uber * commuteDaysPerWeek
                  : null,
              color: MODE_COLORS.uber,
              isAvailable: typeof data.daily.uber === "number",
            },
            {
              mode: "luxuryCar",
              label: MODE_LABELS.luxuryCar,
              value:
                typeof data.daily.luxuryCar === "number"
                  ? data.daily.luxuryCar * commuteDaysPerWeek
                  : null,
              color: MODE_COLORS.luxuryCar,
              isAvailable: typeof data.daily.luxuryCar === "number",
            },
          ];

          setChartData(items);
        },
        onError: () => {
          setChartData([]);
        },
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commuteOrigin, commuteDaysPerWeek]);

  const availableData = chartData.filter((item) => item.isAvailable);

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white text-xl">
          Your Cost Based on {commuteDaysPerWeek} Day
          {commuteDaysPerWeek !== 1 ? "s" : ""} Per Week
        </CardTitle>
        <CardDescription className="text-gray-400">
          Weekly commute costs comparison across different transportation modes
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <div className="h-96 flex items-center justify-center">
            <div className="space-y-4 w-full">
              <Skeleton className="h-12 w-full bg-slate-700/60" />
              <Skeleton className="h-12 w-full bg-slate-700/60" />
              <Skeleton className="h-12 w-full bg-slate-700/60" />
            </div>
          </div>
        ) : error ? (
          <div className="h-96 flex items-center justify-center">
            <p className="text-red-400 text-sm">
              Error loading cost data. Please try again.
            </p>
          </div>
        ) : availableData.length === 0 ? (
          <div className="h-96 flex items-center justify-center">
            <p className="text-gray-400 text-sm">
              No data available. Please select a valid origin.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  type="number"
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                  tickFormatter={(value) => `$${value.toFixed(2)}`}
                />
                <YAxis
                  type="category"
                  dataKey="label"
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                  width={90}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="value"
                  animationDuration={800}
                  animationBegin={0}
                  radius={[0, 4, 4, 0]}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.isAvailable ? entry.color : "#6b7280"}
                    />
                  ))}
                  <LabelList
                    dataKey="value"
                    position="right"
                    fill="#e5e7eb"
                    fontSize={11}
                    fontWeight={500}
                    formatter={(value: number | null, payload: Payload<number, string>) => {
                      const entry = payload as ChartDataItem;
                      return entry?.isAvailable && value !== null
                        ? `$${value.toFixed(2)}`
                        : "";
                    }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            {/* Unavailable modes list */}
            {chartData.filter((item) => !item.isAvailable).length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-700">
                <p className="text-xs text-gray-400 mb-2">Unavailable modes:</p>
                <ul className="space-y-1">
                  {chartData
                    .filter((item) => !item.isAvailable)
                    .map((item) => (
                      <li key={item.mode} className="text-xs text-gray-500">
                        • {item.label}: Not available from selected origin
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
