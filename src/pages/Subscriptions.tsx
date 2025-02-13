
import CoachingPlans from "@/components/subscription/CoachingPlans";
import { Crown } from "lucide-react";

const Subscriptions = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Crown className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Premium Memberships
          </h1>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Transform your fitness journey with personalized coaching, expert guidance, and a supportive community. Choose the plan that best fits your goals.
        </p>
      </div>

      <CoachingPlans />
    </div>
  );
};

export default Subscriptions;
