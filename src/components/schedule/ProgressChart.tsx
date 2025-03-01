
import { useState, useEffect } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart2, Calendar, Loader2 } from "lucide-react";
import { workoutLogService } from "@/services/workoutLogService";
import { WorkoutLog } from "@/types/workout";

export function ProgressChart() {
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
  
  const processWeeklyData = (logs: WorkoutLog[]) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday
    
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
    
    // Reorder days to start with Sunday or Monday based on your preference
    const orderedResult = [...result];
    
    return orderedResult;
  };
  
  const processMonthlyData = (logs: WorkoutLog[]) => {
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
  
  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <BarChart2 className="h-5 w-5 text-primary" />
                Progress Tracking
              </CardTitle>
              <CardDescription>
                Monitor your workout frequency and duration
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-primary" />
              Progress Tracking
            </CardTitle>
            <CardDescription>
              Monitor your workout frequency and duration
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="weekly">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="weekly">This Week</TabsTrigger>
              <TabsTrigger value="monthly">This Month</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="weekly" className="h-[300px]">
            {weeklyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="workouts" name="Workouts" fill="#8884d8" radius={[4, 4, 0, 0]} />
                  <Bar yAxisId="right" dataKey="duration" name="Duration (min)" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <h3 className="text-lg font-medium mb-1">No workout data</h3>
                  <p className="text-sm text-muted-foreground">
                    Complete workouts this week to see your progress
                  </p>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="monthly" className="h-[300px]">
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="workouts" name="Workouts" fill="#8884d8" radius={[4, 4, 0, 0]} />
                  <Bar yAxisId="right" dataKey="duration" name="Duration (min)" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <h3 className="text-lg font-medium mb-1">No workout data</h3>
                  <p className="text-sm text-muted-foreground">
                    Complete workouts this month to see your progress
                  </p>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
