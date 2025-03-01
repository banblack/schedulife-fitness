
import { useState, useEffect } from "react";
import { CalendarCheck, Award, Flame, TrendingUp, Clock, Loader2 } from "lucide-react";
import { workoutLogService } from "@/services/workoutLogService";

export function WorkoutStatistics() {
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalDuration: 0,
    thisMonthWorkouts: 0,
    lastMonthWorkouts: 0,
  });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchStatistics = async () => {
      setLoading(true);
      try {
        const workoutStats = await workoutLogService.getWorkoutStatistics();
        setStats(workoutStats);
      } catch (error) {
        console.error("Error fetching workout statistics:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStatistics();
  }, []);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  // Calculate consistency percentage
  const monthComparison = stats.lastMonthWorkouts > 0 
    ? Math.round((stats.thisMonthWorkouts / stats.lastMonthWorkouts) * 100)
    : stats.thisMonthWorkouts > 0 ? 100 : 0;
  
  const monthTrend = stats.thisMonthWorkouts - stats.lastMonthWorkouts;
  
  // Calculate achievement progress
  const firstStepProgress = stats.totalWorkouts > 0 ? 100 : 0;
  const consistencyKingProgress = Math.min(stats.currentStreak / 5 * 100, 100);
  const volleyballProProgress = Math.min(stats.totalWorkouts / 10 * 100, 100);
  const dedicationProgress = Math.min(stats.totalWorkouts / 30 * 100, 100);
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
          <div className="flex items-center gap-2 mb-2">
            <CalendarCheck className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-medium">Current Streak</h3>
          </div>
          <p className="text-2xl font-bold">{stats.currentStreak} days</p>
          <p className="text-xs text-muted-foreground mt-1">Best: {stats.longestStreak} days</p>
        </div>
        
        <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-medium">This Month</h3>
          </div>
          <p className="text-2xl font-bold">{stats.thisMonthWorkouts} workouts</p>
          <p className="text-xs text-muted-foreground mt-1">
            {monthTrend > 0 && '+'}{monthTrend} from last month
          </p>
        </div>

        <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-medium">Total Time</h3>
          </div>
          <p className="text-2xl font-bold">
            {Math.floor(stats.totalDuration / 60)} hours {stats.totalDuration % 60} min
          </p>
          <p className="text-xs text-muted-foreground mt-1">Lifetime</p>
        </div>
        
        <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-medium">Consistency</h3>
          </div>
          <p className="text-2xl font-bold">{monthComparison}%</p>
          <p className="text-xs text-muted-foreground mt-1">vs. last month</p>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
          <Award className="h-4 w-4 text-primary" />
          Achievements
        </h3>
        <div className="space-y-3">
          <AchievementItem 
            name="First Step" 
            description="Complete your first workout"
            progress={firstStepProgress}
            unlocked={firstStepProgress >= 100}
          />
          <AchievementItem 
            name="Consistency King" 
            description="Work out 5 days in a row"
            progress={consistencyKingProgress}
            unlocked={consistencyKingProgress >= 100}
          />
          <AchievementItem 
            name="Volleyball Pro" 
            description="Complete 10 volleyball-specific workouts"
            progress={volleyballProProgress}
            unlocked={volleyballProProgress >= 100}
          />
          <AchievementItem 
            name="Dedication" 
            description="Log 30 workouts total"
            progress={dedicationProgress}
            unlocked={dedicationProgress >= 100}
          />
        </div>
      </div>
    </div>
  );
}

interface AchievementItemProps {
  name: string;
  description: string;
  progress: number;
  unlocked: boolean;
}

function AchievementItem({ name, description, progress, unlocked }: AchievementItemProps) {
  return (
    <div className={`p-3 rounded-lg border ${unlocked ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-200'}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
            unlocked ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-500'
          }`}>
            {unlocked ? (
              <Award className="h-3 w-3" />
            ) : (
              <Award className="h-3 w-3" />
            )}
          </div>
          <h4 className={`text-sm font-medium ${unlocked ? 'text-yellow-700' : 'text-gray-700'}`}>
            {name}
          </h4>
        </div>
        {unlocked && <span className="text-xs font-medium text-yellow-600">Unlocked!</span>}
      </div>
      <p className="text-xs text-muted-foreground mb-2">{description}</p>
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div 
          className={`h-1.5 rounded-full ${unlocked ? 'bg-yellow-500' : 'bg-primary'}`} 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}
