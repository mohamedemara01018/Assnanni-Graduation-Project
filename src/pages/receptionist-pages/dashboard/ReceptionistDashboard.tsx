import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import DashboardCard from "@/components/DashboardCard/DashboardCard";
import FirstDiv from "@/components/Receptionist/Dashboard/FirstDiv/FirstDiv";
import SecondDiv from "@/components/Receptionist/Dashboard/SecondDiv/SecondDiv";
import { BsCalendar3 } from "react-icons/bs";
import { ImClock } from "react-icons/im";
import { LuUsers } from "react-icons/lu";

const ReceptionistDashboard = () => {
  return (
    <DashboardLayout pageTitle={"Receptionist Dashboard"}>
      <div className="-mt-6 bg-(--color-bg) rounded-2xl min-h-screen">
        <div className="p-8">
          <h1 className="text-3xl text-(--color-text) font-bold mb-1">
            Welcome, John Doe!
          </h1>
          <p className="text-(--color-text-light) font-medium text-sm mb-10">
            Manage patient flow and appointments
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            <DashboardCard
              title="Appointments"
              subTitle="Today"
              num="3"
              logo={<BsCalendar3 />}
              color="blue"
            />
            <DashboardCard
              title="In Queue"
              subTitle="Active"
              num="4"
              logo={<ImClock />}
              color="orange"
            />
            <DashboardCard
              title="Total Patients"
              subTitle="+5"
              num="3"
              logo={<LuUsers />}
              color="green"
            />
          </div>

          <div className="flex gap-8 max-xl:flex-col items-start">
            <FirstDiv />
            <SecondDiv />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReceptionistDashboard;
