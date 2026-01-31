import { NavLink } from "react-router";
import { CiLock } from "react-icons/ci";

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
        to={"#"}
        className={
          "bg-(--color-border) rounded-lg p-4 cursor-not-allowed blur-[0.4px] flex justify-between items-center"
        }
      >
        <div>
          <h3 className="text-(--color-text-light) font-semibold ">
            Prescribe Medication
          </h3>
          <p className="text-sm font-light text-gray-400">
            Requires authorization
          </p>
        </div>
        <CiLock className="text-2xl text-(--color-text-light)" />
      </NavLink>
      <NavLink
        to={"#"}
        className={
          "bg-(--color-border) rounded-lg p-4 blur-[0.4px] cursor-not-allowed flex justify-between items-center"
        }
      >
        <div>
          <h3 className="text-(--color-text-light) font-semibold">
            Edit Patient Records
          </h3>
          <p className="text-sm font-light text-gray-400">
            Requires authorization
          </p>
        </div>
        <CiLock className="text-2xl text-(--color-text-light)" />
      </NavLink>
    </div>
  );
};

export default QuickActions;
