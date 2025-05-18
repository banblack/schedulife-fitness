
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WorkoutTrackingForm } from '@/components/schedule/WorkoutTrackingForm';
import { WorkoutHistory } from '@/components/schedule/WorkoutHistory';
import { WorkoutMetrics } from '@/components/schedule/WorkoutMetrics';
import { useWorkout } from '@/contexts/WorkoutContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, LogIn, Info } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

const WorkoutTracking = () => {
  const { routines } = useWorkout();
  const { user, isDemo, transferDemoData } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [selectedRoutineId, setSelectedRoutineId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('track');
  const [isTransferringData, setIsTransferringData] = useState(false);

  const selectedRoutine = routines.find(r => r.id === selectedRoutineId);

  // Auto-select the first routine if none is selected and routines are available
  useEffect(() => {
    if (routines.length > 0 && !selectedRoutineId) {
      setSelectedRoutineId(routines[0].id);
    }
  }, [routines, selectedRoutineId]);

  // Handle demo data transfer
  const handleTransferData = async () => {
    setIsTransferringData(true);
    try {
      await transferDemoData();
      toast({
        title: "Datos transferidos",
        description: "Tus entrenamientos de prueba han sido guardados en tu cuenta"
      });
      // Reload data or update UI as needed
    } catch (error) {
      console.error("Error transferring demo data:", error);
      toast({
        title: "Error",
        description: "No se pudieron transferir los datos de prueba",
        variant: "destructive"
      });
    } finally {
      setIsTransferringData(false);
    }
  };

  if (!user) {
    return (
      <motion.div 
        className="container mx-auto py-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Acceso restringido</AlertTitle>
          <AlertDescription>
            Debes iniciar sesión para acceder a esta funcionalidad
          </AlertDescription>
        </Alert>
        
        <div className="flex justify-center mt-4">
          <Button 
            onClick={() => navigate("/auth")}
            className="animate-pulse"
          >
            <LogIn className="mr-2 h-4 w-4" />
            Iniciar Sesión
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="container mx-auto py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {isDemo && (
        <Alert className="mb-6 bg-accent/20 border-accent">
          <Info className="h-4 w-4 text-accent" />
          <AlertTitle>Modo Demostración</AlertTitle>
          <AlertDescription className="flex flex-col space-y-2">
            <p>Estás usando el modo demostración. Los datos se guardarán localmente en este dispositivo.</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate("/auth")}
                className="border-accent text-accent hover:bg-accent hover:text-white"
              >
                <LogIn className="mr-2 h-3 w-3" />
                Crear cuenta real
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      <h1 className="text-3xl font-bold mb-6">Seguimiento de Entrenamiento</h1>
      
      <div className="mb-6">
        <WorkoutMetrics />
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="track" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Registrar Entrenamiento
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Historial
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="track" className="animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className={`md:col-span-1 ${isMobile ? 'order-2' : 'order-1'} border-primary/20`}>
              <CardHeader>
                <CardTitle>Mis Rutinas</CardTitle>
                <CardDescription>
                  Selecciona una rutina para registrar tu entrenamiento
                </CardDescription>
              </CardHeader>
              <CardContent>
                {routines.length > 0 ? (
                  <div className="space-y-2">
                    {routines.map((routine) => (
                      <motion.div 
                        key={routine.id}
                        onClick={() => setSelectedRoutineId(routine.id)}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedRoutineId === routine.id 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted hover:bg-muted/80'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <h3 className="font-medium">{routine.name}</h3>
                        <p className="text-sm opacity-80 truncate">
                          {routine.exercises.length} ejercicios
                        </p>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground mb-2">No hay rutinas disponibles</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Crea rutinas en la página de programación para poder usarlas aquí
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => navigate('/schedule')}
                      className="mt-2"
                    >
                      Ir a programación
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <div className={`md:col-span-2 ${isMobile ? 'order-1' : 'order-2'}`}>
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
        
        <TabsContent value="history" className="animate-fade-in">
          <WorkoutHistory />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default WorkoutTracking;
