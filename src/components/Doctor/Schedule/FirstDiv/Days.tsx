import { FaRegClock } from "react-icons/fa6";
import { IoIosClose } from "react-icons/io";

interface Props {
  day: string;
  time: string[];
}

const Days = ({ day, time }: Props) => {
  return (
    <div className="flex flex-col gap-3 pb-4 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {day}
      </h3>
      <div className="flex flex-wrap gap-3">
        {time.length > 0 ? (
          time.map((item, index) => {
            return (
              <div
                key={index}
                className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-full pl-3 pr-2 py-1.5 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors border border-transparent hover:border-blue-200 dark:hover:border-blue-800"
              >
                <FaRegClock className="text-xs text-blue-500" />
                <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                  {item}
                </span>
                <IoIosClose className="text-lg text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors ml-0.5" />
              </div>
            );
          })
        ) : (
          <p className="text-gray-400 dark:text-gray-500 text-sm">
            No available slots
          </p>
        )}
      </div>
    </div>
  );
};

export default Days;
