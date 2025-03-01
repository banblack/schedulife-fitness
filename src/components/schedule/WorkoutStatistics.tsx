
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Calendar, Dumbbell, Flame } from "lucide-react";

interface WorkoutLog {
  date: string;
  type: string;
  description: string;
  completed: boolean;
  performance?: {
    duration: number;
    intensity: 'Low' | 'Medium' | 'High';
    notes: string;
  };
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  progress: number;
  target: number;
  icon: string;
}

interface WorkoutStatisticsProps {
  workoutLogs: WorkoutLog[];
  achievements: Achievement[];
}

export function WorkoutStatistics({ workoutLogs, achievements }: WorkoutStatisticsProps) {
  const completedWorkouts = workoutLogs.filter(log => log.completed);
  const totalWorkoutMinutes = completedWorkouts.reduce(
    (total, log) => total + (log.performance?.duration || 0), 
    0
  );
  
  // Get count of workouts by type
  const workoutsByType: Record<string, number> = {};
  completedWorkouts.forEach(log => {
    workoutsByType[log.type] = (workoutsByType[log.type] || 0) + 1;
  });

  // Current streak calculation
  const calculateStreak = (): number => {
    if (completedWorkouts.length === 0) return 0;
    
    const sortedDates = completedWorkouts
      .map(log => new Date(log.date))
      .sort((a, b) => b.getTime() - a.getTime());
    
    let streak = 1;
    for (let i = 0; i < sortedDates.length - 1; i++) {
      const currentDate = sortedDates[i];
      const nextDate = sortedDates[i + 1];
      
      const diffTime = currentDate.getTime() - nextDate.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      
      if (diffDays <= 1) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Workouts</CardTitle>
            <Dumbbell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedWorkouts.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalWorkoutMinutes} total minutes
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <Flame className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calculateStreak()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Consecutive workout days
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Achievements</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {achievements.filter(a => a.unlocked).length}/{achievements.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Unlocked achievements
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Last Workout</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">
              {completedWorkouts.length > 0 
                ? completedWorkouts[0].type 
                : "None"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {completedWorkouts.length > 0 
                ? completedWorkouts[0].date 
                : "No workouts logged"}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {achievements.map((achievement) => (
              <div key={achievement.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="text-xl">{achievement.icon}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="font-medium">{achievement.name}</div>
                        {achievement.unlocked && (
                          <Badge className="bg-green-500">Unlocked</Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {achievement.description}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm">
                    {achievement.progress}/{achievement.target}
                  </div>
                </div>
                <Progress 
                  value={(achievement.progress / achievement.target) * 100} 
                  className={achievement.unlocked ? "bg-green-100" : ""}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {completedWorkouts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Dumbbell className="h-5 w-5 text-primary" />
              Workout Types
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Object.entries(workoutsByType).map(([type, count]) => (
                <Badge key={type} variant="outline" className="py-2">
                  <span className="capitalize">{type}:</span> {count}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
