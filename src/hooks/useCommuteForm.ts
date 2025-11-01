import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";
import { CommuteFormData, CommuteResults } from "@/types/commute";
import { calculateMockResults } from "@/utils/commuteCalculations";

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
  ranking_relaxation: z
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
    ranking_relaxation: "",
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
        formData.ranking_relaxation,
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
        ranking_relaxation: parseInt(formData.ranking_relaxation),
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

      // Insert validated data into database
      type CommuteInsert =
        Database["public"]["Tables"]["ccccommuteforminputs"]["Insert"];
      const dbPayload: CommuteInsert = {
        ...insertPayload,
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("ccccommuteforminputs")
        .insert([dbPayload])
        .select();

      if (error) {
        toast({
          title: "Database Error",
          description: `Failed to save: ${error.message}`,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Calculate costs (mock data for now)
      const mockResults = calculateMockResults(formData);
      setResults(mockResults);

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
