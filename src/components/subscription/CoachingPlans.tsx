
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, Trophy, Target, Dumbbell, Calendar, MessageSquare, Clock, Heart } from "lucide-react";

const CoachingPlans = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Trophy className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-semibold">Premium Coaching Plans</h2>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Basic Plan */}
        <Card className="relative overflow-hidden transition-transform hover:scale-105">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent" />
          <CardHeader>
            <CardTitle>Basic Coaching</CardTitle>
            <CardDescription>Perfect for beginners starting their fitness journey</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-3xl font-bold">$49<span className="text-sm font-normal">/month</span></p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                <span>1 Personal coaching session/month</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                <span>Basic workout plan</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                <span>Email support</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90">
              Get Started
            </Button>
          </CardFooter>
        </Card>

        {/* Pro Plan */}
        <Card className="relative overflow-hidden transition-transform hover:scale-105 border-primary/20 shadow-lg">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent" />
          <div className="absolute top-4 right-4 bg-primary text-white text-xs px-2 py-1 rounded-full">
            Popular
          </div>
          <CardHeader>
            <CardTitle>Pro Coaching</CardTitle>
            <CardDescription>Ideal for dedicated fitness enthusiasts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-3xl font-bold">$99<span className="text-sm font-normal">/month</span></p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                <span>4 Personal coaching sessions/month</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                <span>Customized workout plan</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                <span>Nutrition guidance</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                <span>24/7 chat support</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90">
              Get Started
            </Button>
          </CardFooter>
        </Card>

        {/* Elite Plan */}
        <Card className="relative overflow-hidden transition-transform hover:scale-105">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent" />
          <CardHeader>
            <CardTitle>Elite Coaching</CardTitle>
            <CardDescription>For those seeking maximum results</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-3xl font-bold">$199<span className="text-sm font-normal">/month</span></p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                <span>8 Personal coaching sessions/month</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                <span>Advanced personalized workout plan</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                <span>Detailed nutrition & meal planning</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                <span>Priority 24/7 support</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                <span>Progress tracking & analysis</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90">
              Get Started
            </Button>
          </CardFooter>
        </Card>
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
