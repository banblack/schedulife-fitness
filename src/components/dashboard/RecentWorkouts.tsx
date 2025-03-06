
import { Calendar, Activity } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDistance } from "date-fns";
import { useNavigate } from "react-router-dom";

interface RecentWorkoutsProps {
  workouts: any[];
}

export function RecentWorkouts({ workouts }: RecentWorkoutsProps) {
  const navigate = useNavigate();

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Calendar className="h-5 w-5 text-primary" />
        Recent Workouts
      </h2>
      {workouts.length > 0 ? (
        <div className="space-y-4">
          {workouts.map((workout) => (
            <Card key={workout.id} className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{workout.workoutName}</h3>
                  <p className="text-sm text-neutral">{workout.duration} minutes • Intensity: {workout.intensity}/10</p>
                </div>
                <span className="text-sm text-neutral">{formatDistance(new Date(workout.date), new Date(), { addSuffix: true })}</span>
              </div>
            </Card>
          ))}
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => navigate('/schedule')}
          >
            View All Workouts
          </Button>
        </div>
      ) : (
        <Card className="p-6 text-center">
          <div className="mb-4 flex justify-center">
            <div className="p-3 bg-muted rounded-full">
              <Activity className="w-6 h-6 text-muted-foreground" />
            </div>
          </div>
          <h3 className="font-medium mb-2">No workouts yet</h3>
          <p className="text-sm text-muted-foreground mb-4">Start your fitness journey by logging your first workout</p>
          <Button 
            onClick={() => navigate('/schedule')}
          >
            Log a Workout
          </Button>
        </Card>
      )}
    </div>
  );
}
