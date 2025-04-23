
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface EmptyWorkoutStateProps {
  onCreateRoutine: () => void;
}

export const EmptyWorkoutState = ({ onCreateRoutine }: EmptyWorkoutStateProps) => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="rounded-full bg-primary/10 p-4 mb-4">
          <Plus className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No tienes rutinas todavía</h3>
        <p className="text-muted-foreground mb-6">
          Comienza tu viaje fitness creando tu primera rutina de entrenamiento
        </p>
        <Button onClick={onCreateRoutine}>
          <Plus className="h-4 w-4 mr-2" />
          Crear Rutina
        </Button>
      </CardContent>
    </Card>
  );
};
