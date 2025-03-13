
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
    duration: 0,
    intensity: 0
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
    
    // Calculate intensity on scale of 1-10
    if (log.intensity) {
      result[dayIndex].intensity = Math.max(result[dayIndex].intensity, log.intensity);
    } else if (log.difficulty) {
      // Convert difficulty to intensity if it exists
      result[dayIndex].intensity = Math.max(result[dayIndex].intensity, log.difficulty);
    }
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
    { name: 'Week 1', workouts: 0, duration: 0, intensity: 0, logCount: 0 },
    { name: 'Week 2', workouts: 0, duration: 0, intensity: 0, logCount: 0 },
    { name: 'Week 3', workouts: 0, duration: 0, intensity: 0, logCount: 0 },
    { name: 'Week 4', workouts: 0, duration: 0, intensity: 0, logCount: 0 },
    { name: 'Week 5', workouts: 0, duration: 0, intensity: 0, logCount: 0 },
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
    weekData[weekIndex].logCount += 1;
    
    // Sum intensity for averaging later
    if (log.intensity) {
      weekData[weekIndex].intensity += log.intensity;
    } else if (log.difficulty) {
      weekData[weekIndex].intensity += log.difficulty;
    }
  });
  
  // Calculate averages
  weekData.forEach(week => {
    if (week.logCount > 0) {
      week.duration = Math.round(week.duration / week.logCount);
      week.intensity = Math.round(week.intensity / week.logCount);
    }
    delete week.logCount;
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

/**
 * Process workout logs to create yearly chart data
 */
export const processYearlyData = (logs: WorkoutLog[]) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const today = new Date();
  const currentYear = today.getFullYear();
  
  // Initialize data for the last 12 months
  const result = months.map((month, index) => ({
    name: month,
    workouts: 0,
    duration: 0,
    intensity: 0,
    logCount: 0
  }));
  
  // Filter logs from the current year
  const yearLogs = logs.filter(log => {
    const logDate = new Date(log.date);
    return logDate.getFullYear() === currentYear;
  });
  
  // Group logs by month
  yearLogs.forEach(log => {
    const logDate = new Date(log.date);
    const monthIndex = logDate.getMonth();
    
    result[monthIndex].workouts += 1;
    result[monthIndex].duration += log.duration;
    result[monthIndex].logCount += 1;
    
    // Sum intensity for averaging later
    if (log.intensity) {
      result[monthIndex].intensity += log.intensity;
    } else if (log.difficulty) {
      result[monthIndex].intensity += log.difficulty;
    }
  });
  
  // Calculate averages
  result.forEach(month => {
    if (month.logCount > 0) {
      month.duration = Math.round(month.duration / month.logCount);
      month.intensity = Math.round(month.intensity / month.logCount);
    }
    delete month.logCount;
  });
  
  // Get only months up to the current month
  const currentMonth = today.getMonth();
  return result.slice(0, currentMonth + 1);
};
