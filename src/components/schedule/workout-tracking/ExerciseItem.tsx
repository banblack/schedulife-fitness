
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
  const exerciseLabel = `${exercise.name} - ${exercise.sets} series × ${exercise.reps}`;
  
  return (
    <div 
      className="flex items-center justify-between py-2 border-b last:border-b-0"
      role="listitem"
    >
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={exercise.completed}
          onChange={() => onToggleCompletion(index)}
          className="mr-2 h-4 w-4 focus:ring-2 focus:ring-primary focus:ring-offset-2"
          id={`exercise-${index}`}
          aria-describedby={`exercise-description-${index}`}
        />
        <label 
          htmlFor={`exercise-${index}`}
          className={`cursor-pointer ${
            exercise.completed ? "line-through text-muted-foreground" : ""
          }`}
        >
          {exerciseLabel}
        </label>
        <span 
          id={`exercise-description-${index}`}
          className="sr-only"
        >
          {exercise.completed ? "Completado" : "Sin completar"}
        </span>
      </div>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => onRemove(index)}
        type="button"
        aria-label={`Eliminar ejercicio ${exercise.name}`}
        className="focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        <Trash2 className="h-4 w-4 text-red-500" aria-hidden="true" />
      </Button>
    </div>
  );
};
