import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Search, CalendarIcon, Trophy, Activity } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { WeeklySchedule } from "@/components/schedule/WeeklySchedule";
import { ExerciseLibrary } from "@/components/schedule/ExerciseLibrary";
import { WorkoutCreationDialog } from "@/components/schedule/WorkoutCreationDialog";
import { CustomWorkoutsList } from "@/components/schedule/CustomWorkoutsList";
import { useToast } from "@/hooks/use-toast";
import { exercises } from "@/lib/exercises";

// Preset workouts database
const presetWorkouts = exercises;

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

interface WorkoutLog {
  date: string;
  type: string;
  description: string;
  completed: boolean;
  performance?: {
    duration: number;
    intensity: 'Low' | 'Medium' | 'High';
    notes: string;
  };
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  progress: number;
  target: number;
  icon: string;
}

const Schedule = () => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<keyof typeof presetWorkouts | null>(null);
  const [customWorkouts, setCustomWorkouts] = useState<CustomWorkout[]>([]);
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 'first-workout',
      name: 'First Step',
      description: 'Complete your first workout',
      unlocked: false,
      progress: 0,
      target: 1,
      icon: '🎯'
    },
    {
      id: 'workout-streak',
      name: 'Consistency King',
      description: 'Complete workouts 3 days in a row',
      unlocked: false,
      progress: 0,
      target: 3,
      icon: '🔥'
    },
    {
      id: 'volleyball-master',
      name: 'Volleyball Pro',
      description: 'Complete 5 volleyball-specific workouts',
      unlocked: false,
      progress: 0,
      target: 5,
      icon: '🏐'
    }
  ]);
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

  const completeWorkout = (date: string, performance: WorkoutLog['performance']) => {
    const newLog: WorkoutLog = {
      date,
      type: selectedType || 'custom',
      description: 'Workout completed',
      completed: true,
      performance
    };

    setWorkoutLogs(prev => [...prev, newLog]);
    
    // Update achievements
    const newAchievements = [...achievements];
    
    // First workout achievement
    if (!newAchievements[0].unlocked) {
      newAchievements[0].progress = 1;
      newAchievements[0].unlocked = true;
      toast({
        title: "Achievement Unlocked! 🎉",
        description: "You've completed your first workout!",
      });
    }

    // Check for streak achievement
    const recentLogs = workoutLogs
      .filter(log => log.completed)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3);

    if (recentLogs.length === 2 && !newAchievements[1].unlocked) {
      newAchievements[1].progress++;
      if (newAchievements[1].progress >= newAchievements[1].target) {
        newAchievements[1].unlocked = true;
        toast({
          title: "Achievement Unlocked! 🔥",
          description: "You've maintained a 3-day workout streak!",
        });
      }
    }

    // Volleyball master achievement
    if (selectedType === 'volleyball') {
      const volleyballAchievement = newAchievements[2];
      volleyballAchievement.progress++;
      if (volleyballAchievement.progress >= volleyballAchievement.target && !volleyballAchievement.unlocked) {
        volleyballAchievement.unlocked = true;
        toast({
          title: "Achievement Unlocked! 🏐",
          description: "You're now a Volleyball Pro!",
        });
      }
    }

    setAchievements(newAchievements);
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
        <div className="flex items-center gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              <span className="font-medium">
                {achievements.filter(a => a.unlocked).length} Achievements
              </span>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              <span className="font-medium">
                {workoutLogs.length} Workouts
              </span>
            </div>
          </Card>
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
