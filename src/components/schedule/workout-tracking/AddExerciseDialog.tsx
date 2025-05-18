
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { WorkoutExercise } from '@/hooks/useWorkoutTracking';

interface AddExerciseDialogProps {
  onAddExercise: (exercise: WorkoutExercise) => void;
  error?: string;
}

export const AddExerciseDialog = ({ onAddExercise, error }: AddExerciseDialogProps) => {
  const [open, setOpen] = useState(false);
  const [newExercise, setNewExercise] = useState<Partial<WorkoutExercise>>({
    name: '',
    sets: 3,
    reps: '10',
    completed: false
  });

  const handleAddExercise = () => {
    if (!newExercise.name) return;
    
    onAddExercise(newExercise as WorkoutExercise);
    
    setNewExercise({
      name: '',
      sets: 3,
      reps: '10',
      completed: false
    });
    
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <PlusCircle className="mr-2 h-4 w-4" />
          Añadir Ejercicio
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Añadir Nuevo Ejercicio</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="exercise-name">Nombre del Ejercicio</Label>
            <Input
              id="exercise-name"
              value={newExercise.name}
              onChange={e => setNewExercise({ ...newExercise, name: e.target.value })}
              placeholder="ej. Flexiones"
              className={error ? "border-destructive" : ""}
            />
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="exercise-sets">Series</Label>
              <Input
                id="exercise-sets"
                type="number"
                min={1}
                value={newExercise.sets}
                onChange={e => setNewExercise({ ...newExercise, sets: parseInt(e.target.value) || 1 })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="exercise-reps">Repeticiones</Label>
              <Input
                id="exercise-reps"
                value={newExercise.reps}
                onChange={e => setNewExercise({ ...newExercise, reps: e.target.value })}
                placeholder="ej. 10 o 30 sec"
              />
            </div>
          </div>
          
          <Button type="button" onClick={handleAddExercise} className="w-full">
            Añadir Ejercicio
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
