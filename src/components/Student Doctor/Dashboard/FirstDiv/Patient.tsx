import type { ReactNode } from "react";
import { CiLock } from "react-icons/ci";

interface Props {
  id?: number | string;
  name: string;
  imageUrl?: string;
  lastInteractionDate?: string;
  children?: ReactNode;
}

const Patient = ({ name, imageUrl, children }: Props) => {
  let firstCharacter: string = " ";
  if (name.startsWith("Dr.")) {
    firstCharacter = name.charAt(0) + name.charAt(4);
  } else {
    firstCharacter = name.charAt(0);
  }

  return (
    <div className="flex justify-between items-center bg-(--color-bg) border border-(--color-border) p-4 rounded-xl shadow-sm">
      <div className="flex gap-4 items-center">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center w-10 h-10 bg-linear-to-br from-blue-400 to-emerald-400 rounded-full">
            <span className="text-white font-bold text-sm">
              {firstCharacter}
            </span>
          </div>
        )}
        <div className="flex flex-col gap-1">
          <h3 className="text-base text-(--color-text) font-medium">{name}</h3>
          <div className="text-xs text-(--color-text-light) font-normal">
            {children}
          </div>
        </div>
      </div>
      <div className="text-xl text-(--color-text-light) opacity-50">
        <CiLock />
      </div>
    </div>
  );
};

export default Patient;
