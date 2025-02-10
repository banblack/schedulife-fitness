import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Search, CalendarIcon, CalendarRange, Dumbbell, Plus, Save, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";

// Preset workouts database
const presetWorkouts = {
  chest: [
    { name: "Bench Press", sets: 4, reps: "8-12", equipment: "Barbell" },
    { name: "Incline Dumbbell Press", sets: 3, reps: "10-12", equipment: "Dumbbells" },
    { name: "Push-Ups", sets: 3, reps: "15-20", equipment: "Bodyweight" },
  ],
  back: [
    { name: "Pull-Ups", sets: 4, reps: "8-12", equipment: "Bodyweight" },
    { name: "Barbell Rows", sets: 3, reps: "10-12", equipment: "Barbell" },
    { name: "Lat Pulldowns", sets: 3, reps: "12-15", equipment: "Cable Machine" },
  ],
  legs: [
    { name: "Squats", sets: 4, reps: "8-12", equipment: "Barbell" },
    { name: "Romanian Deadlifts", sets: 3, reps: "10-12", equipment: "Barbell" },
    { name: "Leg Press", sets: 3, reps: "12-15", equipment: "Machine" },
  ],
  shoulders: [
    { name: "Military Press", sets: 4, reps: "8-12", equipment: "Barbell" },
    { name: "Lateral Raises", sets: 3, reps: "12-15", equipment: "Dumbbells" },
    { name: "Face Pulls", sets: 3, reps: "15-20", equipment: "Cable" },
  ],
  arms: [
    { name: "Bicep Curls", sets: 3, reps: "10-12", equipment: "Dumbbells" },
    { name: "Tricep Pushdowns", sets: 3, reps: "12-15", equipment: "Cable" },
    { name: "Hammer Curls", sets: 3, reps: "10-12", equipment: "Dumbbells" },
  ],
  core: [
    { name: "Planks", sets: 3, reps: "30-60s", equipment: "Bodyweight" },
    { name: "Crunches", sets: 3, reps: "15-20", equipment: "Bodyweight" },
    { name: "Russian Twists", sets: 3, reps: "20 each side", equipment: "Weight Plate" },
  ],
};

// Preset configurations for different experience levels
const presetConfigurations = {
  beginner: {
    name: "Beginner Program",
    description: "Perfect for those just starting their fitness journey. Focus on form and building basic strength.",
    weeklySchedule: [
      { day: "Monday", focus: "Full Body", intensity: "Light" },
      { day: "Wednesday", focus: "Full Body", intensity: "Light" },
      { day: "Friday", focus: "Full Body", intensity: "Light" },
    ],
    recommendedExercises: {
      "Full Body": [
        { name: "Push-Ups", sets: 2, reps: "8-10", equipment: "Bodyweight" },
        { name: "Squats", sets: 2, reps: "10-12", equipment: "Bodyweight" },
        { name: "Pull-Ups (assisted)", sets: 2, reps: "5-8", equipment: "Pull-up Bar" },
      ]
    }
  },
  amateur: {
    name: "Amateur Program",
    description: "For those with some experience. Introduces split routines and progressive overload.",
    weeklySchedule: [
      { day: "Monday", focus: "Upper Body", intensity: "Moderate" },
      { day: "Tuesday", focus: "Lower Body", intensity: "Moderate" },
      { day: "Thursday", focus: "Upper Body", intensity: "Moderate" },
      { day: "Friday", focus: "Lower Body", intensity: "Moderate" },
    ],
    recommendedExercises: {
      "Upper Body": [
        { name: "Bench Press", sets: 3, reps: "8-12", equipment: "Barbell" },
        { name: "Rows", sets: 3, reps: "10-12", equipment: "Barbell" },
      ],
      "Lower Body": [
        { name: "Squats", sets: 3, reps: "8-12", equipment: "Barbell" },
        { name: "Romanian Deadlifts", sets: 3, reps: "10-12", equipment: "Barbell" },
      ]
    }
  },
  pro: {
    name: "Pro Program",
    description: "Advanced program with high volume and intensity. For experienced lifters.",
    weeklySchedule: [
      { day: "Monday", focus: "Push", intensity: "High" },
      { day: "Tuesday", focus: "Pull", intensity: "High" },
      { day: "Wednesday", focus: "Legs", intensity: "High" },
      { day: "Friday", focus: "Push", intensity: "High" },
      { day: "Saturday", focus: "Pull", intensity: "High" },
      { day: "Sunday", focus: "Legs", intensity: "High" },
    ],
    recommendedExercises: {
      "Push": [
        { name: "Bench Press", sets: 4, reps: "6-8", equipment: "Barbell" },
        { name: "Military Press", sets: 4, reps: "8-10", equipment: "Barbell" },
      ],
      "Pull": [
        { name: "Pull-Ups", sets: 4, reps: "8-12", equipment: "Bodyweight" },
        { name: "Barbell Rows", sets: 4, reps: "8-10", equipment: "Barbell" },
      ],
      "Legs": [
        { name: "Squats", sets: 4, reps: "6-8", equipment: "Barbell" },
        { name: "Deadlifts", sets: 4, reps: "6-8", equipment: "Barbell" },
      ]
    }
  }
};

interface CustomWorkout {
  name: string;
  description: string;
  exercises: {
    name: string;
    sets: number;
    reps: string;
    equipment: string;
  }[];
}

