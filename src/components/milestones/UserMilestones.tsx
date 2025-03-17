
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Award, Calendar, Check, Clock, Crown, Medal, Plus, Star, Target, Trophy } from "lucide-react";
import { Milestone } from "@/types/profile";
import { supabase } from "@/lib/supabase";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

export function UserMilestones() {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Normally fetch from database, using sample data for now
    const sampleMilestones: Milestone[] = [
      {
        id: "m1",
        title: "Complete 5 Workouts",
        description: "Keep up your consistency by completing 5 workouts",
        target_value: 5,
        current_value: 3,
        completed: false,
        created_at: new Date().toISOString(),
        completed_at: null
      },
      {
        id: "m2",
        title: "Exercise for 120 Minutes",
        description: "Reach 2 hours of total workout time",
        target_value: 120,
        current_value: 90,
        completed: false,
        created_at: new Date().toISOString(),
        completed_at: null
      },
      {
        id: "m3",
        title: "3-Day Streak",
        description: "Work out for 3 days in a row",
        target_value: 3,
        current_value: 2,
        completed: false,
        created_at: new Date().toISOString(),
        completed_at: null
      },
      {
        id: "m4",
        title: "Try 3 Different Workouts",
        description: "Explore different workout types",
        target_value: 3,
        current_value: 1,
        completed: false,
        created_at: new Date().toISOString(),
        completed_at: null
      },
      {
        id: "m5",
        title: "Complete a Volleyball Workout",
        description: "Try a volleyball-specific training session",
        target_value: 1,
        current_value: 0,
        completed: false,
        created_at: new Date().toISOString(),
        completed_at: null
      }
    ];
    
    setMilestones(sampleMilestones);
    setLoading(false);
  }, []);
  
  const getMilestoneIcon = (title: string) => {
    if (title.includes("Streak")) return <Calendar className="h-5 w-5" />;
    if (title.includes("Minutes") || title.includes("hours")) return <Clock className="h-5 w-5" />;
    if (title.includes("Different")) return <Star className="h-5 w-5" />;
    if (title.includes("Volleyball")) return <Trophy className="h-5 w-5" />;
    return <Target className="h-5 w-5" />;
  };
  
  const handleCreateMilestone = () => {
    // Open a modal or navigate to create milestone page
    console.log("Create new milestone");
  };
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  const completedMilestones = milestones.filter(m => m.completed);
  const inProgressMilestones = milestones.filter(m => !m.completed);
  
  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Trophy className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Your Milestones
          </h1>
        </div>
        <Button onClick={handleCreateMilestone} className="gap-2">
          <Plus className="h-4 w-4" /> New Goal
        </Button>
      </div>
      
      <p className="text-muted-foreground mb-8">
        Track your fitness journey with personalized goals and celebrate your achievements.
      </p>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" /> In Progress
        </h2>
        
        {inProgressMilestones.length > 0 ? (
          <div className="space-y-4">
            {inProgressMilestones.map((milestone) => (
              <Card key={milestone.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      {getMilestoneIcon(milestone.title)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-lg">{milestone.title}</h3>
                      <p className="text-muted-foreground text-sm mb-3">{milestone.description}</p>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span className="font-medium">{milestone.current_value} / {milestone.target_value}</span>
                      </div>
                      <Progress 
                        value={(milestone.current_value / milestone.target_value) * 100} 
                        className="h-2"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                <Target className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-medium text-lg mb-1">No milestones in progress</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Create your first fitness goal to start tracking your progress.
              </p>
              <Button variant="outline" onClick={handleCreateMilestone}>Create a Goal</Button>
            </CardContent>
          </Card>
        )}
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Medal className="h-5 w-5 text-primary" /> Completed
        </h2>
        
        {completedMilestones.length > 0 ? (
          <div className="space-y-4">
            {completedMilestones.map((milestone) => (
              <Card key={milestone.id} className="overflow-hidden bg-success/5 border-success/20">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center text-success">
                      <Check className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-lg">{milestone.title}</h3>
                        <span className="text-xs bg-success/10 text-success px-2 py-1 rounded-full">
                          Completed
                        </span>
                      </div>
                      <p className="text-muted-foreground text-sm">{milestone.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                <Medal className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-medium text-lg mb-1">No completed milestones yet</h3>
              <p className="text-muted-foreground text-sm">
                Complete your first goal to see it here.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
