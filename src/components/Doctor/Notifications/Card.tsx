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
      className={`relative bg-white border border-gray-100 flex gap-5 p-6 items-center rounded-2xl cursor-pointer transition-all duration-200 hover:shadow-md hover:border-blue-100 ${
        !isRead ? "border-l-[6px] border-l-blue-600" : ""
      }`}
    >
      <div className={`text-2xl ${color} ${bgColor} p-4 rounded-2xl flex-shrink-0`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-gray-900 font-bold text-base">{title}</h3>
          {!isRead && (
            <div className="w-2.5 h-2.5 rounded-full bg-blue-600 mt-1.5 ml-4"></div>
          )}
        </div>
        <p className="text-gray-600 text-sm mb-1 line-clamp-1">{desc}</p>
        <p className="text-gray-400 text-[11px] font-medium uppercase tracking-wider">{time}</p>
      </div>
    </div>
  );
};

export default Card;
