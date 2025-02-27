
export interface Exercise {
  id?: string;
  name: string;
  sets: number;
  reps: string;
  equipment: string;
  type: string;
  description?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  muscleGroup?: string;
  videoUrl?: string;
}
