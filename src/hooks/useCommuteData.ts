import { useQuery } from "@tanstack/react-query";
import { getCommuteData } from "@/lib/api";

export const useCommuteData = (timeFilter: "morning" | "afternoon") => {
  const isMorning = timeFilter === "morning";

  const { data, isLoading, error } = useQuery({
    queryKey: ["commuting-data", isMorning],
    queryFn: () => getCommuteData({ isMorning }),
  });

  return { data, isLoading, error };
};
