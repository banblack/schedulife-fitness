
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WorkoutTrackingForm } from '@/components/schedule/WorkoutTrackingForm';
import { WorkoutHistory } from '@/components/schedule/WorkoutHistory';
import { useWorkout } from '@/contexts/WorkoutContext';

const WorkoutTracking = () => {
  const { routines } = useWorkout();
  const [selectedRoutineId, setSelectedRoutineId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('track');

  const selectedRoutine = routines.find(r => r.id === selectedRoutineId);

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Workout Tracking</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="track">Track Workout</TabsTrigger>
          <TabsTrigger value="history">Workout History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="track">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>My Routines</CardTitle>
              </CardHeader>
              <CardContent>
                {routines.length > 0 ? (
                  <div className="space-y-2">
                    {routines.map((routine) => (
                      <div 
                        key={routine.id}
                        onClick={() => setSelectedRoutineId(routine.id)}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedRoutineId === routine.id 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted hover:bg-muted/80'
                        }`}
                      >
                        <h3 className="font-medium">{routine.name}</h3>
                        <p className="text-sm opacity-80 truncate">
                          {routine.exercises.length} exercises
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground">
                    No routines available
                  </p>
                )}
              </CardContent>
            </Card>
            
            <div className="md:col-span-2">
              <WorkoutTrackingForm 
                routineId={selectedRoutine?.id}
                routineName={selectedRoutine?.name}
                exercises={selectedRoutine?.exercises.map(ex => ({
                  name: ex.name,
                  sets: ex.sets,
                  reps: ex.reps
                }))}
                onComplete={() => setActiveTab('history')}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="history">
          <WorkoutHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorkoutTracking;
