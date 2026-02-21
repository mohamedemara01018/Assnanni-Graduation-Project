import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import DashboardCard from "@/components/DashboardCard/DashboardCard";
import FirstDiv from "@/components/Receptionist/Dashboard/FirstDiv/FirstDiv";
import SecondDiv from "@/components/Receptionist/Dashboard/SecondDiv/SecondDiv";
import { MdCreditCard } from "react-icons/md";
import { MdPeople } from "react-icons/md";
import { SlCalender } from "react-icons/sl";
import { ImClock } from "react-icons/im";

const ReceptionistDashboard = () => {
  return (
    <div>
      <DashboardLayout pageTitle={"Receptionist Dashboard"}>
        <div className=" -mt-6    bg-(--color-bg)  rounded-2xl">
          <h1 className="text-2xl text-(--color-text) font-medium p-6 font-sans pb-2">
            Welcome, John Doe!
          </h1>
          <p className="p-6 pt-0 text-(--color-text-light) font-thin text-sm text-shadow-2xs mb-4">
            Manage patient flow and appointments
          </p>
          <div className="bg-gray-200 dark:bg-(--color-bg) rounded-2xl py-4 px-6 flex flex-col gap-6">
            <div className="grid grid-rows-1 grid-cols-4 max-lg:grid-rows-2 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-4">
              <DashboardCard
                title="Appointments"
                subTitle="Today"
                num={"3"}
                logo={<SlCalender />}
                color="blue"
              />
              <DashboardCard
                title="Total Patients"
                subTitle="+5%"
                num={"3"}
                logo={<MdPeople />}
                color="green"
              />
              <DashboardCard
                title="In Queue"
                subTitle="Active"
                num={"1"}
                logo={<ImClock />}
                color="yellow"
              />
              <DashboardCard
                title="Active Doctors"
                subTitle=""
                num={"6"}
                logo={<MdCreditCard />}
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
    </div>
  );
};

export default ReceptionistDashboard;
