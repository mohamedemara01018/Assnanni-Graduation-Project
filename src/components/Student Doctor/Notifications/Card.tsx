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
      className={`bg-gray-50 flex gap-4 p-4 items-center rounded-xl relative`}
    >
      {!isRead && (
        <div className="absolute bg-blue-500 h-25 rounded-l-2xl w-3 -left-2.5"></div>
      )}
      <div className={`text-3xl ${color} ${bgColor} p-4 rounded-full `}>
        {icon}
      </div>
      <div>
        <h3>{title}</h3>
        <p>{desc}</p>
        <p>{time}</p>
      </div>
      {!isRead && (
        <div className="w-3 h-3 rounded-2xl bg-blue-500 self-start"></div>
      )}
    </div>
  );
};

export default Card;
