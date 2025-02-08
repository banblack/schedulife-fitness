
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Dumbbell, Calendar, User, ArrowRight, BookOpen } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Dumbbell className="w-12 h-12 text-primary" />,
      title: "Workout Library",
      description: "Access our comprehensive collection of exercises for every muscle group. Browse through carefully curated workouts designed for all fitness levels.",
      details: [
        "Search exercises by muscle group",
        "View detailed exercise instructions",
        "Get recommended sets and reps",
        "Find suitable alternatives for each exercise"
      ]
    },
    {
      icon: <Calendar className="w-12 h-12 text-primary" />,
      title: "Schedule Your Training",
      description: "Plan your workouts and track your progress with our easy-to-use calendar. Create custom workout plans that fit your schedule.",
      details: [
        "Create personalized workout plans",
        "Set training frequency",
        "Track your progress over time",
        "Get reminders for your workouts"
      ]
    },
    {
      icon: <User className="w-12 h-12 text-primary" />,
      title: "Personal Profile",
      description: "Customize your profile and set your fitness goals. Track your progress and stay motivated on your fitness journey.",
      details: [
        "Set personal fitness goals",
        "Track body measurements",
        "Log your achievements",
        "Update your progress photos"
      ]
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
            className="mt-8"
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
                <ul className="text-left w-full space-y-2">
                  {feature.details.map((detail, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-primary" />
                      <span className="text-sm">{detail}</span>
                    </li>
                  ))}
                </ul>
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
                Start by setting up your profile with your fitness goals and preferences. Add your measurements and upload a profile picture to track your progress.
              </p>
            </div>
            <div className="space-y-4">
              <div className="text-4xl font-bold text-primary">2</div>
              <h3 className="text-xl font-semibold">Explore Workouts</h3>
              <p className="text-muted-foreground">
                Browse our exercise library to find workouts that match your goals. Each exercise comes with detailed instructions and video demonstrations.
              </p>
            </div>
            <div className="space-y-4">
              <div className="text-4xl font-bold text-primary">3</div>
              <h3 className="text-xl font-semibold">Plan Your Schedule</h3>
              <p className="text-muted-foreground">
                Use our calendar to create your personalized workout plan. Set reminders and track your progress as you complete each workout.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <Button
            size="lg"
            className="animate-bounce hover:animate-none"
            onClick={() => navigate("/dashboard")}
          >
            Begin Your Journey <ArrowRight className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
