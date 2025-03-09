
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { WorkoutLogFormData } from "@/types/workout";
import { workoutLogService } from "@/services/workoutLog";
import { CompletionForm } from "./workout-completion/CompletionForm";
import { SuccessState } from "./workout-completion/SuccessState";

interface WorkoutCompletionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workoutId: string | null;
  workoutName: string;
}

export function WorkoutCompletionDialog({
  open,
  onOpenChange,
  workoutId,
  workoutName,
}: WorkoutCompletionDialogProps) {
  const { toast } = useToast();
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: WorkoutLogFormData) => {
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

  const handleCancel = () => {
    onOpenChange(false);
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
            
            <CompletionForm 
              onSubmit={handleSubmit} 
              isSubmitting={isSubmitting} 
              onCancel={handleCancel} 
            />
          </>
        ) : (
          <SuccessState />
        )}
      </DialogContent>
    </Dialog>
  );
}
