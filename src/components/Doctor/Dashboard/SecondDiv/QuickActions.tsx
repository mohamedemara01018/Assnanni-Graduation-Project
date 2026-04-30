import { NavLink } from "react-router";

const QuickActions = () => {
  return (
    <div className="flex flex-col gap-3 bg-(--color-surface) p-6 rounded-xl ">
      <h1 className="text-xl font-normal mb-2 text-(--color-text) border-b-2 border-gray-300 dark:border-gray-700 pb-2">
        Quick Actions
      </h1>
      <NavLink
        to={"/doctor-schedule"}
        className={
          "bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition rounded-lg p-4"
        }
      >
        <h3 className="text-blue-900 dark:text-blue-300 font-semibold text-sm">
          Manage Schedule
        </h3>
        <p className="text-xs font-light text-blue-700 dark:text-blue-400 mt-1">
          Set availability
        </p>
      </NavLink>
      <NavLink
        to={"/doctor-patients"}
        className={
          "bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/40 transition rounded-lg p-4"
        }
      >
        <h3 className="text-green-900 dark:text-green-400 font-semibold text-sm">
          Patient Records
        </h3>
        <p className="text-xs font-light text-green-700 dark:text-green-500 mt-1">
          Access histories
        </p>
      </NavLink>
      <NavLink
        to={"/doctor-reports"}
        className={
          "bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40 transition rounded-lg p-4"
        }
      >
        <h3 className="text-purple-900 dark:text-purple-300 font-semibold text-sm">
          Generate Report
        </h3>
        <p className="text-xs font-light text-purple-700 dark:text-purple-400 mt-1">
          Analytics & insights
        </p>
      </NavLink>
      <NavLink
        to={"/receptionist-access"}
        className={
          "bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/40 transition rounded-lg p-4"
        }
      >
        <h3 className="text-orange-900 dark:text-orange-300 font-semibold text-sm">
          Receptionist Access
        </h3>
        <p className="text-xs font-light text-orange-700 dark:text-orange-400 mt-1">
          Manage permissions
        </p>
      </NavLink>
    </div>
  );
};

export default QuickActions;
