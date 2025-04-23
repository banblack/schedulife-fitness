
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Save, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface RoutineFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  initialData?: {
    id: string;
    name: string;
    description?: string;
    exercises: Array<{
      id: string;
      name: string;
      sets: number;
      reps: string;
      day_of_week: string;
    }>;
  };
}

interface Exercise {
  id?: string;
  name: string;
  sets: number;
  reps: string;
  day_of_week: string;
}

const DAYS_OF_WEEK = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

export function RoutineFormDialog({ open, onOpenChange, onSuccess, initialData }: RoutineFormDialogProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [exercises, setExercises] = useState<Exercise[]>(initialData?.exercises || []);
  const [loading, setLoading] = useState(false);

  const handleAddExercise = () => {
    setExercises([
      ...exercises,
      { name: "", sets: 3, reps: "", day_of_week: "Lunes" },
    ]);
  };

  const handleRemoveExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const handleExerciseChange = (index: number, field: keyof Exercise, value: string | number) => {
    const updatedExercises = [...exercises];
    updatedExercises[index] = {
      ...updatedExercises[index],
      [field]: value,
    };
    setExercises(updatedExercises);
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa un nombre para la rutina",
        variant: "destructive",
      });
      return;
    }

    if (exercises.length === 0) {
      toast({
        title: "Error",
        description: "Agrega al menos un ejercicio a la rutina",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      if (initialData?.id) {
        // Update existing routine
        const { error: routineError } = await supabase
          .from("workout_routines")
          .update({ name, description })
          .eq("id", initialData.id);

        if (routineError) throw routineError;

        // Delete existing exercises
        const { error: deleteError } = await supabase
          .from("routine_exercises")
          .delete()
          .eq("routine_id", initialData.id);

        if (deleteError) throw deleteError;

        // Insert new exercises
        const { error: exercisesError } = await supabase
          .from("routine_exercises")
          .insert(
            exercises.map(ex => ({
              routine_id: initialData.id,
              ...ex
            }))
          );

        if (exercisesError) throw exercisesError;

      } else {
        // Create new routine
        const { data: routine, error: routineError } = await supabase
          .from("workout_routines")
          .insert({ name, description })
          .select()
          .single();

        if (routineError) throw routineError;

        const { error: exercisesError } = await supabase
          .from("routine_exercises")
          .insert(
            exercises.map(ex => ({
              routine_id: routine.id,
              ...ex
            }))
          );

        if (exercisesError) throw exercisesError;
      }

      toast({
        title: "¡Éxito!",
        description: `Rutina ${initialData ? "actualizada" : "creada"} correctamente`,
      });
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving routine:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar la rutina",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Editar Rutina" : "Crear Nueva Rutina"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre de la Rutina</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Rutina de Fuerza"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción (opcional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe el objetivo de esta rutina..."
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Ejercicios</Label>
              <Button onClick={handleAddExercise} type="button" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Agregar Ejercicio
              </Button>
            </div>

            {exercises.map((exercise, index) => (
              <div key={index} className="space-y-4 p-4 border rounded-md">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 space-y-2">
                    <Label>Nombre del Ejercicio</Label>
                    <Input
                      value={exercise.name}
                      onChange={(e) =>
                        handleExerciseChange(index, "name", e.target.value)
                      }
                      placeholder="Ej: Sentadillas"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleRemoveExercise(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Series</Label>
                    <Input
                      type="number"
                      min={1}
                      value={exercise.sets}
                      onChange={(e) =>
                        handleExerciseChange(index, "sets", parseInt(e.target.value))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Repeticiones</Label>
                    <Input
                      value={exercise.reps}
                      onChange={(e) =>
                        handleExerciseChange(index, "reps", e.target.value)
                      }
                      placeholder="Ej: 12 o 8-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Día</Label>
                    <Select
                      value={exercise.day_of_week}
                      onValueChange={(value) =>
                        handleExerciseChange(index, "day_of_week", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {DAYS_OF_WEEK.map((day) => (
                          <SelectItem key={day} value={day}>
                            {day}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              {loading ? "Guardando..." : "Guardar Rutina"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
