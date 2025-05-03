
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Dumbbell, Flame, Trophy } from 'lucide-react';
import { UserStats } from './useUserStats';

interface AchievementsSectionProps {
  stats: UserStats;
}

export const AchievementsSection = ({ stats }: AchievementsSectionProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Achievements
          </CardTitle>
          <Button variant="ghost" size="sm" className="gap-1">
            <span>View All</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-2">
              <Dumbbell className="h-5 w-5 text-muted-foreground" />
            </div>
            <h4 className="font-medium">First Workout</h4>
            <p className="text-sm text-muted-foreground">Complete your first workout</p>
            <div className="mt-2 text-xs px-2 py-1 bg-muted rounded-full">
              {stats.totalWorkouts > 0 ? "Unlocked" : "Locked"}
            </div>
          </div>
          
          <div className="border rounded-lg p-4 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-2">
              <Flame className="h-5 w-5 text-muted-foreground" />
            </div>
            <h4 className="font-medium">3-Day Streak</h4>
            <p className="text-sm text-muted-foreground">Work out 3 days in a row</p>
            <div className="mt-2 text-xs px-2 py-1 bg-muted rounded-full">
              {stats.streak >= 3 ? "Unlocked" : "Locked"}
            </div>
          </div>
          
          <div className="border rounded-lg p-4 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
            </div>
            <h4 className="font-medium">60-Minute Club</h4>
            <p className="text-sm text-muted-foreground">Complete a 60+ min workout</p>
            <div className="mt-2 text-xs px-2 py-1 bg-muted rounded-full">Locked</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
