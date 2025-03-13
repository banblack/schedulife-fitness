
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import BillingToggle from "./BillingToggle";
import PlanCard from "./PlanCard";
import FeaturesSection from "./FeaturesSection";
import { coachingPlans } from "./plansData";

const CoachingPlans = () => {
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');
  const { toast } = useToast();

  const handleStartTrial = (planName: string, trialDays: number) => {
    toast({
      title: "Free Trial Started!",
      description: `Your ${trialDays}-day free trial of ${planName} has begun. Enjoy full access to all features!`,
    });
  };

  return (
    <div className="space-y-10">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-4 gradient-text">
          Premium Coaching Plans
        </h2>
        <p className="text-muted-foreground">
          Take your fitness journey to the next level with personalized guidance from our expert coaches
        </p>
      </div>

      {/* Billing Toggle */}
      <BillingToggle 
        billingInterval={billingInterval} 
        setBillingInterval={setBillingInterval}
      />
      
      <div className="grid gap-8 md:grid-cols-3">
        {coachingPlans.map((plan) => (
          <PlanCard 
            key={plan.name}
            plan={plan}
            billingInterval={billingInterval}
            onStartTrial={handleStartTrial}
          />
        ))}
      </div>

      {/* Features Section */}
      <FeaturesSection />
    </div>
  );
};

export default CoachingPlans;
