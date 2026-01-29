import type { ReactNode } from "react";

interface Props {
  logo: ReactNode;
  title: string;
  color: "blue" | "violet";
  status: "Observe Only" | "View & Learn";
  children?: ReactNode;
}
const Card = ({ logo, title, color, status, children }: Props) => {
  return (
    <div className="flex bg-gray-100 justify-between p-4 items-center rounded-xl">
      <div className="flex gap-4 items-center">
        <div
          className={
            color === "blue"
              ? "text-2xl text-blue-700 p-2.5 bg-blue-200 rounded-lg "
              : "text-2xl text-violet-700 p-2.5 bg-violet-200 rounded-lg "
          }
        >
          {logo}
        </div>
        <div>
          <h1 className="text-base font-normal text-(--color-text)">{title}</h1>
          <div className="text-(--color-text-light) text-xs">{children}</div>
        </div>
      </div>
      <div
        className={
          status === "Observe Only"
            ? "bg-violet-100 text-violet-700 p-2 rounded-lg font-light text-xs"
            : " text-blue-500 p-2 rounded-lg font-light text-sm cursor-pointer"
        }
      >
        <span>{status}</span>
      </div>
    </div>
  );
};

export default Card;
