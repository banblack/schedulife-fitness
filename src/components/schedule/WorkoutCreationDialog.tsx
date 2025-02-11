
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
import { Plus, Save, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface WorkoutCreationDialogProps {
  presetConfigurations: any;
  presetWorkouts: any;
  selectedExercises: string[];
  newWorkout: any;
  selectedPreset: string | null;
  onPresetSelect: (preset: string) => void;
  onWorkoutChange: (workout: any) => void;
  onExercisesChange: (exercises: string[]) => void;
  onCreateWorkout: () => void;
}

export const WorkoutCreationDialog = ({
  presetConfigurations,
  presetWorkouts,
  selectedExercises,
  newWorkout,
  selectedPreset,
  onPresetSelect,
  onWorkoutChange,
  onExercisesChange,
  onCreateWorkout
}: WorkoutCreationDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Workout
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Custom Workout</DialogTitle>
        </DialogHeader>
        <div className="h-[600px] overflow-hidden">
          <ScrollArea className="h-full pr-4">
            <div className="space-y-4">
              <div className="space-y-4">
                <Label>Choose Level</Label>
                <RadioGroup
                  onValueChange={onPresetSelect}
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
                  onChange={(e) => onWorkoutChange({ ...newWorkout, name: e.target.value })}
                  placeholder="e.g., Volleyball Skills Training"
                />
              </div>
              <div>
                <Label htmlFor="workout-description">Description</Label>
                <Textarea
                  id="workout-description"
                  value={newWorkout.description}
                  onChange={(e) => onWorkoutChange({ ...newWorkout, description: e.target.value })}
                  placeholder="Describe your workout..."
                />
              </div>

              {selectedPreset && (
                <div className="space-y-4">
                  <Label>Recommended Schedule</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {presetConfigurations[selectedPreset].weeklySchedule.map((day: any, index: number) => (
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
                                  onExercisesChange([...selectedExercises, exercise.name]);
                                } else {
                                  onExercisesChange(selectedExercises.filter(name => name !== exercise.name));
                                }
                              }}
                            />
                            <label
                              htmlFor={exercise.name}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {exercise.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
              <div className="flex justify-end gap-2">
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </DialogTrigger>
                <Button 
                  onClick={onCreateWorkout} 
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
