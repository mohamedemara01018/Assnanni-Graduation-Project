import type { ReactNode } from "react";
import { HiOutlineDocumentReport } from "react-icons/hi";

interface Props {
  title: string;
  children: ReactNode;
  type: "PDF" | "Excel";
}

const Card = ({ title, children, type }: Props) => {
  return (
    <div className="flex justify-between items-center bg-(--color-border) rounded-md m-1 cursor-pointer p-2 px-4">
      <div className="flex gap-4 items-center">
        <div className="bg-blue-200 p-4 rounded-lg">
          <HiOutlineDocumentReport className="text-3xl text-blue-500" />
        </div>
        <div className="flex flex-col gap-1.5">
          <h3 className="text-base font-thin text-(--color-text)">{title}</h3>
          <div className="text-xs text-(--color-text-light) font-thin flex gap-4">
            {children}
          </div>
        </div>
      </div>
      <span className="bg-(--color-bg) flex h-fit p-3 py-1 rounded-md text-(--color-text)">
        {type}
      </span>
    </div>
  );
};

export default Card;
