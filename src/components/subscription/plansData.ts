
import { Shield, Star, Zap } from "lucide-react";
import { PlanData } from "./PlanCard";

export const coachingPlans: PlanData[] = [
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
