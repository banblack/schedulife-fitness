
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WeeklySchedule } from "@/components/schedule/WeeklySchedule";
import { ExerciseLibrary } from "@/components/schedule/ExerciseLibrary";
import { WorkoutCreationDialog } from "@/components/schedule/WorkoutCreationDialog";
import { CustomWorkoutsList } from "@/components/schedule/CustomWorkoutsList";
import { WorkoutCompletionDialog } from "@/components/schedule/WorkoutCompletionDialog";
import { WorkoutStatistics } from "@/components/schedule/WorkoutStatistics";
import { WorkoutHistory } from "@/components/schedule/WorkoutHistory";
import { ProgressChart } from "@/components/schedule/ProgressChart";
import { CalendarDays, Dumbbell, LineChart, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const Schedule = () => {
  const [isWorkoutCreationOpen, setIsWorkoutCreationOpen] = useState(false);
  const [isWorkoutCompletionOpen, setIsWorkoutCompletionOpen] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<string | null>(null);
  const [selectedWorkoutName, setSelectedWorkoutName] = useState<string>("");

  const handleWorkoutComplete = (workoutId: string, workoutName: string) => {
    setSelectedWorkout(workoutId);
    setSelectedWorkoutName(workoutName);
    setIsWorkoutCompletionOpen(true);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-8/12 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2">
                    <CalendarDays className="h-5 w-5 text-primary" />
                    Weekly Schedule
                  </CardTitle>
                  <CardDescription>
                    Plan and track your weekly workout routine
                  </CardDescription>
                </div>
                <Button onClick={() => setIsWorkoutCreationOpen(true)} size="sm">
                  <Plus className="w-4 h-4 mr-1" /> New Workout
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <WeeklySchedule onWorkoutComplete={handleWorkoutComplete} />
            </CardContent>
          </Card>

          <Tabs defaultValue="history">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="history">Workout History</TabsTrigger>
              <TabsTrigger value="progress">Progress Tracking</TabsTrigger>
            </TabsList>
            <TabsContent value="history" className="pt-4">
              <WorkoutHistory />
            </TabsContent>
            <TabsContent value="progress" className="pt-4">
              <ProgressChart />
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:w-4/12 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5 text-primary" />
                Workout Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <WorkoutStatistics />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Dumbbell className="h-5 w-5 text-primary" />
                Exercise Library
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ExerciseLibrary />
            </CardContent>
          </Card>

          <CustomWorkoutsList onWorkoutComplete={handleWorkoutComplete} />
        </div>
      </div>

      <WorkoutCreationDialog 
        open={isWorkoutCreationOpen} 
        onOpenChange={setIsWorkoutCreationOpen} 
      />
      
      <WorkoutCompletionDialog 
        open={isWorkoutCompletionOpen} 
        onOpenChange={setIsWorkoutCompletionOpen} 
        workoutId={selectedWorkout} 
        workoutName={selectedWorkoutName}
      />
    </div>
  );
};

export default Schedule;
