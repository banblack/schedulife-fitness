
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dumbbell } from "lucide-react";

interface CustomWorkout {
  id: string;
  name: string;
  description: string;
  exercises: {
    name: string;
    sets: number;
    reps: string;
    equipment: string;
  }[];
}

export interface CustomWorkoutsListProps {
  onWorkoutComplete: (workoutId: string, workoutName: string) => void;
}

export const CustomWorkoutsList = ({ onWorkoutComplete }: CustomWorkoutsListProps) => {
  // Sample data for demonstration
  const workouts: CustomWorkout[] = [
    {
      id: "custom-1",
      name: "Volleyball Prep",
      description: "Pre-season volleyball conditioning workout",
      exercises: [
        { name: "Jump Squats", sets: 3, reps: "12", equipment: "None" },
        { name: "Medicine Ball Throws", sets: 3, reps: "10", equipment: "Medicine Ball" },
        { name: "Lateral Jumps", sets: 4, reps: "10 each side", equipment: "Cone" },
      ]
    },
    {
      id: "custom-2",
      name: "Match Day Warmup",
      description: "Quick warmup routine before volleyball matches",
      exercises: [
        { name: "Dynamic Stretching", sets: 1, reps: "5 minutes", equipment: "None" },
        { name: "Reaction Drills", sets: 2, reps: "30 seconds", equipment: "Ball" },
        { name: "Spike Practice", sets: 2, reps: "10 spikes", equipment: "Volleyball" },
      ]
    }
  ];

  if (workouts.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Dumbbell className="h-5 w-5 text-primary" />
          My Custom Workouts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {workouts.map((workout) => (
            <Card key={workout.id} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{workout.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{workout.description}</p>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onWorkoutComplete(workout.id, workout.name)}
                >
                  Start
                </Button>
              </div>
              <div className="space-y-2 mt-3">
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
      </CardContent>
    </Card>
  );
};
