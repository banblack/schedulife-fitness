
import { formatDistance } from "date-fns";
import { Activity, Flame, TrendingUp, Dumbbell } from "lucide-react";
import { useUserStats } from "@/components/dashboard/useUserStats";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentWorkouts } from "@/components/dashboard/RecentWorkouts";
import { RecommendedWorkouts } from "@/components/dashboard/RecommendedWorkouts";
import { Achievements } from "@/components/dashboard/Achievements";
import { WorkoutStatistics } from "@/components/schedule/WorkoutStatistics";
import { ProgressChart } from "@/components/schedule/ProgressChart";

const Dashboard = () => {
  const { stats, recentWorkouts, recommendedWorkouts, loading } = useUserStats();
  
  return (
    <div className="container px-4 py-8 animate-fade-in bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Your Fitness Dashboard</h1>
        {stats.lastWorkout && (
          <p className="text-muted-foreground">
            Last workout: {formatDistance(new Date(stats.lastWorkout), new Date(), { addSuffix: true })}
          </p>
        )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={Activity}
          iconColor="text-primary"
          iconBgColor="bg-primary/10"
          title="Total Workouts"
          value={stats.totalWorkouts}
        />

        <StatCard
          icon={Flame}
          iconColor="text-orange-500"
          iconBgColor="bg-orange-500/20"
          title="Current Streak"
          value={`${stats.streak} days`}
        />

        <StatCard
          icon={TrendingUp}
          iconColor="text-green-500"
          iconBgColor="bg-green-500/20"
          title="Progress"
          value="+12%"
          subtitle="vs. last month"
        />

        <StatCard
          icon={Dumbbell}
          iconColor="text-secondary-foreground"
          iconBgColor="bg-secondary/20"
          title="Favorite Workout"
          value={stats.favoriteWorkout || "None yet"}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div>
          <RecentWorkouts workouts={recentWorkouts} />
          <WorkoutStatistics />
        </div>
        
        <div className="space-y-6">
          <ProgressChart />
          <RecommendedWorkouts workouts={recommendedWorkouts} />
        </div>
      </div>
      
      <Achievements streak={stats.streak} />
    </div>
  );
};

export default Dashboard;
