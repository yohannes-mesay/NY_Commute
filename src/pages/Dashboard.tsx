import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrafficChart } from "@/components/TrafficChart";
import { WeekdayTrafficChart } from "@/components/WeekdayTrafficChart";
import TimeHeatMap from "@/components/TimeHeatMap";
import { HistoricalTrendChartSection } from "@/components/HistoricalTrendChartSection";
import { RollingAverageChartSection } from "@/components/RollingAverageChartSection";

const Dashboard = () => {
  const [timeFilter, setTimeFilter] = useState<"morning" | "afternoon">(
    "afternoon"
  );
  const [weekdayTimeFilter, setWeekdayTimeFilter] = useState<
    "morning" | "afternoon"
  >("afternoon");
  const weekdayOptions = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ] as const;
  type WeekdayOption = (typeof weekdayOptions)[number];
  const [selectedWeekday, setSelectedWeekday] =
    useState<WeekdayOption>("Monday");

  return (
    <div className="relative min-h-screen pt-24 pb-16">
      {/* NYC Street Grid Background Pattern */}
      <div
        className="pointer-events-none fixed inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      <div className="relative z-10 w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 py-12">
        {/* Intro Section */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              NYC Congestion Pricing Traffic Analysis
            </h1>
            <div className="max-w-4xl mx-auto">
              <p className="text-base sm:text-lg text-gray-300 mb-6 leading-relaxed">
                New York City made headlines as the first city to implement
                congestion pricing in the United States. We aim to provide
                insights into how congestion pricing is shaping New York
                commuting and traffic. We've tracked NYC commute durations for
                months as a baseline, and now offer a real-time, data-driven
                view of how travel times are changing across key routes to help
                commuters and policymakers understand its impact.
              </p>
              <p className="text-sm text-gray-400 mt-4">
                Last updated:{" "}
                {new Date().toLocaleString("en-US", {
                  timeZone: "America/New_York",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                  timeZoneName: "short",
                })}
              </p>
            </div>
          </div>
        </section>

        {/* Core Traffic Analysis Section */}
        <section className="mb-12">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="text-xl sm:text-2xl text-white">
                    Average Commute Duration by Time of Day
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Average daily commute duration before and after congestion
                    pricing (January 5, 2025). Data is shown only for weekdays
                    and US federal bank holidays are excluded.
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setTimeFilter("morning")}
                    variant={timeFilter === "morning" ? "outline" : "default"}
                    className={`text-sm sm:text-base ${
                      timeFilter === "morning"
                        ? "bg-blue-600 hover:bg-blue-700 text-white hover:text-white"
                        : "bg-slate-700 hover:bg-slate-600 "
                    }`}
                  >
                    Morning
                  </Button>
                  <Button
                    onClick={() => setTimeFilter("afternoon")}
                    variant={timeFilter === "afternoon" ? "outline" : "default"}
                    className={`text-sm sm:text-base ${
                      timeFilter === "afternoon"
                        ? "bg-blue-600 hover:bg-blue-700 text-white hover:text-white"
                        : "bg-slate-700 hover:bg-slate-600"
                    }`}
                  >
                    Afternoon
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <TrafficChart timeFilter={timeFilter} />
            </CardContent>
          </Card>
        </section>

        {/* Additional Chart Placeholders */}
        <section className="space-y-8">
          <TimeHeatMap />

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="text-xl sm:text-2xl text-white">
                    Commute Duration by Weekday
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Compare pre- and post-congestion commute durations for each
                    route and weekday. Toggle between morning and afternoon
                    windows.
                  </CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setWeekdayTimeFilter("morning")}
                      variant={
                        weekdayTimeFilter === "morning" ? "outline" : "default"
                      }
                      className={`text-sm sm:text-base ${
                        weekdayTimeFilter === "morning"
                          ? "bg-blue-600 hover:bg-blue-700 text-white hover:text-white"
                          : "bg-slate-700 hover:bg-slate-600"
                      }`}
                    >
                      Morning
                    </Button>
                    <Button
                      onClick={() => setWeekdayTimeFilter("afternoon")}
                      variant={
                        weekdayTimeFilter === "afternoon"
                          ? "outline"
                          : "default"
                      }
                      className={`text-sm sm:text-base ${
                        weekdayTimeFilter === "afternoon"
                          ? "bg-blue-600 hover:bg-blue-700 text-white hover:text-white"
                          : "bg-slate-700 hover:bg-slate-600"
                      }`}
                    >
                      Afternoon
                    </Button>
                  </div>
                  <Select
                    value={selectedWeekday}
                    onValueChange={(value) =>
                      setSelectedWeekday(value as WeekdayOption)
                    }
                  >
                    <SelectTrigger className="w-full sm:w-44 bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600 text-white">
                      {weekdayOptions.map((day) => (
                        <SelectItem
                          key={day}
                          value={day}
                          className="text-white hover:bg-slate-600"
                        >
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <WeekdayTrafficChart
                timeFilter={weekdayTimeFilter}
                dayFilter={selectedWeekday}
              />
            </CardContent>
          </Card>

          {/* Historical Trend Chart */}
          <HistoricalTrendChartSection />

          {/* Rolling Average Commute Duration */}
          <RollingAverageChartSection />
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
