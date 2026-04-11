import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  // Use LucideIcon type if you're passing the component itself
  Icon: LucideIcon;
  TrendIcon: LucideIcon;
  label: string;
  value: string | number;
  trendValue: string;
  colorClass?: string; // To handle different colors like blue, green, etc.
}

function StatCard({
  Icon,
  TrendIcon,
  label,
  value,
  trendValue,
  colorClass = "bg-blue-100",
}: StatCardProps) {
  return (
    <div className="p-6 bg-(--color-bg) rounded-xl border border-(--color-border) shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg ${colorClass}`}>
          <Icon size={20} className="text-current" />
        </div>
        <div className="flex items-center text-green-500 text-sm font-medium">
          <TrendIcon size={16} className="mr-1" />
          {trendValue}
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="text-2xl  text-(--color-text)">{value}</h3>
        <p className="text-sm text-(--color-text-light)">{label}</p>
      </div>
    </div>
  );
}

export default StatCard;
