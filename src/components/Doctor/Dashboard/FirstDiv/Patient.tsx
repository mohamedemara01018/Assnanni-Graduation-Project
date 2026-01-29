import { NavLink } from "react-router";

interface Props {
  name: string;
}

const Patient = ({ name }: Props) => {
  const firstCharacter = name.charAt(0);
  return (
    <div className="flex justify-between items-center bg-(--color-border) p-4 rounded-xl">
      <div className="flex gap-4 items-center">
        <div className="flex items-center justify-center w-8 h-8 bg-linear-90 from-[#0087D5] to-[#00AE9B] rounded-full">
          <span className="text-gray-50 font-semibold text-base h-fit">
            {firstCharacter}
          </span>
        </div>
        <h1 className="text-lg text-(--color-text) font-semibold">{name}</h1>
      </div>
      <NavLink to={"#"} className="text-sm  text-blue-500 hover:text-blue-400">
        View
      </NavLink>
    </div>
  );
};

export default Patient;
