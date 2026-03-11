import type { ReactNode } from "react";

interface Props {
  title: string;

  status: "Waiting" | "In Progress" | "Checked In";
  children?: ReactNode;
}
const PatientQueueCard = ({ title, status, children }: Props) => {
  const titleArray = title.split(" ");
  const profilePhoto =
    titleArray[0][0].toUpperCase() + titleArray[1][0].toUpperCase();

  return (
    <div className="flex bg-(--color-border) justify-between p-4 items-center rounded-xl">
      <div className="flex gap-4 items-center">
        <div
          className={
            "text-lg text-white w-14 flex  justify-center items-center h-14 tracking-wider bg-linear-90 from-blue-500 to-green-500 rounded-full"
          }
        >
          {profilePhoto}
        </div>
        <div>
          <h1 className="text-base font-semibold text-(--color-text)">
            {title}
          </h1>
          <div className="text-(--color-text-light) text-xs">{children}</div>
        </div>
      </div>
      <div className="flex gap-3 justify-center items-center">
        <div
          className={
            status === "Checked In"
              ? "bg-green-200 text-green-700 p-0.5 px-2 rounded-lg font-light"
              : status === "Waiting"
              ? "bg-yellow-200 text-yellow-700 p-0.5 px-2 rounded-lg font-light"
              : "bg-blue-200 text-blue-700 p-0.5 px-2 rounded-lg font-light"
          }
        >
          <span
            className={
              status === "Checked In"
                ? "bg-green-200 text-green-700 px-1 rounded-lg font-normal  text-xs"
                : status === "Waiting"
                ? "bg-yellow-200 text-yellow-700  px-1 rounded-lg  font-normal text-xs"
                : "bg-blue-200 text-blue-700  px-1 rounded-lg font-normal text-xs"
            }
          >
            {status}
          </span>
        </div>
        <span className="text-blue-500 hover:text-blue-500/80 cursor-pointer text-sm">
          View
        </span>
      </div>
    </div>
  );
};

export default PatientQueueCard;
