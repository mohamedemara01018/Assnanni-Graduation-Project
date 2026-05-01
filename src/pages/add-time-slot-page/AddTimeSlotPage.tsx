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
        <button className="flex items-center gap-2 bg-(--color-primary) hover:bg-(--color-primary-dark) text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors duration-200 cursor-pointer shadow-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
            />
          </svg>
          Save Changes
        </button>
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
