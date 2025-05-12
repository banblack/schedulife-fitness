
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WorkoutTrackingForm } from '@/components/schedule/WorkoutTrackingForm';
import { WorkoutHistory } from '@/components/schedule/WorkoutHistory';
import { WorkoutMetrics } from '@/components/schedule/WorkoutMetrics';
import { useWorkout } from '@/contexts/WorkoutContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const WorkoutTracking = () => {
  const { routines } = useWorkout();
  const { user } = useAuth();
  const [selectedRoutineId, setSelectedRoutineId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('track');

  const selectedRoutine = routines.find(r => r.id === selectedRoutineId);

  if (!user) {
    return (
      <div className="container mx-auto py-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Debes iniciar sesión para acceder a esta funcionalidad
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Seguimiento de Entrenamiento</h1>
      
      <div className="mb-6">
        <WorkoutMetrics />
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="track">Registrar Entrenamiento</TabsTrigger>
          <TabsTrigger value="history">Historial</TabsTrigger>
        </TabsList>
        
        <TabsContent value="track">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Mis Rutinas</CardTitle>
              </CardHeader>
              <CardContent>
                {routines.length > 0 ? (
                  <div className="space-y-2">
                    {routines.map((routine) => (
                      <div 
                        key={routine.id}
                        onClick={() => setSelectedRoutineId(routine.id)}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedRoutineId === routine.id 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted hover:bg-muted/80'
                        }`}
                      >
                        <h3 className="font-medium">{routine.name}</h3>
                        <p className="text-sm opacity-80 truncate">
                          {routine.exercises.length} ejercicios
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground mb-2">No hay rutinas disponibles</p>
                    <p className="text-sm text-muted-foreground">
                      Crea rutinas en la página de programación para poder usarlas aquí
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <div className="md:col-span-2">
              <WorkoutTrackingForm 
                routineId={selectedRoutine?.id}
                routineName={selectedRoutine?.name}
                exercises={selectedRoutine?.exercises.map(ex => ({
                  name: ex.name,
                  sets: ex.sets,
                  reps: ex.reps
                }))}
                onComplete={() => setActiveTab('history')}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="history">
          <WorkoutHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorkoutTracking;
