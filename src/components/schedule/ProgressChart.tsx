
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, BarChart2, Calendar, LineChart } from "lucide-react";
import { ChartLoadingState } from "./charts/ChartLoadingState";
import { WeeklyChart } from "./charts/WeeklyChart";
import { MonthlyChart } from "./charts/MonthlyChart";
import { YearlyChart } from "./charts/YearlyChart";
import { useProgressChartData } from "./hooks/useProgressChartData";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useTheme } from "@/hooks/useTheme";

export function ProgressChart() {
  const { weeklyData, monthlyData, yearlyData, goalProgress, loading, error } = useProgressChartData();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const chartColors = {
    workouts: isDark ? '#9b87f5' : '#8884d8',
    duration: isDark ? '#4DA1A9' : '#82ca9d',
    intensity: isDark ? '#FF6056' : '#ff7c43',
    grid: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
    tooltip: isDark ? '#1E1F2B' : '#fff',
    text: isDark ? '#e2e8f0' : '#333',
  };
  
  if (loading) {
    return <ChartLoadingState />;
  }
  
  if (error) {
    return (
      <Card className="bg-card dark:bg-card-dark border-border dark:border-gray-700">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center p-6 text-center space-y-3">
            <AlertCircle className="w-12 h-12 text-primary/60" />
            <h3 className="text-lg font-medium">Failed to load chart data</h3>
            <p className="text-sm text-muted-foreground dark:text-muted-dark-foreground">
              There was an error loading your progress data.
            </p>
            <Button variant="outline" size="sm">Retry</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card dark:bg-card-dark border-border dark:border-gray-700">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-primary" />
              Progress Tracking
            </CardTitle>
            <CardDescription className="dark:text-gray-400">
              Monitor your workout frequency, duration and intensity
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {goalProgress && (
          <div className="mb-6 space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium">Monthly Goal Progress</p>
              <p className="text-sm font-medium">{goalProgress.current}/{goalProgress.target} workouts</p>
            </div>
            <Progress value={(goalProgress.current / goalProgress.target) * 100} className="h-2 bg-gray-200 dark:bg-gray-700" />
          </div>
        )}
      
        <Tabs defaultValue="weekly">
          <div className="flex justify-between items-center mb-4">
            <TabsList className="dark:bg-secondary-dark">
              <TabsTrigger value="weekly" className="dark:data-[state=active]:bg-primary dark:data-[state=active]:text-white">
                <Calendar className="w-4 h-4 mr-1" /> Week
              </TabsTrigger>
              <TabsTrigger value="monthly" className="dark:data-[state=active]:bg-primary dark:data-[state=active]:text-white">
                <Calendar className="w-4 h-4 mr-1" /> Month
              </TabsTrigger>
              <TabsTrigger value="yearly" className="dark:data-[state=active]:bg-primary dark:data-[state=active]:text-white">
                <LineChart className="w-4 h-4 mr-1" /> Year
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="weekly" className="h-[300px]">
            <WeeklyChart data={weeklyData} colors={chartColors} />
          </TabsContent>
          
          <TabsContent value="monthly" className="h-[300px]">
            <MonthlyChart data={monthlyData} colors={chartColors} />
          </TabsContent>
          
          <TabsContent value="yearly" className="h-[300px]">
            <YearlyChart data={yearlyData} colors={chartColors} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
