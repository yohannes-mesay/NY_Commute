// hooks/useCommuteCostCalculator.ts
import { useMutation } from "@tanstack/react-query";
import { getCommuteCosts, CostResults } from "@/lib/api";

export function useCommuteCostCalculator() {
  const {
    mutate: calculateCosts,
    isPending,
    error,
  } = useMutation<
    CostResults,
    Error,
    { commute_origin: string; commute_days_per_week: number }
  >({
    mutationFn: ({ commute_origin, commute_days_per_week }) =>
      getCommuteCosts(commute_origin, commute_days_per_week),
    onSuccess: () => {
      // Success handled by the calling component
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return { calculateCosts, isPending, error };
}
