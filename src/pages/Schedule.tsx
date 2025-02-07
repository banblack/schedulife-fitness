
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Search, CalendarIcon, CalendarRange } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

const Schedule = () => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  
  // Sample workout data - in a real app this would come from your backend
  const workouts = {
    "2024-04-15": { type: "Cardio", description: "30min run" },
    "2024-04-10": { type: "Strength", description: "Upper body" },
    // Add more sample workouts as needed
  };

  const selectedDayWorkout = date 
    ? workouts[format(date, 'yyyy-MM-dd')] 
    : null;

  return (
    <div className="container px-4 py-8 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <CalendarIcon className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold text-gray-900">Weekly Schedule</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left side - Weekly schedule */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <CalendarRange className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold">This Week</h2>
          </div>
          {days.map((day) => (
            <Card key={day} className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <span className="font-medium w-28">{day}</span>
                  <div className="h-6 w-px bg-gray-200" />
                  <span className="text-neutral">Rest Day</span>
                </div>
                <button className="text-primary hover:text-primary/80 transition-colors">
                  Add Workout
                </button>
              </div>
            </Card>
          ))}
        </div>

        {/* Right side - Calendar view */}
        <div className="space-y-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Search className="w-6 h-6 text-gray-500" />
              <Input
                type="text"
                placeholder="Search workouts..."
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
