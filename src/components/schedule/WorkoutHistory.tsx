
import { useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Calendar, Clock, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useWorkoutTracking } from '@/hooks/useWorkoutTracking';

export const WorkoutHistory = () => {
  const { workoutHistory, loadWorkoutHistory, removeWorkout, isLoading } = useWorkoutTracking();
  
  useEffect(() => {
    loadWorkoutHistory();
  }, []);
  
  if (isLoading && workoutHistory.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Workout History</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }
  
  if (workoutHistory.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Workout History</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">No workout history yet</p>
          <p className="text-sm text-muted-foreground mt-2">
            Complete a workout to see your history here
          </p>
        </CardContent>
      </Card>
    );
  }
  
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this workout?')) {
      await removeWorkout(id);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Workout History</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <Accordion type="multiple" className="space-y-4">
            {workoutHistory.map((session) => (
              <AccordionItem key={session.id} value={session.id!} className="border rounded-lg p-2">
                <AccordionTrigger className="hover:no-underline px-2">
                  <div className="flex flex-col items-start text-left">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{format(new Date(session.date), 'PP')}</span>
                      {session.completed ? (
                        <Badge variant="success" className="ml-2 bg-green-100 text-green-800">
                          Completed
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="ml-2">
                          Partial
                        </Badge>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground mt-1">
                      {session.exercises.length} exercises • {session.duration} min
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-2 pt-2">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-2">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">Duration: {session.duration} minutes</span>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-2">Exercises:</h4>
                        <ul className="space-y-2">
                          {session.exercises.map((exercise, index) => (
                            <li key={index} className="flex items-center">
                              {exercise.completed ? (
                                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              ) : (
                                <XCircle className="h-4 w-4 text-gray-400 mr-2" />
                              )}
                              <span className="text-sm">
                                {exercise.name} • {exercise.sets} sets × {exercise.reps}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    {session.notes && (
                      <div>
                        <h4 className="text-sm font-medium mb-1">Notes:</h4>
                        <p className="text-sm text-muted-foreground">{session.notes}</p>
                      </div>
                    )}
                    
                    <div className="flex justify-end">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDelete(session.id!)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
