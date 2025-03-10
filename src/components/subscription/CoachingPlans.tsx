
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Trophy, Target, Calendar, MessageSquare, Heart, Star, Shield, Zap } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const CoachingPlans = () => {
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');
  const { toast } = useToast();

  const plans = [
    {
      name: "Basic Coaching",
      description: "Perfect for beginners starting their fitness journey",
      monthlyPrice: 49,
      yearlyPrice: 470,
      features: [
        "1 Personal coaching session/month",
        "Basic workout plan",
        "Email support",
        "Progress tracking",
        "Access to workout library"
      ],
      popular: false,
      icon: <Shield className="w-5 h-5" />,
      trialDays: 7,
      color: "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200"
    },
    {
      name: "Pro Coaching",
      description: "Ideal for dedicated fitness enthusiasts",
      monthlyPrice: 99,
      yearlyPrice: 950,
      features: [
        "4 Personal coaching sessions/month",
        "Customized workout plan",
        "Nutrition guidance",
        "24/7 chat support",
        "Video form check",
        "Monthly progress reviews",
        "Custom meal plans"
      ],
      popular: true,
      icon: <Star className="w-5 h-5" />,
      trialDays: 14,
      color: "bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20"
    },
    {
      name: "Elite Coaching",
      description: "For those seeking maximum results",
      monthlyPrice: 199,
      yearlyPrice: 1900,
      features: [
        "8 Personal coaching sessions/month",
        "Advanced personalized workout plan",
        "Detailed nutrition & meal planning",
        "Priority 24/7 support",
        "Progress tracking & analysis",
        "Weekly video calls",
        "Competition preparation",
        "Recovery protocols",
        "Sport-specific training"
      ],
      popular: false,
      icon: <Zap className="w-5 h-5" />,
      trialDays: 14,
      color: "bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200"
    }
  ];

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
      <div className="flex justify-center gap-4 items-center">
        <button
          onClick={() => setBillingInterval('monthly')}
          className={`px-6 py-2 rounded-xl transition-colors ${
            billingInterval === 'monthly'
              ? 'bg-primary text-white shadow-md'
              : 'bg-muted hover:bg-gray-200'
          }`}
        >
          Monthly
        </button>
        <button
          onClick={() => setBillingInterval('yearly')}
          className={`px-6 py-2 rounded-xl transition-colors ${
            billingInterval === 'yearly'
              ? 'bg-primary text-white shadow-md'
              : 'bg-muted hover:bg-gray-200'
          }`}
        >
          Yearly
          <Badge variant="secondary" className="ml-2 bg-accent text-white">
            Save 20%
          </Badge>
        </button>
      </div>
      
      <div className="grid gap-8 md:grid-cols-3">
        {plans.map((plan) => (
          <Card 
            key={plan.name} 
            className={`relative overflow-hidden transition-all hover:shadow-lg ${plan.color} ${
              plan.popular ? 'ring-2 ring-primary shadow-lg scale-105' : ''
            }`}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0 w-20 h-20">
                <div className="absolute transform rotate-45 bg-primary text-white text-xs font-semibold py-1 right-[-35px] top-[32px] w-[170px] text-center">
                  POPULAR
                </div>
              </div>
            )}
            
            <CardHeader>
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-full bg-white text-primary">
                  {plan.icon}
                </div>
                <CardTitle className="text-lg">{plan.name}</CardTitle>
              </div>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-4xl font-bold text-secondary">
                  ${billingInterval === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                  <span className="text-sm font-normal text-muted-foreground">
                    /{billingInterval === 'monthly' ? 'mo' : 'yr'}
                  </span>
                </p>
                <p className="text-sm text-primary font-medium mt-1">
                  {plan.trialDays} days free trial
                </p>
              </div>
              
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="mt-0.5">
                      <Check className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            
            <CardFooter className="flex flex-col gap-3 pt-4">
              <Button 
                className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 py-6 rounded-xl text-white"
                onClick={() => handleStartTrial(plan.name, plan.trialDays)}
              >
                Start {plan.trialDays}-Day Free Trial
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                No credit card required • Cancel anytime
              </p>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Features Section */}
      <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="fitness-card p-6">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <Calendar className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Flexible Scheduling</h3>
          <p className="text-sm text-muted-foreground">Book sessions at your convenience with our easy scheduling system</p>
        </div>
        
        <div className="fitness-card p-6">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <MessageSquare className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Direct Communication</h3>
          <p className="text-sm text-muted-foreground">Stay connected with your coach through our messaging platform</p>
        </div>
        
        <div className="fitness-card p-6">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <Target className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Custom Programs</h3>
          <p className="text-sm text-muted-foreground">Get workout plans tailored to your specific goals and needs</p>
        </div>
        
        <div className="fitness-card p-6">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <Heart className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Expert Support</h3>
          <p className="text-sm text-muted-foreground">Access to certified coaches who care about your success</p>
        </div>
      </div>
    </div>
  );
};

export default CoachingPlans;
