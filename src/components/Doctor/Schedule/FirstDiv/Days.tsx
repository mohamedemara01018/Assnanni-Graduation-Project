import { FaRegClock } from "react-icons/fa6";
import { IoIosClose } from "react-icons/io";

interface Props {
  day: string;
  time: { id: number; time: string; status: string }[];
  role: string;
  onDeleteSlot: (slotId: number) => void;
}

const Days = ({ day, time, role, onDeleteSlot }: Props) => {
  return (
    <div className="flex flex-col gap-3 pb-4 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {day}
      </h3>
      <div className="flex flex-wrap gap-3">
        {time.length > 0 ? (
          time.map((item, index) => {
            const isUnavailable = item.status === "Unavailable";
            return (
              <div
                key={index}
                className={`flex items-center gap-1.5 rounded-full pl-3 pr-2 py-1.5 transition-all border ${
                  isUnavailable
                    ? "bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800 text-red-600 dark:text-red-400"
                    : "bg-blue-50 dark:bg-blue-900/20 border-transparent text-blue-600 dark:text-blue-400"
                } ${
                  role !== "studentDoctor" && !isUnavailable
                    ? "cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/40 hover:border-blue-200 dark:hover:border-blue-800 shadow-sm"
                    : ""
                }`}
              >
                <FaRegClock
                  className={`text-xs ${
                    isUnavailable ? "text-red-400" : "text-blue-500"
                  }`}
                />
                <span className="text-sm font-medium">{item.time}</span>
                {role !== "studentDoctor" && !isUnavailable && (
                  <button
                    onClick={() => onDeleteSlot(item.id)}
                    className="p-0 border-none bg-transparent cursor-pointer flex items-center"
                    aria-label="Delete slot"
                  >
                    <IoIosClose className="text-lg text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors ml-0.5" />
                  </button>
                )}
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
