
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Save } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRoutineForm, type UseRoutineFormProps } from "./use-routine-form";
import { RoutineExerciseForm } from "./RoutineExerciseForm";
import type { ExerciseFormData } from "./validation-schema";

type RoutineFormDialogProps = UseRoutineFormProps & {
  open: boolean;
};

export function RoutineFormDialog({ open, onOpenChange, onSuccess, initialData }: RoutineFormDialogProps) {
  const {
    name,
    setName,
    description,
    setDescription,
    exercises,
    setExercises,
    loading,
    errors,
    handleExerciseChange,
    handleSubmit,
  } = useRoutineForm({ initialData, onSuccess, onOpenChange });

  const handleAddExercise = () => {
    setExercises([
      ...exercises,
      { name: "", sets: 3, reps: "", day_of_week: "Lunes" },
    ]);
  };

  const handleRemoveExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
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
              onChange={(e) => setName(e.target.value)}
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
              <RoutineExerciseForm
                key={index}
                exercise={exercise}
                index={index}
                errors={errors}
                onExerciseChange={handleExerciseChange}
                onRemove={handleRemoveExercise}
              />
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
