import { useQuery } from "@tanstack/react-query";
import { getNJTransitStations } from "@/lib/api";

export const useNJTransitStations = () => {
  const {
    data: stations = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["nj-transit-stations"],
    queryFn: getNJTransitStations,
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
    refetchOnWindowFocus: false,
  });

  return { stations, isLoading, error };
};
