
import { Trophy, Medal, Flame, Activity } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AchievementProps {
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
  title: string;
  description: string;
  progress: string;
  progressColor: string;
}

interface AchievementsProps {
  streak: number;
}

export function Achievements({ streak }: AchievementsProps) {
  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-semibold text-gray-900">Achievements</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-4 hover:shadow-lg transition-shadow bg-gradient-to-br from-primary/5 to-primary/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-full">
              <Medal className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Consistency Champion</h3>
              <p className="text-sm text-neutral">Completed 5 workouts in a row</p>
            </div>
          </div>
          <div className="mt-3">
            <Badge variant="secondary" className="bg-primary/20 hover:bg-primary/30 text-primary">
              {Math.min(streak, 5)}/5 Days
            </Badge>
          </div>
        </Card>

        <Card className="p-4 hover:shadow-lg transition-shadow bg-gradient-to-br from-orange-500/5 to-orange-500/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/20 rounded-full">
              <Flame className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <h3 className="font-medium">Calorie Crusher</h3>
              <p className="text-sm text-neutral">Burn 5000 calories this week</p>
            </div>
          </div>
          <div className="mt-3">
            <Badge variant="secondary" className="bg-orange-500/20 hover:bg-orange-500/30 text-orange-500">
              3250/5000 cal
            </Badge>
          </div>
        </Card>

        <Card className="p-4 hover:shadow-lg transition-shadow bg-gradient-to-br from-green-500/5 to-green-500/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-full">
              <Activity className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <h3 className="font-medium">Volleyball Pro</h3>
              <p className="text-sm text-neutral">Complete 10 volleyball workouts</p>
            </div>
          </div>
          <div className="mt-3">
            <Badge variant="secondary" className="bg-green-500/20 hover:bg-green-500/30 text-green-500">
              2/10 workouts
            </Badge>
          </div>
        </Card>
      </div>
    </div>
  );
}
