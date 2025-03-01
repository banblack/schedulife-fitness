
import { supabase } from "@/lib/supabase";
import { WorkoutLog, WorkoutLogFormData } from "@/types/workout";

export const workoutLogService = {
  // Add a new workout log
  async addWorkoutLog(
    workoutId: string,
    workoutName: string,
    data: WorkoutLogFormData
  ): Promise<WorkoutLog | null> {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) throw new Error("User not authenticated");

      const { data: log, error } = await supabase
        .from("workout_logs")
        .insert({
          user_id: userData.user.id,
          workout_id: workoutId,
          workout_name: workoutName,
          date: new Date().toISOString(),
          duration: data.duration,
          intensity: data.intensity,
          notes: data.notes,
        })
        .select()
        .single();

      if (error) throw error;
      return log as WorkoutLog;
    } catch (error) {
      console.error("Error adding workout log:", error);
      return null;
    }
  },

  // Get all workout logs for the current user
  async getUserWorkoutLogs(): Promise<WorkoutLog[]> {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("workout_logs")
        .select("*")
        .eq("user_id", userData.user.id)
        .order("date", { ascending: false });

      if (error) throw error;
      return data as WorkoutLog[];
    } catch (error) {
      console.error("Error fetching workout logs:", error);
      return [];
    }
  },

  // Get workout logs within a date range
  async getWorkoutLogsByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<WorkoutLog[]> {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("workout_logs")
        .select("*")
        .eq("user_id", userData.user.id)
        .gte("date", startDate.toISOString())
        .lte("date", endDate.toISOString())
        .order("date", { ascending: false });

      if (error) throw error;
      return data as WorkoutLog[];
    } catch (error) {
      console.error("Error fetching workout logs by date range:", error);
      return [];
    }
  },

  // Get workout statistics
  async getWorkoutStatistics(): Promise<{
    totalWorkouts: number;
    currentStreak: number;
    longestStreak: number;
    totalDuration: number;
    thisMonthWorkouts: number;
    lastMonthWorkouts: number;
  }> {
    try {
      const logs = await this.getUserWorkoutLogs();
      
      // Calculate statistics
      const totalWorkouts = logs.length;
      const totalDuration = logs.reduce((sum, log) => sum + log.duration, 0);
      
      // Current month workouts
      const now = new Date();
      const thisMonth = now.getMonth();
      const thisYear = now.getFullYear();
      const thisMonthWorkouts = logs.filter(log => {
        const logDate = new Date(log.date);
        return logDate.getMonth() === thisMonth && logDate.getFullYear() === thisYear;
      }).length;
      
      // Last month workouts
      let lastMonth = thisMonth - 1;
      let lastMonthYear = thisYear;
      if (lastMonth < 0) {
        lastMonth = 11;
        lastMonthYear--;
      }
      
      const lastMonthWorkouts = logs.filter(log => {
        const logDate = new Date(log.date);
        return logDate.getMonth() === lastMonth && logDate.getFullYear() === lastMonthYear;
      }).length;
      
      // Calculate streak
      let currentStreak = 0;
      let longestStreak = 0;
      
      // Sort logs by date (newest first)
      const sortedLogs = [...logs].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      
      if (sortedLogs.length > 0) {
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
        
        longestStreak = Math.max(longestStreak, tempStreak);
      }
      
      return {
        totalWorkouts,
        currentStreak,
        longestStreak,
        totalDuration,
        thisMonthWorkouts,
        lastMonthWorkouts
      };
    } catch (error) {
      console.error("Error calculating workout statistics:", error);
      return {
        totalWorkouts: 0,
        currentStreak: 0,
        longestStreak: 0,
        totalDuration: 0,
        thisMonthWorkouts: 0,
        lastMonthWorkouts: 0
      };
    }
  }
};
