
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckCircle2, Clock, Dumbbell } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface WorkoutCompletionDialogProps {
  date: Date;
  workoutType: string;
  onComplete: (date: string, performance: {
    duration: number;
    intensity: 'Low' | 'Medium' | 'High';
    notes: string;
  }) => void;
}

export function WorkoutCompletionDialog({ 
  date, 
  workoutType, 
  onComplete 
}: WorkoutCompletionDialogProps) {
  const [open, setOpen] = useState(false);
  const [duration, setDuration] = useState(30);
  const [intensity, setIntensity] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [notes, setNotes] = useState("");
  const { toast } = useToast();

  const handleComplete = () => {
    onComplete(format(date, 'yyyy-MM-dd'), {
      duration,
      intensity,
      notes
    });
    
    toast({
      title: "Workout completed!",
      description: `You've logged your ${workoutType} workout for ${format(date, 'MMMM d, yyyy')}`,
    });
    
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Dumbbell className="h-4 w-4" />
          Log Workout
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Complete Workout</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-2 text-sm">
            <div className="font-medium">Date:</div>
            <div>{format(date, 'MMMM d, yyyy')}</div>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <div className="font-medium">Workout Type:</div>
            <div className="capitalize">{workoutType}</div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="duration" className="flex items-center gap-2">
              <Clock className="h-4 w-4" /> Duration (minutes)
            </Label>
            <Input
              id="duration"
              type="number"
              min="5"
              max="180"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
            />
          </div>
          
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Dumbbell className="h-4 w-4" /> Intensity
            </Label>
            <RadioGroup 
              value={intensity} 
              onValueChange={(val) => setIntensity(val as 'Low' | 'Medium' | 'High')}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Low" id="low" />
                <Label htmlFor="low">Low</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Medium" id="medium" />
                <Label htmlFor="medium">Medium</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="High" id="high" />
                <Label htmlFor="high">High</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="How did this workout feel? Any achievements?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>
        <Button onClick={handleComplete} className="w-full gap-2">
          <CheckCircle2 className="h-4 w-4" />
          Complete Workout
        </Button>
      </DialogContent>
    </Dialog>
  );
}
