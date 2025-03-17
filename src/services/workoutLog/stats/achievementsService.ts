
import { workoutLogCore } from "../workoutLogCore";
import { basicStatsService } from "./basicStats";
import { volleyballStatsService } from "./volleyballStats";
import { streakCalculator } from "./streakCalculator";

export const achievementsService = {
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
      const volleyballStats = await volleyballStatsService.getVolleyballWorkoutStats();
      
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
  },

  // Combine all stats methods to maintain backward compatibility
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
      const basicStats = await basicStatsService.getBasicWorkoutStats();
      const { currentStreak, longestStreak } = streakCalculator.calculateWorkoutStreaks(logs);
      
      return {
        ...basicStats,
        currentStreak,
        longestStreak
      };
    } catch (error) {
      console.error("Error calculating combined workout statistics:", error);
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
  }
};
