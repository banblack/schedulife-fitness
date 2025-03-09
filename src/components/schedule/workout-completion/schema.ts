
import { z } from "zod";

export const workoutCompletionFormSchema = z.object({
  duration: z.number().min(1, "Duration must be at least 1 minute").max(300, "Duration must be less than 300 minutes"),
  intensity: z.number().min(1, "Please rate the intensity").max(10, "Maximum intensity is 10"),
  performance: z.number().min(1, "Please rate your performance").max(5, "Maximum performance rating is 5"),
  notes: z.string().max(500, "Notes must be less than 500 characters"),
});

export type WorkoutCompletionFormValues = z.infer<typeof workoutCompletionFormSchema>;
