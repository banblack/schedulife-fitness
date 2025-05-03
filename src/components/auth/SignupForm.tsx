
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CardContent, CardFooter } from '@/components/ui/card';
import { UserPlus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { FormInput } from './signup/FormInput';
import { AdminSection } from './signup/AdminSection';

interface SignupFormProps {
  onTabChange: (tab: 'login' | 'signup') => void;
}

export const SignupForm = ({ onTabChange }: SignupFormProps) => {
  const { signUp } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    isAdmin: false,
    adminSecretKey: '',
  });
  
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    adminSecretKey: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAdminOption, setShowAdminOption] = useState(false);
  
  const ADMIN_SECRET_KEY = "fittrack_admin_2023";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };
    
    if (!formData.name) {
      newErrors.name = 'Name is required';
      valid = false;
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
      valid = false;
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      valid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      valid = false;
    }
    
    if (formData.isAdmin && formData.adminSecretKey !== ADMIN_SECRET_KEY) {
      newErrors.adminSecretKey = 'Invalid admin secret key';
      valid = false;
    }
    
    setErrors(newErrors);
    return valid;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    const { error } = await signUp(formData.email, formData.password, formData.name, formData.isAdmin);
    
    if (!error) {
      onTabChange('login');
      setFormData(prev => ({ ...prev, password: '', confirmPassword: '', isAdmin: false, adminSecretKey: '' }));
    }
    
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSignup}>
      <CardContent className="space-y-4">
        <FormInput
          id="name"
          label="Full Name"
          placeholder="John Doe"
          value={formData.name}
          error={errors.name}
          onChange={handleChange}
        />
        
        <FormInput
          id="email"
          label="Email"
          type="email"
          placeholder="youremail@example.com"
          value={formData.email}
          error={errors.email}
          onChange={handleChange}
        />
        
        <FormInput
          id="password"
          label="Password"
          type="password"
          value={formData.password}
          error={errors.password}
          onChange={handleChange}
        />
        
        <FormInput
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          value={formData.confirmPassword}
          error={errors.confirmPassword}
          onChange={handleChange}
        />

        <AdminSection
          showAdminOption={showAdminOption}
          isAdmin={formData.isAdmin}
          adminSecretKey={formData.adminSecretKey}
          adminSecretError={errors.adminSecretKey}
          onAdminCheckboxChange={(checked) => setFormData(prev => ({ ...prev, isAdmin: checked }))}
          onAdminKeyChange={handleChange}
          onToggleAdminOption={() => setShowAdminOption(true)}
        />
      </CardContent>
      
      <CardFooter>
        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
          disabled={isSubmitting}
        >
          <UserPlus className="mr-2 h-4 w-4" />
          {isSubmitting ? 'Creating Account...' : 'Create Account'}
        </Button>
      </CardFooter>
    </form>
  );
};
