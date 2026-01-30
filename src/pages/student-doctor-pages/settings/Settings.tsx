import { Outlet } from "react-router";
import SideBar from "../../../components/Doctor/Settings/SideBar";
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";

const StudentSettings = () => {
  return (
    <DashboardLayout pageTitle={"Student Doctor Settings"}>
      <div className="p-4  -mt-6 lg:min-h-[85vh] flex flex-col gap-8 bg-(--color-bg) rounded-2xl">
        <h1 className="text-2xl mb-2 font-normal text-(--color-text) mt-2">
          Settings
        </h1>
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
