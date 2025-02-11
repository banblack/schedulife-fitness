
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera, User } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

interface ProfileAvatarProps {
  imageUrl: string;
  onImageUpdate: (url: string) => void;
}

export const ProfileAvatar = ({ imageUrl, onImageUpdate }: ProfileAvatarProps) => {
  const { toast } = useToast();

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

        onImageUpdate(publicUrl);
        
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

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-white/50 rounded-xl shadow-sm backdrop-blur-sm">
      <Avatar className="w-32 h-32 ring-4 ring-primary/20">
        <AvatarImage src={imageUrl} />
        <AvatarFallback className="bg-primary/10">
          <User className="w-12 h-12 text-primary" />
        </AvatarFallback>
      </Avatar>
      <div className="flex items-center gap-2">
        <input
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
  );
};
