import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  TooltipProps,
  PieLabelRenderProps,
} from "recharts";
import { DollarSign, TrendingUp, Award } from "lucide-react";
import { MODE_COLORS } from "@/constants/commute";

export interface Results {
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
    data: {
      cost: number;
      comfort: number;
      onTime: number;
      stress: number;
    };
  };
}

interface CommuteResultsProps {
  results: Results;
  showComparisonCharts?: boolean;
}

const buildBarChartData = (results: Results) => ({
  dailyData: [
    {
      name: "Self Drive",
      cost: results.daily.driving,
      fill: MODE_COLORS.selfDrive,
    },
    {
      name: "NJ Transit",
      cost: results.daily.njTransit,
      fill: MODE_COLORS.njTransit,
    },
    { name: "Boxcar", cost: results.daily.boxcar, fill: MODE_COLORS.boxcar },
    { name: "Uber", cost: results.daily.uber, fill: MODE_COLORS.uber },
    {
      name: "Luxury Car",
      cost: results.daily.luxury,
      fill: MODE_COLORS.luxuryCar,
    },
  ],
  weeklyData: [
    {
      name: "Self Drive",
      cost: results.weekly.driving,
      fill: MODE_COLORS.selfDrive,
    },
    {
      name: "NJ Transit",
      cost: results.weekly.njTransit,
      fill: MODE_COLORS.njTransit,
    },
    { name: "Boxcar", cost: results.weekly.boxcar, fill: MODE_COLORS.boxcar },
    { name: "Uber", cost: results.weekly.uber, fill: MODE_COLORS.uber },
    {
      name: "Luxury Car",
      cost: results.weekly.luxury,
      fill: MODE_COLORS.luxuryCar,
    },
  ],
  monthlyData: [
    {
      name: "Self Drive",
      cost: results.monthly.driving,
      fill: MODE_COLORS.selfDrive,
    },
    {
      name: "NJ Transit",
      cost: results.monthly.njTransit,
      fill: MODE_COLORS.njTransit,
    },
    { name: "Boxcar", cost: results.monthly.boxcar, fill: MODE_COLORS.boxcar },
    { name: "Uber", cost: results.monthly.uber, fill: MODE_COLORS.uber },
    {
      name: "Luxury Car",
      cost: results.monthly.luxury,
      fill: MODE_COLORS.luxuryCar,
    },
  ],
});

const ChartTooltipContentWrapper = ({
  active,
  payload,
  label,
}: TooltipProps<string, number>) => {
  if (active && payload && payload.length) {
    const value = Number(payload[0].value);
    const isBoxcar = label === "Boxcar" || label === "Boxcar (Member)";
    const isUnavailable = isBoxcar && value === 0;

    return (
      <div className="bg-slate-800 p-3 rounded-lg border border-slate-600 shadow-lg">
        <p className="text-white font-medium">{label}</p>
        {isUnavailable ? (
          <p className="text-gray-400 text-sm italic">Not available</p>
        ) : (
          <p className="text-green-400">
            Cost: ${value.toFixed(2)}
          </p>
        )}
      </div>
    );
  }
  return null;
};

export const CommuteComparisonCharts = ({ results }: { results: Results }) => {
  const { dailyData, weeklyData, monthlyData } = buildBarChartData(results);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-lg sm:text-xl">
            Daily Roundtrip Cost
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={dailyData}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="name"
                tick={{ fill: "#9ca3af", fontSize: 10 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} />
              <Tooltip content={<ChartTooltipContentWrapper />} />
              <Bar dataKey="cost">
                {dailyData.map((entry, index) => (
                  <Cell key={`daily-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-lg sm:text-xl">
            Weekly Roundtrip Cost
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={weeklyData}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="name"
                tick={{ fill: "#9ca3af", fontSize: 10 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} />
              <Tooltip content={<ChartTooltipContentWrapper />} />
              <Bar dataKey="cost">
                {weeklyData.map((entry, index) => (
                  <Cell key={`weekly-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-lg sm:text-xl">
            Monthly Roundtrip Cost
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={monthlyData}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="name"
                tick={{ fill: "#9ca3af", fontSize: 10 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} />
              <Tooltip content={<ChartTooltipContentWrapper />} />
              <Bar dataKey="cost">
                {monthlyData.map((entry, index) => (
                  <Cell key={`monthly-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export const CommuteResults = ({
  results,
  showComparisonCharts = true,
}: CommuteResultsProps) => {
  console.log("results");
  console.log(results);
  const breakdownData = [
    { name: "Fuel", value: results.breakdown.fuel, fill: "#F87171" },
    { name: "Tolls", value: results.breakdown.tolls, fill: "#EF4444" },
    { name: "Parking", value: results.breakdown.parking, fill: "#DC2626" },
    {
      name: "Congestion Fee",
      value: results.breakdown.congestion,
      fill: "#B91C1C",
    },
  ];

  const PieTooltip = ({ active, payload }: TooltipProps<string, number>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 p-3 rounded-lg border border-slate-600 shadow-lg">
          <p className="text-white font-medium">{payload[0].name}</p>
          <p className="text-green-400">
            ${Number(payload[0].value).toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      {showComparisonCharts && <CommuteComparisonCharts results={results} />}

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
            <p className="text-sm font-semibold text-gray-200">
              Total daily cost: $
              {(
                results.breakdown.fuel +
                results.breakdown.tolls +
                results.breakdown.parking +
                results.breakdown.congestion
              ).toFixed(2)}
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={breakdownData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
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
            <CardTitle className="text-xl sm:text-2xl text-white flex items-center gap-2">
              <Award className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-400" />
              Smart Recommendation
            </CardTitle>
            <CardDescription className="text-gray-400">
              Based on your preferences and priorities
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col justify-center h-64">
            <div>
              <div className="mb-4">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                  Your best commuting option is:
                </h3>
                <div className="text-2xl sm:text-3xl font-bold text-[#235CE5] mb-4">
                  {results.recommendation.method}
                </div>
              </div>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                {results.recommendation.reason}
              </p>
              <ul className="text-gray-300 leading-relaxed list-disc list-inside text-xs sm:text-sm">
                <li>
                  <span className="font-bold">Cost-</span>{" "}
                  {results.recommendation.data.cost}
                </li>
                <li>
                  <span className="font-bold">Comfort-</span>{" "}
                  {results.recommendation.data.comfort}
                </li>
                <li>
                  <span className="font-bold">On-Time-</span>{" "}
                  {results.recommendation.data.onTime}
                </li>
                <li>
                  <span className="font-bold">Stress-</span>{" "}
                  {results.recommendation.data.stress}
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
