import type { ReactNode } from "react";

interface Props {
  icon: ReactNode;
  title: string;
  desc: string;
  time: string;
  isRead: boolean;
  color: string;
  bgColor: string;
}

const Card = ({ icon, title, desc, time, isRead, color, bgColor }: Props) => {
  return (
    <div
      className={`relative bg-(--color-surface) border border-(--color-border) flex gap-5 p-6 items-center rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-blue-500/30 group ${
        !isRead ? "shadow-sm" : "opacity-80"
      }`}
    >
      <div
        className={`text-xl ${color} ${bgColor} w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-110`}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-(--color-text) font-bold text-base leading-none">
            {title}
          </h3>
          {!isRead && (
            <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
          )}
        </div>
        <p className="text-(--color-text-light) text-sm mb-1.5 font-medium">
          {desc}
        </p>
        <p className="text-(--color-text-light) text-[11px] opacity-60 font-medium">
          {time}
        </p>
      </div>
    </div>
  );
};

export default Card;
