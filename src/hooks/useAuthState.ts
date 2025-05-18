
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { User, Session } from '@supabase/supabase-js';
import { isDemoUser, getDemoUser } from '@/services/authService';

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

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

  return {
    user,
    session,
    loading,
    isDemo,
    setUser,
    setSession,
    setIsDemo
  };
};
