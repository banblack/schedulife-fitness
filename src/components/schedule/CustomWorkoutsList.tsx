
import { Card } from "@/components/ui/card";
import { Dumbbell } from "lucide-react";

interface CustomWorkout {
  name: string;
  description: string;
  exercises: {
    name: string;
    sets: number;
    reps: string;
    equipment: string;
  }[];
}

interface CustomWorkoutsListProps {
  workouts: CustomWorkout[];
}

export const CustomWorkoutsList = ({ workouts }: CustomWorkoutsListProps) => {
  if (workouts.length === 0) return null;

  return (
    <div className="mt-8">
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Dumbbell className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold">My Workouts</h2>
        </div>
        <div className="space-y-3">
          {workouts.map((workout, index) => (
            <Card key={index} className="p-4">
              <h3 className="font-semibold">{workout.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">{workout.description}</p>
              <div className="space-y-2">
                {workout.exercises.map((exercise, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm">
                    <span>{exercise.name}</span>
                    <span className="text-muted-foreground">
                      {exercise.sets} sets × {exercise.reps}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
};
