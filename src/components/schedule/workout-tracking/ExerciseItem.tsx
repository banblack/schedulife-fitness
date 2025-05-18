
import { WorkoutExercise } from '@/hooks/useWorkoutTracking';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface ExerciseItemProps {
  exercise: WorkoutExercise;
  index: number;
  onToggleCompletion: (index: number) => void;
  onRemove: (index: number) => void;
}

export const ExerciseItem = ({ 
  exercise, 
  index, 
  onToggleCompletion, 
  onRemove 
}: ExerciseItemProps) => {
  return (
    <div className="flex items-center justify-between py-2 border-b last:border-b-0">
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={exercise.completed}
          onChange={() => onToggleCompletion(index)}
          className="mr-2 h-4 w-4"
          id={`exercise-${index}`}
        />
        <label 
          htmlFor={`exercise-${index}`}
          className={exercise.completed ? "line-through text-muted-foreground cursor-pointer" : "cursor-pointer"}
        >
          {exercise.name} - {exercise.sets} series × {exercise.reps}
        </label>
      </div>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => onRemove(index)}
        type="button"
      >
        <Trash2 className="h-4 w-4 text-red-500" />
      </Button>
    </div>
  );
};
