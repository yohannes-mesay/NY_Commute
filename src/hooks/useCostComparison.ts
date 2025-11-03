import { useQuery } from "@tanstack/react-query";
import { getCommuteCosts, type CostResults } from "@/lib/api";

export function useCostComparison(
  commuteOrigin: string | undefined,
  commuteDaysPerWeek: number | undefined,
  options?: { enabled?: boolean }
) {
  const enabled = Boolean(
    commuteOrigin && commuteDaysPerWeek && (options?.enabled ?? true)
  );

  const query = useQuery<CostResults, Error>({
    queryKey: ["cost-comparison", commuteOrigin ?? "", commuteDaysPerWeek ?? 0],
    queryFn: () =>
      getCommuteCosts(commuteOrigin as string, commuteDaysPerWeek as number),
    enabled,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  return query;
}
