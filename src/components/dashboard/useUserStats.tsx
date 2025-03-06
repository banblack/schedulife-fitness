import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { workoutLogService } from "@/services/workoutLogService";

export interface UserStats {
  totalWorkouts: number;
  streak: number;
  lastWorkout: string | null;
  favoriteWorkout: string | null;
}

export interface RecommendedWorkout {
  id: string;
  name: string;
  description: string;
  duration: number;
  difficulty: string;
  category: string;
}

export function useUserStats() {
  const { user } = useAuth();
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

  return {
    stats,
    recentWorkouts,
    loading,
    recommendedWorkouts
  };
}
