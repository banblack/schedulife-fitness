
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Save, Trash2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { z } from "zod";

// Define validation schema
const exerciseSchema = z.object({
  name: z.string().min(1, "El nombre del ejercicio es requerido"),
  sets: z.number().min(1, "Mínimo 1 serie"),
  reps: z.string().min(1, "Las repeticiones son requeridas"),
  day_of_week: z.string().min(1, "El día es requerido")
});

const routineSchema = z.object({
  name: z.string().min(1, "El nombre de la rutina es requerido"),
  description: z.string().optional(),
  exercises: z.array(exerciseSchema).min(1, "Agrega al menos un ejercicio")
});

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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    try {
      routineSchema.parse({ name, description, exercises });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: { [key: string]: string } = {};
        error.errors.forEach((err) => {
          const path = err.path.join('.');
          newErrors[path] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

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
      [field]: field === 'sets' ? parseInt(value.toString()) : value,
    };
    setExercises(updatedExercises);
    
    // Clear exercise-specific error when the user makes a change
    const errorKey = `exercises.${index}.${field}`;
    if (errors[errorKey]) {
      const newErrors = { ...errors };
      delete newErrors[errorKey];
      setErrors(newErrors);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast({
        title: "Error de validación",
        description: "Por favor corrige los errores en el formulario",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      if (initialData?.id) {
        const { error: routineError } = await supabase
          .from("workout_routines")
          .update({ name, description })
          .eq("id", initialData.id);

        if (routineError) throw routineError;

        const { error: deleteError } = await supabase
          .from("routine_exercises")
          .delete()
          .eq("routine_id", initialData.id);

        if (deleteError) throw deleteError;

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
            <Label htmlFor="name" className={errors.name ? "text-destructive" : ""}>
              Nombre de la Rutina
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) {
                  const newErrors = { ...errors };
                  delete newErrors.name;
                  setErrors(newErrors);
                }
              }}
              placeholder="Ej: Rutina de Fuerza"
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
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

            {errors.exercises && exercises.length === 0 && (
              <Alert variant="destructive">
                <AlertDescription>{errors.exercises}</AlertDescription>
              </Alert>
            )}

            {exercises.map((exercise, index) => (
              <div key={index} className="space-y-4 p-4 border rounded-md">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 space-y-2">
                    <Label className={errors[`exercises.${index}.name`] ? "text-destructive" : ""}>
                      Nombre del Ejercicio
                    </Label>
                    <Input
                      value={exercise.name}
                      onChange={(e) => handleExerciseChange(index, "name", e.target.value)}
                      placeholder="Ej: Sentadillas"
                      className={errors[`exercises.${index}.name`] ? "border-destructive" : ""}
                    />
                    {errors[`exercises.${index}.name`] && (
                      <p className="text-sm text-destructive">{errors[`exercises.${index}.name`]}</p>
                    )}
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
                    <Label className={errors[`exercises.${index}.sets`] ? "text-destructive" : ""}>
                      Series
                    </Label>
                    <Input
                      type="number"
                      min={1}
                      value={exercise.sets}
                      onChange={(e) => handleExerciseChange(index, "sets", parseInt(e.target.value))}
                      className={errors[`exercises.${index}.sets`] ? "border-destructive" : ""}
                    />
                    {errors[`exercises.${index}.sets`] && (
                      <p className="text-sm text-destructive">{errors[`exercises.${index}.sets`]}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className={errors[`exercises.${index}.reps`] ? "text-destructive" : ""}>
                      Repeticiones
                    </Label>
                    <Input
                      value={exercise.reps}
                      onChange={(e) => handleExerciseChange(index, "reps", e.target.value)}
                      placeholder="Ej: 12 o 8-12"
                      className={errors[`exercises.${index}.reps`] ? "border-destructive" : ""}
                    />
                    {errors[`exercises.${index}.reps`] && (
                      <p className="text-sm text-destructive">{errors[`exercises.${index}.reps`]}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className={errors[`exercises.${index}.day_of_week`] ? "text-destructive" : ""}>
                      Día
                    </Label>
                    <Select
                      value={exercise.day_of_week}
                      onValueChange={(value) => handleExerciseChange(index, "day_of_week", value)}
                    >
                      <SelectTrigger className={errors[`exercises.${index}.day_of_week`] ? "border-destructive" : ""}>
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
                    {errors[`exercises.${index}.day_of_week`] && (
                      <p className="text-sm text-destructive">{errors[`exercises.${index}.day_of_week`]}</p>
                    )}
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
