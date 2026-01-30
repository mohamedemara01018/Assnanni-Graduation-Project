import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";

import FirstDiv from "../../../components/Doctor/Dashboard/FirstDiv/FirstDiv";
import SecondDiv from "../../../components/Doctor/Dashboard/SecondDiv/SecondDiv";
import { SlCalender } from "react-icons/sl";
import { LuFileSpreadsheet } from "react-icons/lu";
import { MdPeople } from "react-icons/md";
import { GoPulse } from "react-icons/go";
import DashboardCard from "@/components/DashboardCard/DashboardCard";

const DoctorDashboard = () => {
  return (
    <DashboardLayout pageTitle={"Doctor Dashboard"}>
      <div className=" -mt-6    bg-(--color-bg)  rounded-2xl">
        <h1 className="text-2xl text-(--color-text) font-medium p-6 font-sans pb-2">
          Welcome, Dr. John Doe!
        </h1>
        <p className="p-6 pt-0 text-(--color-text-light) font-thin text-sm text-shadow-2xs mb-4">
          Here's your practice overview for today
        </p>
        <div className="bg-gray-200 dark:bg-(--color-bg) rounded-2xl py-4 px-6 flex flex-col gap-6">
          <div className="grid grid-rows-1 grid-cols-4 max-lg:grid-rows-2 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-4">
            <DashboardCard
              title="Appointments"
              subTitle="Today"
              num={"12"}
              logo={<SlCalender />}
              color="blue"
            />
            <DashboardCard
              title="Total Patients"
              subTitle="+12%"
              num={"128"}
              logo={<MdPeople />}
              color="green"
            />
            <DashboardCard
              title="Appointments"
              subTitle="Pending"
              num={"1"}
              logo={<LuFileSpreadsheet />}
              color="yellow"
            />
            <DashboardCard
              title="Appointments"
              subTitle="95%"
              num={"95%"}
              logo={<GoPulse />}
              color="violet"
            />
          </div>
          <div className="flex gap-6 max-md:flex-col">
            <FirstDiv />
            <SecondDiv />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DoctorDashboard;
