import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import Card from "./Card";
import { SlCalender } from "react-icons/sl";

const Notifications = () => {
  return (
    <DashboardLayout pageTitle={"Doctor Notifications"}>
      <div className=" p-4 -ml-6 -mt-6 h-[90vh]">
        <div className="flex justify-between mb-8 items-center">
          <h1 className="text-2xl font-semibold text-gray-800">
            Notifications
          </h1>
          <span className="text-blue-500 font-semibold text-sm cursor-pointer hover:shadow-2xs shadow-blue-500">
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

export default Notifications;
