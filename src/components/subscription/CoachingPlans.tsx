
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
      trialDays: 7
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
      trialDays: 14
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
      trialDays: 14
    }
  ];

  const handleStartTrial = (planName: string, trialDays: number) => {
    toast({
      title: "Free Trial Started!",
      description: `Your ${trialDays}-day free trial of ${planName} has begun. Enjoy full access to all features!`,
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2">
        <Trophy className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-semibold">Premium Coaching Plans</h2>
      </div>

      {/* Billing Toggle */}
      <div className="flex justify-center gap-4 items-center">
        <button
          onClick={() => setBillingInterval('monthly')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            billingInterval === 'monthly'
              ? 'bg-primary text-white'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          Monthly
        </button>
        <button
          onClick={() => setBillingInterval('yearly')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            billingInterval === 'yearly'
              ? 'bg-primary text-white'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          Yearly
          <Badge variant="secondary" className="ml-2 bg-accent text-white">
            Save 20%
          </Badge>
        </button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card 
            key={plan.name} 
            className={`relative overflow-hidden transition-all hover:scale-105 ${
              plan.popular ? 'border-primary/20 shadow-lg' : ''
            }`}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent" />
            {plan.popular && (
              <div className="absolute top-4 right-4 bg-primary text-white text-xs px-2 py-1 rounded-full">
                Most Popular
              </div>
            )}
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-full bg-primary/10 text-primary">
                  {plan.icon}
                </div>
                <CardTitle>{plan.name}</CardTitle>
              </div>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-3xl font-bold">
                  ${billingInterval === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                  <span className="text-sm font-normal text-muted-foreground">
                    /{billingInterval === 'monthly' ? 'month' : 'year'}
                  </span>
                </p>
                <p className="text-sm text-primary">
                  Try free for {plan.trialDays} days
                </p>
              </div>
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button 
                className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
                onClick={() => handleStartTrial(plan.name, plan.trialDays)}
              >
                Start {plan.trialDays}-Day Free Trial
              </Button>
              <p className="text-xs text-center text-gray-500">
                No credit card required • Cancel anytime
              </p>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Features Section */}
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="p-6 bg-white/50 rounded-xl shadow-sm backdrop-blur-sm">
          <Calendar className="w-8 h-8 text-primary mb-4" />
          <h3 className="text-lg font-semibold mb-2">Flexible Scheduling</h3>
          <p className="text-sm text-gray-600">Book sessions at your convenience with our easy scheduling system</p>
        </div>
        <div className="p-6 bg-white/50 rounded-xl shadow-sm backdrop-blur-sm">
          <MessageSquare className="w-8 h-8 text-primary mb-4" />
          <h3 className="text-lg font-semibold mb-2">Direct Communication</h3>
          <p className="text-sm text-gray-600">Stay connected with your coach through our messaging platform</p>
        </div>
        <div className="p-6 bg-white/50 rounded-xl shadow-sm backdrop-blur-sm">
          <Target className="w-8 h-8 text-primary mb-4" />
          <h3 className="text-lg font-semibold mb-2">Custom Programs</h3>
          <p className="text-sm text-gray-600">Get workout plans tailored to your specific goals and needs</p>
        </div>
        <div className="p-6 bg-white/50 rounded-xl shadow-sm backdrop-blur-sm">
          <Heart className="w-8 h-8 text-primary mb-4" />
          <h3 className="text-lg font-semibold mb-2">Expert Support</h3>
          <p className="text-sm text-gray-600">Access to certified coaches who care about your success</p>
        </div>
      </div>
    </div>
  );
};

export default CoachingPlans;
