
import { basicStatsService } from "./stats/basicStats";
import { streakCalculator } from "./stats/streakCalculator";
import { volleyballStatsService } from "./stats/volleyballStats";
import { achievementsService } from "./stats/achievementsService";
import { workoutLogCore } from "./workoutLogCore";

export const workoutStatsService = {
  // Main statistics method (for backwards compatibility)
  async getWorkoutStatistics() {
    return achievementsService.getWorkoutStatistics();
  },
  
  // Expose streak calculator for external use
  calculateWorkoutStreaks(logs: any[]) {
    return streakCalculator.calculateWorkoutStreaks(logs);
  },
  
  // Expose volleyball stats method for external use
  async getVolleyballWorkoutStats() {
    return volleyballStatsService.getVolleyballWorkoutStats();
  },
  
  // Expose achievements method for external use
  async checkAchievements() {
    return achievementsService.checkAchievements();
  }
};
