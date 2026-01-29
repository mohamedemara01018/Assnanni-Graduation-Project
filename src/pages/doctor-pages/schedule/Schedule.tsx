import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import FirstDiv from "../../../components/Doctor/Schedule/FirstDiv/FirstDiv";
import SecondDiv from "../../../components/Doctor/Schedule/SecondDiv/SecondDiv";

const Schedule = () => {
  return (
    <DashboardLayout pageTitle={"Doctor Weekly Schedule"}>
      <div className="flex max-md:flex-col xl:-ml-6 -mt-6 bg-(--color-bg) rounded-2xl ">
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
