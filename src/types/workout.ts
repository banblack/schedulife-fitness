
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

export interface WorkoutRoutine {
  id: string;
  name: string;
  description: string;
  user_id: string;
  created_at: string;
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
  createRoutine: (routine: Partial<RoutineWithExercises>) => Promise<any>;
  error: Error | null;
}

export interface WorkoutSession {
  id?: string;
  user_id: string;
  routine_id?: string;
  date: string;
  duration: number; // in minutes
  exercises: WorkoutExercise[];
  notes?: string;
  completed: boolean;
  created_at?: string;
}

export interface WorkoutExercise {
  name: string;
  sets: number;
  reps: string;
  weight?: number;
  completed: boolean;
}
