
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User, Session } from '@supabase/supabase-js';
import { useToast } from '@/components/ui/use-toast';
import { isDemoUser, getDemoUser, clearDemoUser } from '@/services/authService';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  signUp: (email: string, password: string, name: string, isAdmin?: boolean) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  loading: boolean;
  refreshSession: () => Promise<void>;
  isDemo: boolean;
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

        toast({
          title: "Account created",
          description: isAdmin 
            ? "Admin account created. Please sign in." 
            : "Please check your email to verify your account",
        });
      }

      return { error: null };
    } catch (error) {
      toast({
        title: "Error creating account",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Welcome back!",
        description: "You've successfully signed in",
      });

      return { error: null };
    } catch (error) {
      toast({
        title: "Error signing in",
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
          title: "Signed out",
          description: "Demo user has been signed out",
        });
        return;
      }
      
      // Handle real Supabase auth logout
      await supabase.auth.signOut();
      toast({
        title: "Signed out",
        description: "You've been successfully signed out",
      });
    } catch (error) {
      toast({
        title: "Error signing out",
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
