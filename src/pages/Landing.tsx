
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dumbbell, UserPlus, LogIn, ChevronRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { signInAsDemo } from "@/services/authService";

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleDemoLogin = async () => {
    const { success, error } = await signInAsDemo();
    if (success) {
      navigate('/dashboard');
    } else {
      toast({
        title: "Error",
        description: "No se pudo iniciar sesión como usuario demo",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-primary/10 to-accent/10 py-6">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Dumbbell className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-primary">ScheduliFit</span>
          </div>
          
          {user ? (
            <Button 
              variant="outline" 
              onClick={() => navigate('/dashboard')}
            >
              My Dashboard <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => navigate('/auth', { state: { tab: 'login' } })}
              >
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Button>
              <Button 
                onClick={() => navigate('/auth', { state: { tab: 'signup' } })}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Banner */}
        <section className="py-20 bg-gradient-to-r from-primary to-accent text-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Your Personalized Fitness Journey
            </h1>
            <p className="text-xl max-w-2xl mx-auto mb-8">
              Track workouts, set goals, and achieve your fitness dreams with ScheduliFit.
              Perfect for volleyball players and fitness enthusiasts.
            </p>
            {user ? (
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate('/dashboard')}
                className="animate-pulse bg-white text-primary hover:bg-white/90"
              >
                Go to Dashboard <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => navigate('/auth', { state: { tab: 'signup' } })}
                  className="bg-white text-primary hover:bg-white/90"
                >
                  Get Started <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleDemoLogin}
                  className="bg-white/10 text-white hover:bg-white/20 border-white"
                >
                  Try Demo Version
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose ScheduliFit?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Personalized Workouts</h3>
                <p className="text-gray-600">Customized workout plans designed specifically for volleyball players and fitness enthusiasts.</p>
              </div>

              {/* Feature 2 */}
              <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Track Your Progress</h3>
                <p className="text-gray-600">Monitor your improvement with detailed statistics and achievement milestones.</p>
              </div>

              {/* Feature 3 */}
              <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Convenient Scheduling</h3>
                <p className="text-gray-600">Plan your workouts ahead of time and receive reminders to stay on track.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Fitness Journey?</h2>
            <p className="text-xl max-w-2xl mx-auto mb-8">
              Join thousands of satisfied users who have achieved their fitness goals with ScheduliFit.
            </p>
            {user ? (
              <Button 
                onClick={() => navigate('/dashboard')}
                className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
              >
                Go to Dashboard <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button 
                onClick={() => navigate('/auth', { state: { tab: 'signup' } })}
                className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
              >
                Sign Up Now <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Dumbbell className="h-5 w-5" />
              <span className="text-lg font-bold">ScheduliFit</span>
            </div>
            <div className="text-sm text-gray-400">
              © {new Date().getFullYear()} ScheduliFit. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
