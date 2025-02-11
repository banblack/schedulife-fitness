
import { Input } from "@/components/ui/input";
import { Dumbbell, AlertCircle, Trophy } from "lucide-react";
import { ValidationErrors } from "@/types/profile";

interface PhysicalInfoProps {
  height: string;
  weight: string;
  bmi: number | null;
  errors: ValidationErrors;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const getBMICategory = (bmi: number): string => {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal weight";
  if (bmi < 30) return "Overweight";
  return "Obese";
};

export const PhysicalInfo = ({ height, weight, bmi, errors, onChange }: PhysicalInfoProps) => {
  return (
    <div className="space-y-4 p-6 bg-white/50 rounded-xl shadow-sm backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <Dumbbell className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-semibold">Physical Information</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="height" className="text-sm font-medium text-gray-700">
            Height (cm)
          </label>
          <Input
            id="height"
            name="height"
            type="number"
            value={height}
            onChange={onChange}
            placeholder="Enter your height"
            className={`${errors.height ? "border-red-500" : "focus:ring-primary/30"}`}
          />
          {errors.height && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.height}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <label htmlFor="weight" className="text-sm font-medium text-gray-700">
            Weight (kg)
          </label>
          <Input
            id="weight"
            name="weight"
            type="number"
            value={weight}
            onChange={onChange}
            placeholder="Enter your weight"
            className={`${errors.weight ? "border-red-500" : "focus:ring-primary/30"}`}
          />
          {errors.weight && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.weight}
            </p>
          )}
        </div>
      </div>
      {bmi !== null && (
        <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
          <p className="text-sm font-medium flex items-center gap-2">
            <Trophy className="w-4 h-4 text-primary" />
            Your BMI: {bmi} ({getBMICategory(bmi)})
          </p>
        </div>
      )}
    </div>
  );
};
