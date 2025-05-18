import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { isDemoUser, getDemoUser, createDemoUser, clearDemoUser } from './authService';

// Use custom toast import without the ToastOptions that's causing the error
import { toast } from '@/hooks/use-toast';

export const signUp = async (
  email: string, 
  password: string, 
  name: string, 
  isAdmin: boolean = false,
  toastFunction?: any
) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          is_admin: isAdmin
        }
      }
    });
    
    if (error) {
      if (toastFunction) {
        toastFunction({
          title: "Error de registro",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error de registro",
          description: error.message,
          variant: "destructive",
        });
      }
      return { error };
    }
    
    // Success
    if (toastFunction) {
      toastFunction({
        title: "Registro exitoso",
        description: "Se ha enviado un correo de confirmación a tu dirección de email",
      });
    } else {
      toast({
        title: "Registro exitoso",
        description: "Se ha enviado un correo de confirmación a tu dirección de email",
      });
    }
    
    return { error: null };
  } catch (error: any) {
    console.error("Sign up error:", error);
    if (toastFunction) {
      toastFunction({
        title: "Error inesperado",
        description: "No se pudo completar el registro. Inténtalo más tarde.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Error inesperado",
        description: "No se pudo completar el registro. Inténtalo más tarde.",
        variant: "destructive",
      });
    }
    return { error };
  }
};

export const signIn = async (
  email: string, 
  password: string, 
  isDemo: boolean = false,
  toastFunction?: any
) => {
  try {
    // If demo is active, just return existing demo user or create new one
    if (isDemo) {
      const demoUser = getDemoUser() || createDemoUser();
      
      if (toastFunction) {
        toastFunction({
          title: "Modo demostración activo",
          description: "Has iniciado sesión en modo demo",
        });
      } else {
        toast({
          title: "Modo demostración activo",
          description: "Has iniciado sesión en modo demo",
        });
      }
      
      return { error: null };
    }
    
    // Otherwise proceed with normal authentication
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      if (toastFunction) {
        toastFunction({
          title: "Error de inicio de sesión",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error de inicio de sesión",
          description: error.message,
          variant: "destructive",
        });
      }
      return { error };
    }
    
    // Success
    if (toastFunction) {
      toastFunction({
        title: "Inicio de sesión exitoso",
        description: "Has iniciado sesión correctamente",
      });
    } else {
      toast({
        title: "Inicio de sesión exitoso",
        description: "Has iniciado sesión correctamente",
      });
    }
    
    return { error: null };
  } catch (error: any) {
    console.error("Sign in error:", error);
    if (toastFunction) {
      toastFunction({
        title: "Error inesperado",
        description: "No se pudo iniciar sesión. Inténtalo más tarde.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Error inesperado",
        description: "No se pudo iniciar sesión. Inténtalo más tarde.",
        variant: "destructive",
      });
    }
    return { error };
  }
};

export const signOut = async (
  isDemo: boolean = false,
  toastFunction?: any
) => {
  try {
    // If demo is active, just clear the demo user
    if (isDemo) {
      clearDemoUser();
      
      if (toastFunction) {
        toastFunction({
          title: "Sesión finalizada",
          description: "Has cerrado sesión del modo demo",
        });
      } else {
        toast({
          title: "Sesión finalizada",
          description: "Has cerrado sesión del modo demo",
        });
      }
      
      return;
    }
    
    // Otherwise proceed with normal sign out
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      if (toastFunction) {
        toastFunction({
          title: "Error al cerrar sesión",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error al cerrar sesión",
          description: error.message,
          variant: "destructive",
        });
      }
      return;
    }
    
    // Success
    if (toastFunction) {
      toastFunction({
        title: "Sesión finalizada",
        description: "Has cerrado sesión correctamente",
      });
    } else {
      toast({
        title: "Sesión finalizada",
        description: "Has cerrado sesión correctamente",
      });
    }
  } catch (error: any) {
    console.error("Sign out error:", error);
    if (toastFunction) {
      toastFunction({
        title: "Error inesperado",
        description: "No se pudo cerrar sesión. Inténtalo más tarde.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Error inesperado",
        description: "No se pudo cerrar sesión. Inténtalo más tarde.",
        variant: "destructive",
      });
    }
  }
};

export const refreshSession = async (isDemo: boolean = false): Promise<{ session: Session | null; user: User | null }> => {
  if (isDemo) {
    const demoUser = getDemoUser();
    
    return {
      session: null,
      user: demoUser
    };
  }
  
  const { data } = await supabase.auth.refreshSession();
  const { session, user } = data;
  
  return { session, user };
};
