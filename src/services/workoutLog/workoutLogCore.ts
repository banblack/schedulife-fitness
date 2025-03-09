
import { supabase } from "@/lib/supabase";
import { WorkoutLog, WorkoutLogFormData } from "@/types/workout";

export const workoutLogCore = {
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
  }
};
