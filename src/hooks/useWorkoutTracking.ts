
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  saveWorkoutSession, 
  getUserWorkoutSessions, 
  deleteWorkoutSession,
  WorkoutSession
} from '@/services/workoutTracking';

export const useWorkoutTracking = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutSession[]>([]);

  const trackWorkout = async (workout: Omit<WorkoutSession, 'user_id'>) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to track workouts",
        variant: "destructive",
      });
      return null;
    }

    setIsLoading(true);
    
    try {
      const { data, error } = await saveWorkoutSession(
        { ...workout, user_id: user.id },
        user.id
      );
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Workout saved successfully",
      });
      
      // Update local state
      setWorkoutHistory(prev => [data!, ...prev]);
      
      return data;
    } catch (error) {
      console.error('Error tracking workout:', error);
      toast({
        title: "Error",
        description: "Failed to save workout",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const loadWorkoutHistory = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      const { data, error } = await getUserWorkoutSessions(user.id);
      
      if (error) throw error;
      setWorkoutHistory(data);
    } catch (error) {
      console.error('Error loading workout history:', error);
      toast({
        title: "Error",
        description: "Failed to load workout history",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeWorkout = async (sessionId: string) => {
    if (!user) return false;
    
    setIsLoading(true);
    
    try {
      const { success, error } = await deleteWorkoutSession(sessionId, user.id);
      
      if (error) throw error;
      
      // Update local state
      if (success) {
        setWorkoutHistory(prev => prev.filter(session => session.id !== sessionId));
        toast({
          title: "Success",
          description: "Workout deleted successfully",
        });
      }
      
      return success;
    } catch (error) {
      console.error('Error deleting workout:', error);
      toast({
        title: "Error",
        description: "Failed to delete workout",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    trackWorkout,
    loadWorkoutHistory,
    removeWorkout,
    workoutHistory,
    isLoading
  };
};
