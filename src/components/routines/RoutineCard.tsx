
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { RoutineWithExercises } from '@/types/workout';

interface RoutineCardProps {
  routine: RoutineWithExercises;
  onEdit: (routine: RoutineWithExercises) => void;
  onDelete: (routineId: string) => void;
}

export const RoutineCard = ({ routine, onEdit, onDelete }: RoutineCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="truncate">{routine.name}</span>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(routine)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(routine.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground line-clamp-2 mb-4">
          {routine.description}
        </p>
        <div className="space-y-2">
          {routine.exercises.length > 0 ? (
            routine.exercises.map((exercise) => (
              <div
                key={exercise.id}
                className="text-sm flex justify-between items-center py-1 border-b last:border-0"
              >
                <span>{exercise.name}</span>
                <span className="text-muted-foreground">
                  {exercise.sets}x{exercise.reps} - {exercise.day_of_week}
                </span>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              No hay ejercicios en esta rutina
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
