
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Clock, Flame, Medal, Save, ThumbsUp } from "lucide-react";
import { WorkoutLogFormData } from "@/types/workout";
import { workoutLogService } from "@/services/workoutLogService";

interface WorkoutCompletionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workoutId: string | null;
  workoutName: string;
}

const formSchema = z.object({
  duration: z.number().min(1, "Duration must be at least 1 minute").max(300, "Duration must be less than 300 minutes"),
  intensity: z.number().min(1, "Please rate the intensity").max(10, "Maximum intensity is 10"),
  notes: z.string().max(500, "Notes must be less than 500 characters"),
});

export function WorkoutCompletionDialog({
  open,
  onOpenChange,
  workoutId,
  workoutName,
}: WorkoutCompletionDialogProps) {
  const { toast } = useToast();
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<WorkoutLogFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      duration: 30,
      intensity: 5,
      notes: "",
    },
  });

  const onSubmit = async (data: WorkoutLogFormData) => {
    if (!workoutId) return;
    
    setIsSubmitting(true);
    
    try {
      // Save workout log to database
      const result = await workoutLogService.addWorkoutLog(
        workoutId,
        workoutName,
        data
      );
      
      if (result) {
        // Show success message
        setShowSuccess(true);
        
        // Reset form after 2 seconds and close dialog
        setTimeout(() => {
          form.reset();
          setShowSuccess(false);
          onOpenChange(false);
          
          toast({
            title: "Workout Completed!",
            description: `You've logged ${data.duration} minutes of ${workoutName}. Great job!`,
            duration: 5000,
          });
        }, 2000);
      } else {
        toast({
          title: "Error",
          description: "Failed to save workout log. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error saving workout log:", error);
      toast({
        title: "Error",
        description: "Failed to save workout log. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        {!showSuccess ? (
          <>
            <DialogHeader>
              <DialogTitle>Complete Workout: {workoutName}</DialogTitle>
              <DialogDescription>
                Log your workout details to track your progress over time.
              </DialogDescription>
            </DialogHeader>
            
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
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => onOpenChange(false)} type="button">
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
                </DialogFooter>
              </form>
            </Form>
          </>
        ) : (
          <div className="py-12 flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              <ThumbsUp className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-semibold text-center">Workout Completed!</h2>
            <p className="text-center text-muted-foreground">
              Great job! Your workout has been logged successfully.
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <Medal className="h-4 w-4 text-yellow-500" />
              <span className="text-sm">You're making excellent progress!</span>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
