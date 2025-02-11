
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dumbbell } from "lucide-react";

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  equipment: string;
}

interface ExerciseLibraryProps {
  presetWorkouts: Record<string, Exercise[]>;
  selectedType: string | null;
  onTypeSelect: (type: string) => void;
  searchQuery: string;
}

export const ExerciseLibrary = ({ 
  presetWorkouts, 
  selectedType, 
  onTypeSelect,
  searchQuery 
}: ExerciseLibraryProps) => {
  const filteredExercises = selectedType 
    ? presetWorkouts[selectedType].filter(exercise => 
        exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
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
            onClick={() => onTypeSelect(type)}
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
  );
};
