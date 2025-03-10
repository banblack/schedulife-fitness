
import { useEffect, useState } from "react";
import { Award, Calendar, Flame, Medal, ThumbsUp, TrendingUp } from "lucide-react";
import { workoutLogService } from "@/services/workoutLog";
import { WorkoutLogFormData } from "@/types/workout";
import confetti from "canvas-confetti";

interface SuccessStateProps {
  workoutData: WorkoutLogFormData;
}

export function SuccessState({ workoutData }: SuccessStateProps) {
  const [streak, setStreak] = useState(0);
  const [totalWorkouts, setTotalWorkouts] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Trigger confetti effect when component mounts
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    const fetchStats = async () => {
      try {
        // Get workout statistics using the correct method
        const stats = await workoutLogService.getWorkoutStatistics();
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
      <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white">
        <ThumbsUp className="h-10 w-10" />
      </div>
      
      <h2 className="text-2xl font-bold text-center gradient-text">
        Workout Completed!
      </h2>
      
      <p className="text-center text-muted-foreground">
        {getPerformanceMessage()} Your workout has been logged successfully.
      </p>
      
      {!isLoading && (
        <div className="w-full space-y-5">
          {/* Workout Stats */}
          <div className="flex flex-col gap-3 p-5 bg-white rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm font-medium">Current Streak</span>
              </div>
              <span className="text-lg font-bold">{streak} days</span>
            </div>
            
            <div className="h-px bg-gray-100 w-full"></div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-accent" />
                </div>
                <span className="text-sm font-medium">Total Workouts</span>
              </div>
              <span className="text-lg font-bold">{totalWorkouts}</span>
            </div>
            
            <div className="h-px bg-gray-100 w-full"></div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <Flame className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm font-medium">Workout Intensity</span>
              </div>
              <span className="text-lg font-bold">{workoutData.intensity}/10</span>
            </div>
          </div>
          
          {/* Achievement/Milestone Badge */}
          {isMilestone && (
            <div className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-primary/10 to-accent/10 text-secondary rounded-xl border border-primary/20">
              <Award className="h-6 w-6 text-primary" />
              <span className="text-sm font-semibold">
                Milestone achieved: {totalWorkouts} workouts completed!
              </span>
            </div>
          )}
          
          {streak >= 3 && (
            <div className="flex items-center justify-center gap-3 mt-3 p-3 bg-secondary/5 rounded-xl">
              <Medal className="h-5 w-5 text-accent" />
              <span className="text-sm font-medium">
                {streak} day streak! Keep going!
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
