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
      <div className="flex bg-(--color-surface)   w-full p-6 rounded-2xl justify-between">
        <div className="flex flex-col gap-2">
          <div
            className={`${
              color === "blue"
                ? "bg-blue-100"
                : color === "violet"
                ? "bg-violet-100"
                : color === "green"
                ? "bg-green-100"
                : "bg-yellow-100"
            } w-fit p-2 rounded-md `}
          >
            <div
              className={`${
                color === "blue"
                  ? "text-blue-600"
                  : color === "violet"
                  ? "text-violet-600"
                  : color === "green"
                  ? "text-green-600"
                  : "text-yellow-600"
              } text-2xl`}
            >
              {logo}
            </div>
          </div>
          <p className="text-2xl text-(--color-text) font-semibold">{num}</p>
          <p className="text-(--color-text-light) text-xs">{title}</p>
        </div>
        <div
          className={`h-fit p-0.5 px-1 rounded-lg ${
            color === "blue"
              ? "bg-blue-100"
              : color === "violet"
              ? "bg-violet-100"
              : color === "green"
              ? "bg-green-100"
              : "bg-yellow-100"
          }`}
        >
          <span
            className={`${
              color === "blue"
                ? "text-blue-600"
                : color === "violet"
                ? "text-violet-600"
                : color === "green"
                ? "text-green-600"
                : "text-yellow-600"
            } text-xs `}
          >
            {subTitle}
          </span>
        </div>
      </div>
    </>
  );
};

export default DashboardCard;
