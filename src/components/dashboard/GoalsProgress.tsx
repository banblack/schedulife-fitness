
import React from 'react';
import { Target, TrendingUp, BarChart, LineChart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { UserStats } from './useUserStats';

interface GoalsProgressProps {
  stats: UserStats;
}

export const GoalsProgress = ({ stats }: GoalsProgressProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
          <Target className="h-4 w-4 text-primary" />
          Weekly Goal Progress
        </h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Workouts Completed</span>
              <span className="font-medium">
                {stats.totalWorkouts % 5}/{5}
              </span>
            </div>
            <Progress 
              value={((stats.totalWorkouts % 5) / 5) * 100} 
              className="h-2"
            />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Volleyball Training</span>
              <span className="font-medium">0/2</span>
            </div>
            <Progress value={0} className="h-2" />
          </div>
        </div>
      </div>
      
      <div className="pt-4 border-t">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            Activity Trend
          </h3>
          <Button variant="ghost" size="sm" className="gap-1 h-7">
            <BarChart className="h-3.5 w-3.5" />
            <span className="text-xs">View Stats</span>
          </Button>
        </div>
        <div className="h-40 w-full bg-muted rounded-md flex items-center justify-center">
          <LineChart className="h-6 w-6 text-muted-foreground opacity-50" />
          <span className="text-sm text-muted-foreground ml-2">
            Complete more workouts to see your trends
          </span>
        </div>
      </div>
    </div>
  );
};
