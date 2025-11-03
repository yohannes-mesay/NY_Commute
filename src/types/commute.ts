
export interface CommuteFormData {
  commute_origin: string;
  commute_method: string;
  departure_time: string;
  days_per_week: number[];
  office_address: string;
  ranking_cost: string;
  ranking_comfort: string;
  ranking_on_time: string;
  ranking_stress: string; 
}

export interface CommuteResults {
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
  };
}
