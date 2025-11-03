import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type NJTransitFare = Database["public"]["Tables"]["cccnjtransitfares"]["Row"];
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
  pageSize = 1000,
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
      .from("cccnjtransitfares")
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
      .eq("train_station", station)
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

export interface CostResults {
  daily: Record<string, number | string>;
  weekly: Record<string, number | string>;
  monthly: Record<string, number | string>;
  chartData: {
    labels: string[];
    values: number[];
  };
}

export async function getCommuteCosts(
  commute_origin: string,
  commute_days_per_week: number
): Promise<CostResults> {
  // 1️⃣ Fetch NJ Transit data
  const { data: njTransit, error: njError } = await supabase
    .from("cccnjtransitfares")
    .select("*")
    .eq("train_station", commute_origin)
    .single();

  if (njError || !njTransit)
    throw new Error("Invalid NJ Transit station selected.");

  // 2️⃣ Fetch Boxcar data (optional)
  const { data: boxcar } = await supabase
    .from("cccboxcarfares")
    .select("*")
    .eq("train_station", commute_origin)
    .maybeSingle();

  console.log("boxcar", boxcar);

  // 3️⃣ Fetch driving reference constants
  const { data: driveRef, error: driveError } = await supabase
    .from("cccdrivingcostreference")
    .select("*")
    .limit(1)
    .single();

  if (driveError || !driveRef)
    throw new Error("Missing driving cost reference data.");

  // 4️⃣ Base variables
  const distanceRoundTrip = njTransit.distance_miles * 2;
  const { mpg, gas_price_per_gall, tolls, parking, congestion_fee } = driveRef;

  // 5️⃣ Calculate daily costs
  const njTransitDaily = njTransit.daily_round_trip;
  const boxcarDaily = boxcar ? boxcar.std_roundtrip_price : "Not available";
  const boxcarMemberDaily = boxcar
    ? boxcar.member_roundtrip_price
    : "Not available";

  const fuelCost = (distanceRoundTrip / mpg) * gas_price_per_gall;
  const selfDriveDaily = fuelCost + tolls + parking + congestion_fee;

  const uberFuel = (distanceRoundTrip / mpg) * gas_price_per_gall;
  const uberDistCharge = distanceRoundTrip * 2;
  const UBER_BASE_FARE = 5;
  const uberTripCost = (uberFuel + uberDistCharge + UBER_BASE_FARE) * 2;
  const uberDaily = uberTripCost + tolls + congestion_fee;
  const luxFuel = (distanceRoundTrip / mpg) * gas_price_per_gall;
  const LUX_DIST_CHARGE = 4.1;
  const luxDistCharge = distanceRoundTrip * LUX_DIST_CHARGE;
  const LUX_TIME_CHARGE = 0.7;
  const luxTimeCharge = (distanceRoundTrip / 30) * LUX_TIME_CHARGE;
  const LUX_BASE_FARE = 15;
  const luxTripCost =
    (luxFuel + luxDistCharge + luxTimeCharge + LUX_BASE_FARE) * 2;
  const luxuryDaily = luxTripCost + tolls + congestion_fee;

  // 6️⃣ Weekly and monthly
  const weekly = {
    njTransit: njTransit.weekly,
    boxcar: typeof boxcarDaily === "number" ? boxcarDaily * 5 : boxcarDaily,
    boxcarMember:
      typeof boxcarMemberDaily === "number"
        ? boxcarMemberDaily * 5
        : boxcarMemberDaily,
    selfDrive: selfDriveDaily * 5,
    uber: uberDaily * 5,
    luxuryCar: luxuryDaily * 5,
  };

  const monthly = {
    njTransit: njTransit.monthly,
    boxcar: typeof boxcarDaily === "number" ? boxcarDaily * 21 : boxcarDaily,
    boxcarMember:
      typeof boxcarMemberDaily === "number" && boxcar
        ? boxcarMemberDaily * 21 + boxcar.monthly_membership
        : boxcarMemberDaily,
    selfDrive: selfDriveDaily * 21,
    uber: uberDaily * 21,
    luxuryCar: luxuryDaily * 21,
  };

  // 7️⃣ Chart data (for user frequency)
  const labels = [
    "NJ Transit",
    "Boxcar",
    "Boxcar (Member)",
    "Self Drive",
    "Uber",
    "Luxury Car",
  ];

  const dailyCosts = [
    njTransitDaily,
    boxcarDaily,
    boxcarMemberDaily,
    selfDriveDaily,
    uberDaily,
    luxuryDaily,
  ].map((v) => (typeof v === "number" ? v * commute_days_per_week : null));

  const values = dailyCosts.map((v) => (typeof v === "number" ? v : 0));

  return {
    daily: {
      njTransit: njTransitDaily,
      boxcar: boxcarDaily,
      boxcarMember: boxcarMemberDaily,
      selfDrive: selfDriveDaily,
      uber: uberDaily,
      luxuryCar: luxuryDaily,
    },
    weekly,
    monthly,
    chartData: { labels, values },
  };
}

