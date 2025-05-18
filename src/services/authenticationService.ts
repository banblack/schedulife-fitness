
import { supabase } from '@/lib/supabase';
import { clearDemoUser } from '@/services/authService';
import { transferDemoDataToAccount } from '@/services/workoutTracking';
import { ToastOptions } from '@/hooks/use-toast';

export interface AuthResult {
  error: any;
  success?: boolean;
}

export const signUp = async (
  email: string, 
  password: string, 
  name: string, 
  isAdmin: boolean = false,
  toast: (props: ToastOptions) => void
): Promise<AuthResult> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (error) {
      throw error;
    }

    if (data.user) {
      // Create a profile in users table
      await supabase.from('users').upsert({
        id: data.user.id,
        email,
        full_name: name,
        is_admin: isAdmin,
        created_at: new Date().toISOString(),
      });

      // Transfer demo data if we're converting from demo to real user
      const hasDemoData = localStorage.getItem('demo_workout_sessions') !== null;
      
      if (hasDemoData) {
        await transferDemoDataToAccount(data.user.id);
      }

      toast({
        title: "Cuenta creada",
        description: isAdmin 
          ? "Cuenta de administrador creada. Por favor inicia sesión." 
          : "Por favor revisa tu correo para verificar tu cuenta",
      });
    }

    return { error: null, success: true };
  } catch (error) {
    toast({
      title: "Error al crear la cuenta",
      description: error.message,
      variant: "destructive",
    });
    return { error };
  }
};

export const signIn = async (
  email: string, 
  password: string,
  isDemo: boolean,
  toast: (props: ToastOptions) => void
): Promise<AuthResult> => {
  try {
    // If there's a demo user, clear it before signing in with real credentials
    if (isDemo) {
      clearDemoUser();
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    toast({
      title: "¡Bienvenido!",
      description: "Has iniciado sesión correctamente",
    });

    return { error: null, success: true };
  } catch (error) {
    toast({
      title: "Error al iniciar sesión",
      description: error.message,
      variant: "destructive",
    });
    return { error };
  }
};

export const signOut = async (
  isDemo: boolean,
  toast: (props: ToastOptions) => void
): Promise<void> => {
  try {
    // Handle demo user logout
    if (isDemo) {
      clearDemoUser();
      toast({
        title: "Sesión cerrada",
        description: "Has salido del modo demostración",
      });
      return;
    }
    
    // Handle real Supabase auth logout
    await supabase.auth.signOut();
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente",
    });
  } catch (error) {
    toast({
      title: "Error al cerrar sesión",
      description: error.message,
      variant: "destructive",
    });
  }
};

export const refreshSession = async (isDemo: boolean): Promise<{ session: any; user: any }> => {
  // Handle demo user case
  if (isDemo) {
    const demoUser = require('@/services/authService').getDemoUser();
    return { session: null, user: demoUser };
  }

  // Handle real Supabase auth
  const { data, error } = await supabase.auth.refreshSession();
  if (error) {
    console.error('Error refreshing session:', error);
  }
  
  return {
    session: data.session,
    user: data.session?.user ?? null
  };
};
