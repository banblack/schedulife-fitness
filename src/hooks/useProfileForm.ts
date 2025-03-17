
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { ProfileData, ValidationErrors } from "@/types/profile";

export const useProfileForm = () => {
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

  const calculateBMI = (height: number, weight: number): number => {
    const heightInMeters = height / 100;
    return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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

  return {
    profile,
    setProfile,
    errors,
    bmi,
    loading,
    handleInputChange,
    handleSave
  };
};
