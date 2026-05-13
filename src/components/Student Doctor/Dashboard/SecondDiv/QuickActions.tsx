import { NavLink } from "react-router";

const QuickActions = () => {
  return (
    <div className="flex flex-col gap-3 bg-(--color-surface) p-6 rounded-xl">
      <h1 className="text-xl mb-2 text-(--color-text) pb-2 border-b-2 border-gray-300 ">
        Quick Actions
      </h1>
      <NavLink to={"/doctor-schedule"} className={"bg-blue-100 rounded-lg p-4"}>
        <h3 className="text-blue-900 font-normal">View Schedule</h3>
        <p className="text-sm font-light text-blue-700">Observation times</p>
      </NavLink>

      <NavLink
        to={"/student-doctor/medical-record-drafts"}
        className={
          "bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-xl p-4 flex justify-between items-center hover:bg-blue-100 transition-all group"
        }
      >
        <div className="flex flex-col gap-0.5">
          <h3 className="text-blue-600 dark:text-blue-400 font-bold text-sm">
            Clinical Record Drafts
          </h3>
          <p className="text-[11px] font-medium text-blue-500/70">
            Review and complete your drafts
          </p>
        </div>
      </NavLink>
    </div>
  );
};

export default QuickActions;
