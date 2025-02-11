
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
  volleyball: [
    { name: "Vertical Jump Training", sets: 4, reps: "8-12", equipment: "Box/Platform" },
    { name: "Shoulder Stability", sets: 3, reps: "12-15", equipment: "Resistance Bands" },
    { name: "Agility Drills", sets: 3, reps: "30s each", equipment: "Cones" },
    { name: "Explosive Power", sets: 4, reps: "6-8", equipment: "Medicine Ball" },
    { name: "Core Stability", sets: 3, reps: "15-20", equipment: "Mat" }
  ],
  strength: [
    { name: "Bench Press", sets: 4, reps: "8-12", equipment: "Barbell" },
    { name: "Squats", sets: 4, reps: "8-12", equipment: "Barbell" },
    { name: "Deadlifts", sets: 3, reps: "8-10", equipment: "Barbell" }
  ],
  cardio: [
    { name: "HIIT", sets: 1, reps: "20min", equipment: "None" },
    { name: "Jump Rope", sets: 3, reps: "5min", equipment: "Jump Rope" },
    { name: "Sprint Intervals", sets: 5, reps: "30s/30s", equipment: "None" }
  ]
};

// Preset configurations for different experience levels
const presetConfigurations = {
  beginner: {
    name: "Beginner Volleyball Program",
    description: "Perfect for those just starting volleyball training. Focus on fundamentals and building basic strength.",
    weeklySchedule: [
      { day: "Monday", focus: "Basic Skills", intensity: "Light" },
      { day: "Wednesday", focus: "Strength", intensity: "Light" },
      { day: "Friday", focus: "Cardio", intensity: "Light" }
    ]
  },
  intermediate: {
    name: "Intermediate Volleyball Program",
    description: "For players with some experience. Focuses on skill development and conditioning.",
    weeklySchedule: [
      { day: "Monday", focus: "Skills & Drills", intensity: "Moderate" },
      { day: "Tuesday", focus: "Strength", intensity: "Moderate" },
      { day: "Thursday", focus: "Power & Agility", intensity: "High" },
      { day: "Friday", focus: "Match Practice", intensity: "Moderate" }
    ]
  },
  advanced: {
    name: "Advanced Volleyball Program",
    description: "High-intensity program for competitive players.",
    weeklySchedule: [
      { day: "Monday", focus: "Skills & Strategy", intensity: "High" },
      { day: "Tuesday", focus: "Power", intensity: "High" },
      { day: "Wednesday", focus: "Recovery & Technique", intensity: "Light" },
      { day: "Thursday", focus: "Speed & Agility", intensity: "High" },
      { day: "Friday", focus: "Match Simulation", intensity: "High" },
      { day: "Saturday", focus: "Conditioning", intensity: "Moderate" }
    ]
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
  const [selectedType, setSelectedType] = useState<keyof typeof presetWorkouts | null>(null);
  const [customWorkouts, setCustomWorkouts] = useState<CustomWorkout[]>([]);
  const [newWorkout, setNewWorkout] = useState<CustomWorkout>({
    name: "",
    description: "",
    exercises: []
  });
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<keyof typeof presetConfigurations | null>(null);
  
  const workouts = {
    "2024-04-15": { type: "Volleyball", description: "Skills training" },
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
    
    setNewWorkout({
      name: config.name,
      description: config.description,
      exercises: []
    });
  };

  const selectedDayWorkout = date 
    ? workouts[format(date, 'yyyy-MM-dd')] 
    : null;

  const filteredExercises = selectedType 
    ? presetWorkouts[selectedType].filter(exercise => 
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
                    <Label>Select Exercises</Label>
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
            </div>
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
                {Object.keys(presetWorkouts).map((type) => (
                  <Badge
                    key={type}
                    variant={selectedType === type ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setSelectedType(type as keyof typeof presetWorkouts)}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Badge>
                ))}
              </div>

              {selectedType && (
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
        <div className="mt-8">
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
