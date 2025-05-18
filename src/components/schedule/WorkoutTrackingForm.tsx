
import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { useWorkoutTracking, WorkoutSession, WorkoutExercise } from '@/hooks/useWorkoutTracking';
import { Save, Clock, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { validateWorkoutSession } from '@/services/workoutTracking';
import { AddExerciseDialog } from './workout-tracking/AddExerciseDialog';
import { ExerciseList } from './workout-tracking/ExerciseList';

interface WorkoutTrackingFormProps {
  routineId?: string;
  routineName?: string;
  exercises?: { name: string; sets: number; reps: string }[];
  onComplete?: () => void;
}

export const WorkoutTrackingForm = ({
  routineId,
  routineName,
  exercises = [],
  onComplete
}: WorkoutTrackingFormProps) => {
  const { trackWorkout, isLoading } = useWorkoutTracking();
  
  const [workout, setWorkout] = useState<Partial<WorkoutSession>>({
    routine_id: routineId,
    date: format(new Date(), 'yyyy-MM-dd'),
    duration: 0,
    notes: '',
    completed: false,
    exercises: exercises.map(ex => ({
      name: ex.name,
      sets: ex.sets,
      reps: ex.reps,
      completed: false
    }))
  });
  
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  // Reset form when routine changes
  useState(() => {
    setWorkout({
      routine_id: routineId,
      date: format(new Date(), 'yyyy-MM-dd'),
      duration: 0,
      notes: '',
      completed: false,
      exercises: exercises.map(ex => ({
        name: ex.name,
        sets: ex.sets,
        reps: ex.reps,
        completed: false
      }))
    });
  });
  
  // Form validation
  const validateForm = useCallback(() => {
    if (!workout.user_id) {
      // This is just for form validation, so we can use a temporary ID
      const tempUserId = 'temp-user-id';
      
      const validationError = validateWorkoutSession({
        ...workout as WorkoutSession,
        user_id: tempUserId
      });
      
      if (validationError) {
        const errorMessage = validationError.message;
        
        // Map the error message to specific form fields
        const newErrors: {[key: string]: string} = {};
        
        if (errorMessage.includes('Duration')) {
          newErrors.duration = errorMessage;
        }
        
        if (errorMessage.includes('Workout date')) {
          newErrors.date = errorMessage;
        }
        
        if (errorMessage.includes('one exercise')) {
          newErrors.exercises = errorMessage;
        }
        
        // If we couldn't map to a specific field, set a general error
        if (Object.keys(newErrors).length === 0) {
          newErrors.general = errorMessage;
        }
        
        setErrors(newErrors);
        return false;
      }
    }
    
    setErrors({});
    return true;
  }, [workout]);
  
  // Add exercise handler
  const addExercise = useCallback((newExercise: WorkoutExercise) => {
    setWorkout(prev => ({
      ...prev,
      exercises: [...(prev.exercises || []), newExercise]
    }));
    
    setErrors({
      ...errors,
      exercises: undefined,
      newExercise: undefined
    });
  }, [errors]);
  
  // Remove exercise handler
  const removeExercise = useCallback((index: number) => {
    setWorkout(prev => ({
      ...prev,
      exercises: prev.exercises?.filter((_, i) => i !== index) || []
    }));
  }, []);
  
  // Toggle exercise completion handler
  const toggleExerciseCompletion = useCallback((index: number) => {
    setWorkout(prev => ({
      ...prev,
      exercises: prev.exercises?.map((ex, i) => 
        i === index ? { ...ex, completed: !ex.completed } : ex
      ) || []
    }));
  }, []);
  
  // Form submission handler
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Error",
        description: "Por favor corrige los errores en el formulario",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const allExercisesCompleted = workout.exercises?.every(ex => ex.completed) || false;
      
      const result = await trackWorkout({
        ...workout as WorkoutSession,
        completed: allExercisesCompleted
      });
      
      if (result) {
        toast({
          title: "Entrenamiento guardado",
          description: "Tu entrenamiento ha sido registrado correctamente",
        });
        
        // Reset form
        setWorkout({
          routine_id: routineId,
          date: format(new Date(), 'yyyy-MM-dd'),
          duration: 0,
          notes: '',
          completed: false,
          exercises: exercises.map(ex => ({
            name: ex.name,
            sets: ex.sets,
            reps: ex.reps,
            completed: false
          }))
        });
        
        if (onComplete) {
          onComplete();
        }
      }
    } catch (error) {
      console.error('Error al guardar el entrenamiento:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar el entrenamiento. Intenta de nuevo más tarde.",
        variant: "destructive",
      });
    }
  }, [workout, validateForm, trackWorkout, routineId, exercises, onComplete]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">
          {routineName ? `Registrar: ${routineName}` : 'Registrar Entrenamiento'}
        </CardTitle>
        <CardDescription>
          Registra los detalles de tu entrenamiento y tu progreso
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {Object.keys(errors).length > 0 && errors.general && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {errors.general}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="workout-date">Fecha</Label>
            <Input
              id="workout-date"
              type="date"
              value={workout.date}
              onChange={e => {
                setWorkout({ ...workout, date: e.target.value });
                if (errors.date) {
                  const { date, ...rest } = errors;
                  setErrors(rest);
                }
              }}
              className={errors.date ? "border-destructive" : ""}
            />
            {errors.date && (
              <p className="text-sm text-destructive">{errors.date}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="workout-duration">
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                Duración (minutos)
              </div>
            </Label>
            <Input
              id="workout-duration"
              type="number"
              min={1}
              value={workout.duration || ''}
              onChange={e => {
                setWorkout({ ...workout, duration: parseInt(e.target.value) || 0 });
                if (errors.duration) {
                  const { duration, ...rest } = errors;
                  setErrors(rest);
                }
              }}
              className={errors.duration ? "border-destructive" : ""}
            />
            {errors.duration && (
              <p className="text-sm text-destructive">{errors.duration}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Ejercicios</Label>
              <AddExerciseDialog 
                onAddExercise={addExercise}
                error={errors.newExercise}
              />
            </div>
            
            <ExerciseList 
              exercises={workout.exercises || []}
              onToggleCompletion={toggleExerciseCompletion}
              onRemove={removeExercise}
              error={errors.exercises}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="workout-notes">Notas</Label>
            <Textarea
              id="workout-notes"
              value={workout.notes || ''}
              onChange={e => setWorkout({ ...workout, notes: e.target.value })}
              placeholder="¿Cómo fue tu entrenamiento? ¿Algún récord personal?"
              rows={3}
            />
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            <Save className="mr-2 h-4 w-4" />
            {isLoading ? 'Guardando...' : 'Guardar Entrenamiento'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
