
/**
 * AnalyticsDashboard Component
 * 
 * Displays comprehensive analytics and metrics data including workout progress,
 * performance trends, and personalized recommendations.
 * 
 * Features:
 * - Overview cards with key metrics
 * - Interactive charts for progress visualization
 * - Personalized recommendations display
 * - Progress tracking over time
 * 
 * @example
 * ```tsx
 * import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';
 * 
 * function StatsPage() {
 *   return <AnalyticsDashboard />;
 * }
 * ```
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Calendar, Clock, Target, Award, RefreshCw } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export const AnalyticsDashboard: React.FC = () => {
  const {
    dashboardData,
    recommendations,
    isLoading,
    isLoadingRecommendations,
    refreshDashboard,
    generateNewRecommendations
  } = useAnalytics();

  if (isLoading && !dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Panel de Análisis</h1>
          <p className="text-muted-foreground">
            Visualiza tu progreso y recibe recomendaciones personalizadas
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={refreshDashboard}
            variant="outline"
            size="sm"
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          <Button
            onClick={generateNewRecommendations}
            size="sm"
            disabled={isLoadingRecommendations}
          >
            <Target className="h-4 w-4 mr-2" />
            Generar Recomendaciones
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Entrenamientos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.totalWorkouts || 0}</div>
            <p className="text-xs text-muted-foreground">Últimos 90 días</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Duración Promedio</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(dashboardData?.avgWorkoutDuration || 0)} min
            </div>
            <p className="text-xs text-muted-foreground">Por sesión</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Racha Actual</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.streakDays || 0}</div>
            <p className="text-xs text-muted-foreground">Días consecutivos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progreso Semanal</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData?.weeklyProgress?.reduce((sum, day) => sum + day.workouts, 0) || 0}
            </div>
            <p className="text-xs text-muted-foreground">Entrenamientos esta semana</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Weekly Progress Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Progreso Semanal</CardTitle>
            <CardDescription>Entrenamientos por día (últimos 7 días)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dashboardData?.weeklyProgress || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('es-ES', { weekday: 'short' })}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString('es-ES')}
                />
                <Bar dataKey="workouts" fill="#0088FE" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Trends Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Tendencias Mensuales</CardTitle>
            <CardDescription>Evolución de entrenamientos por mes</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dashboardData?.monthlyTrends || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month"
                  tickFormatter={(value) => new Date(value + '-01').toLocaleDateString('es-ES', { month: 'short' })}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => new Date(value + '-01').toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                />
                <Line 
                  type="monotone" 
                  dataKey="workouts" 
                  stroke="#0088FE" 
                  strokeWidth={2}
                  name="Entrenamientos"
                />
                <Line 
                  type="monotone" 
                  dataKey="totalMinutes" 
                  stroke="#00C49F" 
                  strokeWidth={2}
                  name="Minutos totales"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Exercises and Improvement Areas */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Top Exercises */}
        <Card>
          <CardHeader>
            <CardTitle>Ejercicios Más Realizados</CardTitle>
            <CardDescription>Tus ejercicios favoritos</CardDescription>
          </CardHeader>
          <CardContent>
            {dashboardData?.topExercises && dashboardData.topExercises.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={dashboardData.topExercises}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {dashboardData.topExercises.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-48 text-muted-foreground">
                <p>No hay datos de ejercicios disponibles</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Improvement Areas */}
        <Card>
          <CardHeader>
            <CardTitle>Áreas de Mejora</CardTitle>
            <CardDescription>Aspectos para optimizar tu entrenamiento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData?.improvementAreas && dashboardData.improvementAreas.length > 0 ? (
                dashboardData.improvementAreas.map((area, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{area}</span>
                    <Badge variant="outline">Mejorar</Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Award className="h-12 w-12 text-green-500 mx-auto mb-2" />
                  <p className="text-lg font-semibold text-green-600">¡Excelente!</p>
                  <p className="text-sm text-muted-foreground">
                    No encontramos áreas de mejora específicas
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Recomendaciones Personalizadas</CardTitle>
          <CardDescription>
            Sugerencias basadas en tu historial de entrenamientos
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recommendations.length > 0 ? (
            <div className="space-y-4">
              {recommendations.map((recommendation) => (
                <div
                  key={recommendation.id}
                  className="border rounded-lg p-4 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">{recommendation.title}</h4>
                    <Badge 
                      variant={recommendation.priority === 1 ? "default" : "secondary"}
                    >
                      Prioridad {recommendation.priority}
                    </Badge>
                  </div>
                  {recommendation.description && (
                    <p className="text-sm text-muted-foreground">
                      {recommendation.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline" className="text-xs">
                      {recommendation.recommendation_type.replace('_', ' ')}
                    </Badge>
                    {recommendation.expires_at && (
                      <span>
                        Válida hasta: {new Date(recommendation.expires_at).toLocaleDateString('es-ES')}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">
                No hay recomendaciones disponibles en este momento
              </p>
              <Button 
                onClick={generateNewRecommendations}
                className="mt-4"
                disabled={isLoadingRecommendations}
              >
                Generar Recomendaciones
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