type CommuteFormInsertPayload = {
  commute_origin: string;
  commute_method: string;
  departure_time: string;
  commute_days_per_week: number;
  office_address: string;
  ranking_cost: number;
  ranking_comfort: number;
  ranking_on_time: number;
  ranking_stress: number;
};

export const saveCommuteFormInput = async (
  payload: CommuteFormInsertPayload
) => {
  try {
    type CommuteInsert =
      Database["public"]["Tables"]["ccccommuteforminputs"]["Insert"];
    const dbPayload: CommuteInsert = {
      commute_origin: payload.commute_origin,
      commute_method: payload.commute_method,
      departure_time: payload.departure_time,
      commute_days_per_week: payload.commute_days_per_week,
      office_address: payload.office_address,
      ranking_cost: payload.ranking_cost,
      ranking_comfort: payload.ranking_comfort,
      ranking_on_time: payload.ranking_on_time,
      ranking_stress: payload.ranking_stress,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("ccccommuteforminputs")
      .insert([dbPayload])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error saving commute form input:", error);
    throw error;
  }
};

export interface DrivingBreakdown {
  fuel: number;
  tolls: number;
  parking: number;
  congestion: number;
}

export const getNJTransitStations = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from("cccnjtransitfares")
      .select("train_station")
      .not("train_station", "is", null);

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Get unique station names, filter out nulls, and sort alphabetically
    const uniqueStations = Array.from(
      new Set(
        data
          .map((row) => row.train_station)
          .filter((station): station is string => station !== null)
      )
    ).sort((a, b) => a.localeCompare(b));
    console.log(uniqueStations);

    return uniqueStations;
  } catch (error) {
    console.error("Error fetching NJ Transit stations:", error);
    throw error;
  }
};

export const getDrivingCostBreakdown = async (
  commuteOrigin: string
): Promise<DrivingBreakdown> => {
  try {
    // Get driving cost reference
    const { data: driveRef, error: driveError } = await supabase
      .from("cccdrivingcostreference")
      .select("*")
      .maybeSingle();

    console.log(driveRef);

    if (driveError || !driveRef) {
      throw new Error("Failed to fetch driving cost reference data.");
    }

    // Get distance from NJ Transit data
    const { data: njTransit, error: njError } = await supabase
      .from("cccnjtransitfares")
      .select("distance_miles")
      .eq("train_station", commuteOrigin)
      .single();

    if (njError || !njTransit) {
      throw new Error("Failed to fetch distance data for the selected origin.");
    }

    // Calculate fuel cost
    const distanceRoundTrip = njTransit.distance_miles * 2;
    const fuelCost =
      (distanceRoundTrip / (driveRef.mpg || 1)) *
      (driveRef.gas_price_per_gall || 0);

    return {
      fuel: fuelCost || 0,
      tolls: driveRef.tolls || 0,
      parking: driveRef.parking || 0,
      congestion: driveRef.congestion_fee || 0,
    };
  } catch (error) {
    console.error("Error fetching driving cost breakdown:", error);
    throw error;
  }
};
