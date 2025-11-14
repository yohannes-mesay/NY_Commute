import { CommuteFormData, CommuteResults } from "@/types/commute";
import type { CostResults } from "@/lib/api";

type RecommendationResult = {
  recommended: "NJ Transit" | "Boxcar" | "Uber" | "Self Drive";
  scores: Record<string, number>;
  rawScores: Record<string, number>;
};

export const computeRecommendation = (
  formData: CommuteFormData
): RecommendationResult => {
  const MAX_RANK = 4;
  const WEIGHTS = {
    "NJ Transit": { cost: 4, comfort: 2, onTime: 2, stress: 2 },
    Boxcar: { cost: 2, comfort: 4, onTime: 2, stress: 4 },
    Uber: { cost: 1, comfort: 4, onTime: 3, stress: 3 },
    "Self Drive": { cost: 3, comfort: 2, onTime: 4, stress: 1 },
  } as const;

  const userRanks = {
    cost: parseInt(formData.ranking_cost),
    comfort: parseInt(formData.ranking_comfort),
    onTime: parseInt(formData.ranking_on_time),
    stress: parseInt(formData.ranking_stress),
  };

  const userPriorities = {
    cost: MAX_RANK + 1 - userRanks.cost,
    comfort: MAX_RANK + 1 - userRanks.comfort,
    onTime: MAX_RANK + 1 - userRanks.onTime,
    stress: MAX_RANK + 1 - userRanks.stress,
  };
  const rawScores: Record<string, number> = {};
  (Object.keys(WEIGHTS) as Array<keyof typeof WEIGHTS>).forEach((method) => {
    const w = WEIGHTS[method];
    rawScores[method] =
      w.cost * userPriorities.cost +
      w.comfort * userPriorities.comfort +
      w.onTime * userPriorities.onTime +
      w.stress * userPriorities.stress;
  });

  const recommended = (
    Object.keys(rawScores) as Array<keyof typeof rawScores>
  ).reduce((a, b) =>
    rawScores[a] > rawScores[b] ? a : b
  ) as RecommendationResult["recommended"];

  const maxScore = Math.max(...Object.values(rawScores));
  const scores: Record<string, number> = {};
  Object.entries(rawScores).forEach(([k, v]) => {
    scores[k] = maxScore > 0 ? v / maxScore : 0;
  });
  console.log("scores");
  console.log(scores);
  return { recommended, scores, rawScores };
};

export const determineRecommendation = (
  data: CommuteFormData,
  _costData: CostResults
): {
  method: string;
  reason: string;
  data: { cost: number; comfort: number; onTime: number; stress: number };
} => {
  const rec = computeRecommendation(data);
  const reason = `Top choice based on your priorities:`;
  return {
    method: rec.recommended,
    reason,
    data: {
      cost: parseInt(data.ranking_cost),
      comfort: parseInt(data.ranking_comfort),
      onTime: parseInt(data.ranking_on_time),
      stress: parseInt(data.ranking_stress),
    },
  };
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
