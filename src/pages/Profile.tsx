import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { User, Camera, Save, AlertCircle, Trophy, Target, Dumbbell } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import CoachingPlans from "@/components/subscription/CoachingPlans";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jfwpwpjinixnwbmivdwp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impmd3B3cGppbml4bndibWl2ZHdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDc2NjI5MzAsImV4cCI6MjAyMzIzODkzMH0.JQND6QxHNmbo75QUoZwPEFpJEHiCgo-5ZSg_vvzYtXY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "Please log in to view your profile",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        setProfile({
          name: data.full_name || "",
          email: data.email || "",
          bio: data.bio || "",
          height: data.height?.toString() || "",
          weight: data.weight?.toString() || "",
          fitnessGoals: data.fitness_goals || "",
          imageUrl: data.avatar_url || "",
        });

        if (data.height && data.weight) {
          setBmi(calculateBMI(Number(data.height), Number(data.weight)));
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('No user found');

        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}-${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName);

        setProfile(prev => ({ ...prev, imageUrl: publicUrl }));
        
        // Update user profile with new avatar URL
        const { error: updateError } = await supabase
          .from('users')
          .update({ avatar_url: publicUrl })
          .eq('id', user.id);

        if (updateError) throw updateError;

        toast({
          title: "Success",
          description: "Profile picture updated successfully",
        });
      } catch (error) {
        console.error('Error uploading image:', error);
        toast({
          title: "Error",
          description: "Failed to upload image",
          variant: "destructive",
        });
      }
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));

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

  const handleSave = async () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          full_name: profile.name,
          email: profile.email,
          bio: profile.bio,
          height: profile.height ? Number(profile.height) : null,
          weight: profile.weight ? Number(profile.weight) : null,
          fitness_goals: profile.fitnessGoals,
          avatar_url: profile.imageUrl,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to save profile",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>;
  }

  return (
    <div className="container px-4 py-8 max-w-4xl mx-auto animate-fade-in bg-gradient-to-b from-primary/5 to-transparent rounded-lg">
      <div className="flex items-center gap-3 mb-8">
        <User className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">My Profile</h1>
      </div>

      <div className="space-y-8">
        <div className="flex flex-col items-center gap-4 p-6 bg-white/50 rounded-xl shadow-sm backdrop-blur-sm">
          <Avatar className="w-32 h-32 ring-4 ring-primary/20">
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
              className="hover:bg-primary/10 transition-colors"
            >
              <Camera className="w-4 h-4 mr-2" />
              Upload Photo
            </Button>
          </div>
        </div>

        <div className="space-y-4 p-6 bg-white/50 rounded-xl shadow-sm backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">Personal Information</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-700">
                Full Name *
              </label>
              <Input
                id="name"
                name="name"
                value={profile.name}
                onChange={handleInputChange}
                placeholder="Enter your name"
                className={`${errors.name ? "border-red-500" : "focus:ring-primary/30"}`}
              />
              {errors.name && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.name}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email *
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={profile.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className={`${errors.email ? "border-red-500" : "focus:ring-primary/30"}`}
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

        <div className="space-y-4 p-6 bg-white/50 rounded-xl shadow-sm backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">Physical Information</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="height" className="text-sm font-medium text-gray-700">
                Height (cm)
              </label>
              <Input
                id="height"
                name="height"
                type="number"
                value={profile.height}
                onChange={handleInputChange}
                placeholder="Enter your height"
                className={`${errors.height ? "border-red-500" : "focus:ring-primary/30"}`}
              />
              {errors.height && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.height}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="weight" className="text-sm font-medium text-gray-700">
                Weight (kg)
              </label>
              <Input
                id="weight"
                name="weight"
                type="number"
                value={profile.weight}
                onChange={handleInputChange}
                placeholder="Enter your weight"
                className={`${errors.weight ? "border-red-500" : "focus:ring-primary/30"}`}
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
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
              <p className="text-sm font-medium flex items-center gap-2">
                <Trophy className="w-4 h-4 text-primary" />
                Your BMI: {bmi} ({getBMICategory(bmi)})
              </p>
            </div>
          )}
        </div>

        <div className="space-y-4 p-6 bg-white/50 rounded-xl shadow-sm backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">Bio & Goals</h2>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="bio" className="text-sm font-medium text-gray-700">
                Bio
              </label>
              <Textarea
                id="bio"
                name="bio"
                value={profile.bio}
                onChange={handleInputChange}
                placeholder="Tell us about yourself"
                className="min-h-[100px] focus:ring-primary/30"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="fitnessGoals" className="text-sm font-medium text-gray-700">
                Fitness Goals
              </label>
              <Textarea
                id="fitnessGoals"
                name="fitnessGoals"
                value={profile.fitnessGoals}
                onChange={handleInputChange}
                placeholder="What are your fitness goals?"
                className="min-h-[100px] focus:ring-primary/30"
              />
            </div>
          </div>
        </div>

        <Button 
          onClick={handleSave} 
          className="w-full sm:w-auto bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Profile
        </Button>

        <section className="mt-12">
          <CoachingPlans />
        </section>
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
