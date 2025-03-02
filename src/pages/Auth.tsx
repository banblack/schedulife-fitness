
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignupForm } from '@/components/auth/SignupForm';
import { AuthLayout } from '@/components/auth/AuthLayout';

const Auth = () => {
  const location = useLocation();
  const { signIn, signUp } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(
    location.state?.tab === 'signup' ? 'signup' : 'login'
  );

  const handleTabChange = (tab: 'login' | 'signup') => {
    setActiveTab(tab);
  };

  return (
    <AuthLayout
      activeTab={activeTab}
      onTabChange={handleTabChange}
      loginForm={<LoginForm onTabChange={handleTabChange} />}
      signupForm={<SignupForm onTabChange={handleTabChange} />}
    />
  );
};

export default Auth;
