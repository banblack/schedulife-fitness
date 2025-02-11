
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
