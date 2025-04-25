
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { RoutineWithExercises, WorkoutContextType } from '@/types/workout';

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const WorkoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [routines, setRoutines] = useState<RoutineWithExercises[]>([]);
  const [isLoadingRoutines, setIsLoadingRoutines] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchRoutines = async () => {
    try {
      if (!user) return;

      setIsLoadingRoutines(true);
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
      setError(null);
    } catch (err) {
      console.error('Error fetching routines:', err);
      setError(err as Error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las rutinas",
        variant: "destructive",
      });
    } finally {
      setIsLoadingRoutines(false);
    }
  };

  // Cargar rutinas cuando cambie el usuario
  useEffect(() => {
    fetchRoutines();
  }, [user]);

  const value = {
    routines,
    isLoadingRoutines,
    refreshRoutines: fetchRoutines,
    error,
  };

  return (
    <WorkoutContext.Provider value={value}>
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (context === undefined) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
};
