
import { Card } from "@/components/ui/card";
import { Calendar as CalendarIcon } from "lucide-react";

const Schedule = () => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  return (
    <div className="container px-4 py-8 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <CalendarIcon className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold text-gray-900">Weekly Schedule</h1>
      </div>

      <div className="space-y-4">
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
    </div>
  );
};

export default Schedule;
