import { NavLink } from "react-router";

const QuickActions = () => {
  return (
    <div className="flex flex-col gap-3 bg-(--color-surface) p-6 rounded-xl ">
      <h1 className="text-xl font-normal mb-2 text-(--color-text) border-b-2 border-gray-300 pb-2">
        Quick Actions
      </h1>
      <NavLink to={"#"} className={"bg-blue-200 rounded-lg p-4"}>
        <h3 className="text-blue-950 font-normal">Manage Schedule</h3>
        <p className="text-xs font-light text-blue-700">Set Availability</p>
      </NavLink>
      <NavLink to={"#"} className={"bg-green-200 rounded-lg p-4"}>
        <h3 className="text-green-950 font-normal">Patient Records</h3>
        <p className="text-xs font-light text-green-700">Access Histories</p>
      </NavLink>
      <NavLink to={"#"} className={"bg-violet-200 rounded-lg p-4"}>
        <h3 className="text-violet-950 font-normal">Generate Report</h3>
        <p className="text-xs font-light text-violet-700">
          Analytics & insights
        </p>
      </NavLink>
    </div>
  );
};

export default QuickActions;
