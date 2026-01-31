import type { ReactNode } from "react";

interface Props {
  title: "Total Appointments" | "Upcoming" | "Completed" | "Cancelled";
  num: number;
  logo: ReactNode;
  color: "blue" | "violet" | "green" | "red";
}

const Card = ({ title, num, logo, color }: Props) => {
  return (
    <>
      <div className="flex bg-(--color-surface) w-full p-6 rounded-2xl h-fit justify-between">
        <div className="flex flex-col gap-2">
          <p className="text-(--color-text-light) text-sm">{title}</p>
          <p className="text-2xl text-(--color-text) font-normal">{num}</p>
        </div>
        <div
          className={`${
            color === "blue"
              ? "bg-blue-100"
              : color === "violet"
              ? "bg-violet-100"
              : color === "green"
              ? "bg-green-100"
              : "bg-red-100"
          } h-fit w-fit p-2 rounded-md`}
        >
          <div
            className={`${
              color === "blue"
                ? "text-blue-700"
                : color === "violet"
                ? "text-violet-700"
                : color === "green"
                ? "text-green-700"
                : "text-red-700"
            } text-xl`}
          >
            {logo}
          </div>
        </div>
      </div>
    </>
  );
};

export default Card;
