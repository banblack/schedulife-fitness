
import { Shield } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface AdminSectionProps {
  showAdminOption: boolean;
  isAdmin: boolean;
  adminSecretKey: string;
  adminSecretError?: string;
  onAdminCheckboxChange: (checked: boolean) => void;
  onAdminKeyChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleAdminOption: () => void;
}

export const AdminSection = ({
  showAdminOption,
  isAdmin,
  adminSecretKey,
  adminSecretError,
  onAdminCheckboxChange,
  onAdminKeyChange,
  onToggleAdminOption,
}: AdminSectionProps) => {
  if (!showAdminOption) {
    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-full text-xs"
        onClick={onToggleAdminOption}
      >
        <Shield className="mr-2 h-3 w-3" />
        I need admin access
      </Button>
    );
  }

  return (
    <div className="space-y-4 p-3 border border-amber-200 bg-amber-50 rounded-md">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="admin"
          checked={isAdmin}
          onCheckedChange={onAdminCheckboxChange}
        />
        <Label htmlFor="admin" className="text-sm flex items-center">
          <Shield className="mr-2 h-3 w-3 text-amber-500" />
          Register as admin
        </Label>
      </div>
      
      {isAdmin && (
        <div className="space-y-2">
          <Label htmlFor="adminSecretKey" className="text-sm">Admin Secret Key</Label>
          <Input
            id="adminSecretKey"
            name="adminSecretKey"
            type="password"
            placeholder="Enter admin secret key"
            value={adminSecretKey}
            onChange={onAdminKeyChange}
            className={adminSecretError ? "border-red-500" : ""}
          />
          {adminSecretError && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <Shield className="w-4 h-4" />
              {adminSecretError}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
