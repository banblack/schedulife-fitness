
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DialogDescription } from "@/components/ui/dialog";
import { Plus, Save, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export interface WorkoutCreationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const WorkoutCreationDialog = ({
  open,
  onOpenChange
}: WorkoutCreationDialogProps) => {
  // Sample preset configurations
  const presetConfigurations = {
    beginner: {
      description: "For those new to volleyball training",
      weeklySchedule: [
        { day: "Monday", intensity: "Light", focus: "Fundamentals" },
        { day: "Wednesday", intensity: "Medium", focus: "Skills" },
        { day: "Friday", intensity: "Light", focus: "Recovery" },
      ]
    },
    intermediate: {
      description: "For those with some volleyball experience",
      weeklySchedule: [
        { day: "Monday", intensity: "Medium", focus: "Skills & Drills" },
        { day: "Tuesday", intensity: "Light", focus: "Recovery" },
        { day: "Wednesday", intensity: "High", focus: "Strength" },
        { day: "Thursday", intensity: "Light", focus: "Recovery" },
        { day: "Friday", intensity: "Medium", focus: "Team Strategies" },
      ]
    },
    advanced: {
      description: "For competitive volleyball players",
      weeklySchedule: [
        { day: "Monday", intensity: "High", focus: "Strength & Power" },
        { day: "Tuesday", intensity: "Medium", focus: "Skills & Drills" },
        { day: "Wednesday", intensity: "High", focus: "HIIT & Conditioning" },
        { day: "Thursday", intensity: "Medium", focus: "Team Strategies" },
        { day: "Friday", intensity: "High", focus: "Match Simulation" },
        { day: "Saturday", intensity: "Light", focus: "Active Recovery" },
      ]
    }
  };

  // Sample exercises by category
  const presetWorkouts = {
    "volleyball": [
      { name: "Vertical Jump Training", sets: 4, reps: "8-10" },
      { name: "Setting Drills", sets: 3, reps: "10 minutes" },
      { name: "Serving Practice", sets: 4, reps: "10 serves" },
      { name: "Block Training", sets: 3, reps: "8-10" },
      { name: "Spike Approach", sets: 4, reps: "10 spikes" },
    ],
    "strength": [
      { name: "Squats", sets: 4, reps: "8-10" },
      { name: "Deadlifts", sets: 3, reps: "6-8" },
      { name: "Shoulder Press", sets: 3, reps: "8-12" },
      { name: "Pull-ups", sets: 3, reps: "As many as possible" },
      { name: "Lunges", sets: 3, reps: "10 each leg" },
    ],
    "cardio": [
      { name: "HIIT Sprint Intervals", sets: 1, reps: "15 minutes" },
      { name: "Box Jumps", sets: 3, reps: "10-12" },
      { name: "Burpees", sets: 3, reps: "15" },
      { name: "Jump Rope", sets: 1, reps: "10 minutes" },
      { name: "Mountain Climbers", sets: 3, reps: "30 seconds" },
    ]
  };

  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [newWorkout, setNewWorkout] = useState({
    name: "",
    description: ""
  });

  const handleCreateWorkout = () => {
    if (!newWorkout.name.trim()) {
      toast({
        title: "Error",
        description: "Please provide a workout name",
        variant: "destructive",
      });
      return;
    }

    if (selectedExercises.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one exercise",
        variant: "destructive",
      });
      return;
    }

    // Save workout logic would go here
    console.log("Creating workout:", {
      ...newWorkout,
      preset: selectedPreset,
      exercises: selectedExercises
    });

    onOpenChange(false);
    toast({
      title: "Success",
      description: "Workout created successfully",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Custom Workout</DialogTitle>
          <DialogDescription>
            Design your perfect workout routine by selecting exercises and customizing your preferences.
          </DialogDescription>
        </DialogHeader>
        <div className="h-[600px] overflow-hidden">
          <ScrollArea className="h-full pr-4">
            <div className="space-y-4">
              <div className="space-y-4">
                <Label>Choose Level</Label>
                <RadioGroup
                  onValueChange={setSelectedPreset}
                  value={selectedPreset || undefined}
                  className="grid grid-cols-3 gap-4"
                >
                  {Object.entries(presetConfigurations).map(([key, config]: [string, any]) => (
                    <div key={key} className="relative">
                      <RadioGroupItem
                        value={key}
                        id={key}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={key}
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                      >
                        <span className="font-semibold capitalize">{key}</span>
                        <span className="text-xs text-muted-foreground">{config.description}</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="workout-name">Workout Name</Label>
                <Input
                  id="workout-name"
                  value={newWorkout.name}
                  onChange={(e) => setNewWorkout({ ...newWorkout, name: e.target.value })}
                  placeholder="e.g., Volleyball Skills Training"
                />
              </div>
              <div>
                <Label htmlFor="workout-description">Description</Label>
                <Textarea
                  id="workout-description"
                  value={newWorkout.description}
                  onChange={(e) => setNewWorkout({ ...newWorkout, description: e.target.value })}
                  placeholder="Describe your workout..."
                />
              </div>

              {selectedPreset && (
                <div className="space-y-4">
                  <Label>Recommended Schedule</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {presetConfigurations[selectedPreset as keyof typeof presetConfigurations].weeklySchedule.map((day: any, index: number) => (
                      <Card key={index} className="p-4">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{day.day}</span>
                          <Badge variant="secondary">{day.intensity}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{day.focus}</p>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <Label>Select Exercises</Label>
                <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                  <div className="space-y-4">
                    {Object.entries(presetWorkouts).map(([group, exercises]: [string, any]) => (
                      <div key={group} className="space-y-2">
                        <h4 className="font-semibold capitalize">{group}</h4>
                        {exercises.map((exercise: any) => (
                          <div key={exercise.name} className="flex items-center space-x-2">
                            <Checkbox
                              id={exercise.name}
                              checked={selectedExercises.includes(exercise.name)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedExercises([...selectedExercises, exercise.name]);
                                } else {
                                  setSelectedExercises(selectedExercises.filter(name => name !== exercise.name));
                                }
                              }}
                            />
                            <label
                              htmlFor={exercise.name}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {exercise.name} ({exercise.sets} sets × {exercise.reps})
                            </label>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => onOpenChange(false)}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateWorkout}
                  disabled={!newWorkout.name || selectedExercises.length === 0}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Workout
                </Button>
              </div>
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};
