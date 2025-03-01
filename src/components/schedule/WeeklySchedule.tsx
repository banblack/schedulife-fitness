
import { Card } from "@/components/ui/card";
import { CalendarRange } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface WeeklyScheduleProps {
  onWorkoutComplete: (workoutId: string, workoutName: string) => void;
}

export const WeeklySchedule = ({ onWorkoutComplete }: WeeklyScheduleProps) => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  
  // Sample data for demonstration
  const scheduledWorkouts = {
    "Monday": { id: "workout-1", name: "Upper Body Strength" },
    "Wednesday": { id: "workout-2", name: "Volleyball Drills" },
    "Friday": { id: "workout-3", name: "Lower Body & Core" },
  };

  return (
    <div className="space-y-4">
      {days.map((day) => {
        const workout = scheduledWorkouts[day as keyof typeof scheduledWorkouts];
        
        return (
          <Card key={day} className="p-4 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <span className="font-medium w-28">{day}</span>
                <div className="h-6 w-px bg-gray-200" />
                {workout ? (
                  <span className="text-primary font-medium">{workout.name}</span>
                ) : (
                  <span className="text-muted-foreground">Rest Day</span>
                )}
              </div>
              {workout ? (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onWorkoutComplete(workout.id, workout.name)}
                >
                  Complete Workout
                </Button>
              ) : (
                <Button size="sm" variant="ghost">
                  Add Workout
                </Button>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
};
