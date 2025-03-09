
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
