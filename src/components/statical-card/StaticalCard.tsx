import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  // Use LucideIcon type if you're passing the component itself
  Icon: LucideIcon;
  label: string;
  value: string;
  colorClass?: string; // To handle different colors like blue, green, etc.
}

function StatCard({
  Icon,
  label,
  value,
  colorClass = "bg-blue-100",
}: StatCardProps) {
  return (
    <div className="p-6 bg-(--color-surface)   w-full h-fit transition duration-150 rounded-xl border border-(--color-border) shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg ${colorClass}`}>
          <Icon size={20} className="text-current" />
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
