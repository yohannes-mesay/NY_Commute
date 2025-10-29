
import { CommuteFormData, CommuteResults } from "@/types/commute";

export const determineRecommendation = (data: CommuteFormData) => {
  const costRank = parseInt(data.ranking_cost);
  const comfortRank = parseInt(data.ranking_comfort);
  
  if (costRank === 1) {
    return {
      method: "Boxcar Bus",
      reason: "You ranked cost as most important, and Boxcar offers the best value."
    };
  } else if (comfortRank === 1) {
    return {
      method: "Luxury Car",
      reason: "You prioritized comfort, and a luxury car provides the most comfortable experience."
    };
  } else {
    return {
      method: "NJ Transit",
      reason: "Based on your preferences, NJ Transit offers the best balance of cost and reliability."
    };
  }
};

export const calculateMockResults = (formData: CommuteFormData): CommuteResults => {
  return {
    daily: {
      driving: 35.50,
      uber: 65.00,
      luxury: 25.00,
      njTransit: 22.75,
      boxcar: 15.00
    },
    weekly: {
      driving: 35.50 * formData.days_per_week[0],
      uber: 65.00 * formData.days_per_week[0],
      luxury: 25.00 * formData.days_per_week[0],
      njTransit: 22.75 * formData.days_per_week[0],
      boxcar: 15.00 * formData.days_per_week[0]
    },
    monthly: {
      driving: 35.50 * formData.days_per_week[0] * 4.33,
      uber: 65.00 * formData.days_per_week[0] * 4.33,
      luxury: 25.00 * formData.days_per_week[0] * 4.33,
      njTransit: 22.75 * formData.days_per_week[0] * 4.33,
      boxcar: 15.00 * formData.days_per_week[0] * 4.33
    },
    breakdown: {
      fuel: 8.50,
      tolls: 12.00,
      parking: 25.00,
      congestion: 15.00
    },
    recommendation: determineRecommendation(formData)
  };
};
