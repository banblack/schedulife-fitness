
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getUserWorkoutSessions } from '@/services/workoutTracking';
import { useAuth } from '@/contexts/AuthContext';
import { format, parseISO, subDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarDays, Timer, Dumbbell, ArrowUp } from 'lucide-react';

export const WorkoutMetrics = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState({
    totalWorkouts: 0,
    totalMinutes: 0,
    totalExercises: 0,
    streak: 0,
    lastWorkout: null as string | null,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      if (!user) return;
      setIsLoading(true);

      try {
        const { data: sessions } = await getUserWorkoutSessions(user.id);
        
        if (sessions && sessions.length > 0) {
          // Total workouts
          const totalWorkouts = sessions.length;
          
          // Total minutes
          const totalMinutes = sessions.reduce((acc, session) => acc + (session.duration || 0), 0);
          
          // Total exercises
          const totalExercises = sessions.reduce((acc, session) => acc + (session.exercises?.length || 0), 0);
          
          // Last workout date
          const sortedSessions = [...sessions].sort((a, b) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          const lastWorkout = sortedSessions[0]?.date || null;
          
          // Calculate streak
          const streak = calculateStreak(sessions);
          
          setMetrics({
            totalWorkouts,
            totalMinutes,
            totalExercises,
            streak,
            lastWorkout,
          });
        }
      } catch (error) {
        console.error('Error fetching workout metrics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();
  }, [user]);

  // Calculate current streak of consecutive days with workouts
  const calculateStreak = (sessions: any[]) => {
    if (!sessions.length) return 0;
    
    // Sort sessions by date (descending)
    const sortedDates = [...sessions]
      .map(session => new Date(session.date))
      .sort((a, b) => b.getTime() - a.getTime());
    
    // Get unique dates (in case of multiple workouts per day)
    const uniqueDates = new Set(sortedDates.map(date => format(date, 'yyyy-MM-dd')));
    const dates = Array.from(uniqueDates).map(dateStr => parseISO(dateStr));
    
    let streak = 1; // Start with 1 for the most recent workout
    let currentDate = dates[0];
    
    // Check for consecutive days
    for (let i = 1; i < dates.length; i++) {
      const expectedPrevDay = subDays(currentDate, 1);
      
      if (format(dates[i], 'yyyy-MM-dd') === format(expectedPrevDay, 'yyyy-MM-dd')) {
        streak++;
        currentDate = dates[i];
      } else {
        break; // Streak is broken
      }
    }
    
    return streak;
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle>Estadísticas de Entrenamiento</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col space-y-1.5 p-4 rounded-lg animate-pulse bg-muted">
              <div className="h-5 w-5 rounded-full bg-muted-foreground/30"></div>
              <div className="h-6 w-24 rounded bg-muted-foreground/30"></div>
              <div className="h-4 w-16 rounded bg-muted-foreground/30"></div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle>Estadísticas de Entrenamiento</CardTitle>
        <CardDescription>
          Resumen de tu actividad física
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="flex flex-col space-y-1.5 p-4 rounded-lg bg-muted/50">
          <div className="flex items-center text-primary justify-between">
            <Dumbbell className="h-5 w-5" />
          </div>
          <h3 className="text-2xl font-bold">{metrics.totalWorkouts}</h3>
          <p className="text-xs text-muted-foreground">Entrenamientos</p>
        </div>
        
        <div className="flex flex-col space-y-1.5 p-4 rounded-lg bg-muted/50">
          <div className="flex items-center text-primary justify-between">
            <Timer className="h-5 w-5" />
          </div>
          <h3 className="text-2xl font-bold">{metrics.totalMinutes}</h3>
          <p className="text-xs text-muted-foreground">Minutos totales</p>
        </div>
        
        <div className="flex flex-col space-y-1.5 p-4 rounded-lg bg-muted/50">
          <div className="flex items-center text-primary justify-between">
            <ArrowUp className="h-5 w-5" />
          </div>
          <h3 className="text-2xl font-bold">{metrics.streak}</h3>
          <p className="text-xs text-muted-foreground">Racha actual</p>
        </div>
        
        <div className="flex flex-col space-y-1.5 p-4 rounded-lg bg-muted/50">
          <div className="flex items-center text-primary justify-between">
            <CalendarDays className="h-5 w-5" />
          </div>
          <h3 className="text-2xl font-bold">{metrics.lastWorkout ? 
            format(parseISO(metrics.lastWorkout), "d MMM", {locale: es}) : "N/A"}
          </h3>
          <p className="text-xs text-muted-foreground">Último entrenamiento</p>
        </div>
      </CardContent>
    </Card>
  );
};
