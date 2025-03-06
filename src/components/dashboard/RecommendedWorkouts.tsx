
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, ArrowRight, Clock, Dumbbell } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface RecommendedWorkoutsProps {
  workouts: any[];
}

export function RecommendedWorkouts({ workouts }: RecommendedWorkoutsProps) {
  const navigate = useNavigate();

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Dumbbell className="h-5 w-5 text-primary" />
          Recommended Workouts
        </h2>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate('/volleyball-workouts')}
          className="text-primary"
        >
          Volleyball Workouts <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="space-y-4">
        {workouts.map((workout) => (
          <Card key={workout.id} className="p-4 hover:shadow-lg transition-shadow">
            <div className="flex justify-between">
              <div>
                <h3 className="font-medium">{workout.name}</h3>
                <p className="text-sm text-muted-foreground">{workout.description}</p>
                <div className="flex items-center mt-2 gap-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    {workout.duration} min
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {workout.difficulty}
                  </div>
                  <div className="text-sm text-primary">
                    {workout.category}
                  </div>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="h-8"
                onClick={() => navigate('/schedule')}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
