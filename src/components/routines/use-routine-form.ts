
import { useState } from "react";
import { routineSchema, type ExerciseFormData, type RoutineFormData } from "./validation-schema";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

export interface UseRoutineFormProps {
  initialData?: {
    id: string;
    name: string;
    description?: string;
    exercises: Array<ExerciseFormData & { id?: string }>;
  };
  onSuccess?: () => void;
  onOpenChange: (open: boolean) => void;
}

export function useRoutineForm({ initialData, onSuccess, onOpenChange }: UseRoutineFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [exercises, setExercises] = useState<ExerciseFormData[]>(initialData?.exercises || []);
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

  const handleExerciseChange = (index: number, field: keyof ExerciseFormData, value: string | number) => {
    const updatedExercises = [...exercises];
    updatedExercises[index] = {
      ...updatedExercises[index],
      [field]: field === 'sets' ? parseInt(value.toString()) : value,
    };
    setExercises(updatedExercises);
    
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
        await handleUpdate();
      } else {
        await handleCreate();
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

  const handleCreate = async () => {
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
  };

  const handleUpdate = async () => {
    if (!initialData?.id) return;

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
  };

  return {
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
  };
}
