import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type NJTransitFare = Database["public"]["Tables"]["cccnjtrafares"]["Row"];
type BoxcarFare = Database["public"]["Tables"]["cccboxcarfares"]["Row"];
type DrivingCostReference =
  Database["public"]["Tables"]["cccdrivingcostreference"]["Row"];
type CommuteRow = Database["public"]["Tables"]["commutingdata"]["Row"];
type RouteInfo = Pick<
  Database["public"]["Tables"]["routeids"]["Row"],
  "starting_point" | "finish_point"
>;

type CommuteQueryOptions = {
  isMorning: boolean;
  pageSize?: number;
};

export type CommuteDataRow = Pick<
  CommuteRow,
  | "id"
  | "date"
  | "duration_minutes"
  | "route_name"
  | "route_id"
  | "is_commuting_day"
  | "is_morning"
  | "rounded_time"
  | "congestion_pricing"
  | "time"
  | "timestamp_collected"
  | "weekday"
> & {
  routeids: RouteInfo | null;
};

const COMMUTE_COLUMNS =
  "id,date,duration_minutes,route_name,route_id,is_commuting_day,is_morning,rounded_time,congestion_pricing,time,timestamp_collected,weekday,routeids(starting_point, finish_point)";

const isRouteInfo = (value: unknown): value is RouteInfo =>
  Boolean(
    value &&
      typeof value === "object" &&
      "starting_point" in value &&
      "finish_point" in value
  );

export const getCommuteData = async ({
  isMorning,
  pageSize = 500,
}: CommuteQueryOptions) => {
  try {
    const results: CommuteDataRow[] = [];
    let from = 0;

    while (true) {
      const to = from + pageSize - 1;
      const { data, error } = await supabase
        .from("commutingdata")
        .select(COMMUTE_COLUMNS)
        .eq("is_morning", isMorning)
        .eq("is_commuting_day", true)
        .order("date", { ascending: true })
        .range(from, to);

      if (error) {
        throw error;
      }

      if (!data || data.length === 0) {
        break;
      }

      const normalizedRows: CommuteDataRow[] = data.map((row) => {
        return {
          ...row,
          routeids: isRouteInfo(row.routeids) ? row.routeids : null,
        };
      });

      results.push(...normalizedRows);

      if (data.length < pageSize) {
        break;
      }

      from += pageSize;
    }

    return results;
  } catch (error) {
    console.error("Error fetching commute data:", error);
    throw error;
  }
};

export const getCommuteDataById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from("commutingdata")
      .select("*, routeids(starting_point, finish_point)")
      .eq("id", id)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    console.error("Error fetching commute data by id:", error);
    throw error;
  }
};

export const getNJTransitData = async (station: string) => {
  try {
    const { data, error } = await supabase
      .from("cccnjtrafares")
      .select("*")
      .eq("train_station", station)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data as NJTransitFare | null;
  } catch (error) {
    console.error("Error fetching NJ Transit data:", error);
    throw error;
  }
};

export const getBoxcarData = async (station: string) => {
  try {
    const { data, error } = await supabase
      .from("cccboxcarfares")
      .select("*")
      .eq("boxcar_station", station)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data as BoxcarFare | null;
  } catch (error) {
    console.error("Error fetching Boxcar data:", error);
    throw error;
  }
};

export const getDrivingCostReference = async () => {
  try {
    const { data, error } = await supabase
      .from("cccdrivingcostreference")
      .select("*")
      .order("effective_date", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data as DrivingCostReference | null;
  } catch (error) {
    console.error("Error fetching driving cost reference:", error);
    throw error;
  }
};
