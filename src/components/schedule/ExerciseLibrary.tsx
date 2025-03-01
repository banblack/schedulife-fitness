
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, Search } from "lucide-react";
import { Exercise } from "@/types/exercise";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export interface ExerciseLibraryProps {
  presetWorkouts?: Record<string, Exercise[]>;
  selectedType: string | null;
  onTypeSelect: (type: string) => void;
  searchQuery: string;
}

export const ExerciseLibrary = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  
  // Sample preset workouts for demonstration
  const presetWorkouts: Record<string, Exercise[]> = {
    "strength": [
      {
        name: "Bench Press",
        sets: 3,
        reps: "8-12",
        equipment: "Barbell",
        type: "strength",
        difficulty: "intermediate",
        muscleGroup: "Chest"
      },
      {
        name: "Squats",
        sets: 4,
        reps: "6-8",
        equipment: "Barbell",
        type: "strength",
        difficulty: "intermediate",
        muscleGroup: "Legs"
      }
    ],
    "cardio": [
      {
        name: "HIIT Treadmill",
        sets: 1,
        reps: "20 min",
        equipment: "Treadmill",
        type: "cardio",
        difficulty: "advanced",
        muscleGroup: "Full Body"
      }
    ],
    "volleyball": [
      {
        name: "Vertical Jump Training",
        sets: 4,
        reps: "8-10",
        equipment: "None",
        type: "volleyball",
        difficulty: "intermediate",
        muscleGroup: "Legs"
      },
      {
        name: "Serving Drills",
        sets: 3,
        reps: "10 serves",
        equipment: "Volleyball",
        type: "volleyball",
        difficulty: "beginner",
        muscleGroup: "Arms, Shoulders"
      }
    ]
  };

  const handleTypeSelect = (type: string) => {
    setSelectedType(selectedType === type ? null : type);
  };

  const filteredExercises = selectedType
    ? presetWorkouts[selectedType].filter(exercise => 
        exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exercise.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exercise.muscleGroup?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Dumbbell className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">Exercise Library</h3>
      </div>
      
      <div className="relative mb-4">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search exercises..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {Object.keys(presetWorkouts).map((type) => (
          <Badge
            key={type}
            variant={selectedType === type ? "default" : "outline"}
            className="cursor-pointer capitalize"
            onClick={() => handleTypeSelect(type)}
          >
            {type}
          </Badge>
        ))}
      </div>

      {selectedType && (
        <ScrollArea className="h-[300px]">
          <div className="space-y-3">
            {filteredExercises.length > 0 ? (
              filteredExercises.map((exercise, index) => (
                <Card key={index} className="p-3">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{exercise.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {exercise.sets} sets × {exercise.reps}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="secondary">{exercise.equipment}</Badge>
                        <Badge className={getDifficultyColor(exercise.difficulty)}>
                          {exercise.difficulty}
                        </Badge>
                      </div>
                    </div>
                    {exercise.description && (
                      <p className="text-sm text-muted-foreground">
                        {exercise.description}
                      </p>
                    )}
                    {exercise.muscleGroup && (
                      <p className="text-xs text-muted-foreground">
                        Target: {exercise.muscleGroup}
                      </p>
                    )}
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-4">
                No exercises found matching your search.
              </div>
            )}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};
