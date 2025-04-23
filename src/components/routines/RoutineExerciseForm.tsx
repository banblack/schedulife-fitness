
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2 } from "lucide-react";
import type { ExerciseFormData } from "./validation-schema";

const DAYS_OF_WEEK = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

interface RoutineExerciseFormProps {
  exercise: ExerciseFormData;
  index: number;
  errors: { [key: string]: string };
  onExerciseChange: (index: number, field: keyof ExerciseFormData, value: string | number) => void;
  onRemove: (index: number) => void;
}

export function RoutineExerciseForm({ 
  exercise, 
  index, 
  errors, 
  onExerciseChange, 
  onRemove 
}: RoutineExerciseFormProps) {
  return (
    <div className="space-y-4 p-4 border rounded-md">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 space-y-2">
          <Label className={errors[`exercises.${index}.name`] ? "text-destructive" : ""}>
            Nombre del Ejercicio
          </Label>
          <Input
            value={exercise.name}
            onChange={(e) => onExerciseChange(index, "name", e.target.value)}
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
          onClick={() => onRemove(index)}
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
            onChange={(e) => onExerciseChange(index, "sets", parseInt(e.target.value))}
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
            onChange={(e) => onExerciseChange(index, "reps", e.target.value)}
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
            onValueChange={(value) => onExerciseChange(index, "day_of_week", value)}
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
  );
}
