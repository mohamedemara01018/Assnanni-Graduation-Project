import type { ReactNode } from "react";
import { CiLock } from "react-icons/ci";

interface Props {
  name: string;
  children?: ReactNode;
}

const Patient = ({ name, children }: Props) => {
  let firstCharacter: string = " ";
  if (name.startsWith("Dr.")) {
    firstCharacter = name.charAt(0) + name.charAt(4);
  } else {
    firstCharacter = name.charAt(0);
  }

  return (
    <div className="flex justify-between items-center bg-(--color-border) p-4 rounded-xl">
      <div className="flex gap-4 items-center">
        <div className="flex items-center justify-center w-8 h-8 bg-linear-90 from-[#0087D5] to-[#00AE9B] rounded-full">
          <span className="text-gray-50 font-semibold text-sm h-fit">
            {firstCharacter}
          </span>
        </div>
        <div className="flex-col gap-2">
          <h1 className="text-lg text-(--color-text) font-normal">{name}</h1>
          <div className="text-sm text-(--color-text-light) font-normal">
            {children}
          </div>
        </div>
      </div>
      {firstCharacter.length === 1 ? (
        <p className="text-2xl  text-(--color-text-light) ">
          <CiLock />
        </p>
      ) : (
        ""
      )}
    </div>
  );
};

export default Patient;
