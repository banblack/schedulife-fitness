
/**
 * QuickMetrics Component
 * 
 * Displays a condensed view of key analytics metrics that can be
 * embedded in other pages like the main dashboard.
 * 
 * @example
 * ```tsx
 * import { QuickMetrics } from '@/components/analytics/QuickMetrics';
 * 
 * function Dashboard() {
 *   return (
 *     <div>
 *       <QuickMetrics />
 *       {/* Other dashboard content */}
 *     </div>
 *   );
 * }
 * ```
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Award, Clock, BarChart3 } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { Link } from 'react-router-dom';

export const QuickMetrics: React.FC = () => {
  const { dashboardData, isLoading } = useAnalytics();

  if (isLoading || !dashboardData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Métricas Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-muted rounded animate-pulse" />
                <div className="h-6 bg-muted rounded animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Métricas Rápidas
        </CardTitle>
        <Button asChild size="sm" variant="outline">
          <Link to="/analytics">Ver Detalles</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center space-y-1">
            <div className="flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold">{dashboardData.totalWorkouts}</div>
            <p className="text-xs text-muted-foreground">Entrenamientos</p>
          </div>
          
          <div className="text-center space-y-1">
            <div className="flex items-center justify-center">
              <Clock className="h-4 w-4 text-green-500" />
            </div>
            <div className="text-2xl font-bold">
              {Math.round(dashboardData.avgWorkoutDuration)}m
            </div>
            <p className="text-xs text-muted-foreground">Promedio</p>
          </div>
          
          <div className="text-center space-y-1">
            <div className="flex items-center justify-center">
              <Award className="h-4 w-4 text-yellow-500" />
            </div>
            <div className="text-2xl font-bold">{dashboardData.streakDays}</div>
            <p className="text-xs text-muted-foreground">Racha</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
