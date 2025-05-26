
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  height?: number;
  weight?: number;
  fitness_goals?: string;
  is_admin?: boolean;
  created_at?: string;
  updated_at?: string;
}

export const getCurrentUser = async (): Promise<User | null> => {
  const { data } = await supabase.auth.getUser();
  return data.user;
};

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (error) throw error;
    return data as UserProfile;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

export const updateUserProfile = async (
  userId: string, 
  updates: Partial<UserProfile>
): Promise<{ success: boolean; error: any }> => {
  try {
    const { error } = await supabase
      .from('users')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);
      
    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { success: false, error };
  }
};

export const updateUserEmail = async (email: string): Promise<{ success: boolean; error: any }> => {
  try {
    const { error } = await supabase.auth.updateUser({ email });
    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    console.error('Error updating email:', error);
    return { success: false, error };
  }
};

export const updateUserPassword = async (password: string): Promise<{ success: boolean; error: any }> => {
  try {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    console.error('Error updating password:', error);
    return { success: false, error };
  }
};

export const resetPassword = async (email: string): Promise<{ success: boolean; error: any }> => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });
    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return { success: false, error };
  }
};

// Demo user credentials
const DEMO_USER_ID = '12345678-1234-1234-1234-123456789012';
const DEMO_USER_EMAIL = 'demo@schedulefit.com';
const DEMO_USER_PASSWORD = 'demo123'; // This is just for the demo, normally we'd use environment variables

export const signInAsDemo = async (): Promise<{ success: boolean; error: any }> => {
  try {
    // Since Supabase Email logins are disabled, we'll simulate a successful login
    // In a real application, this would use proper Supabase auth
    console.log("Signing in as demo user (simulated)");

    // Store demo user info in localStorage to simulate logged in state
    localStorage.setItem('demo_user', JSON.stringify({
      id: DEMO_USER_ID,
      email: DEMO_USER_EMAIL,
      user_metadata: {
        full_name: 'Demo User'
      }
    }));
    
    // Simulate a successful login response
    return { success: true, error: null };
  } catch (error) {
    console.error('Error signing in as demo:', error);
    return { success: false, error };
  }
};

export const isDemoUser = (userId?: string): boolean => {
  return userId === DEMO_USER_ID || localStorage.getItem('demo_user') !== null;
};

export const getDemoUser = (): User | null => {
  const demoUserString = localStorage.getItem('demo_user');
  if (!demoUserString) return null;
  
  try {
    return JSON.parse(demoUserString) as User;
  } catch (error) {
    console.error('Error parsing demo user from localStorage:', error);
    return null;
  }
};

export const createDemoUser = (): User => {
  const demoUser: User = {
    id: DEMO_USER_ID,
    email: DEMO_USER_EMAIL,
    aud: 'authenticated',
    role: 'authenticated',
    user_metadata: {
      full_name: 'Demo User'
    },
    app_metadata: {},
    created_at: new Date().toISOString(),
    email_confirmed_at: new Date().toISOString(),
    phone_confirmed_at: null,
    confirmed_at: new Date().toISOString(),
    last_sign_in_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  localStorage.setItem('demo_user', JSON.stringify(demoUser));
  return demoUser;
};

export const clearDemoUser = (): void => {
  localStorage.removeItem('demo_user');
};
