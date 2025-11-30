import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RollingAverageChart } from "./RollingAverageChart";
import { useCommuteData } from "@/hooks/useCommuteData";
import type { CommuteDataRow } from "@/lib/api";

export const RollingAverageChartSection = () => {
  const [timeFilter, setTimeFilter] = useState<"morning" | "afternoon">(
    "afternoon"
  );
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const { data: commutingData } = useCommuteData(timeFilter);

  // Extract routes from commute data
  const availableRoutes = useMemo(() => {
    if (!commutingData) return [];

    const routeMap = new Map<
      string,
      {
        startingPoint: string | null;
        finishPoint: string | null;
      }
    >();

    commutingData.forEach((record) => {
      const routeName = record.route_name || "Unknown Route";
      if (!routeMap.has(routeName)) {
        routeMap.set(routeName, {
          startingPoint: record.routeids?.starting_point ?? null,
          finishPoint: record.routeids?.finish_point ?? null,
        });
      } else {
        const routeInfo = routeMap.get(routeName)!;
        if (routeInfo.startingPoint === null && record.routeids?.starting_point) {
          routeInfo.startingPoint = record.routeids.starting_point;
        }
        if (routeInfo.finishPoint === null && record.routeids?.finish_point) {
          routeInfo.finishPoint = record.routeids.finish_point;
        }
      }
    });

    return Array.from(routeMap.entries()).map(([name, { startingPoint, finishPoint }]) => ({
      name,
      startingPoint,
      finishPoint,
    }));
  }, [commutingData]);

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

  const routeInfo = selectedRoute
    ? availableRoutes.find((route) => route.name === selectedRoute)
    : null;
  const routeLabel =
    routeInfo?.startingPoint && routeInfo?.finishPoint
      ? `${routeInfo.startingPoint} → ${routeInfo.finishPoint}`
      : selectedRoute ?? undefined;

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <div className="flex flex-col gap-4">
          <div>
            <CardTitle className="text-xl sm:text-2xl text-white">
              Rolling Average Commute Duration
            </CardTitle>
            <CardDescription className="text-gray-400 text-sm sm:text-base">
              Seven-day rolling average commute times before and after
              congestion pricing (January 5, 2025). Data is shown only for
              weekdays and US federal bank holidays are excluded.
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
                {availableRoutes.slice(0, 3).map((route) => (
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
        {selectedRoute ? (
          <RollingAverageChart
            timeFilter={timeFilter}
            routeName={selectedRoute}
            routeLabel={routeLabel}
          />
        ) : (
          <div className="h-64 sm:h-80 flex items-center justify-center text-sm text-gray-400">
            Loading routes...
          </div>
        )}
      </CardContent>
    </Card>
  );
};

