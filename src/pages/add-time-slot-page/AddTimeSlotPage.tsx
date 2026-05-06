import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import AddNewSlotPanel from "@/components/Doctor/AddTimeSlot/AddNewSlotPanel";
import WeeklySchedulePanel from "@/components/Doctor/AddTimeSlot/WeeklySchedulePanel";

const AddTimeSlotPage = () => {
  return (
    <DashboardLayout pageTitle="Manage Your Availability">
      <div className="flex items-center justify-between -mt-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-(--color-text)">
            Manage Your Availability
          </h1>
          <p className="text-sm text-(--color-text-light) mt-0.5">
            Set your weekly schedule and{" "}
            <span className="text-(--color-primary) cursor-pointer hover:underline">
              appointment slots
            </span>
          </p>
        </div>
      </div>

      {/* Two-panel layout */}
      <div className="flex gap-6 max-md:flex-col items-start">
        {/* Left – Add New Slot form */}
        <div className="w-80 max-md:w-full shrink-0">
          <AddNewSlotPanel />
        </div>

        {/* Right – Weekly Schedule list */}
        <div className="flex-1 min-w-0">
          <WeeklySchedulePanel />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AddTimeSlotPage;
