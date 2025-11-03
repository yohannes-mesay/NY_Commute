import { useState } from "react";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { CommuteFormData, CommuteResults } from "@/types/commute";
import { convertCostResultsToCommuteResults } from "@/utils/commuteCalculations";
import {
  getCommuteCosts,
  saveCommuteFormInput,
  getDrivingCostBreakdown,
} from "@/lib/api";

// Zod validation schema for commute form inputs
const commuteFormSchema = z.object({
  commute_origin: z
    .string()
    .trim()
    .min(1, "Origin is required")
    .max(200, "Origin must be less than 200 characters"),
  commute_method: z
    .string()
    .trim()
    .min(1, "Commute method is required")
    .max(100, "Method must be less than 100 characters"),
  departure_time: z
    .string()
    .trim()
    .min(1, "Departure time is required")
    .max(50, "Time must be less than 50 characters"),
  commute_days_per_week: z
    .number()
    .int()
    .min(1, "Must commute at least 1 day")
    .max(7, "Cannot exceed 7 days per week"),
  office_address: z
    .string()
    .trim()
    .min(1, "Office address is required")
    .max(500, "Address must be less than 500 characters"),
  ranking_cost: z
    .number()
    .int()
    .min(1, "Ranking must be between 1 and 4")
    .max(4, "Ranking must be between 1 and 4"),
  ranking_comfort: z
    .number()
    .int()
    .min(1, "Ranking must be between 1 and 4")
    .max(4, "Ranking must be between 1 and 4"),
  ranking_on_time: z
    .number()
    .int()
    .min(1, "Ranking must be between 1 and 4")
    .max(4, "Ranking must be between 1 and 4"),
  ranking_stress: z
    .number()
    .int()
    .min(1, "Ranking must be between 1 and 4")
    .max(4, "Ranking must be between 1 and 4"),
});

export const useCommuteForm = () => {
  const [formData, setFormData] = useState<CommuteFormData>({
    commute_origin: "",
    commute_method: "",
    departure_time: "",
    days_per_week: [3],
    office_address: "",
    ranking_cost: "",
    ranking_comfort: "",
    ranking_on_time: "",
    ranking_stress: "",
  });

  const [results, setResults] = useState<CommuteResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      // Validate rankings are unique
      const rankings = [
        formData.ranking_cost,
        formData.ranking_comfort,
        formData.ranking_on_time,
        formData.ranking_stress,
      ].filter((r) => r !== "");

      const uniqueRankings = new Set(rankings);
      if (rankings.length !== uniqueRankings.size) {
        toast({
          title: "Invalid Rankings",
          description: "Each ranking must be unique (1-4, no duplicates)",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Create payload with proper types
      const insertPayload = {
        commute_origin: formData.commute_origin,
        commute_method: formData.commute_method,
        departure_time: formData.departure_time,
        commute_days_per_week: formData.days_per_week[0],
        office_address: formData.office_address,
        ranking_cost: parseInt(formData.ranking_cost),
        ranking_comfort: parseInt(formData.ranking_comfort),
        ranking_on_time: parseInt(formData.ranking_on_time),
        ranking_stress: parseInt(formData.ranking_stress),
      };

      // Validate input with zod schema
      try {
        commuteFormSchema.parse(insertPayload);
      } catch (validationError) {
        if (validationError instanceof z.ZodError) {
          const errorMessages = validationError.errors
            .map((err) => err.message)
            .join(", ");
          toast({
            title: "Invalid Input",
            description: errorMessages,
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
        throw validationError;
      }

      // Save form data to database
      try {
        await saveCommuteFormInput(insertPayload);
      } catch (error) {
        toast({
          title: "Database Error",
          description:
            error instanceof Error
              ? error.message
              : "Failed to save form data.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Fetch real cost data and breakdown from Supabase
      let costResults;
      let breakdown;
      try {
        [costResults, breakdown] = await Promise.all([
          getCommuteCosts(formData.commute_origin, formData.days_per_week[0]),
          getDrivingCostBreakdown(formData.commute_origin),
        ]);
      } catch (costError) {
        toast({
          title: "Error",
          description:
            costError instanceof Error
              ? costError.message
              : "Failed to calculate commute costs. Please check your origin station.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Convert CostResults to CommuteResults format
      const commuteResults = convertCostResultsToCommuteResults(
        costResults,
        formData,
        breakdown
      );

      setResults(commuteResults);

      toast({
        title: "Success!",
        description:
          "Your preferences have been saved and cost comparison is ready!",
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";

      toast({
        title: "Unexpected Error",
        description: errorMessage,
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  return {
    formData,
    setFormData,
    results,
    isLoading,
    handleSubmit,
  };
};
