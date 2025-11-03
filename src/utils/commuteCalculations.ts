import { CommuteFormData, CommuteResults } from "@/types/commute";
import type { CostResults } from "@/lib/api";

export const determineRecommendation = (
  data: CommuteFormData,
  costData: CostResults
): { method: string; reason: string } => {
  const costRank = parseInt(data.ranking_cost);
  const comfortRank = parseInt(data.ranking_comfort);

  // Get the lowest cost method
  const dailyCosts = Object.entries(costData.daily)
    .filter(([_, value]) => typeof value === "number")
    .map(([key, value]) => ({
      key,
      cost: value as number,
    }))
    .sort((a, b) => a.cost - b.cost);

  if (dailyCosts.length === 0) {
    return {
      method: "NJ Transit",
      reason: "Based on your preferences, NJ Transit offers the best balance.",
    };
  }

  if (costRank === 1) {
    const cheapest = dailyCosts[0];
    const methodNames: Record<string, string> = {
      njTransit: "NJ Transit",
      boxcar: "Boxcar",
      boxcarMember: "Boxcar (Member)",
      selfDrive: "Self Drive",
      uber: "Uber",
      luxuryCar: "Luxury Car",
    };
    return {
      method: methodNames[cheapest.key] || cheapest.key,
      reason:
        "You ranked cost as most important, and this option offers the best value.",
    };
  } else if (comfortRank === 1) {
    return {
      method: "Luxury Car",
      reason:
        "You prioritized comfort, and a luxury car provides the most comfortable experience.",
    };
  } else {
    return {
      method: "NJ Transit",
      reason:
        "Based on your preferences, NJ Transit offers the best balance of cost and reliability.",
    };
  }
};

export const convertCostResultsToCommuteResults = (
  costResults: CostResults,
  formData: CommuteFormData,
  breakdown: {
    fuel: number;
    tolls: number;
    parking: number;
    congestion: number;
  }
): CommuteResults => {
  const getNumberValue = (value: number | string): number => {
    return typeof value === "number" ? value : 0;
  };

  const daily = {
    driving: getNumberValue(costResults.daily.selfDrive),
    uber: getNumberValue(costResults.daily.uber),
    luxury: getNumberValue(costResults.daily.luxuryCar),
    njTransit: getNumberValue(costResults.daily.njTransit),
    boxcar: getNumberValue(costResults.daily.boxcar),
  };

  const weekly = {
    driving: getNumberValue(costResults.weekly.selfDrive),
    uber: getNumberValue(costResults.weekly.uber),
    luxury: getNumberValue(costResults.weekly.luxuryCar),
    njTransit: getNumberValue(costResults.weekly.njTransit),
    boxcar: getNumberValue(costResults.weekly.boxcar),
  };

  const monthly = {
    driving: getNumberValue(costResults.monthly.selfDrive),
    uber: getNumberValue(costResults.monthly.uber),
    luxury: getNumberValue(costResults.monthly.luxuryCar),
    njTransit: getNumberValue(costResults.monthly.njTransit),
    boxcar: getNumberValue(costResults.monthly.boxcar),
  };

  return {
    daily,
    weekly,
    monthly,
    breakdown,
    recommendation: determineRecommendation(formData, costResults),
  };
};
