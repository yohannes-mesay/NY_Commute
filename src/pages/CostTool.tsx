import { Calculator } from "lucide-react";
import { CostToolForm } from "@/components/CostToolForm";
import { CostToolResults } from "@/components/CostToolResults";
import { CostBarChart } from "@/components/CostBarChart";
import { useCommuteForm } from "@/hooks/useCommuteForm";

const CostTool = () => {
  const { formData, setFormData, results, isLoading, handleSubmit } =
    useCommuteForm();

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-slate-900/80 via-slate-800/80 to-slate-900/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Calculator className="h-10 w-10 text-blue-400" />
            Commuting Cost Comparison Tool
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Compare the real cost of commuting into New York City across a
            variety of transit methods. This currently works for New Jersey
            only.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Input Form - Left Side */}
          <CostToolForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />

          {/* Results - Right Side */}
          <div className="space-y-6">
            <CostToolResults results={results} />
          </div>
        </div>

        {/* Cost Bar Chart */}
        {formData.commute_origin && formData.days_per_week[0] > 0 && (
          <div className="mt-8">
            <CostBarChart
              commuteOrigin={formData.commute_origin}
              commuteDaysPerWeek={formData.days_per_week[0]}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CostTool;
