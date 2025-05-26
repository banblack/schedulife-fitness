
/**
 * Analytics Service
 * 
 * Provides functionality for tracking user metrics, app usage, and generating
 * personalized recommendations based on user behavior and workout data.
 * 
 * @example
 * ```typescript
 * import { analyticsService } from '@/services/analytics';
 * 
 * // Track a workout completion event
 * await analyticsService.trackEvent('workout_completed', {
 *   workoutType: 'strength',
 *   duration: 45
 * });
 * 
 * // Get user progress metrics
 * const metrics = await analyticsService.getUserProgressMetrics('last_30_days');
 * ```
 */

import { supabase } from '@/integrations/supabase/client';

export interface UsageMetric {
  id: string;
  user_id: string;
  event_type: string;
  event_data: Record<string, any>;
  session_id?: string;
  page_path?: string;
  created_at: string;
}

export interface ProgressMetric {
  id: string;
  user_id: string;
  metric_name: string;
  metric_value: number;
  metric_unit?: string;
  date: string;
  created_at: string;
}

export interface UserRecommendation {
  id: string;
  user_id: string;
  recommendation_type: string;
  title: string;
  description?: string;
  priority: number;
  is_active: boolean;
  expires_at?: string;
  created_at: string;
}

export interface AnalyticsDashboardData {
  totalWorkouts: number;
  avgWorkoutDuration: number;
  weeklyProgress: Array<{ date: string; workouts: number }>;
  monthlyTrends: Array<{ month: string; workouts: number; totalMinutes: number }>;
  topExercises: Array<{ name: string; count: number }>;
  streakDays: number;
  improvementAreas: string[];
}

class AnalyticsService {
  private sessionId: string;

  constructor() {
    this.sessionId = this.generateSessionId();
  }

  /**
   * Generates a unique session ID for tracking user sessions
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  /**
   * Gets the current user ID from Supabase auth
   */
  private async getCurrentUserId(): Promise<string | null> {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id || null;
  }

  /**
   * Tracks a user event for analytics purposes
   * 
   * @param eventType - Type of event (e.g., 'workout_completed', 'page_view')
   * @param eventData - Additional data associated with the event
   * @param pagePath - Optional page path where the event occurred
   */
  async trackEvent(
    eventType: string, 
    eventData: Record<string, any> = {}, 
    pagePath?: string
  ): Promise<void> {
    try {
      const userId = await this.getCurrentUserId();
      if (!userId) {
        console.warn('Cannot track event: user not authenticated');
        return;
      }

      const { error } = await supabase
        .from('app_usage_metrics')
        .insert({
          user_id: userId,
          event_type: eventType,
          event_data: eventData,
          session_id: this.sessionId,
          page_path: pagePath || window.location.pathname
        });

      if (error) {
        console.error('Error tracking event:', error);
      }
    } catch (error) {
      console.error('Failed to track event:', error);
    }
  }

  /**
   * Records a progress metric for the user
   * 
   * @param metricName - Name of the metric (e.g., 'weight', 'workout_count')
   * @param value - Numeric value of the metric
   * @param unit - Optional unit of measurement
   * @param date - Optional date (defaults to today)
   */
  async recordProgressMetric(
    metricName: string,
    value: number,
    unit?: string,
    date?: Date
  ): Promise<void> {
    try {
      const userId = await this.getCurrentUserId();
      if (!userId) {
        console.warn('Cannot record progress metric: user not authenticated');
        return;
      }

      const { error } = await supabase
        .from('user_progress_metrics')
        .upsert({
          user_id: userId,
          metric_name: metricName,
          metric_value: value,
          metric_unit: unit,
          date: date ? date.toISOString().split('T')[0] : undefined
        });

      if (error) {
        console.error('Error recording progress metric:', error);
      }
    } catch (error) {
      console.error('Failed to record progress metric:', error);
    }
  }

