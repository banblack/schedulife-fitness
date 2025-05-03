
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Dumbbell, Plus } from 'lucide-react';
import { RecommendedWorkout } from './useUserStats';

interface QuickStartSectionProps {
  recommendedWorkouts: RecommendedWorkout[];
  onStartWorkout: (workoutId: string, workoutName: string) => void;
}

export const QuickStartSection = ({ 
  recommendedWorkouts, 
  onStartWorkout 
}: QuickStartSectionProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Dumbbell className="h-5 w-5 text-primary" />
            Quick Start
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button className="w-full gap-2">
            <Plus className="h-4 w-4" /> Create Workout
          </Button>
          
          <div className="pt-2">
            <h3 className="text-sm font-medium mb-3">Volleyball Workouts</h3>
            {recommendedWorkouts
              .filter(w => w.category === "volleyball")
              .map(workout => (
                <div key={workout.id} className="mb-2 last:mb-0">
                  <Button 
                    variant="outline" 
                    className="w-full justify-between"
                    onClick={() => onStartWorkout(workout.id, workout.name)}
                  >
                    <span className="truncate">{workout.name}</span>
                    <Clock className="h-4 w-4 ml-2 text-muted-foreground" />
                  </Button>
                </div>
              ))}
          </div>
          
          <div className="pt-2">
            <h3 className="text-sm font-medium mb-3">Quick Workouts</h3>
            {recommendedWorkouts
              .filter(w => w.duration <= 30)
              .map(workout => (
                <div key={workout.id} className="mb-2 last:mb-0">
                  <Button 
                    variant="outline" 
                    className="w-full justify-between"
                    onClick={() => onStartWorkout(workout.id, workout.name)}
                  >
                    <span className="truncate">{workout.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {workout.duration} min
                    </span>
                  </Button>
                </div>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
