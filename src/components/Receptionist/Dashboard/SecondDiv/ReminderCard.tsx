import { IoIosWarning } from "react-icons/io";

const ReminderCard = () => {
  return (
    <div className="bg-yellow-50/50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/30 p-6 rounded-2xl flex gap-4 items-center shadow-sm">
      <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 p-3 rounded-xl">
        <IoIosWarning size={20} />
      </div>
      <div>
        <h3 className="text-sm font-bold text-yellow-800 dark:text-yellow-400">
          Reminder
        </h3>
        <p className="text-xs text-yellow-700 dark:text-yellow-500 font-medium">
          3 patients need insurance verification
        </p>
      </div>
    </div>
  );
};

export default ReminderCard;
