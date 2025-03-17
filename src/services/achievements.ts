
import { supabase } from "@/lib/supabase";

export interface Achievement {
  id: string;
  name: string;
  description: string;
  achieved: boolean;
  progress: number;
  maxProgress: number;
  unlockedAt?: string | null;
  iconName?: string;
}

export const achievementsService = {
  /**
   * Check for user achievements based on their workout history
   */
  async getUserAchievements(): Promise<Achievement[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      
      // Fetch workout logs
      const { data: logs, error: logsError } = await supabase
        .from("workout_logs")
        .select("*")
        .eq("user_id", user.id);
        
      if (logsError) throw logsError;
      
      // Calculate total workout minutes
      const totalMinutes = logs ? logs.reduce((sum, log) => sum + log.duration, 0) : 0;
      
      // Count total workouts
      const totalWorkouts = logs ? logs.length : 0;
      
      // Check for volleyball specific workouts
      const volleyballWorkouts = logs ? logs.filter(log => 
        log.workout_name.toLowerCase().includes("volleyball") ||
        (log.notes && log.notes.toLowerCase().includes("volleyball"))
      ).length : 0;
      
      // Get the workout categories (to check for workout variety)
      const workoutCategories = new Set();
      logs?.forEach(log => {
        workoutCategories.add(log.workout_name);
      });
      
      // Calculate streak
      const { currentStreak } = await this.calculateStreak(logs || []);
      
      // Define achievements
      const achievements: Achievement[] = [
        {
          id: "first-workout",
          name: "First Steps",
          description: "Complete your first workout",
          achieved: totalWorkouts > 0,
          progress: Math.min(totalWorkouts, 1),
          maxProgress: 1,
          iconName: "Dumbbell"
        },
        {
          id: "workout-streak-3",
          name: "Consistency Streak",
          description: "Complete workouts 3 days in a row",
          achieved: currentStreak >= 3,
          progress: Math.min(currentStreak, 3),
          maxProgress: 3,
          iconName: "Flame"
        },
        {
          id: "workout-streak-7",
          name: "Week Warrior",
          description: "Complete workouts 7 days in a row",
          achieved: currentStreak >= 7,
          progress: Math.min(currentStreak, 7),
          maxProgress: 7,
          iconName: "Flame"
        },
        {
          id: "workout-total-5",
          name: "Getting Started",
          description: "Complete 5 workouts total",
          achieved: totalWorkouts >= 5,
          progress: Math.min(totalWorkouts, 5),
          maxProgress: 5,
          iconName: "Dumbbell"
        },
        {
          id: "workout-total-20",
          name: "Regular Athlete",
          description: "Complete 20 workouts total",
          achieved: totalWorkouts >= 20,
          progress: Math.min(totalWorkouts, 20),
          maxProgress: 20,
          iconName: "Dumbbell"
        },
        {
          id: "volleyball-specialist",
          name: "Volleyball Enthusiast",
          description: "Complete 5 volleyball workouts",
          achieved: volleyballWorkouts >= 5,
          progress: Math.min(volleyballWorkouts, 5),
          maxProgress: 5,
          iconName: "Target"
        },
        {
          id: "workout-variety",
          name: "Exercise Explorer",
          description: "Try 5 different types of workouts",
          achieved: workoutCategories.size >= 5,
          progress: Math.min(workoutCategories.size, 5),
          maxProgress: 5,
          iconName: "Globe"
        },
        {
          id: "workout-minutes-60",
          name: "Hour Champion",
          description: "Complete a 60+ minute workout",
          achieved: logs ? logs.some(log => log.duration >= 60) : false,
          progress: logs ? (logs.some(log => log.duration >= 60) ? 1 : 0) : 0,
          maxProgress: 1,
          iconName: "Clock"
        },
        {
          id: "workout-minutes-total-300",
          name: "300 Club",
          description: "Accumulate 300 total workout minutes",
          achieved: totalMinutes >= 300,
          progress: Math.min(totalMinutes, 300),
          maxProgress: 300,
          iconName: "Clock"
        }
      ];
      
      return achievements;
    } catch (error) {
      console.error("Error fetching achievements:", error);
      return [];
    }
  },
  
  /**
   * Calculate the user's current and longest streak
   */
  async calculateStreak(logs: any[]): Promise<{currentStreak: number, longestStreak: number}> {
    if (logs.length === 0) return { currentStreak: 0, longestStreak: 0 };
    
    // Sort logs by date (newest first)
    const sortedLogs = [...logs].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    // Initialize streak counters
    let currentStreak = 0;
    let longestStreak = 0;
    
    // Check if there's a workout today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const mostRecentLogDate = new Date(sortedLogs[0].date);
    mostRecentLogDate.setHours(0, 0, 0, 0);
    
    const daysSinceLastWorkout = Math.floor(
      (today.getTime() - mostRecentLogDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysSinceLastWorkout <= 1) {
      // Start counting current streak
      currentStreak = 1;
      let previousDate = mostRecentLogDate;
      
      for (let i = 1; i < sortedLogs.length; i++) {
        const currentLogDate = new Date(sortedLogs[i].date);
        currentLogDate.setHours(0, 0, 0, 0);
        
        const daysBetween = Math.floor(
          (previousDate.getTime() - currentLogDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        
        if (daysBetween === 1) {
          currentStreak++;
          previousDate = currentLogDate;
        } else {
          break;
        }
      }
    }
    
    // Calculate longest streak
    let tempStreak = 1;
    let prevDate = new Date(sortedLogs[0].date);
    prevDate.setHours(0, 0, 0, 0);
    
    for (let i = 1; i < sortedLogs.length; i++) {
      const currDate = new Date(sortedLogs[i].date);
      currDate.setHours(0, 0, 0, 0);
      
      const daysBetween = Math.floor(
        (prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      if (daysBetween === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
      
      prevDate = currDate;
    }
    
    longestStreak = Math.max(longestStreak, tempStreak, currentStreak);
    
    return { currentStreak, longestStreak };
  }
};
