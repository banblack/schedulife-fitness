
import { useState, useEffect } from "react";
import { workoutLogService } from "@/services/workoutLog";
import { processWeeklyData, processMonthlyData } from "../utils/chartDataUtils";

export function useProgressChartData() {
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchWorkoutLogs = async () => {
      setLoading(true);
      try {
        const workoutLogs = await workoutLogService.getUserWorkoutLogs();
        
        // Process data for weekly chart
        const weeklyChartData = processWeeklyData(workoutLogs);
        setWeeklyData(weeklyChartData);
        
        // Process data for monthly chart
        const monthlyChartData = processMonthlyData(workoutLogs);
        setMonthlyData(monthlyChartData);
      } catch (error) {
        console.error("Error fetching workout logs for chart:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchWorkoutLogs();
  }, []);
  
  return { weeklyData, monthlyData, loading };
}
