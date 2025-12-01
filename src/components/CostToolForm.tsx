import { useEffect, useMemo, useState } from "react";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { COMMUTE_METHODS, DEPARTURE_TIMES } from "@/constants/commute";
import { useNJTransitStations } from "@/hooks/useNJTransitStations";
import { CommuteFormData } from "@/types/commute";
import { Skeleton } from "@/components/ui/skeleton";

interface CostToolFormProps {
  formData: CommuteFormData;
  setFormData: (data: CommuteFormData) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const CostToolForm = ({
  formData,
  setFormData,
  onSubmit,
  isLoading,
}: CostToolFormProps) => {
  const {
    stations,
    isLoading: stationsLoading,
    error: stationsError,
  } = useNJTransitStations();

  const [addressQuery, setAddressQuery] = useState<string>(
    formData.office_address ?? ""
  );
  const [addressSuggestions, setAddressSuggestions] = useState<
    Array<{ label: string; formatted: string }>
  >([]);
  const [isAddressSearching, setIsAddressSearching] = useState(false);
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);

  const GEOAPIFY_API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;

  useEffect(() => {
    setAddressQuery(formData.office_address ?? "");
  }, [formData.office_address]);

  useEffect(() => {
    const query = addressQuery.trim();
    if (query.length < 3 || !GEOAPIFY_API_KEY) {
      setAddressSuggestions([]);
      setIsAddressSearching(false);
      return;
    }

    let isActive = true;
    setIsAddressSearching(true);
    const debounceId = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
            query
          )}&apiKey=${GEOAPIFY_API_KEY}&filter=countrycode:us&limit=5`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch addresses");
        }

        const data = (await response.json()) as {
          features?: Array<{
            properties: {
              formatted?: string;
              address_line1?: string;
            };
          }>;
        };

        if (!isActive) {
          return;
        }

        const suggestions = (data.features || []).map((feature) => ({
          label:
            feature.properties.formatted ||
            feature.properties.address_line1 ||
            query,
          formatted:
            feature.properties.formatted ||
            feature.properties.address_line1 ||
            query,
        }));

        setAddressSuggestions(suggestions);
      } catch (error) {
        console.error("Error fetching address suggestions:", error);
        if (isActive) {
          setAddressSuggestions([]);
        }
      } finally {
        if (isActive) {
          setIsAddressSearching(false);
        }
      }
    }, 350);

    return () => {
      isActive = false;
      clearTimeout(debounceId);
    };
  }, [addressQuery, GEOAPIFY_API_KEY]);

  const handleAddressChange = (value: string) => {
    setAddressQuery(value);
    setFormData({ ...formData, office_address: value });
    setShowAddressSuggestions(true);
  };

  const handleAddressSelect = (value: string) => {
    setAddressQuery(value);
    setFormData({ ...formData, office_address: value });
    setShowAddressSuggestions(false);
    setAddressSuggestions([]);
  };

  // Ranking helpers
  const selectedRanks = {
    cost: formData.ranking_cost,
    comfort: formData.ranking_comfort,
    onTime: formData.ranking_on_time,
    stress: formData.ranking_stress,
  };

  const rankingOptions = ["1", "2", "3", "4"] as const;

  const getOptionsFor = (currentField: keyof typeof selectedRanks) => {
    return rankingOptions.filter((option) => {
      if (selectedRanks[currentField] === option) {
        return true;
      }
      return !Object.entries(selectedRanks).some(
        ([field, value]) => field !== currentField && value === option
      );
    });
  };

  const areAllRanksChosen =
    selectedRanks.cost !== "" &&
    selectedRanks.comfort !== "" &&
    selectedRanks.onTime !== "" &&
    selectedRanks.stress !== "";

  const hasUniqueRanks = (() => {
    const used = [
      selectedRanks.cost,
      selectedRanks.comfort,
      selectedRanks.onTime,
      selectedRanks.stress,
    ].filter(Boolean);
    return new Set(used).size === used.length && used.length === 4;
  })();

  const rankingError = areAllRanksChosen && !hasUniqueRanks;

  const isFormValid = () => {
    return (
      formData.commute_origin &&
      formData.commute_method &&
      formData.departure_time &&
      formData.office_address &&
      areAllRanksChosen &&
      hasUniqueRanks
    );
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl text-white flex items-center gap-2">
          <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
          Your Commute Details
        </CardTitle>
        <CardDescription className="text-gray-400">
          Tell us about your daily commute to get personalized cost comparisons
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Where do you commute from (what train station is closest to you)?
          </label>
          {stationsLoading ? (
            <Skeleton className="h-10 w-full bg-slate-700/60" />
          ) : stationsError ? (
            <div className="text-sm text-red-400">
              Failed to load stations. Please try refreshing the page.
            </div>
          ) : (
            <Select
              value={formData.commute_origin}
              onValueChange={(value) =>
                setFormData({ ...formData, commute_origin: value })
              }
            >
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Select your closest station" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600 max-h-60">
                {stations.map((station) => (
                  <SelectItem
                    key={station}
                    value={station}
                    className="text-white hover:bg-slate-600"
                  >
                    {station}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            How do you usually commute?
          </label>
          <Select
            value={formData.commute_method}
            onValueChange={(value) =>
              setFormData({ ...formData, commute_method: value })
            }
          >
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
              <SelectValue placeholder="Select your commute method" />
            </SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600">
              {COMMUTE_METHODS.map((method) => (
                <SelectItem
                  key={method}
                  value={method}
                  className="text-white hover:bg-slate-600"
                >
                  {method}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            What time do you leave in the morning?
          </label>
          <Select
            value={formData.departure_time}
            onValueChange={(value) =>
              setFormData({ ...formData, departure_time: value })
            }
          >
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
              <SelectValue placeholder="Select departure time" />
            </SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600">
              {DEPARTURE_TIMES.map((time) => (
                <SelectItem
                  key={time}
                  value={time}
                  className="text-white hover:bg-slate-600"
                >
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Days per week you commute (on average): {formData.days_per_week[0]}{" "}
            days
          </label>
          <Slider
            value={formData.days_per_week}
            onValueChange={(value) =>
              setFormData({ ...formData, days_per_week: value })
            }
            max={5}
            min={1}
            step={1}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            What is your office's address?
          </label>
          <div className="relative">
            <Input
              value={addressQuery}
              onChange={(e) => handleAddressChange(e.target.value)}
              onFocus={() => setShowAddressSuggestions(true)}
              onBlur={() => {
                setTimeout(() => setShowAddressSuggestions(false), 150);
              }}
              placeholder="Start typing your office address..."
              className="bg-slate-700 border-slate-600 text-white placeholder-gray-400"
            />
            {showAddressSuggestions && (
              <div className="absolute left-0 right-0 z-30 mt-2 max-h-60 overflow-y-auto rounded-lg border border-slate-600 bg-slate-800/95 shadow-xl">
                {isAddressSearching ? (
                  <div className="px-4 py-3 text-sm text-gray-400">
                    Searching addresses...
                  </div>
                ) : addressSuggestions.length === 0 &&
                  addressQuery.trim().length >= 3 ? (
                  <div className="px-4 py-3 text-sm text-gray-400">
                    No matching addresses found.
                  </div>
                ) : (
                  addressSuggestions.map((suggestion, index) => (
                    <button
                      key={`${suggestion.formatted}-${index}`}
                      type="button"
                      className="flex w-full items-start px-4 py-3 text-left text-sm text-gray-200 hover:bg-slate-700/70"
                      onMouseDown={(event) => {
                        event.preventDefault();
                        handleAddressSelect(suggestion.formatted);
                      }}
                    >
                      {suggestion.label}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-base sm:text-lg font-semibold text-white mb-4">
            Rank these in order of importance to you (1 = most important, 4 =
            least important):
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Cost
              </label>
              <Select
                value={formData.ranking_cost}
                onValueChange={(value) =>
                  setFormData({ ...formData, ranking_cost: value })
                }
              >
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Rank" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  {getOptionsFor("cost").map((option) => (
                    <SelectItem
                      key={option}
                      value={option}
                      className="text-white hover:bg-slate-600"
                    >
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Comfortability
              </label>
              <Select
                value={formData.ranking_comfort}
                onValueChange={(value) =>
                  setFormData({ ...formData, ranking_comfort: value })
                }
              >
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Rank" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  {getOptionsFor("comfort").map((option) => (
                    <SelectItem
                      key={option}
                      value={option}
                      className="text-white hover:bg-slate-600"
                    >
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                On-time arrival
              </label>
              <Select
                value={formData.ranking_on_time}
                onValueChange={(value) =>
                  setFormData({ ...formData, ranking_on_time: value })
                }
              >
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Rank" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  {getOptionsFor("onTime").map((option) => (
                    <SelectItem
                      key={option}
                      value={option}
                      className="text-white hover:bg-slate-600"
                    >
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Relaxed commute
              </label>
              <Select
                value={formData.ranking_stress}
                onValueChange={(value) =>
                  setFormData({ ...formData, ranking_stress: value })
                }
              >
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Rank" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  {getOptionsFor("stress").map((option) => (
                    <SelectItem
                      key={option}
                      value={option}
                      className="text-white hover:bg-slate-600"
                    >
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-3">
            <Button
              type="button"
              variant="outline"
              className="text-sm sm:text-base"
              onClick={() =>
                setFormData({
                  ...formData,
                  ranking_cost: "",
                  ranking_comfort: "",
                  ranking_on_time: "",
                  ranking_stress: "",
                })
              }
            >
              Clear ranks
            </Button>
          </div>
        </div>

        <Button
          onClick={onSubmit}
          disabled={!isFormValid() || isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 text-sm sm:text-base"
        >
          {isLoading ? "Calculating..." : "Compare Options"}
        </Button>
        {rankingError && (
          <p className="mt-3 text-sm text-red-400 text-center">
            Please use each rank (1–4) exactly once across all categories.
          </p>
        )}
      </CardContent>
    </Card>
  );
};
