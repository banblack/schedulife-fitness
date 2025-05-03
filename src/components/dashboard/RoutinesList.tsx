
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { EmptyWorkoutState } from '@/components/auth/EmptyWorkoutState';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { RoutineFormDialog } from '@/components/routines/RoutineFormDialog';
import { DeleteRoutineDialog } from '@/components/routines/DeleteRoutineDialog';
import { RoutinesGrid } from '@/components/routines/RoutinesGrid';
import { supabase } from '@/lib/supabase';
import { RoutineWithExercises } from '@/types/workout';
import { useWorkout } from '@/contexts/WorkoutContext';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export const RoutinesList = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedRoutine, setSelectedRoutine] = useState<RoutineWithExercises | null>(null);
  const [routineToDelete, setRoutineToDelete] = useState<string | null>(null);
  const { toast } = useToast();
  const { routines, isLoadingRoutines, refreshRoutines } = useWorkout();

  const handleCreateRoutine = () => {
    setSelectedRoutine(null);
    setIsFormOpen(true);
  };

  const handleEditRoutine = (routine: RoutineWithExercises) => {
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
      refreshRoutines();
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

  if (isLoadingRoutines) {
    return <LoadingSpinner />;
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
      
      <RoutinesGrid 
        routines={routines} 
        onEdit={handleEditRoutine} 
        onDelete={(id) => setRoutineToDelete(id)}
      />

      <RoutineFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        initialData={selectedRoutine || undefined}
        onSuccess={refreshRoutines}
      />

      <DeleteRoutineDialog
        open={!!routineToDelete}
        onOpenChange={() => setRoutineToDelete(null)}
        onConfirm={handleDeleteRoutine}
      />
    </div>
  );
};
