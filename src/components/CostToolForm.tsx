
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { NJ_STATIONS, COMMUTE_METHODS, DEPARTURE_TIMES } from "@/constants/commute";
import { CommuteFormData } from "@/types/commute";

interface CostToolFormProps {
  formData: CommuteFormData;
  setFormData: (data: CommuteFormData) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const CostToolForm = ({ formData, setFormData, onSubmit, isLoading }: CostToolFormProps) => {
  const isFormValid = () => {
    return formData.commute_origin && 
           formData.commute_method && 
           formData.departure_time && 
           formData.office_address &&
           formData.ranking_cost &&
           formData.ranking_comfort &&
           formData.ranking_on_time &&
           formData.ranking_relaxation;
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <MapPin className="h-5 w-5 text-blue-400" />
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
          <Select value={formData.commute_origin} onValueChange={(value) => 
            setFormData({...formData, commute_origin: value})}>
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
              <SelectValue placeholder="Select your closest station" />
            </SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600 max-h-60">
              {NJ_STATIONS.map((station) => (
                <SelectItem key={station} value={station} className="text-white hover:bg-slate-600">
                  {station}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            How do you usually commute?
          </label>
          <Select value={formData.commute_method} onValueChange={(value) => 
            setFormData({...formData, commute_method: value})}>
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
              <SelectValue placeholder="Select your commute method" />
            </SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600">
              {COMMUTE_METHODS.map((method) => (
                <SelectItem key={method} value={method} className="text-white hover:bg-slate-600">
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
          <Select value={formData.departure_time} onValueChange={(value) => 
            setFormData({...formData, departure_time: value})}>
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
              <SelectValue placeholder="Select departure time" />
            </SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600">
              {DEPARTURE_TIMES.map((time) => (
                <SelectItem key={time} value={time} className="text-white hover:bg-slate-600">
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Days per week you commute (on average): {formData.days_per_week[0]} days
          </label>
          <Slider
            value={formData.days_per_week}
            onValueChange={(value) => setFormData({...formData, days_per_week: value})}
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
          <Textarea
            value={formData.office_address}
            onChange={(e) => setFormData({...formData, office_address: e.target.value})}
            placeholder="Enter your office address..."
            className="bg-slate-700 border-slate-600 text-white placeholder-gray-400"
            rows={3}
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Rank these in order of importance to you (1 = most important, 4 = least important):</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Cost</label>
              <Select value={formData.ranking_cost} onValueChange={(value) => 
                setFormData({...formData, ranking_cost: value})}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Rank" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  {[1,2,3,4].map((num) => (
                    <SelectItem key={num} value={num.toString()} className="text-white hover:bg-slate-600">
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Comfortability</label>
              <Select value={formData.ranking_comfort} onValueChange={(value) => 
                setFormData({...formData, ranking_comfort: value})}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Rank" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  {[1,2,3,4].map((num) => (
                    <SelectItem key={num} value={num.toString()} className="text-white hover:bg-slate-600">
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">On-time arrival</label>
              <Select value={formData.ranking_on_time} onValueChange={(value) => 
                setFormData({...formData, ranking_on_time: value})}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Rank" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  {[1,2,3,4].map((num) => (
                    <SelectItem key={num} value={num.toString()} className="text-white hover:bg-slate-600">
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Relaxed commute</label>
              <Select value={formData.ranking_relaxation} onValueChange={(value) => 
                setFormData({...formData, ranking_relaxation: value})}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Rank" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  {[1,2,3,4].map((num) => (
                    <SelectItem key={num} value={num.toString()} className="text-white hover:bg-slate-600">
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Button 
          onClick={onSubmit} 
          disabled={!isFormValid() || isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3"
        >
          {isLoading ? "Calculating..." : "Compare Options"}
        </Button>
      </CardContent>
    </Card>
  );
};
