
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Search, CalendarIcon } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { WeeklySchedule } from "@/components/schedule/WeeklySchedule";
import { ExerciseLibrary } from "@/components/schedule/ExerciseLibrary";
import { WorkoutCreationDialog } from "@/components/schedule/WorkoutCreationDialog";
import { CustomWorkoutsList } from "@/components/schedule/CustomWorkoutsList";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  
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

  return (
    <div className="container px-4 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <CalendarIcon className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-gray-900">Weekly Schedule</h1>
        </div>
        <WorkoutCreationDialog
          presetConfigurations={presetConfigurations}
          presetWorkouts={presetWorkouts}
          selectedExercises={selectedExercises}
          newWorkout={newWorkout}
          selectedPreset={selectedPreset}
          onPresetSelect={handlePresetSelect}
          onWorkoutChange={setNewWorkout}
          onExercisesChange={setSelectedExercises}
          onCreateWorkout={handleCreateWorkout}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <WeeklySchedule days={days} />

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

            <ExerciseLibrary
              presetWorkouts={presetWorkouts}
              selectedType={selectedType}
              onTypeSelect={(type: keyof typeof presetWorkouts) => setSelectedType(type)}
              searchQuery={searchQuery}
            />
          </div>
        </div>
      </div>

      <CustomWorkoutsList workouts={customWorkouts} />
    </div>
  );
};

export default Schedule;
