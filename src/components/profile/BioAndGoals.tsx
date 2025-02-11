
import { Textarea } from "@/components/ui/textarea";
import { Target } from "lucide-react";

interface BioAndGoalsProps {
  bio: string;
  fitnessGoals: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const BioAndGoals = ({ bio, fitnessGoals, onChange }: BioAndGoalsProps) => {
  return (
    <div className="space-y-4 p-6 bg-white/50 rounded-xl shadow-sm backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <Target className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-semibold">Bio & Goals</h2>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="bio" className="text-sm font-medium text-gray-700">
            Bio
          </label>
          <Textarea
            id="bio"
            name="bio"
            value={bio}
            onChange={onChange}
            placeholder="Tell us about yourself"
            className="min-h-[100px] focus:ring-primary/30"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="fitnessGoals" className="text-sm font-medium text-gray-700">
            Fitness Goals
          </label>
          <Textarea
            id="fitnessGoals"
            name="fitnessGoals"
            value={fitnessGoals}
            onChange={onChange}
            placeholder="What are your fitness goals?"
            className="min-h-[100px] focus:ring-primary/30"
          />
        </div>
      </div>
    </div>
  );
};
