
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, Loader2, CheckCircle } from "lucide-react";
import { Exercise } from "@/types/exercise";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

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
  const { data: dbExercises, isLoading } = useQuery({
    queryKey: ['exercises', selectedType],
    queryFn: async () => {
      const query = supabase
        .from('exercises')
        .select('*');
      
      if (selectedType) {
        query.eq('type', selectedType);
      }

      const { data, error } = await query;
      
      if (error) {
        throw error;
      }

      return data as Exercise[];
    }
  });

  // Combine preset workouts with database exercises
  const allExercises = selectedType
    ? [...(presetWorkouts[selectedType] || []), ...(dbExercises || [])]
    : [];

  const filteredExercises = allExercises.filter(exercise => 
    exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exercise.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exercise.muscleGroup?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Dumbbell className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold">Exercise Library</h2>
        </div>
        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading exercises...
          </div>
        )}
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
        <ScrollArea className="h-[400px]">
          <div className="space-y-3">
            {filteredExercises.map((exercise, index) => (
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
                  <div className="flex justify-between items-center">
                    {exercise.videoUrl && (
                      <a 
                        href={exercise.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline"
                      >
                        Watch Tutorial
                      </a>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
    </Card>
  );
};
