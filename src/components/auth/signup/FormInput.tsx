
import { AlertCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface FormInputProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  error?: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FormInput = ({
  id,
  label,
  type = 'text',
  value,
  error,
  placeholder,
  onChange,
}: FormInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={error ? "border-red-500" : ""}
      />
      {error && (
        <p className="text-sm text-red-500 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );
};
