
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Volleyball, Dumbbell, Clock, Award, ChevronRight, BarChart } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

interface VolleyballWorkout {
  id: string;
  name: string;
  description: string;
  difficulty: string;
  duration: number;
  focus_areas: string[];
}

export function VolleyballWorkouts() {
  const [workouts, setWorkouts] = useState<VolleyballWorkout[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  
  useEffect(() => {
    // This would normally fetch from the database
    // For now, we'll use sample data
    const sampleWorkouts: VolleyballWorkout[] = [
      {
        id: "v1",
        name: "Volleyball Jump Training",
        description: "Increase your vertical jump with this specialized workout for volleyball players. Focus on explosive power and proper landing technique.",
        difficulty: "Intermediate",
        duration: 40,
        focus_areas: ["Jumping", "Power", "Legs"]
      },
      {
        id: "v2",
        name: "Setter Hand Strength",
        description: "Build finger and wrist strength specifically for setters. Includes exercises to improve ball control and setting accuracy.",
        difficulty: "Beginner",
        duration: 30,
        focus_areas: ["Hands", "Wrists", "Control"]
      },
      {
        id: "v3",
        name: "Defensive Agility Circuit",
        description: "Enhance your reaction time and agility for defensive plays. Great for liberos and all-around players.",
        difficulty: "Advanced",
        duration: 45,
        focus_areas: ["Agility", "Speed", "Reaction"]
      },
      {
        id: "v4",
        name: "Volleyball HIIT",
        description: "High-intensity intervals designed to mimic the energy demands of volleyball matches.",
        difficulty: "Advanced",
        duration: 35,
        focus_areas: ["Cardio", "Endurance", "Recovery"]
      },
      {
        id: "v5",
        name: "Serving Power Workout",
        description: "Develop a more powerful serve with this shoulder and core-focused routine.",
        difficulty: "Intermediate",
        duration: 30,
        focus_areas: ["Power", "Shoulders", "Core"]
      }
    ];
    
    setWorkouts(sampleWorkouts);
    setLoading(false);
  }, []);
  
  // Filter workouts based on active tab
  const filteredWorkouts = workouts.filter(workout => {
    if (activeTab === "all") return true;
    if (activeTab === "beginner" && workout.difficulty === "Beginner") return true;
    if (activeTab === "intermediate" && workout.difficulty === "Intermediate") return true;
    if (activeTab === "advanced" && workout.difficulty === "Advanced") return true;
    return false;
  });
  
  const handleStartWorkout = (workout: VolleyballWorkout) => {
    // Here you would start the workout, perhaps navigate to a workout screen
    console.log("Starting workout:", workout.name);
    // You could navigate to a workout screen or open a modal
  };
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      <div className="flex items-center gap-3 mb-6">
        <Volleyball className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          Volleyball Workouts
        </h1>
      </div>
      
      <p className="text-muted-foreground mb-8">
        Specially designed workouts to improve your volleyball performance, targeting key skills and physical attributes needed for the sport.
      </p>
      
      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Workouts</TabsTrigger>
          <TabsTrigger value="beginner">Beginner</TabsTrigger>
          <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="space-y-6">
          {filteredWorkouts.length > 0 ? (
            filteredWorkouts.map((workout) => (
              <Card key={workout.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {workout.name}
                        {workout.difficulty === "Advanced" && (
                          <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                            Advanced
                          </span>
                        )}
                      </CardTitle>
                      <CardDescription>{workout.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex flex-wrap gap-6 mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{workout.duration} min</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Dumbbell className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{workout.difficulty}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {workout.focus_areas.map((area) => (
                      <span key={area} className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full">
                        {area}
                      </span>
                    ))}
                  </div>
                  
                  <Button 
                    className="w-full mt-2" 
                    variant="default"
                    onClick={() => handleStartWorkout(workout)}
                  >
                    Start Workout <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <Volleyball className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-1">No workouts found</h3>
              <p className="text-muted-foreground text-sm">
                No {activeTab !== "all" ? activeTab : ""} volleyball workouts are available at the moment.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <div className="mt-12 bg-accent/5 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Award className="h-5 w-5 text-primary" /> Your Volleyball Stats
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">0</div>
              <div className="text-sm text-muted-foreground">Volleyball workouts completed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">0 min</div>
              <div className="text-sm text-muted-foreground">Total volleyball training time</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">N/A</div>
              <div className="text-sm text-muted-foreground">Last volleyball workout</div>
            </CardContent>
          </Card>
        </div>
        <div className="mt-6 text-center">
          <Button variant="outline" className="gap-2">
            <BarChart className="h-4 w-4" /> View Detailed Progress
          </Button>
        </div>
      </div>
    </div>
  );
}
