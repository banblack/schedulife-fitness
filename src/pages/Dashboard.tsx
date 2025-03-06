import { Card } from "@/components/ui/card";
import { Activity, Weight, Medal, Trophy, Flame, Calendar, Dumbbell, TrendingUp, ArrowUpRight, User, Book, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { workoutLogService } from "@/services/workoutLogService";
import { formatDistance } from "date-fns";
import { useNavigate } from "react-router-dom";
import { WorkoutStatistics } from "@/components/schedule/WorkoutStatistics";
import { ProgressChart } from "@/components/schedule/ProgressChart";

interface UserStats {
  totalWorkouts: number;
  streak: number;
  lastWorkout: string | null;
  favoriteWorkout: string | null;
}

interface RecommendedWorkout {
  id: string;
  name: string;
  description: string;
  duration: number;
  difficulty: string;
  category: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<UserStats>({
    totalWorkouts: 0,
    streak: 0,
    lastWorkout: null,
    favoriteWorkout: null
  });
  const [recentWorkouts, setRecentWorkouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [recommendedWorkouts, setRecommendedWorkouts] = useState<RecommendedWorkout[]>([
    {
      id: "volleyball-1",
      name: "Volleyball Power Training",
      description: "Focus on explosive power for better jumps and spikes",
      duration: 45,
      difficulty: "Intermediate",
      category: "volleyball"
    },
    {
      id: "cardio-1",
      name: "HIIT Cardio Blast",
      description: "High intensity intervals to improve endurance",
      duration: 30,
      difficulty: "Advanced",
      category: "cardio"
    },
    {
      id: "strength-1",
      name: "Full Body Strength",
      description: "Comprehensive strength routine for overall fitness",
      duration: 50,
      difficulty: "Beginner",
      category: "strength"
    }
  ]);
  
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        // Fetch workout logs
        const logs = await workoutLogService.getUserWorkoutLogs();
        
        // Get recent workouts - last 3
        setRecentWorkouts(logs.slice(0, 3));
        
        // Calculate basic stats
        const lastWorkoutDate = logs.length > 0 ? logs[0].date : null;
        
        // Count workouts by name to find favorite
        const workoutCounts = logs.reduce((acc: Record<string, number>, log: any) => {
          acc[log.workoutName] = (acc[log.workoutName] || 0) + 1;
          return acc;
        }, {});
        
        const favoriteWorkout = logs.length > 0 
          ? Object.entries(workoutCounts).sort((a, b) => b[1] - a[1])[0][0] 
          : null;
        
        setStats({
          totalWorkouts: logs.length,
          streak: calculateStreak(logs),
          lastWorkout: lastWorkoutDate ? lastWorkoutDate.toString() : null,
          favoriteWorkout
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [user?.id]);
  
  const calculateStreak = (logs: any[]): number => {
    if (logs.length === 0) return 0;
    
    // Sort logs by date (newest first)
    const sortedLogs = [...logs].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    // Check if they worked out today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const mostRecentDate = new Date(sortedLogs[0].date);
    mostRecentDate.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // If most recent workout is not today or yesterday, streak is 0
    if (mostRecentDate < yesterday) return 0;
    
    // Otherwise count consecutive days
    let streak = 1;
    let currentDate = mostRecentDate;
    
    for (let i = 1; i < sortedLogs.length; i++) {
      const logDate = new Date(sortedLogs[i].date);
      logDate.setHours(0, 0, 0, 0);
      
      const expectedDate = new Date(currentDate);
      expectedDate.setDate(expectedDate.getDate() - 1);
      
      if (logDate.getTime() === expectedDate.getTime()) {
        streak++;
        currentDate = logDate;
      } else {
        break;
      }
    }
    
    return streak;
  };
  
  const handleStartWorkout = (id: string) => {
    navigate(`/schedule?workout=${id}`);
  };
  
  return (
    <div className="container px-4 py-8 animate-fade-in bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Your Fitness Dashboard</h1>
        {stats.lastWorkout && (
          <p className="text-muted-foreground">
            Last workout: {formatDistance(new Date(stats.lastWorkout), new Date(), { addSuffix: true })}
          </p>
        )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Activity className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-neutral">Total Workouts</p>
              <p className="text-2xl font-semibold">{stats.totalWorkouts}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-500/20 rounded-lg">
              <Flame className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-neutral">Current Streak</p>
              <p className="text-2xl font-semibold">{stats.streak} days</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-neutral">Progress</p>
              <p className="text-2xl font-semibold">+12%</p>
              <p className="text-xs text-muted-foreground">vs. last month</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-secondary/20 rounded-lg">
              <Dumbbell className="w-6 h-6 text-secondary-foreground" />
            </div>
            <div>
              <p className="text-sm text-neutral">Favorite Workout</p>
              <p className="text-lg font-semibold truncate max-w-[140px]">
                {stats.favoriteWorkout || "None yet"}
              </p>
            </div>
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Recent Workouts
            </h2>
            {recentWorkouts.length > 0 ? (
              <div className="space-y-4">
                {recentWorkouts.map((workout, i) => (
                  <Card key={workout.id} className="p-4 hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{workout.workoutName}</h3>
                        <p className="text-sm text-neutral">{workout.duration} minutes • Intensity: {workout.intensity}/10</p>
                      </div>
                      <span className="text-sm text-neutral">{formatDistance(new Date(workout.date), new Date(), { addSuffix: true })}</span>
                    </div>
                  </Card>
                ))}
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/schedule')}
                >
                  View All Workouts
                </Button>
              </div>
            ) : (
              <Card className="p-6 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="p-3 bg-muted rounded-full">
                    <Activity className="w-6 h-6 text-muted-foreground" />
                  </div>
                </div>
                <h3 className="font-medium mb-2">No workouts yet</h3>
                <p className="text-sm text-muted-foreground mb-4">Start your fitness journey by logging your first workout</p>
                <Button 
                  onClick={() => navigate('/schedule')}
                >
                  Log a Workout
                </Button>
              </Card>
            )}
          </div>
          
          <WorkoutStatistics />
        </div>
        
        <div className="space-y-6">
          <ProgressChart />
          
          <Card>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Dumbbell className="h-5 w-5 text-primary" />
                Recommended Workouts
              </h3>
              <div className="space-y-4">
                {recommendedWorkouts.map((workout) => (
                  <div key={workout.id} className="p-4 border rounded-lg hover:bg-accent/5 transition-colors">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-medium flex items-center">
                          {workout.name}
                          {workout.category === 'volleyball' && (
                            <Badge className="ml-2 bg-indigo-100 text-indigo-800 hover:bg-indigo-200">
                              Volleyball
                            </Badge>
                          )}
                        </h4>
                        <p className="text-sm text-muted-foreground mb-2">{workout.description}</p>
                        <div className="flex items-center text-sm gap-3">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {workout.duration} min
                          </span>
                          <span className="flex items-center gap-1">
                            <Activity className="h-3.5 w-3.5" />
                            {workout.difficulty}
                          </span>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="h-8"
                        onClick={() => handleStartWorkout(workout.id)}
                      >
                        Start
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button 
                variant="link" 
                className="mt-2 p-0 h-auto flex items-center"
                onClick={() => navigate('/schedule')}
              >
                Browse all workouts
                <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
      
      <div className="mt-6">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold text-gray-900">Achievements</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="p-4 hover:shadow-lg transition-shadow bg-gradient-to-br from-primary/5 to-primary/10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-full">
                <Medal className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Consistency Champion</h3>
                <p className="text-sm text-neutral">Completed 5 workouts in a row</p>
              </div>
            </div>
            <div className="mt-3">
              <Badge variant="secondary" className="bg-primary/20 hover:bg-primary/30 text-primary">
                {Math.min(stats.streak, 5)}/5 Days
              </Badge>
            </div>
          </Card>

          <Card className="p-4 hover:shadow-lg transition-shadow bg-gradient-to-br from-orange-500/5 to-orange-500/10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/20 rounded-full">
                <Flame className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <h3 className="font-medium">Calorie Crusher</h3>
                <p className="text-sm text-neutral">Burn 5000 calories this week</p>
              </div>
            </div>
            <div className="mt-3">
              <Badge variant="secondary" className="bg-orange-500/20 hover:bg-orange-500/30 text-orange-500">
                3250/5000 cal
              </Badge>
            </div>
          </Card>

          <Card className="p-4 hover:shadow-lg transition-shadow bg-gradient-to-br from-green-500/5 to-green-500/10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-full">
                <Activity className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <h3 className="font-medium">Volleyball Pro</h3>
                <p className="text-sm text-neutral">Complete 10 volleyball workouts</p>
              </div>
            </div>
            <div className="mt-3">
              <Badge variant="secondary" className="bg-green-500/20 hover:bg-green-500/30 text-green-500">
                2/10 workouts
              </Badge>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
