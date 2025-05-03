
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useWorkoutTracking, WorkoutSession, WorkoutExercise } from '@/hooks/useWorkoutTracking';
import { PlusCircle, Save, Trash2, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

interface WorkoutTrackingFormProps {
  routineId?: string;
  routineName?: string;
  exercises?: { name: string; sets: number; reps: string }[];
  onComplete?: () => void;
}

export const WorkoutTrackingForm = ({
  routineId,
  routineName,
  exercises = [],
  onComplete
}: WorkoutTrackingFormProps) => {
  const { trackWorkout, isLoading } = useWorkoutTracking();
  
  const [workout, setWorkout] = useState<Partial<WorkoutSession>>({
    routine_id: routineId,
    date: format(new Date(), 'yyyy-MM-dd'),
    duration: 0,
    notes: '',
    completed: false,
    exercises: exercises.map(ex => ({
      name: ex.name,
      sets: ex.sets,
      reps: ex.reps,
      completed: false
    }))
  });
  
  const [newExercise, setNewExercise] = useState<Partial<WorkoutExercise>>({
    name: '',
    sets: 3,
    reps: '10',
    completed: false
  });
  
  const addExercise = () => {
    if (!newExercise.name) {
      toast({
        title: "Error",
        description: "Exercise name is required",
        variant: "destructive",
      });
      return;
    }
    
    setWorkout(prev => ({
      ...prev,
      exercises: [...(prev.exercises || []), newExercise as WorkoutExercise]
    }));
    
    setNewExercise({
      name: '',
      sets: 3,
      reps: '10',
      completed: false
    });
  };
  
  const removeExercise = (index: number) => {
    setWorkout(prev => ({
      ...prev,
      exercises: prev.exercises?.filter((_, i) => i !== index) || []
    }));
  };
  
  const toggleExerciseCompletion = (index: number) => {
    setWorkout(prev => ({
      ...prev,
      exercises: prev.exercises?.map((ex, i) => 
        i === index ? { ...ex, completed: !ex.completed } : ex
      ) || []
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!workout.duration) {
      toast({
        title: "Error",
        description: "Please enter workout duration",
        variant: "destructive",
      });
      return;
    }
    
    if (!workout.exercises?.length) {
      toast({
        title: "Error",
        description: "Please add at least one exercise",
        variant: "destructive",
      });
      return;
    }
    
    const allExercisesCompleted = workout.exercises.every(ex => ex.completed);
    
    const result = await trackWorkout({
      ...workout as WorkoutSession,
      completed: allExercisesCompleted
    });
    
    if (result && onComplete) {
      onComplete();
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">
          {routineName ? `Track: ${routineName}` : 'Track Workout'}
        </CardTitle>
        <CardDescription>
          Record your workout details and progress
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="workout-date">Date</Label>
            <Input
              id="workout-date"
              type="date"
              value={workout.date}
              onChange={e => setWorkout({ ...workout, date: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="workout-duration">
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                Duration (minutes)
              </div>
            </Label>
            <Input
              id="workout-duration"
              type="number"
              min={1}
              value={workout.duration || ''}
              onChange={e => setWorkout({ ...workout, duration: parseInt(e.target.value) })}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Exercises</Label>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Exercise
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Exercise</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="exercise-name">Exercise Name</Label>
                      <Input
                        id="exercise-name"
                        value={newExercise.name}
                        onChange={e => setNewExercise({ ...newExercise, name: e.target.value })}
                        placeholder="e.g., Push Ups"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="exercise-sets">Sets</Label>
                        <Input
                          id="exercise-sets"
                          type="number"
                          min={1}
                          value={newExercise.sets}
                          onChange={e => setNewExercise({ ...newExercise, sets: parseInt(e.target.value) })}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="exercise-reps">Reps</Label>
                        <Input
                          id="exercise-reps"
                          value={newExercise.reps}
                          onChange={e => setNewExercise({ ...newExercise, reps: e.target.value })}
                          placeholder="e.g., 10 or 30 sec"
                        />
                      </div>
                    </div>
                    
                    <Button type="button" onClick={addExercise} className="w-full">
                      Add Exercise
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            {workout.exercises && workout.exercises.length > 0 ? (
              <div className="space-y-2 border rounded-md p-4">
                {workout.exercises.map((exercise, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={exercise.completed}
                        onChange={() => toggleExerciseCompletion(index)}
                        className="mr-2 h-4 w-4"
                      />
                      <span className={exercise.completed ? "line-through text-muted-foreground" : ""}>
                        {exercise.name} - {exercise.sets} sets × {exercise.reps}
                      </span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeExercise(index)}
                      type="button"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">
                No exercises added yet
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="workout-notes">Notes</Label>
            <Textarea
              id="workout-notes"
              value={workout.notes || ''}
              onChange={e => setWorkout({ ...workout, notes: e.target.value })}
              placeholder="How was your workout? Any PRs?"
              rows={3}
            />
          </div>
        </CardContent>
        
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            <Save className="mr-2 h-4 w-4" />
            {isLoading ? 'Saving...' : 'Save Workout'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
