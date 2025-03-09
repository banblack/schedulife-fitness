
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Clock, Flame, Save, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { WorkoutLogFormData } from "@/types/workout";
import { workoutCompletionFormSchema } from "./schema";

interface CompletionFormProps {
  onSubmit: (data: WorkoutLogFormData) => void;
  isSubmitting: boolean;
  onCancel: () => void;
}

export function CompletionForm({ onSubmit, isSubmitting, onCancel }: CompletionFormProps) {
  const form = useForm<WorkoutLogFormData>({
    resolver: zodResolver(workoutCompletionFormSchema),
    defaultValues: {
      duration: 30,
      intensity: 5,
      performance: 3,
      notes: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Clock className="h-4 w-4" /> Duration (minutes)
              </FormLabel>
              <FormControl>
                <div className="flex items-center gap-4">
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    className="w-20"
                  />
                  <Slider
                    value={[field.value]}
                    min={1}
                    max={180}
                    step={1}
                    onValueChange={(vals) => field.onChange(vals[0])}
                    className="flex-1"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="intensity"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Flame className="h-4 w-4" /> Intensity (1-10)
              </FormLabel>
              <FormControl>
                <div className="space-y-4">
                  <Slider
                    value={[field.value]}
                    min={1}
                    max={10}
                    step={1}
                    onValueChange={(vals) => field.onChange(vals[0])}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Light</span>
                    <span>Moderate</span>
                    <span>Intense</span>
                  </div>
                </div>
              </FormControl>
              <FormDescription>
                How challenging was this workout for you?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="performance"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Star className="h-4 w-4" /> Performance (1-5)
              </FormLabel>
              <FormControl>
                <div className="space-y-4">
                  <Slider
                    value={[field.value]}
                    min={1}
                    max={5}
                    step={1}
                    onValueChange={(vals) => field.onChange(vals[0])}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Needs Work</span>
                    <span>Average</span>
                    <span>Excellent</span>
                  </div>
                </div>
              </FormControl>
              <FormDescription>
                How would you rate your performance today?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                Notes (optional)
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="How did you feel? Any achievements or challenges?"
                  {...field}
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
          <Button variant="outline" onClick={onCancel} type="button">
            Cancel
          </Button>
          <Button type="submit" className="gap-2" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 border-2 border-current border-t-transparent animate-spin rounded-full" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" /> Log Workout
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
