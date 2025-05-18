
import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  saveWorkoutSession, 
  getUserWorkoutSessions, 
  deleteWorkoutSession,
  WorkoutSession,
  WorkoutExercise,
  PaginationOptions,
  validateWorkoutSession
} from '@/services/workoutTracking';

// Re-export the types from the service for easier import
export type { WorkoutSession, WorkoutExercise, PaginationOptions };

export const useWorkoutTracking = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutSession[]>([]);
  const [totalSessions, setTotalSessions] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
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
      // Validate workout data with our frontend validation
      const validationError = validateWorkoutSession({ 
        ...workout, 
        user_id: user.id 
      });
      
      if (validationError) {
        toast({
          title: "Validation Error",
          description: validationError.message,
          variant: "destructive",
        });
        return null;
      }
      
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
      setTotalSessions(prev => prev + 1);
      
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

  const loadWorkoutHistory = useCallback(async (page = 1, size = pageSize) => {
    if (!user) return;
    
    setIsLoading(true);
    setCurrentPage(page);
    
    if (size !== pageSize) {
      setPageSize(size);
    }
    
    try {
      const pagination: PaginationOptions = { 
        page, 
        pageSize: size 
      };
      
      const { data, error, count } = await getUserWorkoutSessions(
        user.id,
        pagination
      );
      
      if (error) throw error;
      setWorkoutHistory(data);
      setTotalSessions(count);
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
  }, [user, pageSize, toast]);

  const removeWorkout = async (sessionId: string) => {
    if (!user) return false;
    
    setIsLoading(true);
    
    try {
      const { success, error } = await deleteWorkoutSession(sessionId, user.id);
      
      if (error) throw error;
      
      // Update local state
      if (success) {
        setWorkoutHistory(prev => prev.filter(session => session.id !== sessionId));
        setTotalSessions(prev => prev - 1);
        
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
    totalSessions,
    currentPage,
    pageSize,
    setPageSize,
    setCurrentPage,
    isLoading
  };
};
