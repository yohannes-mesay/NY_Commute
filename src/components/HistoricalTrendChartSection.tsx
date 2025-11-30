import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { HistoricalTrendChart } from "./HistoricalTrendChart";

export const HistoricalTrendChartSection = () => {
  const [timeFilter, setTimeFilter] = useState<"morning" | "afternoon">(
    "afternoon"
  );
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [availableRoutes, setAvailableRoutes] = useState<
    Array<{
      name: string;
      startingPoint: string | null;
      finishPoint: string | null;
    }>
  >([]);

  useEffect(() => {
    if (availableRoutes.length === 0) {
      setSelectedRoute(null);
      return;
    }
    if (
      !selectedRoute ||
      !availableRoutes.some((route) => route.name === selectedRoute)
    ) {
      setSelectedRoute(availableRoutes[0].name);
    }
  }, [availableRoutes, selectedRoute]);

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <div className="flex flex-col gap-4">
          <div>
            <CardTitle className="text-xl sm:text-2xl text-white">
              Commute Duration Over Time by Route
            </CardTitle>
            <CardDescription className="text-gray-400 text-sm sm:text-base">
              Historical daily average commute duration before and after
              congestion pricing (January 5, 2025) with linear trend lines.
              Data is shown only for weekdays and US federal bank holidays are
              excluded.
            </CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="flex gap-2 flex-shrink-0">
              <Button
                onClick={() => setTimeFilter("morning")}
                variant={timeFilter === "morning" ? "outline" : "default"}
                className={`text-xs sm:text-sm flex-1 sm:flex-none ${
                  timeFilter === "morning"
                    ? "bg-blue-600 hover:bg-blue-700 text-white hover:text-white"
                    : "bg-slate-700 hover:bg-slate-600"
                }`}
              >
                Morning
              </Button>
              <Button
                onClick={() => setTimeFilter("afternoon")}
                variant={timeFilter === "afternoon" ? "outline" : "default"}
                className={`text-xs sm:text-sm flex-1 sm:flex-none ${
                  timeFilter === "afternoon"
                    ? "bg-blue-600 hover:bg-blue-700 text-white hover:text-white"
                    : "bg-slate-700 hover:bg-slate-600"
                }`}
              >
                Afternoon
              </Button>
            </div>
            {availableRoutes.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 -mx-1 px-1 sm:mx-0 sm:px-0">
                {availableRoutes.map((route) => (
                  <Button
                    key={route.name}
                    onClick={() => setSelectedRoute(route.name)}
                    variant={
                      selectedRoute === route.name ? "outline" : "default"
                    }
                    className={`text-xs sm:text-sm whitespace-nowrap flex-shrink-0 ${
                      selectedRoute === route.name
                        ? "bg-blue-600 hover:bg-blue-700 text-white hover:text-white"
                        : "bg-slate-700 hover:bg-slate-600"
                    }`}
                  >
                    {route.startingPoint && route.finishPoint
                      ? `${route.startingPoint} → ${route.finishPoint}`
                      : route.name}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        <HistoricalTrendChart
          timeFilter={timeFilter}
          selectedRoute={selectedRoute}
          routes={availableRoutes}
          onRoutesChange={setAvailableRoutes}
        />
      </CardContent>
    </Card>
  );
};

