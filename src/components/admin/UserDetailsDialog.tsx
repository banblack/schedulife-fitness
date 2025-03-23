
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { UserProfile } from "@/services/authService";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";

interface UserDetailsDialogProps {
  user: UserProfile | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserUpdated: () => void;
}

export function UserDetailsDialog({
  user,
  open,
  onOpenChange,
  onUserUpdated,
}: UserDetailsDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<UserProfile>>({});

  // Initialize form data when user changes
  useState(() => {
    if (user) {
      setFormData({
        full_name: user.full_name,
        bio: user.bio,
        height: user.height,
        weight: user.weight,
        fitness_goals: user.fitness_goals,
        is_admin: user.is_admin,
      });
    }
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, is_admin: checked }));
  };

  const handleSubmit = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("users")
        .update({
          full_name: formData.full_name,
          bio: formData.bio,
          height: formData.height ? Number(formData.height) : null,
          weight: formData.weight ? Number(formData.weight) : null,
          fitness_goals: formData.fitness_goals,
          is_admin: formData.is_admin,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "User details updated successfully",
      });
      onUserUpdated();
    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar_url || ""} />
              <AvatarFallback>
                {user.full_name?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>{user.email}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="full_name" className="text-right">
              Name
            </Label>
            <Input
              id="full_name"
              name="full_name"
              className="col-span-3"
              value={formData.full_name || ""}
              onChange={handleInputChange}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="bio" className="text-right">
              Bio
            </Label>
            <Textarea
              id="bio"
              name="bio"
              className="col-span-3"
              value={formData.bio || ""}
              onChange={handleInputChange}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="height" className="text-right">
              Height (cm)
            </Label>
            <Input
              id="height"
              name="height"
              type="number"
              className="col-span-3"
              value={formData.height || ""}
              onChange={handleInputChange}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="weight" className="text-right">
              Weight (kg)
            </Label>
            <Input
              id="weight"
              name="weight"
              type="number"
              className="col-span-3"
              value={formData.weight || ""}
              onChange={handleInputChange}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fitness_goals" className="text-right">
              Fitness Goals
            </Label>
            <Textarea
              id="fitness_goals"
              name="fitness_goals"
              className="col-span-3"
              value={formData.fitness_goals || ""}
              onChange={handleInputChange}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="is_admin" className="text-right">
              Admin Access
            </Label>
            <div className="flex items-center space-x-2 col-span-3">
              <Switch
                id="is_admin"
                checked={formData.is_admin || false}
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="is_admin" className="cursor-pointer">
                {formData.is_admin ? "Enabled" : "Disabled"}
              </Label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
