
import { WorkoutLog } from "@/types/workout";

/**
 * Process workout logs to create weekly chart data
 */
export const processWeeklyData = (logs: WorkoutLog[]) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  
  // Initialize data for the last 7 days
  const result = days.map((day, index) => ({
    name: day,
    workouts: 0,
    duration: 0
  }));
  
  // Get the date 7 days ago
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);
  
  // Filter logs from the last 7 days
  const recentLogs = logs.filter(log => {
    const logDate = new Date(log.date);
    return logDate >= sevenDaysAgo;
  });
  
  // Group logs by day of week
  recentLogs.forEach(log => {
    const logDate = new Date(log.date);
    const dayIndex = logDate.getDay(); // 0 = Sunday, 6 = Saturday
    
    result[dayIndex].workouts += 1;
    result[dayIndex].duration += log.duration;
  });
  
  return result;
};

/**
 * Process workout logs to create monthly chart data
 */
export const processMonthlyData = (logs: WorkoutLog[]) => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  // Calculate first day of the month
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  
  // Filter logs from the current month
  const monthLogs = logs.filter(log => {
    const logDate = new Date(log.date);
    return logDate.getMonth() === currentMonth && logDate.getFullYear() === currentYear;
  });
  
  // Group logs by week of month
  const weekData = [
    { name: 'Week 1', workouts: 0, duration: 0 },
    { name: 'Week 2', workouts: 0, duration: 0 },
    { name: 'Week 3', workouts: 0, duration: 0 },
    { name: 'Week 4', workouts: 0, duration: 0 },
    { name: 'Week 5', workouts: 0, duration: 0 },
  ];
  
  monthLogs.forEach(log => {
    const logDate = new Date(log.date);
    const dayOfMonth = logDate.getDate();
    
    // Assign to appropriate week (simplified)
    let weekIndex;
    if (dayOfMonth <= 7) weekIndex = 0;
    else if (dayOfMonth <= 14) weekIndex = 1;
    else if (dayOfMonth <= 21) weekIndex = 2;
    else if (dayOfMonth <= 28) weekIndex = 3;
    else weekIndex = 4;
    
    weekData[weekIndex].workouts += 1;
    weekData[weekIndex].duration += log.duration;
  });
  
  // Remove unused weeks (e.g., if current date is in week 3, we don't show weeks 4-5)
  const dayOfMonth = today.getDate();
  let currentWeekIndex;
  if (dayOfMonth <= 7) currentWeekIndex = 0;
  else if (dayOfMonth <= 14) currentWeekIndex = 1;
  else if (dayOfMonth <= 21) currentWeekIndex = 2;
  else if (dayOfMonth <= 28) currentWeekIndex = 3;
  else currentWeekIndex = 4;
  
  return weekData.slice(0, currentWeekIndex + 1);
};
