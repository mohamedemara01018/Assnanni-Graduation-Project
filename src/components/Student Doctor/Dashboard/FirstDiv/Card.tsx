import type { ReactNode } from "react";
import { ScaleLoader } from "react-spinners";

interface Props {
  logo: ReactNode;
  title: string;
  color: "blue" | "violet";
  status: string;
  children?: ReactNode;
  onMarkViewed?: () => void;
  isMarkingViewed?: boolean;
}

const Card = ({
  logo,
  title,
  color,
  status,
  children,
  onMarkViewed,
  isMarkingViewed,
}: Props) => {
  return (
    <div className="flex bg-(--color-bg) justify-between p-4 items-center rounded-xl border border-(--color-border)/50 hover:border-(--color-border) transition-all shadow-sm">
      <div className="flex gap-4 items-center flex-1">
        <div
          className={
            color === "blue"
              ? "text-2xl text-blue-700 p-2.5 bg-blue-100 rounded-lg dark:bg-blue-900/30 dark:text-blue-400"
              : "text-2xl text-violet-700 p-2.5 bg-violet-100 rounded-lg dark:bg-violet-900/30 dark:text-violet-400"
          }
        >
          {logo}
        </div>
        <div className="flex-1">
          <h1 className="text-base font-semibold text-(--color-text) line-clamp-1">{title}</h1>
          <div className="text-(--color-text-light) text-xs mt-1">{children}</div>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2 ml-4 min-w-fit">
        {onMarkViewed && status === "New Case" ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMarkViewed();
            }}
            disabled={isMarkingViewed}
            className="text-[10px] bg-violet-600 text-white px-4 py-2 rounded-xl font-bold uppercase cursor-pointer hover:bg-violet-700 transition-all shadow-md shadow-violet-500/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isMarkingViewed ? (
              <ScaleLoader color="#fff" height={10} width={2} />
            ) : (
              "Mark as Viewed"
            )}
          </button>
        ) : (
          <div
            className={`px-3 py-1.5 rounded-full font-bold text-[10px] uppercase tracking-wider shadow-sm ${
              status === "Observe Only" || status === "Completed"
                ? "bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/50"
                : "bg-blue-50 text-blue-600 border border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/50"
            }`}
          >
            {status}
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
