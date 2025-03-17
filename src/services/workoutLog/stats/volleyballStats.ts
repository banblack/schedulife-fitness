
import { workoutLogCore } from "../workoutLogCore";

export const volleyballStatsService = {
  // Get volleyball-specific workout statistics
  async getVolleyballWorkoutStats(): Promise<{
    totalVolleyballWorkouts: number;
    lastVolleyballWorkout: string | null;
    volleyballWorkoutsTrend: number;
  }> {
    try {
      const logs = await workoutLogCore.getUserWorkoutLogs();
      
      // Filter volleyball workouts
      const volleyballWorkouts = logs.filter(log => 
        log.workoutName?.toLowerCase().includes('volleyball') ||
        log.notes?.toLowerCase().includes('volleyball')
      );
      
      const totalVolleyballWorkouts = volleyballWorkouts.length;
      
      // Get last volleyball workout date
      const lastVolleyballWorkout = totalVolleyballWorkouts > 0 
        ? new Date(volleyballWorkouts[0].date).toISOString()
        : null;
      
      // Calculate trend - compare this month vs last month
      const now = new Date();
      const thisMonth = now.getMonth();
      const thisYear = now.getFullYear();
      
      const thisMonthVolleyball = volleyballWorkouts.filter(log => {
        const logDate = new Date(log.date);
        return logDate.getMonth() === thisMonth && logDate.getFullYear() === thisYear;
      }).length;
      
      let lastMonth = thisMonth - 1;
      let lastMonthYear = thisYear;
      if (lastMonth < 0) {
        lastMonth = 11;
        lastMonthYear--;
      }
      
      const lastMonthVolleyball = volleyballWorkouts.filter(log => {
        const logDate = new Date(log.date);
        return logDate.getMonth() === lastMonth && logDate.getFullYear() === lastMonthYear;
      }).length;
      
      const volleyballWorkoutsTrend = lastMonthVolleyball > 0 
        ? Math.round((thisMonthVolleyball - lastMonthVolleyball) / lastMonthVolleyball * 100) 
        : thisMonthVolleyball > 0 ? 100 : 0;
      
      return {
        totalVolleyballWorkouts,
        lastVolleyballWorkout,
        volleyballWorkoutsTrend
      };
    } catch (error) {
      console.error("Error calculating volleyball workout stats:", error);
      return {
        totalVolleyballWorkouts: 0,
        lastVolleyballWorkout: null,
        volleyballWorkoutsTrend: 0
      };
    }
  }
};
