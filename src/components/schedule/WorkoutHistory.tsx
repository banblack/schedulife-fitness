
import { useState, useEffect } from 'react';
import { useWorkoutTracking } from '@/hooks/useWorkoutTracking';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Separator } from '@/components/ui/separator';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Clock, Dumbbell, CalendarDays, Trash2, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';

export const WorkoutHistory = () => {
  const { workoutHistory, loadWorkoutHistory, removeWorkout, isLoading } = useWorkoutTracking();
  const { isDemo } = useAuth();
  const isMobile = useIsMobile();
  const [expandedSessions, setExpandedSessions] = useState<Record<string, boolean>>({});
  const [groupedByMonth, setGroupedByMonth] = useState<Record<string, any[]>>({});
  const [expandedMonths, setExpandedMonths] = useState<Record<string, boolean>>({});
  
  useEffect(() => {
    loadWorkoutHistory();
  }, []);
  
  useEffect(() => {
    if (workoutHistory.length > 0) {
      // Group workouts by month
      const grouped = workoutHistory.reduce((acc, workout) => {
        const monthYear = format(parseISO(workout.date), 'MMMM yyyy', { locale: es });
        
        if (!acc[monthYear]) {
          acc[monthYear] = [];
        }
        
        acc[monthYear].push(workout);
        return acc;
      }, {} as Record<string, any[]>);
      
      setGroupedByMonth(grouped);
      
      // By default expand the most recent month
      const months = Object.keys(grouped);
      if (months.length > 0) {
        const initialExpandedMonths: Record<string, boolean> = {};
        initialExpandedMonths[months[0]] = true;
        setExpandedMonths(initialExpandedMonths);
      }
    }
  }, [workoutHistory]);
  
  const toggleSessionExpand = (sessionId: string) => {
    setExpandedSessions(prev => ({
      ...prev,
      [sessionId]: !prev[sessionId]
    }));
  };
  
  const toggleMonthExpand = (month: string) => {
    setExpandedMonths(prev => ({
      ...prev,
      [month]: !prev[month]
    }));
  };
  
  const handleRemoveWorkout = async (sessionId: string) => {
    await removeWorkout(sessionId);
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };
  
  const renderSkeletons = () => (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <Card key={i}>
          <CardHeader className="pb-2">
            <Skeleton className="h-4 w-48 mb-2" />
            <Skeleton className="h-3 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-24" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Skeleton className="h-9 w-full" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
  
  if (isLoading) {
    return renderSkeletons();
  }
  
  if (workoutHistory.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No hay entrenamientos registrados</CardTitle>
          <CardDescription>
            Comienza a registrar tus entrenamientos para ver tu historial
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
          <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            Tu historial de entrenamientos aparecerá aquí cuando comiences a registrarlos.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {isDemo && (
        <Card className="bg-accent/10 border-accent/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Modo Demostración</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Los datos se están guardando localmente en este dispositivo. Crea una cuenta para guardarlos permanentemente.
            </p>
          </CardContent>
        </Card>
      )}
      
      {Object.entries(groupedByMonth).map(([month, sessions]) => (
        <Card key={month} className="overflow-hidden">
          <CardHeader 
            className="bg-muted/30 cursor-pointer p-4" 
            onClick={() => toggleMonthExpand(month)}
          >
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg capitalize">
                {month}
              </CardTitle>
              <Button variant="ghost" size="sm">
                {expandedMonths[month] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
            <CardDescription>
              {sessions.length} {sessions.length === 1 ? 'entrenamiento' : 'entrenamientos'}
            </CardDescription>
          </CardHeader>
          
          <AnimatePresence>
            {expandedMonths[month] && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CardContent className="divide-y">
                  {sessions.map((session) => (
                    <motion.div 
                      key={session.id} 
                      className="py-4 first:pt-2"
                      variants={itemVariants}
                    >
                      <div 
                        className="flex justify-between items-start cursor-pointer"
                        onClick={() => toggleSessionExpand(session.id!)}
                      >
                        <div>
                          <h3 className="font-medium flex items-center">
                            {session.exercises.filter((ex: any) => ex.completed).length}/{session.exercises.length} Ejercicios Completados
                            {session.completed && (
                              <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                                Completado
                              </span>
                            )}
                          </h3>
                          <div className="text-sm text-muted-foreground flex flex-wrap gap-2 mt-1">
                            <span className="flex items-center">
                              <CalendarDays className="h-3.5 w-3.5 mr-1" />
                              {format(parseISO(session.date), 'dd/MM/yyyy')}
                            </span>
                            <span className="flex items-center">
                              <Clock className="h-3.5 w-3.5 mr-1" />
                              {session.duration} min
                            </span>
                            <span className="flex items-center">
                              <Dumbbell className="h-3.5 w-3.5 mr-1" />
                              {session.exercises.length} ejercicios
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            {expandedSessions[session.id!] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      
                      <AnimatePresence>
                        {expandedSessions[session.id!] && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-4 space-y-3">
                              {session.notes && (
                                <div className="bg-muted/30 p-3 rounded-md text-sm">
                                  <p className="font-medium mb-1">Notas:</p>
                                  <p>{session.notes}</p>
                                </div>
                              )}
                              
                              <div className="space-y-2">
                                <h4 className="text-sm font-medium">Ejercicios:</h4>
                                <div className="bg-muted/20 rounded-md divide-y">
                                  {session.exercises.map((exercise: any, idx: number) => (
                                    <div key={idx} className="px-3 py-2 flex justify-between items-center">
                                      <div>
                                        <span className={exercise.completed ? "flex-1" : "flex-1 text-muted-foreground"}>
                                          {exercise.name}
                                        </span>
                                        <div className="text-xs text-muted-foreground mt-0.5">
                                          {exercise.sets} series × {exercise.reps} {exercise.weight ? ` | ${exercise.weight} kg` : ''}
                                        </div>
                                      </div>
                                      {exercise.completed && (
                                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100">
                                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                          </svg>
                                        </span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                              
                              <div className={`flex ${isMobile ? 'flex-col' : 'justify-end'} gap-2 pt-2`}>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size={isMobile ? "default" : "sm"} className={isMobile ? "w-full" : ""}>
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Eliminar
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Esta acción no se puede deshacer. Este registro de entrenamiento se eliminará permanentemente.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleRemoveWorkout(session.id!)}>
                                        Eliminar
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      ))}
    </motion.div>
  );
};
