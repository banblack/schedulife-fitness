
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmptyWorkoutState } from '@/components/auth/EmptyWorkoutState';
import { CalendarDays, Edit, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { RoutineFormDialog } from '@/components/routines/RoutineFormDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuth } from '@/contexts/AuthContext';

interface WorkoutRoutine {
  id: string;
  name: string;
  description: string;
  created_at: string;
  exercises: Array<{
    id: string;
    name: string;
    sets: number;
    reps: string;
    day_of_week: string;
  }>;
}

export const RoutinesList = () => {
  const [routines, setRoutines] = useState<WorkoutRoutine[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedRoutine, setSelectedRoutine] = useState<WorkoutRoutine | null>(null);
  const [routineToDelete, setRoutineToDelete] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchRoutines = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data: routinesData, error: routinesError } = await supabase
        .from('workout_routines')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (routinesError) throw routinesError;

      const routinesWithExercises = await Promise.all(
        (routinesData || []).map(async (routine) => {
          const { data: exercises, error: exercisesError } = await supabase
            .from('routine_exercises')
            .select('*')
            .eq('routine_id', routine.id)
            .order('created_at', { ascending: true });

          if (exercisesError) throw exercisesError;

          return {
            ...routine,
            exercises: exercises || [],
          };
        })
      );

      setRoutines(routinesWithExercises);
    } catch (error) {
      console.error('Error fetching routines:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las rutinas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutines();
  }, [user]);

  const handleCreateRoutine = () => {
    setSelectedRoutine(null);
    setIsFormOpen(true);
  };

  const handleEditRoutine = (routine: WorkoutRoutine) => {
    setSelectedRoutine(routine);
    setIsFormOpen(true);
  };

  const handleDeleteRoutine = async () => {
    if (!routineToDelete) return;

    try {
      const { error } = await supabase
        .from('workout_routines')
        .delete()
        .eq('id', routineToDelete);

      if (error) throw error;

      toast({
        title: "¡Éxito!",
        description: "Rutina eliminada correctamente",
      });
      fetchRoutines();
    } catch (error) {
      console.error('Error deleting routine:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la rutina",
        variant: "destructive",
      });
    } finally {
      setRoutineToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (routines.length === 0) {
    return <EmptyWorkoutState onCreateRoutine={handleCreateRoutine} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Mis Rutinas</h2>
        <Button onClick={handleCreateRoutine}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Rutina
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {routines.map((routine) => (
          <Card key={routine.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="truncate">{routine.name}</span>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditRoutine(routine)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setRoutineToDelete(routine.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground line-clamp-2 mb-4">
                {routine.description}
              </p>
              <div className="space-y-2">
                {routine.exercises.length > 0 ? (
                  routine.exercises.map((exercise) => (
                    <div
                      key={exercise.id}
                      className="text-sm flex justify-between items-center py-1 border-b last:border-0"
                    >
                      <span>{exercise.name}</span>
                      <span className="text-muted-foreground">
                        {exercise.sets}x{exercise.reps} - {exercise.day_of_week}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No hay ejercicios en esta rutina
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <RoutineFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        initialData={selectedRoutine || undefined}
        onSuccess={fetchRoutines}
      />

      <AlertDialog open={!!routineToDelete} onOpenChange={() => setRoutineToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará la rutina y todos sus ejercicios asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteRoutine}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
