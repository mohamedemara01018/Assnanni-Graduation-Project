import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import FirstDiv from "../../../components/Doctor/Schedule/FirstDiv/FirstDiv";
import SecondDiv from "../../../components/Doctor/Schedule/SecondDiv/SecondDiv";

const Schedule = () => {
  return (
    <DashboardLayout pageTitle={"Doctor Weekly Schedule"}>
      <div className="flex flex-col gap-6 px-1">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold text-(--color-text)">My Schedule</h1>
          <p className="text-gray-500 text-sm">Manage your availability and appointments</p>
        </div>
        <div className="flex max-md:flex-col gap-6">
          <div className="flex-2">
            <FirstDiv />
          </div>
          <div className="flex-1">
            <SecondDiv />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Schedule;
