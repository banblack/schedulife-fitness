
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User, Session } from '@supabase/supabase-js';
import { useToast } from '@/components/ui/use-toast';
import { isDemoUser, getDemoUser, clearDemoUser } from '@/services/authService';
import { transferDemoDataToAccount } from '@/services/workoutTracking';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  signUp: (email: string, password: string, name: string, isAdmin?: boolean) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  loading: boolean;
  refreshSession: () => Promise<void>;
  isDemo: boolean;
  transferDemoData: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);
  const { toast } = useToast();

  // Function to refresh the session
  const refreshSession = async () => {
    // Handle demo user case
    if (isDemo) {
      const demoUser = getDemoUser();
      if (demoUser) {
        setUser(demoUser);
      }
      return;
    }

    // Handle real Supabase auth
    const { data, error } = await supabase.auth.refreshSession();
    if (error) {
      console.error('Error refreshing session:', error);
    } else {
      setSession(data.session);
      setUser(data.session?.user ?? null);
    }
  };

  // Function to transfer demo data to a real account
  const transferDemoData = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "No hay usuario autenticado para transferir los datos",
        variant: "destructive",
      });
      return false;
    }

    const success = await transferDemoDataToAccount(user.id);
    
    if (success) {
      toast({
        title: "Datos transferidos",
        description: "Tus entrenamientos de prueba han sido guardados en tu cuenta",
      });
    } else {
      toast({
        title: "Error",
        description: "No se pudieron transferir los datos de prueba",
        variant: "destructive",
      });
    }
    
    return success;
  };

  useEffect(() => {
    // First check if there's a demo user in localStorage
    const demoUser = getDemoUser();
    if (demoUser) {
      setUser(demoUser);
      setIsDemo(true);
      setLoading(false);
      return;
    }

    // If no demo user, proceed with normal Supabase auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsDemo(session?.user ? isDemoUser(session.user.id) : false);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsDemo(session?.user ? isDemoUser(session.user.id) : false);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (
    email: string, 
    password: string, 
    name: string, 
    isAdmin: boolean = false
  ) => {
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

      return { error: null };
    } catch (error) {
      toast({
        title: "Error al crear la cuenta",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
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

      return { error: null };
    } catch (error) {
      toast({
        title: "Error al iniciar sesión",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };

  const signOut = async () => {
    try {
      // Handle demo user logout
      if (isDemo) {
        clearDemoUser();
        setUser(null);
        setIsDemo(false);
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

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        signUp,
        signIn,
        signOut,
        loading,
        refreshSession,
        isDemo,
        transferDemoData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
