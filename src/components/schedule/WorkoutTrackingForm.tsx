
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useWorkoutTracking, WorkoutSession, WorkoutExercise } from '@/hooks/useWorkoutTracking';
import { PlusCircle, Save, Trash2, Clock, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { validateWorkoutSession } from '@/services/workoutTracking';

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
  
  const [newExercise, setNewExercise] = useState<Partial<WorkoutExercise>>({
    name: '',
    sets: 3,
    reps: '10',
    completed: false
  });

  const [addExerciseOpen, setAddExerciseOpen] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  // Reset form when routine changes - memoized dependencies
  useEffect(() => {
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
  }, [routineId, exercises]);
  
  // Memoize the validation function
  const validateForm = useCallback(() => {
    if (!workout.user_id) {
      // This is just for form validation, so we can use a temporary ID
      // The actual user_id will be set by the trackWorkout function
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
  
  // Memoize the addExercise function
  const addExercise = useCallback(() => {
    if (!newExercise.name) {
      setErrors({
        ...errors,
        newExercise: "El nombre del ejercicio es requerido"
      });
      return;
    }
    
    setWorkout(prev => ({
      ...prev,
      exercises: [...(prev.exercises || []), newExercise as WorkoutExercise]
    }));
    
    setNewExercise({
      name: '',
      sets: 3,
      reps: '10',
      completed: false
    });
    
    setErrors({
      ...errors,
      exercises: undefined,
      newExercise: undefined
    });
    
    setAddExerciseOpen(false);
  }, [newExercise, errors]);
  
  // Memoize the removeExercise function
  const removeExercise = useCallback((index: number) => {
    setWorkout(prev => ({
      ...prev,
      exercises: prev.exercises?.filter((_, i) => i !== index) || []
    }));
  }, []);
  
  // Memoize the toggleExerciseCompletion function
  const toggleExerciseCompletion = useCallback((index: number) => {
    setWorkout(prev => ({
      ...prev,
      exercises: prev.exercises?.map((ex, i) => 
        i === index ? { ...ex, completed: !ex.completed } : ex
      ) || []
    }));
  }, []);
  
  // Memoize the form submission handler
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

  // Memoize the entire exercise list for better performance
  const exercisesList = useMemo(() => {
    if (!workout.exercises || workout.exercises.length === 0) {
      return (
        <div className="text-center text-muted-foreground py-4 border rounded-md">
          <p>No hay ejercicios añadidos aún</p>
          {errors.exercises && (
            <p className="text-sm text-destructive mt-2">{errors.exercises}</p>
          )}
        </div>
      );
    }
    
    return (
      <div className="space-y-2 border rounded-md p-4">
        {workout.exercises.map((exercise, index) => (
          <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={exercise.completed}
                onChange={() => toggleExerciseCompletion(index)}
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
              onClick={() => removeExercise(index)}
              type="button"
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        ))}
      </div>
    );
  }, [workout.exercises, errors.exercises, toggleExerciseCompletion, removeExercise]);
  
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
              <Dialog open={addExerciseOpen} onOpenChange={setAddExerciseOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Añadir Ejercicio
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Añadir Nuevo Ejercicio</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="exercise-name">Nombre del Ejercicio</Label>
                      <Input
                        id="exercise-name"
                        value={newExercise.name}
                        onChange={e => {
                          setNewExercise({ ...newExercise, name: e.target.value });
                          if (errors.newExercise) {
                            const { newExercise, ...rest } = errors;
                            setErrors(rest);
                          }
                        }}
                        placeholder="ej. Flexiones"
                        className={errors.newExercise ? "border-destructive" : ""}
                      />
                      {errors.newExercise && (
                        <p className="text-sm text-destructive">{errors.newExercise}</p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="exercise-sets">Series</Label>
                        <Input
                          id="exercise-sets"
                          type="number"
                          min={1}
                          value={newExercise.sets}
                          onChange={e => setNewExercise({ ...newExercise, sets: parseInt(e.target.value) || 1 })}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="exercise-reps">Repeticiones</Label>
                        <Input
                          id="exercise-reps"
                          value={newExercise.reps}
                          onChange={e => setNewExercise({ ...newExercise, reps: e.target.value })}
                          placeholder="ej. 10 o 30 sec"
                        />
                      </div>
                    </div>
                    
                    <Button type="button" onClick={addExercise} className="w-full">
                      Añadir Ejercicio
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            {exercisesList}
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
