
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { User, Camera, Save } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const Profile = () => {
  const { toast } = useToast();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    bio: "",
    height: "",
    weight: "",
    fitnessGoals: "",
    imageUrl: "",
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload this to your backend
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // In a real app, you would save this to your backend
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
  };

  return (
    <div className="container px-4 py-8 max-w-2xl mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <User className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
      </div>

      <div className="space-y-8">
        {/* Profile Picture Section */}
        <div className="flex flex-col items-center gap-4">
          <Avatar className="w-32 h-32">
            <AvatarImage src={profile.imageUrl} />
            <AvatarFallback className="bg-primary/10">
              <User className="w-12 h-12 text-primary" />
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-2">
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="avatar-upload"
            />
            <Button
              variant="outline"
              onClick={() => document.getElementById("avatar-upload")?.click()}
            >
              <Camera className="w-4 h-4 mr-2" />
              Upload Photo
            </Button>
          </div>
        </div>

        {/* Personal Information */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Personal Information</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Full Name
              </label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter your name"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="Enter your email"
              />
            </div>
          </div>
        </div>

        {/* Physical Information */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Physical Information</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="height" className="text-sm font-medium">
                Height (cm)
              </label>
              <Input
                id="height"
                type="number"
                value={profile.height}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, height: e.target.value }))
                }
                placeholder="Enter your height"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="weight" className="text-sm font-medium">
                Weight (kg)
              </label>
              <Input
                id="weight"
                type="number"
                value={profile.weight}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, weight: e.target.value }))
                }
                placeholder="Enter your weight"
              />
            </div>
          </div>
        </div>

        {/* Bio & Goals */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Bio & Goals</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="bio" className="text-sm font-medium">
                Bio
              </label>
              <Textarea
                id="bio"
                value={profile.bio}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, bio: e.target.value }))
                }
                placeholder="Tell us about yourself"
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="goals" className="text-sm font-medium">
                Fitness Goals
              </label>
              <Textarea
                id="goals"
                value={profile.fitnessGoals}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, fitnessGoals: e.target.value }))
                }
                placeholder="What are your fitness goals?"
                className="min-h-[100px]"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <Button onClick={handleSave} className="w-full sm:w-auto">
          <Save className="w-4 h-4 mr-2" />
          Save Profile
        </Button>
      </div>
    </div>
  );
};

export default Profile;
