
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Dumbbell, Calendar, User, ArrowRight } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Dumbbell className="w-12 h-12 text-primary" />,
      title: "Workout Library",
      description: "Access our comprehensive collection of exercises for every muscle group",
    },
    {
      icon: <Calendar className="w-12 h-12 text-primary" />,
      title: "Schedule Your Training",
      description: "Plan your workouts and track your progress with our easy-to-use calendar",
    },
    {
      icon: <User className="w-12 h-12 text-primary" />,
      title: "Personal Profile",
      description: "Customize your profile and set your fitness goals",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container px-4 py-8 mx-auto">
        <div className="text-center space-y-4 animate-fade-in">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Welcome to Your Fitness Journey
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Whether you're new to working out or an experienced athlete, we're here to help you achieve your fitness goals.
          </p>
          <Button
            size="lg"
            className="mt-8 animate-pulse hover:animate-none"
            onClick={() => navigate("/dashboard")}
          >
            Get Started <ArrowRight className="ml-2" />
          </Button>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-6 hover:shadow-lg transition-shadow animate-fade-in"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                {feature.icon}
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-16 space-y-8 animate-fade-in">
          <h2 className="text-3xl font-bold text-center">How to Get Started</h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-4">
              <div className="text-4xl font-bold text-primary">1</div>
              <h3 className="text-xl font-semibold">Create Your Profile</h3>
              <p className="text-muted-foreground">
                Set up your profile with your fitness goals and preferences
              </p>
            </div>
            <div className="space-y-4">
              <div className="text-4xl font-bold text-primary">2</div>
              <h3 className="text-xl font-semibold">Explore Workouts</h3>
              <p className="text-muted-foreground">
                Browse our exercise library and find workouts that match your goals
              </p>
            </div>
            <div className="space-y-4">
              <div className="text-4xl font-bold text-primary">3</div>
              <h3 className="text-xl font-semibold">Plan Your Schedule</h3>
              <p className="text-muted-foreground">
                Create your workout schedule and start tracking your progress
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
