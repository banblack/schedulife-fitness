
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { Activity, Dumbbell, Filter, ArrowRight } from "lucide-react";

const VolleyballWorkouts = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("all");
  
  // Sample volleyball-specific workouts data
  const workouts = [
    {
      id: "vb-1",
      name: "Spike Power Training",
      description: "Improve your spiking power with these targeted exercises",
      difficulty: "Intermediate",
      duration: 45,
      category: "strength",
      focus: "upper-body"
    },
    {
      id: "vb-2",
      name: "Vertical Jump Enhancement",
      description: "Exercises designed to increase your vertical jump height",
      difficulty: "Advanced",
      duration: 40,
      category: "plyometrics",
      focus: "legs"
    },
    {
      id: "vb-3",
      name: "Setting Precision Drills",
      description: "Improve your setting accuracy and finger strength",
      difficulty: "Beginner",
      duration: 30,
      category: "skills",
      focus: "technique"
    },
    {
      id: "vb-4",
      name: "Defensive Agility Circuit",
      description: "Enhance your reaction time and defensive movements",
      difficulty: "Intermediate",
      duration: 35,
      category: "agility",
      focus: "full-body"
    },
    {
      id: "vb-5",
      name: "Serving Power & Accuracy",
      description: "Develop a more powerful and precise serve",
      difficulty: "All Levels",
      duration: 25,
      category: "skills",
      focus: "technique"
    }
  ];
  
  const filteredWorkouts = activeFilter === "all" 
    ? workouts 
    : workouts.filter(workout => workout.category === activeFilter);
  
  const startWorkout = (workoutId: string) => {
    // In a real app, this would navigate to the workout session page
    console.log(`Starting workout: ${workoutId}`);
    // For now, we'll just navigate to the schedule page
    navigate('/schedule');
  };
  
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Activity className="h-8 w-8 text-primary" />
            Volleyball Workouts
          </h1>
          <p className="text-muted-foreground mt-1">
            Specialized workouts to enhance your volleyball performance
          </p>
        </div>
        
        <Button 
          variant="outline"
          className="mt-4 sm:mt-0"
          onClick={() => navigate('/schedule')}
        >
          Back to Schedule
        </Button>
      </div>
      
      <Tabs defaultValue="featured" className="space-y-4">
        <TabsList>
          <TabsTrigger value="featured">Featured</TabsTrigger>
          <TabsTrigger value="all">All Workouts</TabsTrigger>
          <TabsTrigger value="my-workouts">My Workouts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="featured" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workouts.slice(0, 3).map((workout) => (
              <WorkoutCard 
                key={workout.id}
                workout={workout}
                onStart={() => startWorkout(workout.id)}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="all" className="space-y-4">
          <div className="flex flex-wrap gap-2 mb-4">
            <Button 
              variant={activeFilter === "all" ? "default" : "outline"} 
              size="sm"
              onClick={() => setActiveFilter("all")}
            >
              All Types
            </Button>
            <Button 
              variant={activeFilter === "strength" ? "default" : "outline"} 
              size="sm"
              onClick={() => setActiveFilter("strength")}
            >
              Strength
            </Button>
            <Button 
              variant={activeFilter === "plyometrics" ? "default" : "outline"} 
              size="sm"
              onClick={() => setActiveFilter("plyometrics")}
            >
              Plyometrics
            </Button>
            <Button 
              variant={activeFilter === "agility" ? "default" : "outline"} 
              size="sm"
              onClick={() => setActiveFilter("agility")}
            >
              Agility
            </Button>
            <Button 
              variant={activeFilter === "skills" ? "default" : "outline"} 
              size="sm"
              onClick={() => setActiveFilter("skills")}
            >
              Skills
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredWorkouts.map((workout) => (
              <WorkoutCard 
                key={workout.id}
                workout={workout} 
                onStart={() => startWorkout(workout.id)}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="my-workouts">
          <div className="text-center py-12">
            <Dumbbell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No saved workouts yet</h3>
            <p className="text-muted-foreground mb-6">
              Complete workouts or save them to your profile to see them here
            </p>
            <Button onClick={() => navigate('/schedule')}>
              Go to Schedule
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface WorkoutCardProps {
  workout: {
    id: string;
    name: string;
    description: string;
    difficulty: string;
    duration: number;
    category: string;
    focus: string;
  };
  onStart: () => void;
}

const WorkoutCard = ({ workout, onStart }: WorkoutCardProps) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle>{workout.name}</CardTitle>
          <span className={`text-xs px-2 py-1 rounded ${
            workout.difficulty === "Beginner" ? "bg-green-100 text-green-800" : 
            workout.difficulty === "Intermediate" ? "bg-blue-100 text-blue-800" : 
            workout.difficulty === "Advanced" ? "bg-orange-100 text-orange-800" : 
            "bg-gray-100 text-gray-800"
          }`}>
            {workout.difficulty}
          </span>
        </div>
        <CardDescription>{workout.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Duration:</span>
            <span>{workout.duration} minutes</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Type:</span>
            <span className="capitalize">{workout.category}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Focus:</span>
            <span className="capitalize">{workout.focus}</span>
          </div>
        </div>
      </CardContent>
      <div className="p-4 pt-0 mt-auto">
        <Button className="w-full" onClick={onStart}>
          Start Workout <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};

export default VolleyballWorkouts;
