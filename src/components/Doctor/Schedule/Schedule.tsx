import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import FirstDiv from "./FirstDiv/FirstDiv";
import SecondDiv from "./SecondDiv/SecondDiv";

const Schedule = () => {
  return (
    <DashboardLayout pageTitle={"Doctor Weekly Schedule"}>
      <div className="flex max-md:flex-col -ml-6 -mt-6">
        <div className="flex-2">
          <FirstDiv />
        </div>
        <div className="flex-1">
          <SecondDiv />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Schedule;
