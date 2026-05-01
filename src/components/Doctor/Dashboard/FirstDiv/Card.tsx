import type { ReactNode } from "react";

interface Props {
  logo: ReactNode;
  title: string;
  color: "blue" | "violet" | string;
  status: string;
  children?: ReactNode;
}
const Card = ({ logo, title, color, status, children }: Props) => {
  const getStatusColor = (statusStr: string) => {
    const s = statusStr.toLowerCase();
    if (s === "confirmed") {
      return "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-500";
    }
    if (s === "pending" || s === "completed") {
      return "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-500";
    }
    return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";
  };

  return (
    <div className="flex bg-gray-50 dark:bg-slate-700/30 justify-between p-4 items-center rounded-xl">
      <div className="flex gap-4 items-center">
        <div
          className={
            color === "blue"
              ? "text-3xl text-blue-600 p-2 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 rounded-lg"
              : "text-3xl text-violet-600 p-3 bg-violet-100 dark:bg-violet-900/30 dark:text-violet-400 rounded-lg"
          }
        >
          {logo}
        </div>
        <div>
          <h1 className="text-base font-semibold text-(--color-text)">
            {title}
          </h1>
          <div className="text-(--color-text-light) text-xs">{children}</div>
        </div>
      </div>
      <div
        className={`p-0.5 px-2 rounded-lg font-light ${getStatusColor(status)}`}
      >
        <span>{status}</span>
      </div>
    </div>
  );
};

export default Card;
