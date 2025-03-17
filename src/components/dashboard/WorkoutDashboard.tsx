
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Activity, 
  BarChart, 
  Calendar, 
  Clock, 
  Dumbbell, 
  Flame, 
  Heart, 
  LineChart, 
  Plus, 
  Target, 
  TrendingUp, 
  Trophy, 
  User 
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useUserStats } from "@/components/dashboard/useUserStats";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

export function WorkoutDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const { stats, recentWorkouts, loading, recommendedWorkouts } = useUserStats();
  
  const handleStartWorkout = (workoutId: string, workoutName: string) => {
    console.log(`Starting workout: ${workoutName}`);
    // Navigate to workout screen or open workout modal
  };
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-8/12 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Fitness Overview
              </CardTitle>
              <CardDescription>
                Your workout activity and progress at a glance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-primary/5 p-4 rounded-lg border border-primary/10 flex flex-col">
                  <span className="text-xs text-muted-foreground">Total Workouts</span>
                  <div className="flex items-center gap-2 mt-1">
                    <Dumbbell className="h-4 w-4 text-primary" />
                    <span className="text-2xl font-bold">{stats.totalWorkouts}</span>
                  </div>
                </div>
                
                <div className="bg-primary/5 p-4 rounded-lg border border-primary/10 flex flex-col">
                  <span className="text-xs text-muted-foreground">Current Streak</span>
                  <div className="flex items-center gap-2 mt-1">
                    <Flame className="h-4 w-4 text-primary" />
                    <span className="text-2xl font-bold">{stats.streak} days</span>
                  </div>
                </div>
                
                <div className="bg-primary/5 p-4 rounded-lg border border-primary/10 flex flex-col">
                  <span className="text-xs text-muted-foreground">Last Workout</span>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="text-lg font-medium truncate">
                      {stats.lastWorkout ? new Date(stats.lastWorkout).toLocaleDateString() : "None"}
                    </span>
                  </div>
                </div>
                
                <div className="bg-primary/5 p-4 rounded-lg border border-primary/10 flex flex-col">
                  <span className="text-xs text-muted-foreground">Favorite Workout</span>
                  <div className="flex items-center gap-2 mt-1">
                    <Heart className="h-4 w-4 text-primary" />
                    <span className="text-lg font-medium truncate">
                      {stats.favoriteWorkout || "None yet"}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" />
                    Weekly Goal Progress
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Workouts Completed</span>
                        <span className="font-medium">
                          {stats.totalWorkouts % 5}/{5}
                        </span>
                      </div>
                      <Progress 
                        value={((stats.totalWorkouts % 5) / 5) * 100} 
                        className="h-2"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Volleyball Training</span>
                        <span className="font-medium">0/2</span>
                      </div>
                      <Progress value={0} className="h-2" />
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      Activity Trend
                    </h3>
                    <Button variant="ghost" size="sm" className="gap-1 h-7">
                      <BarChart className="h-3.5 w-3.5" />
                      <span className="text-xs">View Stats</span>
                    </Button>
                  </div>
                  <div className="h-40 w-full bg-muted rounded-md flex items-center justify-center">
                    <LineChart className="h-6 w-6 text-muted-foreground opacity-50" />
                    <span className="text-sm text-muted-foreground ml-2">
                      Complete more workouts to see your trends
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  Achievements
                </CardTitle>
                <Button variant="ghost" size="sm" className="gap-1">
                  <span>View All</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4 text-center flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-2">
                    <Dumbbell className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <h4 className="font-medium">First Workout</h4>
                  <p className="text-sm text-muted-foreground">Complete your first workout</p>
                  <div className="mt-2 text-xs px-2 py-1 bg-muted rounded-full">
                    {stats.totalWorkouts > 0 ? "Unlocked" : "Locked"}
                  </div>
                </div>
                
                <div className="border rounded-lg p-4 text-center flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-2">
                    <Flame className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <h4 className="font-medium">3-Day Streak</h4>
                  <p className="text-sm text-muted-foreground">Work out 3 days in a row</p>
                  <div className="mt-2 text-xs px-2 py-1 bg-muted rounded-full">
                    {stats.streak >= 3 ? "Unlocked" : "Locked"}
                  </div>
                </div>
                
                <div className="border rounded-lg p-4 text-center flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-2">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <h4 className="font-medium">60-Minute Club</h4>
                  <p className="text-sm text-muted-foreground">Complete a 60+ min workout</p>
                  <div className="mt-2 text-xs px-2 py-1 bg-muted rounded-full">Locked</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:w-4/12 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Dumbbell className="h-5 w-5 text-primary" />
                  Quick Start
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button className="w-full gap-2">
                  <Plus className="h-4 w-4" /> Create Workout
                </Button>
                
                <div className="pt-2">
                  <h3 className="text-sm font-medium mb-3">Volleyball Workouts</h3>
                  {recommendedWorkouts
                    .filter(w => w.category === "volleyball")
                    .map(workout => (
                      <div key={workout.id} className="mb-2 last:mb-0">
                        <Button 
                          variant="outline" 
                          className="w-full justify-between"
                          onClick={() => handleStartWorkout(workout.id, workout.name)}
                        >
                          <span className="truncate">{workout.name}</span>
                          <Clock className="h-4 w-4 ml-2 text-muted-foreground" />
                        </Button>
                      </div>
                    ))}
                </div>
                
                <div className="pt-2">
                  <h3 className="text-sm font-medium mb-3">Quick Workouts</h3>
                  {recommendedWorkouts
                    .filter(w => w.duration <= 30)
                    .map(workout => (
                      <div key={workout.id} className="mb-2 last:mb-0">
                        <Button 
                          variant="outline" 
                          className="w-full justify-between"
                          onClick={() => handleStartWorkout(workout.id, workout.name)}
                        >
                          <span className="truncate">{workout.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {workout.duration} min
                          </span>
                        </Button>
                      </div>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentWorkouts.length > 0 ? (
                <div className="space-y-4">
                  {recentWorkouts.map((workout, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <Dumbbell className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">{workout.workoutName}</p>
                        <div className="text-sm text-muted-foreground flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> 
                            {new Date(workout.date).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" /> 
                            {workout.duration} min
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                    <Calendar className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium text-lg mb-1">No recent workouts</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Complete your first workout to see it here.
                  </p>
                  <Button size="sm">Start a Workout</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
