
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, TrendingUp } from "lucide-react";
import { CommuteResults } from "@/components/CommuteResults";
import { CommuteResults as CommuteResultsType } from "@/types/commute";

interface CostToolResultsProps {
  results: CommuteResultsType | null;
}

export const CostToolResults = ({ results }: CostToolResultsProps) => {
  if (results) {
    return <CommuteResults results={results} />;
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-400" />
          Cost Comparison Results
        </CardTitle>
        <CardDescription className="text-gray-400">
          Fill out the form to see your personalized cost analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-center h-64">
        <div className="text-center text-gray-400">
          <Calculator className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <p>Complete the form to generate your cost comparison</p>
        </div>
      </CardContent>
    </Card>
  );
};
