
import { useEffect, useState } from "react";
import { Award, Calendar, Flame, Medal, ThumbsUp, TrendingUp } from "lucide-react";
import { workoutLogService } from "@/services/workoutLog";
import { WorkoutLogFormData } from "@/types/workout";

interface SuccessStateProps {
  workoutData: WorkoutLogFormData;
}

export function SuccessState({ workoutData }: SuccessStateProps) {
  const [streak, setStreak] = useState(0);
  const [totalWorkouts, setTotalWorkouts] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const stats = await workoutLogService.getUserWorkoutStats();
        setStreak(stats.currentStreak || 0);
        setTotalWorkouts(stats.totalWorkouts || 0);
      } catch (error) {
        console.error("Failed to fetch workout stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Performance-based message
  const getPerformanceMessage = () => {
    if (!workoutData.performance) return "Keep it up!";
    
    if (workoutData.performance >= 4) return "Excellent performance!";
    if (workoutData.performance >= 3) return "Great effort!";
    return "Good job showing up today!";
  };

  // Determine if this is a milestone workout
  const isMilestone = totalWorkouts > 0 && (totalWorkouts % 5 === 0 || totalWorkouts % 10 === 0);

  return (
    <div className="py-8 flex flex-col items-center justify-center space-y-6">
      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-600">
        <ThumbsUp className="h-8 w-8" />
      </div>
      
      <h2 className="text-xl font-semibold text-center">Workout Completed!</h2>
      
      <p className="text-center text-muted-foreground">
        {getPerformanceMessage()} Your workout has been logged successfully.
      </p>
      
      {!isLoading && (
        <div className="w-full space-y-4">
          {/* Workout Stats */}
          <div className="flex flex-col gap-2 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Current Streak</span>
              </div>
              <span className="font-bold">{streak} days</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Total Workouts</span>
              </div>
              <span className="font-bold">{totalWorkouts}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium">Workout Intensity</span>
              </div>
              <span className="font-bold">{workoutData.intensity}/10</span>
            </div>
          </div>
          
          {/* Achievement/Milestone Badge */}
          {isMilestone && (
            <div className="flex items-center justify-center gap-2 p-3 bg-yellow-100 text-yellow-800 rounded-lg">
              <Award className="h-5 w-5 text-yellow-600" />
              <span className="text-sm font-semibold">
                Milestone achieved: {totalWorkouts} workouts completed!
              </span>
            </div>
          )}
          
          {streak >= 3 && (
            <div className="flex items-center justify-center gap-2 mt-2">
              <Medal className="h-5 w-5 text-primary" />
              <span className="text-sm">
                {streak} day streak! Keep going!
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
