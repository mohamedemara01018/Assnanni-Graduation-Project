import type { WeeklyScheduleStats } from "@/interfaces/doctorInterfaces";

interface Props {
  stats: WeeklyScheduleStats;
}

const QuickStats = ({ stats }: Props) => {
  return (
    <div className="flex flex-col gap-4 bg-(--color-surface) p-6 rounded-2xl border border-gray-100 dark:border-gray-800/0 shadow-sm">
      <h3 className="text-lg font-semibold text-(--color-text) mb-1">
        Quick Stats
      </h3>

      <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-4 flex flex-col gap-1 border border-transparent dark:border-blue-900/20">
        <h4 className="text-xs font-medium text-blue-500 dark:text-blue-400">
          Total Slots
        </h4>
        <p className="text-lg font-semibold text-blue-700 dark:text-blue-200">
          {stats.totalSlots}
        </p>
      </div>

      <div className="bg-emerald-50 dark:bg-emerald-900/30 rounded-xl p-4 flex flex-col gap-1 border border-transparent dark:border-emerald-900/20">
        <h4 className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
          Available Slots
        </h4>
        <p className="text-lg font-semibold text-emerald-800 dark:text-emerald-200">
          {stats.availableSlots}
        </p>
      </div>

      <div className="bg-purple-50 dark:bg-purple-900/30 rounded-xl p-4 flex flex-col gap-1 border border-transparent dark:border-purple-900/20">
        <h4 className="text-xs font-medium text-purple-600 dark:text-purple-400">
          Unavailable Slots
        </h4>
        <p className="text-lg font-semibold text-purple-800 dark:text-purple-200">
          {stats.unavailableSlots}
        </p>
      </div>
    </div>
  );
};

export default QuickStats;
