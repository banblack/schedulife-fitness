
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardContent, CardFooter } from '@/components/ui/card';
import { LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { resetPassword } from '@/services/authService';
import { useToast } from '@/components/ui/use-toast';

interface LoginFormProps {
  onTabChange: (tab: 'login' | 'signup') => void;
}

export const LoginForm = ({ onTabChange }: LoginFormProps) => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
      valid = false;
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }
    
    setErrors(newErrors);
    return valid;
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setErrors(prev => ({ ...prev, email: 'Please enter your email to reset password' }));
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setErrors(prev => ({ ...prev, email: 'Please enter a valid email' }));
      return;
    }
    
    setIsSendingReset(true);
    
    const { success, error } = await resetPassword(formData.email);
    
    if (success) {
      toast({
        title: "Password Reset Email Sent",
        description: "Check your inbox for instructions to reset your password",
      });
    } else {
      toast({
        title: "Error",
        description: error?.message || "Failed to send reset email. Please try again later.",
        variant: "destructive",
      });
    }
    
    setIsSendingReset(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    const { error } = await signIn(formData.email, formData.password);
    
    if (!error) {
      navigate('/dashboard');
    }
    
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleLogin}>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="login-email">Email</Label>
          <Input
            id="login-email"
            name="email"
            type="email"
            placeholder="youremail@example.com"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="login-password">Password</Label>
            <button 
              type="button"
              onClick={handleForgotPassword}
              className="text-xs text-primary hover:underline"
              disabled={isSendingReset}
            >
              {isSendingReset ? 'Sending...' : 'Forgot password?'}
            </button>
          </div>
          <Input
            id="login-password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className={errors.password ? "border-red-500" : ""}
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
          disabled={isSubmitting}
        >
          <LogIn className="mr-2 h-4 w-4" />
          {isSubmitting ? 'Signing In...' : 'Sign In'}
        </Button>
      </CardFooter>
    </form>
  );
};