  /**
   * Retrieves user progress metrics for a given time period
   * 
   * @param period - Time period ('last_7_days', 'last_30_days', 'last_90_days')
   * @param metricName - Optional specific metric name to filter by
   */
  async getUserProgressMetrics(
    period: 'last_7_days' | 'last_30_days' | 'last_90_days' = 'last_30_days',
    metricName?: string
  ): Promise<ProgressMetric[]> {
    try {
      const userId = await this.getCurrentUserId();
      if (!userId) {
        console.warn('Cannot get progress metrics: user not authenticated');
        return [];
      }

      const days = period === 'last_7_days' ? 7 : period === 'last_30_days' ? 30 : 90;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      let query = supabase
        .from('user_progress_metrics')
        .select('*')
        .eq('user_id', userId)
        .gte('date', startDate.toISOString().split('T')[0])
        .order('date', { ascending: false });

      if (metricName) {
        query = query.eq('metric_name', metricName);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching progress metrics:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Failed to fetch progress metrics:', error);
      return [];
    }
  }

  /**
   * Generates comprehensive dashboard data for analytics visualization
   */
  async getDashboardData(): Promise<AnalyticsDashboardData> {
    try {
      const userId = await this.getCurrentUserId();
      if (!userId) {
        console.warn('Cannot get dashboard data: user not authenticated');
        return this.getEmptyDashboardData();
      }

      // Get workout sessions data
      const { data: workoutSessions, error: workoutError } = await supabase
        .from('workout_sessions')
        .select('*')
        .eq('user_id', userId)
        .eq('completed', true)
        .gte('date', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .order('date', { ascending: false });

      if (workoutError) {
        console.error('Error fetching workout sessions:', workoutError);
      }

      const sessions = workoutSessions || [];

      // Calculate basic metrics
      const totalWorkouts = sessions.length;
      const avgWorkoutDuration = sessions.length > 0 
        ? sessions.reduce((sum, session) => sum + session.duration, 0) / sessions.length 
        : 0;

      // Calculate weekly progress (last 7 days)
      const weeklyProgress = this.calculateWeeklyProgress(sessions);

      // Calculate monthly trends (last 3 months)
      const monthlyTrends = this.calculateMonthlyTrends(sessions);

      // Get top exercises
      const topExercises = this.calculateTopExercises(sessions);

      // Calculate streak days
      const streakDays = this.calculateStreakDays(sessions);

      // Generate improvement areas
      const improvementAreas = this.generateImprovementAreas(sessions);

      return {
        totalWorkouts,
        avgWorkoutDuration,
        weeklyProgress,
        monthlyTrends,
        topExercises,
        streakDays,
        improvementAreas
      };
    } catch (error) {
      console.error('Failed to generate dashboard data:', error);
      return this.getEmptyDashboardData();
    }
  }

  /**
   * Returns empty dashboard data structure
   */
  private getEmptyDashboardData(): AnalyticsDashboardData {
    return {
      totalWorkouts: 0,
      avgWorkoutDuration: 0,
      weeklyProgress: [],
      monthlyTrends: [],
      topExercises: [],
      streakDays: 0,
      improvementAreas: []
    };
  }

  /**
   * Generates personalized recommendations based on user data
   */
  async generateRecommendations(): Promise<void> {
    try {
      const userId = await this.getCurrentUserId();
      if (!userId) {
        console.warn('Cannot generate recommendations: user not authenticated');
        return;
      }

      const dashboardData = await this.getDashboardData();
      const recommendations: Array<{
        user_id: string;
        recommendation_type: string;
        title: string;
        description?: string;
        priority: number;
        is_active: boolean;
        expires_at?: string;
      }> = [];

      // Workout frequency recommendations
      if (dashboardData.totalWorkouts < 12) { // Less than 3 workouts per month average
        recommendations.push({
          user_id: userId,
          recommendation_type: 'workout_frequency',
          title: 'Incrementa tu frecuencia de entrenamiento',
          description: 'Intenta entrenar al menos 3 veces por semana para mejores resultados',
          priority: 1,
          is_active: true,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        });
      }

      // Workout duration recommendations
      if (dashboardData.avgWorkoutDuration < 30) {
        recommendations.push({
          user_id: userId,
          recommendation_type: 'workout_duration',
          title: 'Extiende tus sesiones de entrenamiento',
          description: 'Intenta entrenar por al menos 30-45 minutos para maximizar los beneficios',
          priority: 2,
          is_active: true,
          expires_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
        });
      }

      // Streak recommendations
      if (dashboardData.streakDays < 3) {
        recommendations.push({
          user_id: userId,
          recommendation_type: 'consistency',
          title: 'Mejora tu consistencia',
          description: 'Trata de entrenar días consecutivos para construir un hábito sólido',
          priority: 1,
          is_active: true,
          expires_at: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString()
        });
      }

      // Insert recommendations
      if (recommendations.length > 0) {
        const { error } = await supabase
          .from('user_recommendations')
          .insert(recommendations);

        if (error) {
          console.error('Error inserting recommendations:', error);
        }
      }
    } catch (error) {
      console.error('Failed to generate recommendations:', error);
    }
  }

  /**
   * Retrieves active recommendations for the user
   */
  async getActiveRecommendations(): Promise<UserRecommendation[]> {
    try {
      const userId = await this.getCurrentUserId();
      if (!userId) {
        console.warn('Cannot get recommendations: user not authenticated');
        return [];
      }

      const { data, error } = await supabase
        .from('user_recommendations')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
        .order('priority', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching recommendations:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
      return [];
    }
  }

  // Private helper methods for calculations
  private calculateWeeklyProgress(sessions: any[]): Array<{ date: string; workouts: number }> {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => ({
      date,
      workouts: sessions.filter(session => session.date === date).length
    }));
  }

  private calculateMonthlyTrends(sessions: any[]): Array<{ month: string; workouts: number; totalMinutes: number }> {
    const monthlyData: Record<string, { workouts: number; totalMinutes: number }> = {};

    sessions.forEach(session => {
      const monthKey = new Date(session.date).toISOString().substring(0, 7); // YYYY-MM
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { workouts: 0, totalMinutes: 0 };
      }
      monthlyData[monthKey].workouts++;
      monthlyData[monthKey].totalMinutes += session.duration;
    });

    return Object.entries(monthlyData)
      .map(([month, data]) => ({ month, ...data }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }

  private calculateTopExercises(sessions: any[]): Array<{ name: string; count: number }> {
    const exerciseCount: Record<string, number> = {};

    sessions.forEach(session => {
      if (session.exercises && Array.isArray(session.exercises)) {
        session.exercises.forEach((exercise: any) => {
          const name = exercise.name || 'Unknown Exercise';
          exerciseCount[name] = (exerciseCount[name] || 0) + 1;
        });
      }
    });

    return Object.entries(exerciseCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  private calculateStreakDays(sessions: any[]): number {
    if (sessions.length === 0) return 0;

    const sortedDates = sessions
      .map(session => new Date(session.date))
      .sort((a, b) => b.getTime() - a.getTime());

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const sessionDate of sortedDates) {
      const diffDays = Math.floor((currentDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === streak) {
        streak++;
      } else if (diffDays > streak) {
        break;
      }
    }

    return streak;
  }

  private generateImprovementAreas(sessions: any[]): string[] {
    const areas: string[] = [];

    if (sessions.length < 12) {
      areas.push('Frecuencia de entrenamiento');
    }

    const avgDuration = sessions.length > 0 
      ? sessions.reduce((sum, session) => sum + session.duration, 0) / sessions.length 
      : 0;

    if (avgDuration < 30) {
      areas.push('Duración de sesiones');
    }

    const uniqueExercises = new Set();
    sessions.forEach(session => {
      if (session.exercises && Array.isArray(session.exercises)) {
        session.exercises.forEach((exercise: any) => {
          uniqueExercises.add(exercise.name);
        });
      }
    });

    if (uniqueExercises.size < 10) {
      areas.push('Variedad de ejercicios');
    }

    return areas;
  }
}

export const analyticsService = new AnalyticsService();
