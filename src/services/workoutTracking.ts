
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { isDemoUser } from '@/services/authService';

// Types for workout tracking
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

// Local storage keys
const DEMO_WORKOUT_SESSIONS = 'demo_workout_sessions';

// Demo workout tracking functions
export const saveDemoWorkoutSession = (session: WorkoutSession): WorkoutSession => {
  const sessions = getDemoWorkoutSessions();
  
  // Create a new session with ID
  const newSession = {
    ...session,
    id: `demo-session-${Date.now()}`,
    created_at: new Date().toISOString(),
  };
  
  sessions.push(newSession);
  localStorage.setItem(DEMO_WORKOUT_SESSIONS, JSON.stringify(sessions));
  
  return newSession;
};

export const getDemoWorkoutSessions = (): WorkoutSession[] => {
  const sessionsJSON = localStorage.getItem(DEMO_WORKOUT_SESSIONS);
  if (!sessionsJSON) return [];
  
  try {
    return JSON.parse(sessionsJSON);
  } catch (error) {
    console.error('Error parsing demo workout sessions:', error);
    return [];
  }
};

// Real Supabase workout tracking functions
export const saveWorkoutSession = async (
  session: WorkoutSession, 
  userId: string
): Promise<{ data: WorkoutSession | null, error: any }> => {
  // For demo users, use local storage
  if (isDemoUser(userId)) {
    const demoSession = saveDemoWorkoutSession(session);
    return { data: demoSession, error: null };
  }
  
  try {
    // For real users, save to Supabase
    const { data, error } = await supabase
      .from('workout_sessions')
      .insert({
        ...session,
        user_id: userId,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error saving workout session:', error);
    return { data: null, error };
  }
};

export const getUserWorkoutSessions = async (
  userId: string
): Promise<{ data: WorkoutSession[], error: any }> => {
  // For demo users, use local storage
  if (isDemoUser(userId)) {
    const sessions = getDemoWorkoutSessions();
    return { data: sessions.filter(s => s.user_id === userId), error: null };
  }
  
  try {
    // For real users, fetch from Supabase
    const { data, error } = await supabase
      .from('workout_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });
    
    if (error) throw error;
    return { data: data || [], error: null };
  } catch (error) {
    console.error('Error fetching workout sessions:', error);
    return { data: [], error };
  }
};

export const deleteWorkoutSession = async (
  sessionId: string,
  userId: string
): Promise<{ success: boolean, error: any }> => {
  // For demo users, use local storage
  if (isDemoUser(userId)) {
    const sessions = getDemoWorkoutSessions();
    const filteredSessions = sessions.filter(s => s.id !== sessionId);
    localStorage.setItem(DEMO_WORKOUT_SESSIONS, JSON.stringify(filteredSessions));
    return { success: true, error: null };
  }
  
  try {
    // For real users, delete from Supabase
    const { error } = await supabase
      .from('workout_sessions')
      .delete()
      .eq('id', sessionId)
      .eq('user_id', userId); // Security check
    
    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    console.error('Error deleting workout session:', error);
    return { success: false, error };
  }
};
