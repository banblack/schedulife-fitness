
/**
 * useAnalytics Hook
 * 
 * Custom React hook that provides analytics functionality including
 * event tracking, progress metrics, and dashboard data.
 * 
 * @example
 * ```typescript
 * import { useAnalytics } from '@/hooks/useAnalytics';
 * 
 * function MyComponent() {
 *   const { trackEvent, dashboardData, isLoading } = useAnalytics();
 *   
 *   const handleWorkoutComplete = () => {
 *     trackEvent('workout_completed', { duration: 45 });
 *   };
 *   
 *   return <div>Total workouts: {dashboardData?.totalWorkouts}</div>;
 * }
 * ```
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { analyticsService, AnalyticsDashboardData, UserRecommendation, ProgressMetric } from '@/services/analytics';

export interface UseAnalyticsReturn {
  // Data
  dashboardData: AnalyticsDashboardData | null;
  recommendations: UserRecommendation[];
  progressMetrics: ProgressMetric[];
  
  // Loading states
  isLoading: boolean;
  isLoadingRecommendations: boolean;
  isLoadingMetrics: boolean;
  
  // Actions
  trackEvent: (eventType: string, eventData?: Record<string, any>, pagePath?: string) => Promise<void>;
  recordProgressMetric: (metricName: string, value: number, unit?: string, date?: Date) => Promise<void>;
  refreshDashboard: () => Promise<void>;
  refreshRecommendations: () => Promise<void>;
  generateNewRecommendations: () => Promise<void>;
  
  // Getters
  getProgressMetrics: (period?: 'last_7_days' | 'last_30_days' | 'last_90_days', metricName?: string) => Promise<void>;
}

export const useAnalytics = (): UseAnalyticsReturn => {
  const { user } = useAuth();
  
  // State management
  const [dashboardData, setDashboardData] = useState<AnalyticsDashboardData | null>(null);
  const [recommendations, setRecommendations] = useState<UserRecommendation[]>([]);
  const [progressMetrics, setProgressMetrics] = useState<ProgressMetric[]>([]);
  
  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(false);

  /**
   * Tracks an event using the analytics service
   */
  const trackEvent = useCallback(async (
    eventType: string, 
    eventData?: Record<string, any>, 
    pagePath?: string
  ) => {
    if (!user) return;
    
    try {
      await analyticsService.trackEvent(eventType, eventData, pagePath);
    } catch (error) {
      console.error('Failed to track event:', error);
    }
  }, [user]);

  /**
   * Records a progress metric
   */
  const recordProgressMetric = useCallback(async (
    metricName: string,
    value: number,
    unit?: string,
    date?: Date
  ) => {
    if (!user) return;
    
    try {
      await analyticsService.recordProgressMetric(metricName, value, unit, date);
      // Refresh metrics after recording
      await getProgressMetrics();
    } catch (error) {
      console.error('Failed to record progress metric:', error);
    }
  }, [user]);

  /**
   * Loads dashboard data
   */
  const refreshDashboard = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const data = await analyticsService.getDashboardData();
      setDashboardData(data);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  /**
   * Loads active recommendations
   */
  const refreshRecommendations = useCallback(async () => {
    if (!user) return;
    
    setIsLoadingRecommendations(true);
    try {
      const data = await analyticsService.getActiveRecommendations();
      setRecommendations(data);
    } catch (error) {
      console.error('Failed to load recommendations:', error);
    } finally {
      setIsLoadingRecommendations(false);
    }
  }, [user]);

  /**
   * Generates new personalized recommendations
   */
  const generateNewRecommendations = useCallback(async () => {
    if (!user) return;
    
    try {
      await analyticsService.generateRecommendations();
      await refreshRecommendations();
    } catch (error) {
      console.error('Failed to generate recommendations:', error);
    }
  }, [user, refreshRecommendations]);

  /**
   * Gets progress metrics for a specific period
   */
  const getProgressMetrics = useCallback(async (
    period: 'last_7_days' | 'last_30_days' | 'last_90_days' = 'last_30_days',
    metricName?: string
  ) => {
    if (!user) return;
    
    setIsLoadingMetrics(true);
    try {
      const data = await analyticsService.getUserProgressMetrics(period, metricName);
      setProgressMetrics(data);
    } catch (error) {
      console.error('Failed to load progress metrics:', error);
    } finally {
      setIsLoadingMetrics(false);
    }
  }, [user]);

  // Initial data loading
  useEffect(() => {
    if (user) {
      refreshDashboard();
      refreshRecommendations();
      getProgressMetrics();
    }
  }, [user, refreshDashboard, refreshRecommendations, getProgressMetrics]);

  // Auto-track page views
  useEffect(() => {
    if (user) {
      trackEvent('page_view', {
        path: window.location.pathname,
        timestamp: new Date().toISOString()
      });
    }
  }, [user, trackEvent]);

  return {
    // Data
    dashboardData,
    recommendations,
    progressMetrics,
    
    // Loading states
    isLoading,
    isLoadingRecommendations,
    isLoadingMetrics,
    
    // Actions
    trackEvent,
    recordProgressMetric,
    refreshDashboard,
    refreshRecommendations,
    generateNewRecommendations,
    getProgressMetrics
  };
};
