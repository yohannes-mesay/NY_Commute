import { Calculator } from "lucide-react";
import { CostToolForm } from "@/components/CostToolForm";
import { CostToolResults } from "@/components/CostToolResults";
import { CostBarChart } from "@/components/CostBarChart";
import { useCommuteForm } from "@/hooks/useCommuteForm";

const CostTool = () => {
  const { formData, setFormData, results, isLoading, handleSubmit } =
    useCommuteForm();

  return (
    <div className="relative min-h-screen pt-24 pb-16">
      <div
        className="pointer-events-none fixed inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />
      <div className="relative z-10 w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Calculator className="h-8 w-8 sm:h-10 sm:w-10 text-blue-400" />
            Commuting Cost Comparison Tool
          </h1>
          <p className="text-base sm:text-lg text-gray-300 max-w-3xl mx-auto">
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
