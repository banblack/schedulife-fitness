
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";
import { AlertCircle } from "lucide-react";
import { ValidationErrors } from "@/types/profile";

interface PersonalInfoProps {
  name: string;
  email: string;
  errors: ValidationErrors;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const PersonalInfo = ({ name, email, errors, onChange }: PersonalInfoProps) => {
  return (
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
            value={name}
            onChange={onChange}
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
            value={email}
            onChange={onChange}
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
  );
};
