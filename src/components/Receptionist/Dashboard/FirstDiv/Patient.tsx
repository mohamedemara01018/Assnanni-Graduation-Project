import { NavLink } from "react-router";

interface Props {
  name: string;
  status: "available" | "busy" | "offline";
}

const Patient = ({ name, status }: Props) => {
  const firstCharacter = name.charAt(0);
  return (
    <div className="flex justify-between items-center bg-(--color-border) p-4 rounded-xl">
      <div className="flex gap-4 items-center">
        <div className="flex items-center justify-center w-8 h-8 bg-linear-90 from-[#0087D5] to-[#00AE9B] rounded-full">
          <span className="text-gray-50 font-semibold text-base h-fit">
            {firstCharacter}
          </span>
        </div>
        <h1 className="text-lg text-(--color-text) font-semibold -ml-2">
          Dr. {name}
        </h1>
      </div>
      <NavLink
        to={"#"}
        className="text-sm  text-gray-600 bg-gray-300 p-1 rounded-2xl px-2"
      >
        {status}
      </NavLink>
    </div>
  );
};

export default Patient;
