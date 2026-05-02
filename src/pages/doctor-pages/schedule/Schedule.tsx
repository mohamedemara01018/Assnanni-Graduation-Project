import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import FirstDiv from "../../../components/Doctor/Schedule/FirstDiv/FirstDiv";
import SecondDiv from "../../../components/Doctor/Schedule/SecondDiv/SecondDiv";

import { useSelector } from "react-redux";

const Schedule = () => {
  const role = useSelector(
    (state: { auth: { role: string } }) => state.auth.role,
  );

  return (
    <DashboardLayout pageTitle={"Doctor Weekly Schedule"}>
      <div className="flex flex-col gap-6 px-1">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold text-(--color-text)">
            {role === "studentDoctor" ? "Supervisor's Schedule" : "My Schedule"}
          </h1>
          <p className="text-gray-500 text-sm">
            {role === "studentDoctor"
              ? "View availability and upcoming appointments"
              : "Manage your availability and appointments"}
          </p>
        </div>
        {role === "studentDoctor" ? (
          <div className="w-full">
            <FirstDiv role={role} />
          </div>
        ) : (
          <div className="flex max-md:flex-col gap-6">
            <div className="flex-2">
              <FirstDiv role={role} />
            </div>
            <div className="flex-1">
              <SecondDiv role={role} />
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Schedule;
