
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Calendar, Dumbbell, Flame, Heart } from 'lucide-react';
import { UserStats } from './useUserStats';

interface StatsOverviewProps {
  stats: UserStats;
}

export const StatsOverview = ({ stats }: StatsOverviewProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Fitness Overview
        </CardTitle>
        <CardDescription>
          Your workout activity and progress at a glance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-primary/5 p-4 rounded-lg border border-primary/10 flex flex-col">
            <span className="text-xs text-muted-foreground">Total Workouts</span>
            <div className="flex items-center gap-2 mt-1">
              <Dumbbell className="h-4 w-4 text-primary" />
              <span className="text-2xl font-bold">{stats.totalWorkouts}</span>
            </div>
          </div>
          
          <div className="bg-primary/5 p-4 rounded-lg border border-primary/10 flex flex-col">
            <span className="text-xs text-muted-foreground">Current Streak</span>
            <div className="flex items-center gap-2 mt-1">
              <Flame className="h-4 w-4 text-primary" />
              <span className="text-2xl font-bold">{stats.streak} days</span>
            </div>
          </div>
          
          <div className="bg-primary/5 p-4 rounded-lg border border-primary/10 flex flex-col">
            <span className="text-xs text-muted-foreground">Last Workout</span>
            <div className="flex items-center gap-2 mt-1">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="text-lg font-medium truncate">
                {stats.lastWorkout ? new Date(stats.lastWorkout).toLocaleDateString() : "None"}
              </span>
            </div>
          </div>
          
          <div className="bg-primary/5 p-4 rounded-lg border border-primary/10 flex flex-col">
            <span className="text-xs text-muted-foreground">Favorite Workout</span>
            <div className="flex items-center gap-2 mt-1">
              <Heart className="h-4 w-4 text-primary" />
              <span className="text-lg font-medium truncate">
                {stats.favoriteWorkout || "None yet"}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