const Schedule = () => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<keyof typeof presetWorkouts | null>(null);
  const [customWorkouts, setCustomWorkouts] = useState<CustomWorkout[]>([]);
  const [newWorkout, setNewWorkout] = useState<CustomWorkout>({
    name: "",
    description: "",
    exercises: []
  });
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<keyof typeof presetConfigurations | null>(null);
  
  const workouts = {
    "2024-04-15": { type: "Cardio", description: "30min run" },
    "2024-04-10": { type: "Strength", description: "Upper body" },
  };

  const handleCreateWorkout = () => {
    if (!newWorkout.name) {
      toast({
        title: "Error",
        description: "Please provide a workout name",
        variant: "destructive"
      });
      return;
    }
    
    if (selectedExercises.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one exercise",
        variant: "destructive"
      });
      return;
    }

    const selectedWorkoutExercises = Object.values(presetWorkouts)
      .flat()
      .filter(exercise => selectedExercises.includes(exercise.name));

    const workoutToAdd = {
      ...newWorkout,
      exercises: selectedWorkoutExercises
    };

    setCustomWorkouts([...customWorkouts, workoutToAdd]);
    setNewWorkout({ name: "", description: "", exercises: [] });
    setSelectedExercises([]);
    
    toast({
      title: "Success",
      description: "Workout created successfully",
    });
  };

  const handlePresetSelect = (preset: keyof typeof presetConfigurations) => {
    setSelectedPreset(preset);
    const config = presetConfigurations[preset];
    
    // Create a new workout based on the preset configuration
    const presetExercises = Object.values(config.recommendedExercises)
      .flat()
      .map(exercise => ({
        name: exercise.name,
        sets: exercise.sets,
        reps: exercise.reps,
        equipment: exercise.equipment
      }));

    setNewWorkout({
      name: config.name,
      description: config.description,
      exercises: presetExercises
    });
  };

  const selectedDayWorkout = date 
    ? workouts[format(date, 'yyyy-MM-dd')] 
    : null;

  const filteredExercises = selectedMuscleGroup 
    ? presetWorkouts[selectedMuscleGroup].filter(exercise => 
        exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="container px-4 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <CalendarIcon className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-gray-900">Weekly Schedule</h1>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Workout
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Create Custom Workout</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-4">
                <div className="space-y-4">
                  <Label>Choose Experience Level</Label>
                  <RadioGroup
                    onValueChange={(value) => handlePresetSelect(value as keyof typeof presetConfigurations)}
                    className="grid grid-cols-3 gap-4"
                  >
                    {Object.entries(presetConfigurations).map(([key, config]) => (
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
                    placeholder="e.g., Full Body Workout"
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
                      {presetConfigurations[selectedPreset].weeklySchedule.map((day, index) => (
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
                  <Label>Select Additional Exercises</Label>
                  <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                    <div className="space-y-4">
                      {Object.entries(presetWorkouts).map(([group, exercises]) => (
                        <div key={group} className="space-y-2">
                          <h4 className="font-semibold capitalize">{group}</h4>
                          {exercises.map((exercise) => (
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
                    onClick={handleCreateWorkout} 
                    disabled={!newWorkout.name || selectedExercises.length === 0}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Workout
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <CalendarRange className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold">This Week</h2>
          </div>
          {days.map((day) => (
            <Card key={day} className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <span className="font-medium w-28">{day}</span>
                  <div className="h-6 w-px bg-gray-200" />
                  <span className="text-neutral">Rest Day</span>
                </div>
                <button className="text-primary hover:text-primary/80 transition-colors">
                  Add Workout
                </button>
              </div>
            </Card>
          ))}
        </div>

        <div className="space-y-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Search className="w-6 h-6 text-gray-500" />
              <Input
                type="text"
                placeholder="Search exercises..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
            </div>
            
            <Card className="p-4">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />

              {selectedDayWorkout && (
                <div className="mt-4 p-4 bg-primary/5 rounded-lg">
                  <h3 className="font-medium mb-2">
                    Workout on {date ? format(date, 'MMMM d, yyyy') : ''}
                  </h3>
                  <p className="text-sm text-neutral">
                    {selectedDayWorkout.type} - {selectedDayWorkout.description}
                  </p>
                </div>
              )}
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Dumbbell className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-semibold">Exercise Library</h2>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {Object.keys(presetWorkouts).map((muscleGroup) => (
                  <Badge
                    key={muscleGroup}
                    variant={selectedMuscleGroup === muscleGroup ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setSelectedMuscleGroup(muscleGroup as keyof typeof presetWorkouts)}
                  >
                    {muscleGroup.charAt(0).toUpperCase() + muscleGroup.slice(1)}
                  </Badge>
                ))}
              </div>

              {selectedMuscleGroup && (
                <div className="space-y-3">
                  {filteredExercises.map((exercise, index) => (
                    <Card key={index} className="p-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">{exercise.name}</h3>
                          <p className="text-sm text-neutral">
                            {exercise.sets} sets × {exercise.reps}
                          </p>
                        </div>
                        <Badge variant="secondary">{exercise.equipment}</Badge>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      {customWorkouts.length > 0 && (
        <div className="mt-8 space-y-6">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Dumbbell className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-semibold">My Workouts</h2>
            </div>
            <div className="space-y-3">
              {customWorkouts.map((workout, index) => (
                <Card key={index} className="p-4">
                  <h3 className="font-semibold">{workout.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{workout.description}</p>
                  <div className="space-y-2">
                    {workout.exercises.map((exercise, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <span>{exercise.name}</span>
                        <span className="text-muted-foreground">
                          {exercise.sets} sets × {exercise.reps}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Schedule;
