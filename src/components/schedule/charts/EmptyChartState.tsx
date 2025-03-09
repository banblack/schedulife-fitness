
import { Calendar } from "lucide-react";

export function EmptyChartState() {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center">
        <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
        <h3 className="text-lg font-medium mb-1">No workout data</h3>
        <p className="text-sm text-muted-foreground">
          Complete workouts this week to see your progress
        </p>
      </div>
    </div>
  );
}
