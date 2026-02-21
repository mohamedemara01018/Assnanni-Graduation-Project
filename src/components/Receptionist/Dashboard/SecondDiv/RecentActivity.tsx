import type { ReactNode } from "react";

interface Props {
  title: string;
  color: "bg-green-500" | "bg-blue-500" | "bg-violet-500" | "bg-orange-500";
  children: ReactNode;
}

const RecentActivity = ({ title, color, children }: Props) => {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-4 h-4 ${color} rounded-full`}></div>
      <div>
        <h3 className="text-(--color-text) font-light">{title}</h3>
        <div className="flex gap-3 text-xs text-(--color-text-light) font-thin">
          {children}
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;
