
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardDescription, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ReactNode } from 'react';

interface AuthLayoutProps {
  activeTab: 'login' | 'signup';
  onTabChange: (tab: 'login' | 'signup') => void;
  loginForm: ReactNode;
  signupForm: ReactNode;
}

export const AuthLayout = ({ 
  activeTab, 
  onTabChange, 
  loginForm, 
  signupForm 
}: AuthLayoutProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button 
          variant="ghost" 
          className="mb-4" 
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
        </Button>
        
        <Card className="border-primary/10 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              Welcome to ScheduliFit
            </CardTitle>
            <CardDescription className="text-center">
              Your personal fitness journey starts here
            </CardDescription>
          </CardHeader>
          
          <Tabs value={activeTab} onValueChange={(v) => onTabChange(v as 'login' | 'signup')}>
            <TabsList className="grid w-full grid-cols-2 mb-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              {loginForm}
            </TabsContent>
            
            <TabsContent value="signup">
              {signupForm}
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};
