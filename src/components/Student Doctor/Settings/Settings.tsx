import { Outlet } from "react-router";
import SideBar from "./SideBar";
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";

const StudentSettings = () => {
  return (
    <DashboardLayout pageTitle={"Student Doctor Settings"}>
      <div className="p-4 -ml-6 -mt-6 lg:h-[90vh] flex flex-col gap-8">
        <h1 className="text-2xl mb-2 font-semibold text-gray-800">Settings</h1>
        <div className="flex max-lg:flex-col">
          <div className="flex-1">
            <SideBar />
          </div>
          <div className="flex-3">
            <Outlet />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentSettings;
