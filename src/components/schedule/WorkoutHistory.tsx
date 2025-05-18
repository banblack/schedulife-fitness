
import { useEffect, useState, useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Calendar, Clock, Trash2, User, Dumbbell, Pencil, Check, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useWorkoutTracking } from '@/hooks/useWorkoutTracking';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const WorkoutHistory = () => {
  const { 
    workoutHistory, 
    isLoading, 
    loadWorkoutHistory, 
    removeWorkout,
    totalSessions,
    currentPage,
    pageSize,
    setPageSize 
  } = useWorkoutTracking();
  
  const { user } = useAuth();
  const [selectedWorkout, setSelectedWorkout] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  useEffect(() => {
    if (user) {
      loadWorkoutHistory(1, pageSize);
    }
  }, [user, loadWorkoutHistory, pageSize]);
  
  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(totalSessions / pageSize));
  }, [totalSessions, pageSize]);
  
  // Handle page changes
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      loadWorkoutHistory(newPage, pageSize);
    }
  };
  
  // Group workouts by month for display
  const groupedWorkouts = useMemo(() => {
    const groups: Record<string, typeof workoutHistory> = {};
    
    workoutHistory.forEach(workout => {
      const date = parseISO(workout.date);
      const monthYear = format(date, 'MMMM yyyy', { locale: es });
      
      if (!groups[monthYear]) {
        groups[monthYear] = [];
      }
      
      groups[monthYear].push(workout);
    });
    
    return groups;
  }, [workoutHistory]);
  
  const handleDelete = async () => {
    if (!selectedWorkout) return;
    
    const success = await removeWorkout(selectedWorkout);
    if (success) {
      setIsDeleteDialogOpen(false);
      setSelectedWorkout(null);
    }
  };
  
  const openDeleteDialog = (workoutId: string) => {
    setSelectedWorkout(workoutId);
    setIsDeleteDialogOpen(true);
  };
  
  // Empty state (no workouts)
  if (!isLoading && workoutHistory.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="py-10">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Dumbbell className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium">No hay entrenamientos registrados</h3>
            <p className="text-muted-foreground">
              Aún no has registrado ningún entrenamiento. ¡Empieza a registrar tus sesiones para ver tu progreso!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Loading state
  if (isLoading && workoutHistory.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-8 w-24" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-72" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="mb-6">
              <Skeleton className="h-6 w-36 mb-4" />
              <div className="space-y-4">
                {Array.from({ length: 2 }).map((_, subIndex) => (
                  <Skeleton key={`${index}-${subIndex}`} className="h-24 w-full" />
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle>Historial de Entrenamientos</CardTitle>
            <CardDescription>
              {totalSessions} {totalSessions === 1 ? 'entrenamiento registrado' : 'entrenamientos registrados'}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => setPageSize(parseInt(value))}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Items por página" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 por página</SelectItem>
                <SelectItem value="10">10 por página</SelectItem>
                <SelectItem value="25">25 por página</SelectItem>
                <SelectItem value="50">50 por página</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <AnimatePresence mode="wait">
          {Object.entries(groupedWorkouts).map(([month, workouts]) => (
            <motion.div 
              key={month}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-medium capitalize">{month}</h3>
              <div className="space-y-4">
                {workouts.map(workout => (
                  <motion.div
                    key={workout.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-4 border rounded-lg hover:bg-accent/10 transition-colors"
                  >
                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {format(parseISO(workout.date), 'PPP', { locale: es })}
                          </span>
                          <Clock className="h-4 w-4 mx-2 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {workout.duration} minutos
                          </span>
                        </div>
                        <Badge variant={workout.completed ? "default" : "outline"}>
                          {workout.completed ? "Completado" : "Parcial"}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium">Ejercicios</h4>
                        <ul className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                          {workout.exercises.map((exercise, i) => (
                            <li key={`${workout.id}-${i}`} className="flex items-start">
                              {exercise.completed ? 
                                <Check className="h-4 w-4 mr-2 text-green-500" /> : 
                                <X className="h-4 w-4 mr-2 text-red-500" />
                              }
                              <span>{exercise.name} - {exercise.sets} series × {exercise.reps}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {workout.notes && (
                        <div className="mt-2">
                          <h4 className="text-sm font-medium">Notas:</h4>
                          <p className="text-sm text-muted-foreground">{workout.notes}</p>
                        </div>
                      )}
                      
                      <div className="flex justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDeleteDialog(workout.id!)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2 pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || isLoading}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <Button
                    key={i}
                    variant={pageNum === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNum)}
                    disabled={isLoading}
                    className="w-8 h-8 p-0"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || isLoading}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
      
      {/* Delete confirmation dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Entrenamiento</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres eliminar este entrenamiento? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
              {isLoading ? 'Eliminando...' : 'Eliminar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
