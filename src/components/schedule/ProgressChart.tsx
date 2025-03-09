
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart2 } from "lucide-react";
import { ChartLoadingState } from "./charts/ChartLoadingState";
import { WeeklyChart } from "./charts/WeeklyChart";
import { MonthlyChart } from "./charts/MonthlyChart";
import { useProgressChartData } from "./hooks/useProgressChartData";

export function ProgressChart() {
  const { weeklyData, monthlyData, loading } = useProgressChartData();
  
  if (loading) {
    return <ChartLoadingState />;
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
            <WeeklyChart data={weeklyData} />
          </TabsContent>
          
          <TabsContent value="monthly" className="h-[300px]">
            <MonthlyChart data={monthlyData} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
