
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getUserWorkoutSessions } from '@/services/workoutTracking';
import { useAuth } from '@/contexts/AuthContext';
import { format, parseISO, subDays, isAfter } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarDays, Timer, Dumbbell, ArrowUp, Award, TrendingUp, Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsMobile } from '@/hooks/use-mobile';

export const WorkoutMetrics = () => {
  const { user, isDemo } = useAuth();
  const isMobile = useIsMobile();
  const [metrics, setMetrics] = useState({
    totalWorkouts: 0,
    totalMinutes: 0,
    totalExercises: 0,
    streak: 0,
    lastWorkout: null as string | null,
    thisWeekWorkouts: 0,
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
          
          // This week workouts
          const today = new Date();
          const oneWeekAgo = subDays(today, 7);
          const thisWeekWorkouts = sessions.filter(session => 
            isAfter(new Date(session.date), oneWeekAgo)
          ).length;
          
          setMetrics({
            totalWorkouts,
            totalMinutes,
            totalExercises,
            streak,
            lastWorkout,
            thisWeekWorkouts,
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

  // Card variants for animation
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  const renderSkeleton = () => (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle>Estadísticas de Entrenamiento</CardTitle>
        <CardDescription>
          {isDemo ? "Datos de la versión de prueba" : "Resumen de tu actividad física"}
        </CardDescription>
      </CardHeader>
      <CardContent className={`grid grid-cols-2 ${!isMobile ? 'sm:grid-cols-4' : ''} gap-4`}>
        {Array(isMobile ? 4 : 6).fill(0).map((_, i) => (
          <div key={i} className="flex flex-col space-y-2 p-4 rounded-lg bg-muted/50">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-7 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
  
  if (isLoading) {
    return renderSkeleton();
  }
  
  // Determine the number of metrics to display based on screen size
  const metrics_to_display = [
    { 
      icon: <Dumbbell className="h-5 w-5" />,
      value: metrics.totalWorkouts,
      label: "Entrenamientos"
    },
    { 
      icon: <Timer className="h-5 w-5" />,
      value: metrics.totalMinutes,
      label: "Minutos totales"
    },
    { 
      icon: <Flame className="h-5 w-5" />,
      value: metrics.streak,
      label: "Racha actual"
    },
    { 
      icon: <CalendarDays className="h-5 w-5" />,
      value: metrics.lastWorkout ? format(parseISO(metrics.lastWorkout), "d MMM", {locale: es}) : "N/A",
      label: "Último entrenamiento"
    },
    // Additional metrics for larger screens
    { 
      icon: <Award className="h-5 w-5" />,
      value: metrics.totalExercises,
      label: "Ejercicios totales"
    },
    { 
      icon: <TrendingUp className="h-5 w-5" />,
      value: metrics.thisWeekWorkouts,
      label: "Esta semana"
    }
  ];
  
  // For mobile, only show 4 metrics
  const displayMetrics = isMobile ? metrics_to_display.slice(0, 4) : metrics_to_display;

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          Estadísticas de Entrenamiento
          {isDemo && (
            <span className="ml-2 text-xs font-normal bg-accent/20 text-accent px-2 py-1 rounded-full">
              Demo
            </span>
          )}
        </CardTitle>
        <CardDescription>
          {isDemo ? "Datos guardados localmente en este dispositivo" : "Resumen de tu actividad física"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <motion.div 
          className={`grid grid-cols-2 ${!isMobile ? 'sm:grid-cols-3 lg:grid-cols-6' : ''} gap-3`}
          variants={container}
          initial="hidden"
          animate="show"
        >
          {displayMetrics.map((metric, idx) => (
            <motion.div 
              key={idx} 
              className="flex flex-col space-y-1.5 p-4 rounded-lg bg-muted/50 hover:bg-muted/80 transition-colors"
              variants={item}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center text-primary justify-between">
                {metric.icon}
              </div>
              <h3 className="text-2xl font-bold">{metric.value}</h3>
              <p className="text-xs text-muted-foreground">{metric.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </CardContent>
    </Card>
  );
};
