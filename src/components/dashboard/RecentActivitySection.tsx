
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Dumbbell } from 'lucide-react';

interface RecentActivitySectionProps {
  recentWorkouts: any[];
}

export const RecentActivitySection = ({ 
  recentWorkouts 
}: RecentActivitySectionProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recentWorkouts.length > 0 ? (
          <div className="space-y-4">
            {recentWorkouts.map((workout, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Dumbbell className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium">{workout.workoutName}</p>
                  <div className="text-sm text-muted-foreground flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> 
                      {new Date(workout.date).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> 
                      {workout.duration} min
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
              <Calendar className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-medium text-lg mb-1">No recent workouts</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Complete your first workout to see it here.
            </p>
            <Button size="sm">Start a Workout</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
