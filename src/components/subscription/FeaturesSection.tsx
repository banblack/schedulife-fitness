
import { Calendar, MessageSquare, Target, Heart } from "lucide-react";
import FeatureCard from "./FeatureCard";

const FeaturesSection = () => {
  return (
    <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <FeatureCard 
        icon={Calendar}
        title="Flexible Scheduling"
        description="Book sessions at your convenience with our easy scheduling system"
      />
      
      <FeatureCard 
        icon={MessageSquare}
        title="Direct Communication"
        description="Stay connected with your coach through our messaging platform"
      />
      
      <FeatureCard 
        icon={Target}
        title="Custom Programs"
        description="Get workout plans tailored to your specific goals and needs"
      />
      
      <FeatureCard 
        icon={Heart}
        title="Expert Support"
        description="Access to certified coaches who care about your success"
      />
    </div>
  );
};

export default FeaturesSection;
