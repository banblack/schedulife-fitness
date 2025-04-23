
import { z } from "zod";

export const exerciseSchema = z.object({
  name: z.string().min(1, "El nombre del ejercicio es requerido"),
  sets: z.number().min(1, "Mínimo 1 serie"),
  reps: z.string().min(1, "Las repeticiones son requeridas"),
  day_of_week: z.string().min(1, "El día es requerido")
});

export const routineSchema = z.object({
  name: z.string().min(1, "El nombre de la rutina es requerido"),
  description: z.string().optional(),
  exercises: z.array(exerciseSchema).min(1, "Agrega al menos un ejercicio")
});

export type ExerciseFormData = z.infer<typeof exerciseSchema>;
export type RoutineFormData = z.infer<typeof routineSchema>;
