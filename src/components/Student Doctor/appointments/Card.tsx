import type { ReactNode } from "react";

interface Props {
  title: "Total Appointments" | "Upcoming" | "Completed" | "Cancelled";
  num: number;
  logo: ReactNode;
  color: "blue" | "violet" | "green" | "red";
}

const Card = ({ title, num, logo, color }: Props) => {
  const colorMap = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    violet: "bg-violet-50 text-violet-600 border-violet-100",
    green: "bg-emerald-50 text-emerald-600 border-emerald-100",
    red: "bg-red-50 text-red-600 border-red-100",
  };

  return (
    <div className="flex bg-(--color-surface) w-full p-6 rounded-2xl border border-(--color-border) shadow-sm hover:shadow-md transition-shadow justify-between items-center">
      <div className="flex flex-col gap-1">
        <p className="text-(--color-text-light) text-xs font-bold uppercase tracking-wider">
          {title}
        </p>
        <p className="text-3xl text-(--color-text) font-bold">{num}</p>
      </div>
      <div
        className={`p-3 rounded-xl border ${colorMap[color]} shadow-sm flex items-center justify-center`}
      >
        {logo}
      </div>
    </div>
  );
};

export default Card;
