
export interface ProfileData {
  name: string;
  email: string;
  bio: string;
  height: string;
  weight: string;
  fitnessGoals: string;
  imageUrl: string;
}

export interface ValidationErrors {
  name?: string;
  email?: string;
  height?: string;
  weight?: string;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  target_value: number;
  current_value: number;
  completed: boolean;
  created_at: string;
  completed_at: string | null;
}

export interface UserWorkoutStats {
  id: string;
  user_id: string;
  workouts_completed: number;
  total_workout_minutes: number;
  streak_days: number;
  last_workout_date: string | null;
}
