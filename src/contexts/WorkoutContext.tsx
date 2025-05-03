
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { RoutineWithExercises, WorkoutContextType } from '@/types/workout';
import { isDemoUser } from '@/services/authService';

// Demo data for routines
const DEMO_ROUTINES: RoutineWithExercises[] = [
  {
    id: "demo-routine-1",
    name: "Fuerza para Voleibol",
    description: "Rutina de ejercicios para fortalecer los músculos usados en voleibol",
    user_id: "12345678-1234-1234-1234-123456789012",
    created_at: new Date().toISOString(),
    exercises: [
      {
        id: "demo-ex-1",
        name: "Sentadillas con Salto",
        sets: 3,
        reps: "12",
        day_of_week: "Lunes"
      },
      {
        id: "demo-ex-2",
        name: "Press de Hombros",
        sets: 4,
        reps: "10",
        day_of_week: "Lunes"
      },
      {
        id: "demo-ex-3",
        name: "Planchas con Rotación",
        sets: 3,
        reps: "12 por lado",
        day_of_week: "Miércoles"
      }
    ]
  },
  {
    id: "demo-routine-2",
    name: "Cardio HIIT",
    description: "Entrenamiento de alta intensidad para mejorar resistencia",
    user_id: "12345678-1234-1234-1234-123456789012",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    exercises: [
      {
        id: "demo-ex-4",
        name: "Burpees",
        sets: 5,
        reps: "45 segundos",
        day_of_week: "Martes"
      },
      {
        id: "demo-ex-5",
        name: "Mountain Climbers",
        sets: 5,
        reps: "45 segundos",
        day_of_week: "Martes"
      },
      {
        id: "demo-ex-6",
        name: "Jumping Jacks",
        sets: 5,
        reps: "45 segundos",
        day_of_week: "Jueves"
      }
    ]
  }
];

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const WorkoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [routines, setRoutines] = useState<RoutineWithExercises[]>([]);
  const [isLoadingRoutines, setIsLoadingRoutines] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  const { user, isDemo } = useAuth();

  const fetchRoutines = async () => {
    try {
      if (!user) return;

      setIsLoadingRoutines(true);

      // If demo user, return demo data
      if (isDemo || isDemoUser(user.id)) {
        console.log("Loading demo routines");
        setRoutines(DEMO_ROUTINES);
        setIsLoadingRoutines(false);
        setError(null);
        return;
      }

      // For real users, fetch from Supabase
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

  // Load routines when user changes
  useEffect(() => {
    if (user) {
      fetchRoutines();
    }
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
