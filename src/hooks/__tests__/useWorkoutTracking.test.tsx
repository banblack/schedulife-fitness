
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useWorkoutTracking } from '../useWorkoutTracking';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

// Mock dependencies
vi.mock('@/contexts/AuthContext');
vi.mock('@/hooks/use-toast');
vi.mock('@/services/workoutTracking');

const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com'
};

const mockToast = vi.fn();

describe('useWorkoutTracking', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as any).mockReturnValue({ user: mockUser });
    (useToast as any).mockReturnValue({ toast: mockToast });
  });

  it('initializes with default state', () => {
    const { result } = renderHook(() => useWorkoutTracking());

    expect(result.current.workoutHistory).toEqual([]);
    expect(result.current.totalSessions).toBe(0);
    expect(result.current.currentPage).toBe(1);
    expect(result.current.pageSize).toBe(10);
    expect(result.current.isLoading).toBe(false);
  });

  it('shows error toast when user is not logged in', async () => {
    (useAuth as any).mockReturnValue({ user: null });
    
    const { result } = renderHook(() => useWorkoutTracking());

    await act(async () => {
      const mockWorkout = {
        routine_id: 'test-routine',
        date: '2024-01-01',
        duration: 60,
        exercises: [],
        completed: false,
        notes: ''
      };
      
      await result.current.trackWorkout(mockWorkout);
    });

    expect(mockToast).toHaveBeenCalledWith({
      title: "Error",
      description: "You must be logged in to track workouts",
      variant: "destructive",
    });
  });
});
