
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Calendar, Clock, CheckCircle, XCircle, Trash2, AlertCircle } from 'lucide-react';
import { format, parseISO, isAfter, subDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { useWorkoutTracking } from '@/hooks/useWorkoutTracking';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const WorkoutHistory = () => {
  const { workoutHistory, loadWorkoutHistory, removeWorkout, isLoading } = useWorkoutTracking();
  const [error, setError] = useState<string | null>(null);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  const getRecentWorkoutsAccordionValue = () => {
    // Autoexpand the "Recent Workouts" section
    const recentDate = subDays(new Date(), 7);
    const recentSessionIds = workoutHistory
      .filter(session => isAfter(parseISO(session.date), recentDate))
      .map(session => session.id);
    
    return recentSessionIds;
  };
  
  useEffect(() => {
    const fetchWorkoutHistory = async () => {
      try {
        await loadWorkoutHistory();
        setError(null);
      } catch (err) {
        console.error('Error loading workout history:', err);
        setError('No se pudo cargar el historial de entrenamientos. Por favor, inténtalo de nuevo más tarde.');
      }
    };
    
    fetchWorkoutHistory();
  }, []);
  
  const handleDelete = async (id: string) => {
    setSelectedSessionId(null);
    try {
      await removeWorkout(id);
      setError(null);
    } catch (err) {
      console.error('Error deleting workout:', err);
      setError('No se pudo eliminar el entrenamiento. Por favor, inténtalo de nuevo más tarde.');
    }
  };

  if (isLoading && workoutHistory.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Historial de Entrenamientos</CardTitle>
          <CardDescription>Registro de tus actividades físicas</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Historial de Entrenamientos</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button 
            onClick={() => loadWorkoutHistory()} 
            className="mt-4 w-full"
            variant="outline"
          >
            Reintentar
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  if (workoutHistory.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Historial de Entrenamientos</CardTitle>
          <CardDescription>Registro de tus actividades físicas</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">No hay entrenamientos registrados aún</p>
          <p className="text-sm text-muted-foreground mt-2">
            Completa un entrenamiento para comenzar a ver tu historial aquí
          </p>
        </CardContent>
      </Card>
    );
  }
  
  // Group sessions by month
  const groupedSessions = workoutHistory.reduce((acc, session) => {
    const monthYear = format(parseISO(session.date), 'MMMM yyyy', { locale: es });
    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    acc[monthYear].push(session);
    return acc;
  }, {} as Record<string, typeof workoutHistory>);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Historial de Entrenamientos</CardTitle>
        <CardDescription>Registro de tus actividades físicas</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <Accordion 
            type="multiple" 
            className="space-y-4"
            defaultValue={getRecentWorkoutsAccordionValue() as string[]}
          >
            {Object.entries(groupedSessions).map(([monthYear, sessions]) => (
              <div key={monthYear} className="mb-4">
                <h3 className="text-sm font-medium mb-2 text-muted-foreground capitalize">
                  {monthYear}
                </h3>
                <div className="space-y-2">
                  {sessions.map((session) => (
                    <AccordionItem key={session.id} value={session.id!} className="border rounded-lg">
                      <AccordionTrigger className="hover:no-underline px-4">
                        <div className="flex flex-col items-start text-left">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{format(parseISO(session.date), 'EEEE, d', { locale: es })}</span>
                            {session.completed ? (
                              <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">
                                Completado
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="ml-2">
                                Parcial
                              </Badge>
                            )}
                          </div>
                          <span className="text-sm text-muted-foreground mt-1">
                            {session.exercises.length} ejercicios • {session.duration} min
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pt-2">
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 gap-2">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span className="text-sm">Duración: {session.duration} minutos</span>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium mb-2">Ejercicios:</h4>
                              <ul className="space-y-2">
                                {session.exercises.map((exercise, index) => (
                                  <li key={index} className="flex items-center">
                                    {exercise.completed ? (
                                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                    ) : (
                                      <XCircle className="h-4 w-4 text-gray-400 mr-2" />
                                    )}
                                    <span className="text-sm">
                                      {exercise.name} • {exercise.sets} series × {exercise.reps}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          
                          {session.notes && (
                            <div>
                              <h4 className="text-sm font-medium mb-1">Notas:</h4>
                              <p className="text-sm text-muted-foreground">{session.notes}</p>
                            </div>
                          )}
                          
                          <div className="flex justify-end">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                >
                                  <Trash2 className="h-4 w-4 text-red-500 mr-1" />
                                  Eliminar
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Esta acción no se puede deshacer. Esta acción eliminará permanentemente
                                    el registro de este entrenamiento.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDelete(session.id!)}
                                    className="bg-red-500 text-white hover:bg-red-600"
                                  >
                                    Eliminar
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </div>
              </div>
            ))}
          </Accordion>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
