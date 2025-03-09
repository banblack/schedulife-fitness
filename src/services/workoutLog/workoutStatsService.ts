
import { workoutLogCore } from "./workoutLogCore";

export const workoutStatsService = {
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
      const logs = await workoutLogCore.getUserWorkoutLogs();
      
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
      
      // Calculate streaks
      const { currentStreak, longestStreak } = this.calculateWorkoutStreaks(logs);
      
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
  },
  
  // Helper function to calculate streak
  calculateWorkoutStreaks(logs: any[]): { currentStreak: number; longestStreak: number } {
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
    
    return { currentStreak, longestStreak };
  }
};
