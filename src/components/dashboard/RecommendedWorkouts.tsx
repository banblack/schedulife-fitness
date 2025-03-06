
import { ArrowUpRight, Clock, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface RecommendedWorkout {
  id: string;
  name: string;
  description: string;
  duration: number;
  difficulty: string;
  category: string;
}

interface RecommendedWorkoutsProps {
  workouts: RecommendedWorkout[];
}

export function RecommendedWorkouts({ workouts }: RecommendedWorkoutsProps) {
  const navigate = useNavigate();

  const handleStartWorkout = (id: string) => {
    navigate(`/schedule?workout=${id}`);
  };

  return (
    <Card>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Recommended Workouts
        </h3>
        <div className="space-y-4">
          {workouts.map((workout) => (
            <div key={workout.id} className="p-4 border rounded-lg hover:bg-accent/5 transition-colors">
              <div className="flex justify-between">
                <div>
                  <h4 className="font-medium flex items-center">
                    {workout.name}
                    {workout.category === 'volleyball' && (
                      <Badge className="ml-2 bg-indigo-100 text-indigo-800 hover:bg-indigo-200">
                        Volleyball
                      </Badge>
                    )}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">{workout.description}</p>
                  <div className="flex items-center text-sm gap-3">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {workout.duration} min
                    </span>
                    <span className="flex items-center gap-1">
                      <Activity className="h-3.5 w-3.5" />
                      {workout.difficulty}
                    </span>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="h-8"
                  onClick={() => handleStartWorkout(workout.id)}
                >
                  Start
                </Button>
              </div>
            </div>
          ))}
        </div>
        <Button 
          variant="link" 
          className="mt-2 p-0 h-auto flex items-center"
          onClick={() => navigate('/schedule')}
        >
          Browse all workouts
          <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
        </Button>
      </div>
    </Card>
  );
}
