import type { ReactNode } from "react";

interface Props {
  logo: ReactNode;
  title: string;
  color: "blue" | "violet";
  status: "confirmed" | "pending";
  children?: ReactNode;
}
const Card = ({ logo, title, color, status, children }: Props) => {
  return (
    <div className="flex bg-gray-200 justify-between p-4 items-center rounded-xl">
      <div className="flex gap-4 items-center">
        <div
          className={
            color === "blue"
              ? "text-3xl text-blue-700 p-3 bg-blue-200 rounded-lg"
              : "text-3xl text-violet-700 p-3 bg-violet-200 rounded-lg"
          }
        >
          {logo}
        </div>
        <div>
          <h1 className="text-lg font-semibold text-gray-700">{title}</h1>
          <div className="text-gray-500 text-sm">{children}</div>
        </div>
      </div>
      <div
        className={
          status === "confirmed"
            ? "bg-green-200 text-green-700 p-2 rounded-lg font-light"
            : "bg-yellow-200 text-yellow-700 p-2 rounded-lg font-light"
        }
      >
        <span>{status}</span>
      </div>
    </div>
  );
};

export default Card;
