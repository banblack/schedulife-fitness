export interface WorkoutLog {
  id: string;
  userId: string;
  workoutId: string;
  workoutName: string;
  date: Date;
  duration: number;
  intensity: number;
  performance?: number;
  notes: string;
  created_at?: string;
}

export interface WorkoutLogFormData {
  duration: number;
  intensity: number;
  performance: number;
  notes: string;
}

export interface RoutineWithExercises extends WorkoutRoutine {
  exercises: Array<{
    id: string;
    name: string;
    sets: number;
    reps: string;
    day_of_week: string;
  }>;
}

export interface WorkoutContextType {
  routines: RoutineWithExercises[];
  isLoadingRoutines: boolean;
  refreshRoutines: () => Promise<void>;
  error: Error | null;
}
