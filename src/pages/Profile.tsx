
import { Button } from "@/components/ui/button";
import { User, Save } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import CoachingPlans from "@/components/subscription/CoachingPlans";
import { supabase } from "@/lib/supabase";
import { ProfileData, ValidationErrors } from "@/types/profile";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { PersonalInfo } from "@/components/profile/PersonalInfo";
import { PhysicalInfo } from "@/components/profile/PhysicalInfo";
import { BioAndGoals } from "@/components/profile/BioAndGoals";
import { SetupProgress } from "@/components/profile/SetupProgress";

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

      <SetupProgress />

      <div className="space-y-8">
        <ProfileAvatar 
          imageUrl={profile.imageUrl} 
          onImageUpdate={(url) => setProfile(prev => ({ ...prev, imageUrl: url }))}
        />

        <PersonalInfo
          name={profile.name}
          email={profile.email}
          errors={errors}
          onChange={handleInputChange}
        />

        <PhysicalInfo
          height={profile.height}
          weight={profile.weight}
          bmi={bmi}
          errors={errors}
          onChange={handleInputChange}
        />

        <BioAndGoals
          bio={profile.bio}
          fitnessGoals={profile.fitnessGoals}
          onChange={handleInputChange}
        />

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

export default Profile;
