import { NavLink } from "react-router";

interface Props {
  name: string;
  imageUrl?: string;
  lastInteractionDate?: string;
}

const Patient = ({ name, imageUrl, lastInteractionDate }: Props) => {
  const firstCharacter = name.charAt(0);
  return (
    <div className="flex justify-between items-center bg-gray-50 dark:bg-slate-700/30 p-4 rounded-xl">
      <div className="flex gap-4 items-center">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center w-8 h-8 bg-linear-90 from-[#0087D5] to-[#00AE9B] rounded-full">
            <span className="text-gray-50 font-semibold text-base h-fit">
              {firstCharacter}
            </span>
          </div>
        )}
        <div className="flex flex-col">
          <h1 className="text-lg text-(--color-text) dark:text-gray-100 font-semibold">
            {name}
          </h1>
          {lastInteractionDate && (
            <p className="text-xs text-(--color-text-light) dark:text-gray-400">
              Last interaction:{" "}
              {new Date(lastInteractionDate).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
      <NavLink
        to={"#"}
        className="text-sm text-blue-500 hover:text-blue-400 dark:text-blue-400 dark:hover:text-blue-300"
      >
        View
      </NavLink>
    </div>
  );
};

export default Patient;
