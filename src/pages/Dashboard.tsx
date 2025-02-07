
import { Card } from "@/components/ui/card";
import { Activity, Weight, Run } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="container px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Workout Dashboard</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Activity className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-neutral">Daily Activity</p>
              <p className="text-2xl font-semibold">75%</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-secondary/20 rounded-lg">
              <Weight className="w-6 h-6 text-secondary-foreground" />
            </div>
            <div>
              <p className="text-sm text-neutral">Weight Training</p>
              <p className="text-2xl font-semibold">3 sessions</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-accent/10 rounded-lg">
              <Run className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-neutral">Cardio</p>
              <p className="text-2xl font-semibold">5.2 km</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Workouts</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Full Body Workout</h3>
                  <p className="text-sm text-neutral">45 minutes • High Intensity</p>
                </div>
                <span className="text-sm text-neutral">{i} day{i > 1 ? 's' : ''} ago</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
