
import { Card } from "@/components/ui/card";

interface WeeklyScheduleProps {
  days: string[];
}

export const WeeklySchedule = ({ days }: WeeklyScheduleProps) => {
  return (
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
  );
};
