import type { ReactNode } from "react";

interface Props {
  title: string;
  subTitle: string;
  num: string;
  logo: ReactNode;
  color: "blue" | "violet" | "green" | "yellow";
}

const DashboardCard = ({ title, subTitle, num, logo, color }: Props) => {
  return (
    <>
    <div className="flex bg-(--color-surface) border border-(--color-border) shadow-sm w-full p-6 rounded-2xl justify-between">
      <div className="flex flex-col gap-4">
        <div
          className={`${
            color === "blue"
              ? "bg-blue-50 text-blue-500"
              : color === "violet"
              ? "bg-violet-50 text-violet-500"
              : color === "green"
              ? "bg-emerald-50 text-emerald-500"
              : "bg-yellow-50 text-yellow-500"
          } w-10 h-10 flex items-center justify-center rounded-xl shadow-xs`}
        >
          <div className="text-xl">{logo}</div>
        </div>
        <div>
          <p className="text-3xl text-(--color-text) font-bold tracking-tight">
            {num}
          </p>
          <p className="text-(--color-text-light) text-xs font-medium mt-1">
            {title}
          </p>
        </div>
      </div>
      <div
        className={`h-fit py-1 px-2.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
          color === "blue"
            ? "bg-blue-100 text-blue-600"
            : color === "violet"
            ? "bg-violet-100 text-violet-600"
            : color === "green"
            ? "bg-emerald-100 text-emerald-600"
            : "bg-yellow-100 text-yellow-600"
        }`}
      >
        {subTitle}
      </div>
    </div>
    </>
  );
};

export default DashboardCard;
