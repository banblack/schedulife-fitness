
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
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: DEMO_USER_EMAIL,
      password: DEMO_USER_PASSWORD,
    });

    if (signInError) throw signInError;
    return { success: true, error: null };
  } catch (error) {
    console.error('Error signing in as demo:', error);
    return { success: false, error };
  }
};
