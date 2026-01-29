import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import Card from "../../../components/Doctor/Notifications/Card";
import { SlCalender } from "react-icons/sl";

const StudentNotifications = () => {
  return (
    <DashboardLayout pageTitle={"Student Doctor Notifications"}>
      <div className=" p-6 xl:-ml-6 -mt-6 h-[85vh] bg-(--color-bg)">
        <div className="flex justify-between mb-8 items-center border-b-2 border-gray-300 pb-2">
          <h1 className="text-2xl font-normal text-(--color-text)">
            Notifications
          </h1>
          <span className="text-blue-400 font-semibold text-sm cursor-pointer hover:shadow-2xs shadow-blue-400">
            Mark all as read
          </span>
        </div>
        <div className="flex flex-col gap-4">
          <Card
            icon={<SlCalender />}
            title="New Appointment"
            desc="John Doe has booked an appointment for Dec 15, 2025"
            time="1 hour age"
            isRead={false}
            color="text-blue-700"
            bgColor="bg-blue-200"
          />
          <Card
            icon={<SlCalender />}
            title="Appointment Reminder"
            desc="John Doe has booked an appointment for Dec 15, 2025"
            time="1 hour age"
            isRead={true}
            color="text-yellow-700"
            bgColor="bg-yellow-200"
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentNotifications;
