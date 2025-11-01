import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrafficChart } from "@/components/TrafficChart";
import { WeekdayTrafficChart } from "@/components/WeekdayTrafficChart";
import { NewsSection } from "@/components/NewsSection";
import TimeHeatMap from "@/components/TimeHeatMap";

const Dashboard = () => {
  const [timeFilter, setTimeFilter] = useState<"morning" | "afternoon">(
    "morning"
  );
  const [weekdayTimeFilter, setWeekdayTimeFilter] = useState<
    "morning" | "afternoon"
  >("morning");

  return (
    <div className="min-h-screen pt-16">
      {/* NYC Street Grid Background Pattern */}
      <div
        className="fixed inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Intro Section */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              NYC Congestion Pricing Traffic Analysis
            </h1>
            <div className="max-w-4xl mx-auto">
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
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
                  <CardTitle className="text-2xl text-white">
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
                    className={`${
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
                    className={`${
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

        {/* News Section */}
        <section className="mb-12">
          <NewsSection />
        </section>

        {/* Additional Chart Placeholders */}
        <section className="space-y-8">
          <TimeHeatMap />

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="text-2xl text-white">
                    Commute Duration by Weekday
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Compare pre- and post-congestion commute durations for each
                    route and weekday. Toggle between morning and afternoon
                    windows.
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setWeekdayTimeFilter("morning")}
                    variant={
                      weekdayTimeFilter === "morning" ? "outline" : "default"
                    }
                    className={`${
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
                      weekdayTimeFilter === "afternoon" ? "outline" : "default"
                    }
                    className={`${
                      weekdayTimeFilter === "afternoon"
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
              <WeekdayTrafficChart timeFilter={weekdayTimeFilter} />
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
