
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardContent, CardFooter } from '@/components/ui/card';
import { UserPlus, AlertCircle, Shield } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';

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
  
  // Admin secret key for basic protection
  const ADMIN_SECRET_KEY = "fittrack_admin_2023";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, isAdmin: checked }));
    // If unchecked, clear the admin secret key error
    if (!checked) {
      setErrors(prev => ({ ...prev, adminSecretKey: '' }));
    }
  };

  const toggleAdminOption = () => {
    setShowAdminOption(!showAdminOption);
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };
    
    if (!formData.name) {
      newErrors.name = 'Name is required';
      valid = false;
    }
    
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
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      valid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      valid = false;
    }
    
    // Admin secret key validation
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
      // On success, switch to login tab
      onTabChange('login');
      setFormData(prev => ({ ...prev, password: '', confirmPassword: '', isAdmin: false, adminSecretKey: '' }));
    }
    
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSignup}>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="signup-name">Full Name</Label>
          <Input
            id="signup-name"
            name="name"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && <p className="text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.name}
          </p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="signup-email">Email</Label>
          <Input
            id="signup-email"
            name="email"
            type="email"
            placeholder="youremail@example.com"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && <p className="text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.email}
          </p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="signup-password">Password</Label>
          <Input
            id="signup-password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className={errors.password ? "border-red-500" : ""}
          />
          {errors.password && <p className="text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.password}
          </p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="signup-confirm-password">Confirm Password</Label>
          <Input
            id="signup-confirm-password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={errors.confirmPassword ? "border-red-500" : ""}
          />
          {errors.confirmPassword && <p className="text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.confirmPassword}
          </p>}
        </div>

        {!showAdminOption && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full text-xs"
            onClick={toggleAdminOption}
          >
            <Shield className="mr-2 h-3 w-3" />
            I need admin access
          </Button>
        )}

        {showAdminOption && (
          <div className="space-y-4 p-3 border border-amber-200 bg-amber-50 rounded-md">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="admin"
                checked={formData.isAdmin}
                onCheckedChange={handleCheckboxChange}
              />
              <Label htmlFor="admin" className="text-sm flex items-center">
                <Shield className="mr-2 h-3 w-3 text-amber-500" />
                Register as admin
              </Label>
            </div>
            
            {formData.isAdmin && (
              <div className="space-y-2">
                <Label htmlFor="adminSecretKey" className="text-sm">Admin Secret Key</Label>
                <Input
                  id="adminSecretKey"
                  name="adminSecretKey"
                  type="password"
                  placeholder="Enter admin secret key"
                  value={formData.adminSecretKey}
                  onChange={handleChange}
                  className={errors.adminSecretKey ? "border-red-500" : ""}
                />
                {errors.adminSecretKey && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.adminSecretKey}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
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
