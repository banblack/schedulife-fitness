
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

// Pagination options
export interface PaginationOptions {
  page: number;
  pageSize: number;
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

// Clear demo data (used after transferring to a real account)
export const clearDemoWorkoutSessions = (): void => {
  localStorage.removeItem(DEMO_WORKOUT_SESSIONS);
};

// Transfer demo data to a real account
export const transferDemoDataToAccount = async (userId: string): Promise<boolean> => {
  try {
    const demoSessions = getDemoWorkoutSessions();
    if (!demoSessions.length) return true; // No data to transfer
    
    // Update user_id in all demo sessions
    const sessionsToTransfer = demoSessions.map(session => ({
      ...session,
      id: undefined, // Remove demo ID to let Supabase generate a new one
      user_id: userId,
    }));
    
    // Insert all sessions at once
    const { error } = await supabase
      .from('workout_sessions')
      .insert(sessionsToTransfer);
    
    if (error) throw error;
    
    // Clear demo data after successful transfer
    clearDemoWorkoutSessions();
    return true;
  } catch (error) {
    console.error('Error transferring demo data:', error);
    return false;
  }
};

// Real Supabase workout tracking functions with pagination
export const saveWorkoutSession = async (
  session: WorkoutSession, 
  userId: string
): Promise<{ data: WorkoutSession | null, error: any }> => {
  // Validate data before saving
  const validationError = validateWorkoutSession(session);
  if (validationError) {
    return { data: null, error: validationError };
  }
  
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
  userId: string,
  pagination?: PaginationOptions
): Promise<{ data: WorkoutSession[], error: any, count: number }> => {
  // For demo users, use local storage
  if (isDemoUser(userId)) {
    const sessions = getDemoWorkoutSessions();
    const filteredSessions = sessions.filter(s => s.user_id === userId);
    
    // Handle pagination for demo sessions
    if (pagination) {
      const { page, pageSize } = pagination;
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const paginatedSessions = filteredSessions
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(start, end);
        
      return { 
        data: paginatedSessions, 
        error: null,
        count: filteredSessions.length
      };
    }
    
    return { 
      data: filteredSessions, 
      error: null,
      count: filteredSessions.length
    };
  }
  
  try {
    let query = supabase
      .from('workout_sessions')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('date', { ascending: false });
    
    // Apply pagination if specified
    if (pagination) {
      const { page, pageSize } = pagination;
      const start = (page - 1) * pageSize;
      const end = start + pageSize - 1;
      query = query.range(start, end);
    }
    
    const { data, error, count } = await query;
    
    if (error) throw error;
    return { 
      data: data || [], 
      error: null, 
      count: count || 0
    };
  } catch (error) {
    console.error('Error fetching workout sessions:', error);
    return { data: [], error, count: 0 };
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

// Frontend validation function
export const validateWorkoutSession = (session: WorkoutSession): Error | null => {
  // Validate duration
  if (!session.duration || session.duration <= 0 || session.duration > 1440) {
    return new Error('Duration must be between 1 and 1440 minutes');
  }
  
  // Validate date (not in the future)
  const sessionDate = new Date(session.date);
  const today = new Date();
  today.setHours(23, 59, 59, 999); // End of today
  
  if (sessionDate > today) {
    return new Error('Workout date cannot be in the future');
  }
  
  // Validate exercises
  if (!session.exercises || !Array.isArray(session.exercises) || session.exercises.length === 0) {
    return new Error('At least one exercise is required');
  }
  
  // Validate each exercise
  for (const exercise of session.exercises) {
    if (!exercise.name || exercise.name.trim() === '') {
      return new Error('Exercise name is required');
    }
    
    if (!exercise.sets || exercise.sets <= 0) {
      return new Error('Exercise sets must be greater than 0');
    }
    
    if (!exercise.reps || exercise.reps.trim() === '') {
      return new Error('Exercise reps are required');
    }
  }
  
  return null;
};
