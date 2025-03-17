
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Check, CircleHelp } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

type SetupStep = {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  helpText: string;
};

export function SetupProgress() {
  const { user } = useAuth();
  const [setupSteps, setSetupSteps] = useState<SetupStep[]>([
    {
      id: "profile",
      name: "Complete Profile",
      description: "Add your name and bio",
      completed: false,
      helpText: "Fill out your personal information to personalize your experience."
    },
    {
      id: "physical",
      name: "Physical Information",
      description: "Add your height and weight",
      completed: false,
      helpText: "Adding your physical information helps us provide more accurate recommendations."
    },
    {
      id: "goals",
      name: "Set Fitness Goals",
      description: "Define what you want to achieve",
      completed: false,
      helpText: "Setting goals helps you stay motivated and track your progress."
    },
    {
      id: "first-workout",
      name: "Complete First Workout",
      description: "Log your first exercise session",
      completed: false,
      helpText: "Start your fitness journey by logging your first workout."
    }
  ]);

  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      checkSetupProgress();
    }
  }, [user]);

  const checkSetupProgress = async () => {
    try {
      setLoading(true);
      
      // Get user profile data
      const { data: profileData } = await supabase
        .from('users')
        .select('*')
        .eq('id', user?.id)
        .single();
      
      // Get workout logs
      const { data: workoutLogs } = await supabase
        .from('workout_logs')
        .select('*')
        .eq('user_id', user?.id);
      
      // Update setup steps based on data
      const updatedSteps = [...setupSteps];
      
      // Check profile completion
      if (profileData?.full_name && profileData?.bio) {
        updatedSteps[0].completed = true;
      }
      
      // Check physical info
      if (profileData?.height && profileData?.weight) {
        updatedSteps[1].completed = true;
      }
      
      // Check fitness goals
      if (profileData?.fitness_goals) {
        updatedSteps[2].completed = true;
      }
      
      // Check first workout
      if (workoutLogs && workoutLogs.length > 0) {
        updatedSteps[3].completed = true;
      }
      
      setSetupSteps(updatedSteps);
      
      // Calculate completion percentage
      const completedSteps = updatedSteps.filter(step => step.completed).length;
      setCompletionPercentage((completedSteps / updatedSteps.length) * 100);
      
    } catch (error) {
      console.error("Error checking setup progress:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="h-[150px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6 bg-white/50 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Profile Setup Progress</CardTitle>
        <CardDescription>Complete these steps to get the most out of your experience</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium">
                {completionPercentage === 100 
                  ? "All set! You're ready to go" 
                  : `${Math.round(completionPercentage)}% complete`}
              </p>
              <p className="text-sm text-muted-foreground">
                {setupSteps.filter(step => step.completed).length}/{setupSteps.length} steps
              </p>
            </div>
            <Progress 
              value={completionPercentage} 
              className="h-2" 
            />
          </div>
          
          <div className="space-y-3 mt-4">
            {setupSteps.map((step) => (
              <div 
                key={step.id}
                className={`p-3 rounded-lg border flex items-center justify-between ${
                  step.completed 
                    ? 'bg-green-50 border-green-100' 
                    : 'bg-gray-50 border-gray-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    step.completed 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step.completed && <Check className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${step.completed ? 'text-green-700' : 'text-gray-700'}`}>
                      {step.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </div>
                </div>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <CircleHelp className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs max-w-[200px]">{step.helpText}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
