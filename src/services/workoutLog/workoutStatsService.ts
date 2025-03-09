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
      
      // Calculate streaks
      const { currentStreak, longestStreak } = this.calculateWorkoutStreaks(logs);
      
      return {
        totalWorkouts,
        currentStreak,
        longestStreak,
        totalDuration,
        thisMonthWorkouts,
        lastMonthWorkouts,
        workoutsByType,
        averageDuration,
        averageIntensity
      };
    } catch (error) {
      console.error("Error calculating workout statistics:", error);
      return {
        totalWorkouts: 0,
        currentStreak: 0,
        longestStreak: 0,
        totalDuration: 0,
        thisMonthWorkouts: 0,
        lastMonthWorkouts: 0,
        workoutsByType: {},
        averageDuration: 0,
        averageIntensity: 0
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
  },

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
  },

  // Check if user has achieved specific milestones
  async checkAchievements(): Promise<{
    achievements: Array<{
      id: string;
      name: string;
      description: string;
      achieved: boolean;
      progress: number;
      maxProgress: number;
    }>
  }> {
    try {
      const logs = await workoutLogCore.getUserWorkoutLogs();
      const stats = await this.getWorkoutStatistics();
      const volleyballStats = await this.getVolleyballWorkoutStats();
      
      // Define achievements
      const achievements = [
        {
          id: 'first-workout',
          name: 'First Step',
          description: 'Complete your first workout',
          achieved: logs.length > 0,
          progress: Math.min(logs.length, 1),
          maxProgress: 1
        },
        {
          id: 'consistency-streak',
          name: 'Consistency King',
          description: 'Work out 5 days in a row',
          achieved: stats.currentStreak >= 5,
          progress: Math.min(stats.currentStreak, 5),
          maxProgress: 5
        },
        {
          id: 'volleyball-enthusiast',
          name: 'Volleyball Pro',
          description: 'Complete 10 volleyball-specific workouts',
          achieved: volleyballStats.totalVolleyballWorkouts >= 10,
          progress: Math.min(volleyballStats.totalVolleyballWorkouts, 10),
          maxProgress: 10
        },
        {
          id: 'workout-explorer',
          name: 'Workout Explorer',
          description: 'Try 5 different types of workouts',
          achieved: Object.keys(stats.workoutsByType).length >= 5,
          progress: Math.min(Object.keys(stats.workoutsByType).length, 5),
          maxProgress: 5
        },
        {
          id: 'dedication',
          name: 'Dedication',
          description: 'Log 30 workouts total',
          achieved: stats.totalWorkouts >= 30,
          progress: Math.min(stats.totalWorkouts, 30),
          maxProgress: 30
        },
        {
          id: 'intensity-master',
          name: 'Intensity Master',
          description: 'Complete a workout with intensity 10',
          achieved: logs.some(log => log.intensity === 10),
          progress: logs.some(log => log.intensity === 10) ? 1 : 0,
          maxProgress: 1
        }
      ];
      
      return { achievements };
    } catch (error) {
      console.error("Error checking achievements:", error);
      return { achievements: [] };
    }
  }
};
