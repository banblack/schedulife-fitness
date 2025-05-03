
import { useEffect, useState } from "react";
import { useUserStats } from "@/components/dashboard/useUserStats";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { StatsOverview } from "./StatsOverview";
import { GoalsProgress } from "./GoalsProgress";
import { AchievementsSection } from "./AchievementsSection";
import { QuickStartSection } from "./QuickStartSection";
import { RecentActivitySection } from "./RecentActivitySection";

export function WorkoutDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const { stats, recentWorkouts, loading, recommendedWorkouts } = useUserStats();
  
  const handleStartWorkout = (workoutId: string, workoutName: string) => {
    console.log(`Starting workout: ${workoutName}`);
    // Navigate to workout screen or open workout modal
  };
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-8/12 space-y-6">
          <StatsOverview stats={stats} />
          
          <div className="card p-6 border rounded-lg">
            <GoalsProgress stats={stats} />
          </div>
          
          <AchievementsSection stats={stats} />
        </div>

        <div className="lg:w-4/12 space-y-6">
          <QuickStartSection 
            recommendedWorkouts={recommendedWorkouts}
            onStartWorkout={handleStartWorkout}
          />
          
          <RecentActivitySection recentWorkouts={recentWorkouts} />
        </div>
      </div>
    </div>
  );
};
