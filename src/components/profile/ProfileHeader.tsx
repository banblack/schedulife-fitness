
import { User } from "lucide-react";

export const ProfileHeader = () => {
  return (
    <div className="flex items-center gap-3 mb-8">
      <User className="w-8 h-8 text-primary" />
      <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">My Profile</h1>
    </div>
  );
};
