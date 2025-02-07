
import { Card } from "@/components/ui/card";
import { Activity, Weight, Medal, Trophy, Flame } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
              <Activity className="w-6 h-6 text-accent rotate-45" />
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

      <div className="mt-8">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold text-gray-900">Achievements</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="p-4 hover:shadow-lg transition-shadow bg-gradient-to-br from-primary/5 to-primary/10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-full">
                <Medal className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Consistency Champion</h3>
                <p className="text-sm text-neutral">Completed 5 workouts in a row</p>
              </div>
            </div>
            <div className="mt-3">
              <Badge variant="secondary" className="bg-primary/20 hover:bg-primary/30 text-primary">
                4/5 Days
              </Badge>
            </div>
          </Card>

          <Card className="p-4 hover:shadow-lg transition-shadow bg-gradient-to-br from-orange-500/5 to-orange-500/10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/20 rounded-full">
                <Flame className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <h3 className="font-medium">Calorie Crusher</h3>
                <p className="text-sm text-neutral">Burn 5000 calories this week</p>
              </div>
            </div>
            <div className="mt-3">
              <Badge variant="secondary" className="bg-orange-500/20 hover:bg-orange-500/30 text-orange-500">
                3250/5000 cal
              </Badge>
            </div>
          </Card>

          <Card className="p-4 hover:shadow-lg transition-shadow bg-gradient-to-br from-green-500/5 to-green-500/10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-full">
                <Activity className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <h3 className="font-medium">Cardio Master</h3>
                <p className="text-sm text-neutral">Run 10km this week</p>
              </div>
            </div>
            <div className="mt-3">
              <Badge variant="secondary" className="bg-green-500/20 hover:bg-green-500/30 text-green-500">
                5.2/10 km
              </Badge>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
