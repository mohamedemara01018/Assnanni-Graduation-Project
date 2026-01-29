import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import Card from "../../../components/Doctor/Dashboard/Card";
import FirstDiv from "../../../components/Doctor/Dashboard/FirstDiv/FirstDiv";
import SecondDiv from "../../../components/Doctor/Dashboard/SecondDiv/SecondDiv";

const DoctorDashboard = () => {
  return (
    <DashboardLayout pageTitle={"Doctor Dashboard"}>
      <div className="xl:-ml-6 -mt-6    bg-(--color-bg)  rounded-2xl">
        <h1 className="text-2xl text-(--color-text) font-medium p-6 font-sans pb-2">
          Welcome, Dr. John Doe!
        </h1>
        <p className="p-6 pt-0 text-(--color-text-light) font-thin text-sm text-shadow-2xs mb-4">
          Here's your practice overview for today
        </p>
        <div className="bg-gray-200 dark:bg-(--color-bg) rounded-2xl py-4 px-6 flex flex-col gap-6">
          <div className="grid grid-rows-1 grid-cols-4 max-lg:grid-rows-2 max-lg:grid-cols-2 gap-4">
            <Card />
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
