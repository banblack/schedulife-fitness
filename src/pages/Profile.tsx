
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { User, Camera, Save, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface ProfileData {
  name: string;
  email: string;
  bio: string;
  height: string;
  weight: string;
  fitnessGoals: string;
  imageUrl: string;
}

interface ValidationErrors {
  name?: string;
  email?: string;
  height?: string;
  weight?: string;
}

const Profile = () => {
  const { toast } = useToast();
  const [profile, setProfile] = useState<ProfileData>({
    name: "",
    email: "",
    bio: "",
    height: "",
    weight: "",
    fitnessGoals: "",
    imageUrl: "",
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [bmi, setBmi] = useState<number | null>(null);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const calculateBMI = (height: number, weight: number): number => {
    const heightInMeters = height / 100;
    return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    if (!profile.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    if (!profile.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!validateEmail(profile.email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    if (profile.height && (isNaN(Number(profile.height)) || Number(profile.height) <= 0)) {
      newErrors.height = "Height must be a positive number";
      isValid = false;
    }

    if (profile.weight && (isNaN(Number(profile.weight)) || Number(profile.weight) <= 0)) {
      newErrors.weight = "Weight must be a positive number";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "Image size should be less than 5MB",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({ ...prev, imageUrl: reader.result as string }));
        toast({
          title: "Success",
          description: "Profile picture updated successfully",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));

    // Calculate BMI when height or weight changes
    if ((name === 'height' || name === 'weight') && profile.height && profile.weight) {
      const height = Number(name === 'height' ? value : profile.height);
      const weight = Number(name === 'weight' ? value : profile.weight);
      
      if (!isNaN(height) && !isNaN(weight) && height > 0 && weight > 0) {
        setBmi(calculateBMI(height, weight));
      } else {
        setBmi(null);
      }
    }
  };

  const handleSave = () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
      });
      return;
    }

    // Save to localStorage for persistence
    localStorage.setItem('userProfile', JSON.stringify(profile));

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
                Full Name *
              </label>
              <Input
                id="name"
                name="name"
                value={profile.name}
                onChange={handleInputChange}
                placeholder="Enter your name"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.name}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email *
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={profile.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.email}
                </p>
              )}
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
                name="height"
                type="number"
                value={profile.height}
                onChange={handleInputChange}
                placeholder="Enter your height"
                className={errors.height ? "border-red-500" : ""}
              />
              {errors.height && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.height}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="weight" className="text-sm font-medium">
                Weight (kg)
              </label>
              <Input
                id="weight"
                name="weight"
                type="number"
                value={profile.weight}
                onChange={handleInputChange}
                placeholder="Enter your weight"
                className={errors.weight ? "border-red-500" : ""}
              />
              {errors.weight && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.weight}
                </p>
              )}
            </div>
          </div>
          {bmi !== null && (
            <div className="p-4 bg-primary/5 rounded-lg">
              <p className="text-sm font-medium">
                Your BMI: {bmi} ({getBMICategory(bmi)})
              </p>
            </div>
          )}
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
                name="bio"
                value={profile.bio}
                onChange={handleInputChange}
                placeholder="Tell us about yourself"
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="fitnessGoals" className="text-sm font-medium">
                Fitness Goals
              </label>
              <Textarea
                id="fitnessGoals"
                name="fitnessGoals"
                value={profile.fitnessGoals}
                onChange={handleInputChange}
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

const getBMICategory = (bmi: number): string => {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal weight";
  if (bmi < 30) return "Overweight";
  return "Obese";
};

export default Profile;

