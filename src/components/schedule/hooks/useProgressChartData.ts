
import { useState, useEffect } from "react";
import { workoutLogService } from "@/services/workoutLog";
import { processWeeklyData, processMonthlyData, processYearlyData } from "../utils/chartDataUtils";

export function useProgressChartData() {
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [yearlyData, setYearlyData] = useState<any[]>([]);
  const [goalProgress, setGoalProgress] = useState<{current: number; target: number} | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const fetchWorkoutLogs = async () => {
      setLoading(true);
      try {
        const workoutLogs = await workoutLogService.getUserWorkoutLogs();
        const workoutStats = await workoutLogService.getWorkoutStatistics();
        
        // Set monthly goal progress
        setGoalProgress({
          current: workoutStats.thisMonthWorkouts,
          target: 20 // Default target, could be from user settings
        });
        
        // Process data for weekly chart
        const weeklyChartData = processWeeklyData(workoutLogs);
        setWeeklyData(weeklyChartData);
        
        // Process data for monthly chart
        const monthlyChartData = processMonthlyData(workoutLogs);
        setMonthlyData(monthlyChartData);
        
        // Process data for yearly chart
        const yearlyChartData = processYearlyData(workoutLogs);
        setYearlyData(yearlyChartData);
        
      } catch (error) {
        console.error("Error fetching workout logs for chart:", error);
        setError(error instanceof Error ? error : new Error('Unknown error occurred'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchWorkoutLogs();
  }, []);
  
  return { weeklyData, monthlyData, yearlyData, goalProgress, loading, error };
}
