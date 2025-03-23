
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { updateUserPassword } from '@/services/authService';
import { ArrowLeft, Key } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const PasswordReset = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);
  
  useEffect(() => {
    // Check if the URL has a valid hash for password reset
    const hashParams = new URLSearchParams(location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    const refreshToken = hashParams.get('refresh_token');
    const type = hashParams.get('type');
    
    const isResetPasswordFlow = type === 'recovery' && accessToken;
    
    if (isResetPasswordFlow) {
      // Set the session using the tokens from the URL
      setIsValidToken(true);
      
      // Set the access token in Supabase
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken || '',
      }).then(({error}) => {
        if (error) {
          console.error('Error setting session:', error);
          setIsValidToken(false);
          toast({
            title: 'Invalid or expired reset link',
            description: 'Please request a new password reset link',
            variant: 'destructive',
          });
        }
      });
    } else {
      setIsValidToken(false);
    }
  }, [location.hash, toast]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate password
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setIsSubmitting(true);
    
    const { success, error } = await updateUserPassword(password);
    
    if (success) {
      toast({
        title: 'Password Updated',
        description: 'Your password has been successfully updated. You can now log in with your new password.',
      });
      navigate('/auth', { state: { tab: 'login' } });
    } else {
      toast({
        title: 'Error',
        description: error?.message || 'Failed to update password. Please try again later.',
        variant: 'destructive',
      });
    }
    
    setIsSubmitting(false);
  };
  
  if (!isValidToken) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Invalid Reset Link</CardTitle>
            <CardDescription>
              This password reset link is invalid or has expired.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button 
              className="w-full"
              onClick={() => navigate('/auth', { state: { tab: 'login' } })}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Reset Your Password</CardTitle>
            <CardDescription className="text-center">
              Please enter your new password
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="••••••••"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="••••••••"
                  required
                />
              </div>
              
              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}
            </CardContent>
            
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-primary to-accent"
                disabled={isSubmitting}
              >
                <Key className="mr-2 h-4 w-4" />
                {isSubmitting ? 'Updating Password...' : 'Update Password'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default PasswordReset;
