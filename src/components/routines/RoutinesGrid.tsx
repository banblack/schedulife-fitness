
import React from 'react';
import { RoutineCard } from './RoutineCard';
import { RoutineWithExercises } from '@/types/workout';

interface RoutinesGridProps {
  routines: RoutineWithExercises[];
  onEdit: (routine: RoutineWithExercises) => void;
  onDelete: (routineId: string) => void;
}

export const RoutinesGrid = ({ routines, onEdit, onDelete }: RoutinesGridProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {routines.map((routine) => (
        <RoutineCard 
          key={routine.id} 
          routine={routine} 
          onEdit={onEdit} 
          onDelete={onDelete} 
        />
      ))}
    </div>
  );
};
