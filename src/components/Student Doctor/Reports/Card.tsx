import type { ReactNode } from "react";
import { HiOutlineDocumentReport } from "react-icons/hi";

interface Props {
  title: string;
  children: ReactNode;
  type: "PDF" | "Excel";
}

const Card = ({ title, children, type }: Props) => {
  return (
    <div className="flex justify-between items-center bg-white rounded-md m-1 cursor-pointer p-2 px-4">
      <div className="flex gap-4 items-center">
        <div className="bg-blue-200 p-4 rounded-lg">
          <HiOutlineDocumentReport className="text-3xl text-blue-500" />
        </div>
        <div className="flex flex-col gap-1.5">
          <h3 className="text-base font-thin text-gray-900">{title}</h3>
          <div className="text-xs text-gray-600 font-thin flex gap-4">
            {children}
          </div>
        </div>
      </div>
      <span className="bg-gray-300 flex h-fit p-3 py-1 rounded-md text-gray-800">
        {type}
      </span>
    </div>
  );
};

export default Card;
