
import { useState, useEffect } from "react";
import { Trophy, Target, Calendar, Award, Dumbbell, CheckCircle, Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { Textarea } from "@/components/ui/textarea";
import { WorkoutStatistics } from "@/components/schedule/WorkoutStatistics";

interface Milestone {
  id: string;
  title: string;
  description: string;
  target_value: number;
  current_value: number;
  completed: boolean;
  created_at: string;
  completed_at: string | null;
}

export default function Milestones() {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMilestone, setNewMilestone] = useState({
    title: "",
    description: "",
    target_value: 0
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchMilestones();
  }, []);

  const fetchMilestones = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to view your milestones",
          variant: "destructive"
        });
        return;
      }

      const { data, error } = await supabase
        .from('fitness_milestones')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMilestones(data || []);
    } catch (error) {
      console.error("Error fetching milestones:", error);
      toast({
        title: "Failed to load milestones",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createMilestone = async () => {
    try {
      if (!newMilestone.title) {
        toast({
          title: "Title required",
          description: "Please provide a title for your milestone",
          variant: "destructive"
        });
        return;
      }

      if (newMilestone.target_value <= 0) {
        toast({
          title: "Invalid target",
          description: "Target value must be greater than 0",
          variant: "destructive"
        });
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to create milestones",
          variant: "destructive"
        });
        return;
      }

      const { data, error } = await supabase
        .from('fitness_milestones')
        .insert({
          user_id: user.id,
          title: newMilestone.title,
          description: newMilestone.description,
          target_value: newMilestone.target_value,
          current_value: 0,
          completed: false
        })
        .select();

      if (error) throw error;

      setMilestones([...(data || []), ...milestones]);
      setNewMilestone({
        title: "",
        description: "",
        target_value: 0
      });
      setDialogOpen(false);
      
      toast({
        title: "Milestone created",
        description: "Your new fitness goal has been added",
      });
    } catch (error) {
      console.error("Error creating milestone:", error);
      toast({
        title: "Failed to create milestone",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  const updateMilestoneProgress = async (id: string, newValue: number) => {
    try {
      const milestone = milestones.find(m => m.id === id);
      if (!milestone) return;

      const isCompleted = newValue >= milestone.target_value;
      
      const { error } = await supabase
        .from('fitness_milestones')
        .update({ 
          current_value: newValue,
          completed: isCompleted,
          completed_at: isCompleted ? new Date().toISOString() : null
        })
        .eq('id', id);

      if (error) throw error;

      setMilestones(milestones.map(m => 
        m.id === id 
          ? { ...m, current_value: newValue, completed: isCompleted, completed_at: isCompleted ? new Date().toISOString() : null } 
          : m
      ));

      if (isCompleted) {
        toast({
          title: "Milestone achieved!",
          description: `Congratulations! You've completed "${milestone.title}"`,
        });
      } else {
        toast({
          title: "Progress updated",
          description: "Your milestone progress has been updated",
        });
      }
    } catch (error) {
      console.error("Error updating milestone:", error);
      toast({
        title: "Failed to update progress",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  const deleteMilestone = async (id: string) => {
    try {
      const { error } = await supabase
        .from('fitness_milestones')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMilestones(milestones.filter(m => m.id !== id));
      
      toast({
        title: "Milestone deleted",
        description: "Your fitness goal has been removed",
      });
    } catch (error) {
      console.error("Error deleting milestone:", error);
      toast({
        title: "Failed to delete milestone",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container p-4 py-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-2/3 space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Target className="h-8 w-8 text-primary" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Fitness Milestones</span>
            </h1>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
                  <Plus className="mr-2 h-4 w-4" /> New Milestone
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create New Milestone</DialogTitle>
                  <DialogDescription>
                    Set a new fitness goal to track your progress.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={newMilestone.title}
                      onChange={(e) => setNewMilestone({...newMilestone, title: e.target.value})}
                      placeholder="Complete 10 workouts"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description (optional)</Label>
                    <Textarea
                      id="description"
                      value={newMilestone.description}
                      onChange={(e) => setNewMilestone({...newMilestone, description: e.target.value})}
                      placeholder="Build a consistent workout habit"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="target">Target Value</Label>
                    <Input
                      id="target"
                      type="number"
                      min="1"
                      value={newMilestone.target_value || ''}
                      onChange={(e) => setNewMilestone({...newMilestone, target_value: parseInt(e.target.value) || 0})}
                      placeholder="10"
                    />
                    <p className="text-xs text-muted-foreground">
                      Set a numerical target for your milestone
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                  <Button onClick={createMilestone}>Create Milestone</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : milestones.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {milestones.map((milestone) => {
                const progress = milestone.target_value > 0 
                  ? Math.min(Math.round((milestone.current_value / milestone.target_value) * 100), 100) 
                  : 0;
                
                return (
                  <Card key={milestone.id} className={`overflow-hidden ${milestone.completed ? 'border-green-400 bg-green-50' : 'hover:shadow-md transition-shadow'}`}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {milestone.completed ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <Target className="h-5 w-5 text-primary" />
                          )}
                          {milestone.title}
                        </CardTitle>
                        {milestone.completed && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                            Completed
                          </span>
                        )}
                      </div>
                      <CardDescription>
                        {milestone.description || "Track your progress toward this goal"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress: {milestone.current_value} / {milestone.target_value}</span>
                          <span>{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-2">
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => updateMilestoneProgress(milestone.id, milestone.current_value + 1)}
                        >
                          Update +1
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => deleteMilestone(milestone.id)}
                          className="text-destructive hover:bg-destructive/10"
                        >
                          Delete
                        </Button>
                      </div>
                      {milestone.completed_at && (
                        <span className="text-xs text-muted-foreground flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(milestone.completed_at).toLocaleDateString()}
                        </span>
                      )}
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center p-12 bg-muted/20 rounded-lg border border-dashed">
              <Award className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <h3 className="text-lg font-medium mb-2">No milestones yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first fitness milestone to start tracking your progress
              </p>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Create Milestone
              </Button>
            </div>
          )}
        </div>

        <div className="w-full md:w-1/3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Dumbbell className="h-5 w-5 text-primary" />
                Your Statistics
              </CardTitle>
              <CardDescription>
                Track your workout performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WorkoutStatistics />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                Suggested Milestones
              </CardTitle>
              <CardDescription>
                Try these fitness goals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-left h-auto py-3"
                  onClick={() => {
                    setNewMilestone({
                      title: "Complete 10 workouts",
                      description: "Build a consistent workout routine",
                      target_value: 10
                    });
                    setDialogOpen(true);
                  }}
                >
                  <div className="flex gap-3 items-center">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Dumbbell className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">Complete 10 workouts</p>
                      <p className="text-xs text-muted-foreground">Build a consistent workout routine</p>
                    </div>
                  </div>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-left h-auto py-3"
                  onClick={() => {
                    setNewMilestone({
                      title: "Maintain 7-day streak",
                      description: "Work out every day for a week",
                      target_value: 7
                    });
                    setDialogOpen(true);
                  }}
                >
                  <div className="flex gap-3 items-center">
                    <div className="p-2 bg-orange-500/10 rounded-full">
                      <Calendar className="h-4 w-4 text-orange-500" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">Maintain 7-day streak</p>
                      <p className="text-xs text-muted-foreground">Work out every day for a week</p>
                    </div>
                  </div>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-left h-auto py-3"
                  onClick={() => {
                    setNewMilestone({
                      title: "Complete 5 volleyball workouts",
                      description: "Improve your volleyball-specific fitness",
                      target_value: 5
                    });
                    setDialogOpen(true);
                  }}
                >
                  <div className="flex gap-3 items-center">
                    <div className="p-2 bg-green-500/10 rounded-full">
                      <Award className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">Complete 5 volleyball workouts</p>
                      <p className="text-xs text-muted-foreground">Improve your volleyball-specific fitness</p>
                    </div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
