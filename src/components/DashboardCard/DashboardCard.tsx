import type { ReactNode } from "react";

interface Props {
  title: string;
  subTitle: string;
  num: string;
  logo: ReactNode;
  color: "blue" | "violet" | "green" | "yellow" | "orange";
}

const DashboardCard = ({ title, subTitle, num, logo, color }: Props) => {
  const colorMap = {
    blue: "bg-blue-50 text-blue-500 border-blue-100",
    violet: "bg-violet-50 text-violet-500 border-violet-100",
    green: "bg-emerald-50 text-emerald-500 border-emerald-100",
    yellow: "bg-yellow-50 text-yellow-500 border-yellow-100",
    orange: "bg-orange-50 text-orange-500 border-orange-100",
  };

  const badgeColorMap = {
    blue: "bg-blue-100 text-blue-600",
    violet: "bg-violet-100 text-violet-600",
    green: "bg-emerald-100 text-emerald-600",
    yellow: "bg-yellow-100 text-yellow-600",
    orange: "bg-orange-100 text-orange-600",
  };

  return (
    <div className="flex flex-col bg-(--color-surface) border border-(--color-border) shadow-sm w-full p-6 rounded-2xl gap-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div
          className={`${colorMap[color]} w-12 h-12 flex items-center justify-center rounded-xl border shadow-xs`}
        >
          <div className="text-xl">{logo}</div>
        </div>
        {subTitle && (
          <div
            className={`h-fit py-1 px-3 rounded-full text-[10px] font-bold uppercase tracking-wider ${badgeColorMap[color]}`}
          >
            {subTitle}
          </div>
        )}
      </div>
      <div>
        <p className="text-3xl text-(--color-text) font-bold tracking-tight">
          {num}
        </p>
        <p className="text-(--color-text-light) text-xs font-bold uppercase tracking-widest mt-1">
          {title}
        </p>
      </div>
    </div>
  );
};

export default DashboardCard;
