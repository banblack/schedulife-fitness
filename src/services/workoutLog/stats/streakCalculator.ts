
import { WorkoutLog } from "@/types/workout";

export const streakCalculator = {
  // Calculate workout streaks
  calculateWorkoutStreaks(logs: WorkoutLog[]): { currentStreak: number; longestStreak: number } {
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
