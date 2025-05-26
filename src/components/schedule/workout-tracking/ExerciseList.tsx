
import { WorkoutExercise } from '@/hooks/useWorkoutTracking';
import { ExerciseItem } from './ExerciseItem';

interface ExerciseListProps {
  exercises: WorkoutExercise[];
  onToggleCompletion: (index: number) => void;
  onRemove: (index: number) => void;
  error?: string;
}

export const ExerciseList = ({ 
  exercises, 
  onToggleCompletion, 
  onRemove,
  error
}: ExerciseListProps) => {
  if (!exercises || exercises.length === 0) {
    return (
      <div 
        className="text-center text-muted-foreground py-4 border rounded-md"
        role="status"
        aria-live="polite"
      >
        <p>No hay ejercicios añadidos aún</p>
        {error && (
          <p className="text-sm text-destructive mt-2" role="alert" aria-live="assertive">
            {error}
          </p>
        )}
      </div>
    );
  }
  
  return (
    <div className="space-y-2 border rounded-md p-4">
      <ul 
        role="list" 
        aria-label={`Lista de ${exercises.length} ejercicios`}
        className="space-y-0"
      >
        {exercises.map((exercise, index) => (
          <ExerciseItem
            key={index}
            exercise={exercise}
            index={index}
            onToggleCompletion={onToggleCompletion}
            onRemove={onRemove}
          />
        ))}
      </ul>
    </div>
  );
};
