
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface SaveProfileButtonProps {
  onClick: () => void;
}

export const SaveProfileButton = ({ onClick }: SaveProfileButtonProps) => {
  return (
    <Button 
      onClick={onClick} 
      className="w-full sm:w-auto bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
    >
      <Save className="w-4 h-4 mr-2" />
      Save Profile
    </Button>
  );
};
