
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmptyWorkoutState } from '@/components/auth/EmptyWorkoutState';
import { CalendarDays, Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface WorkoutRoutine {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

export const RoutinesList = () => {
  const [routines, setRoutines] = useState<WorkoutRoutine[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchRoutines();
  }, []);

  const fetchRoutines = async () => {
    try {
      const { data, error } = await supabase
        .from('workout_routines')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRoutines(data || []);
    } catch (error) {
      console.error('Error fetching routines:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las rutinas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoutine = () => {
    // Esta función se implementará más adelante cuando creemos el diálogo de creación de rutinas
    console.log('Crear nueva rutina');
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (routines.length === 0) {
    return <EmptyWorkoutState onCreateRoutine={handleCreateRoutine} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Mis Rutinas</h2>
        <Button onClick={handleCreateRoutine}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Rutina
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {routines.map((routine) => (
          <Card key={routine.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="truncate">{routine.name}</span>
                <CalendarDays className="h-5 w-5 text-muted-foreground" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground line-clamp-2">{routine.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
