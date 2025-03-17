
import { workoutLogCore } from "../workoutLogCore";

export const basicStatsService = {
  // Get basic workout statistics
  async getBasicWorkoutStats(): Promise<{
    totalWorkouts: number;
    totalDuration: number;
    thisMonthWorkouts: number;
    lastMonthWorkouts: number;
    workoutsByType: Record<string, number>;
    averageDuration: number;
    averageIntensity: number;
  }> {
    try {
      const logs = await workoutLogCore.getUserWorkoutLogs();
      
      // Calculate statistics
      const totalWorkouts = logs.length;
      const totalDuration = logs.reduce((sum, log) => sum + log.duration, 0);
      const totalIntensity = logs.reduce((sum, log) => sum + log.intensity, 0);
      const averageDuration = totalWorkouts > 0 ? Math.round(totalDuration / totalWorkouts) : 0;
      const averageIntensity = totalWorkouts > 0 ? Math.round(totalIntensity / totalWorkouts * 10) / 10 : 0;
      
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
      
      // Group workouts by type
      const workoutsByType = logs.reduce((acc: Record<string, number>, log) => {
        const workoutName = log.workoutName || 'Unknown';
        acc[workoutName] = (acc[workoutName] || 0) + 1;
        return acc;
      }, {});
      
      return {
        totalWorkouts,
        totalDuration,
        thisMonthWorkouts,
        lastMonthWorkouts,
        workoutsByType,
        averageDuration,
        averageIntensity
      };
    } catch (error) {
      console.error("Error calculating basic workout statistics:", error);
      return {
        totalWorkouts: 0,
        totalDuration: 0,
        thisMonthWorkouts: 0,
        lastMonthWorkouts: 0,
        workoutsByType: {},
        averageDuration: 0,
        averageIntensity: 0
      };
    }
  }
};
