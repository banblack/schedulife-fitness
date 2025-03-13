
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, LucideIcon } from "lucide-react";
import React from "react";

export interface PlanData {
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  popular: boolean;
  icon: React.ReactNode;
  trialDays: number;
  color: string;
}

interface PlanCardProps {
  plan: PlanData;
  billingInterval: 'monthly' | 'yearly';
  onStartTrial: (planName: string, trialDays: number) => void;
}

const PlanCard = ({ plan, billingInterval, onStartTrial }: PlanCardProps) => {
  return (
    <Card 
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
          onClick={() => onStartTrial(plan.name, plan.trialDays)}
        >
          Start {plan.trialDays}-Day Free Trial
        </Button>
        <p className="text-xs text-center text-muted-foreground">
          No credit card required • Cancel anytime
        </p>
      </CardFooter>
    </Card>
  );
};

export default PlanCard;
