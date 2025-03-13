
import { Badge } from "@/components/ui/badge";

interface BillingToggleProps {
  billingInterval: 'monthly' | 'yearly';
  setBillingInterval: (interval: 'monthly' | 'yearly') => void;
}

const BillingToggle = ({ billingInterval, setBillingInterval }: BillingToggleProps) => {
  return (
    <div className="flex justify-center gap-4 items-center">
      <button
        onClick={() => setBillingInterval('monthly')}
        className={`px-6 py-2 rounded-xl transition-colors ${
          billingInterval === 'monthly'
            ? 'bg-primary text-white shadow-md'
            : 'bg-muted hover:bg-gray-200'
        }`}
      >
        Monthly
      </button>
      <button
        onClick={() => setBillingInterval('yearly')}
        className={`px-6 py-2 rounded-xl transition-colors ${
          billingInterval === 'yearly'
            ? 'bg-primary text-white shadow-md'
            : 'bg-muted hover:bg-gray-200'
        }`}
      >
        Yearly
        <Badge variant="secondary" className="ml-2 bg-accent text-white">
          Save 20%
        </Badge>
      </button>
    </div>
  );
};

export default BillingToggle;
