
import React, { createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';
import { useAuthState } from '@/hooks/useAuthState';
import { useDemoDataTransfer } from '@/hooks/useDemoDataTransfer';
import { signUp, signIn, signOut, refreshSession } from '@/services/authenticationService';

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
  const { user, session, loading, isDemo, setUser, setSession } = useAuthState();
  const { toast } = useToast();
  const { transferDemoData: transferData } = useDemoDataTransfer();

  // Function to refresh the session
  const handleRefreshSession = async () => {
    const { session: newSession, user: newUser } = await refreshSession(isDemo);
    setSession(newSession);
    setUser(newUser);
  };

  // Function to transfer demo data to a real account
  const handleTransferDemoData = async () => {
    return user ? transferData(user.id) : false;
  };

  const handleSignUp = async (email: string, password: string, name: string, isAdmin: boolean = false) => {
    return signUp(email, password, name, isAdmin, toast);
  };

  const handleSignIn = async (email: string, password: string) => {
    return signIn(email, password, isDemo, toast);
  };

  const handleSignOut = async () => {
    await signOut(isDemo, toast);
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        signUp: handleSignUp,
        signIn: handleSignIn,
        signOut: handleSignOut,
        loading,
        refreshSession: handleRefreshSession,
        isDemo,
        transferDemoData: handleTransferDemoData,
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
