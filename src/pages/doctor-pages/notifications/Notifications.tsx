import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import Card from "../../../components/Doctor/Notifications/Card";
import { FiCalendar, FiActivity, FiBell } from "react-icons/fi";

const notificationsData = [
  {
    icon: <FiCalendar />,
    title: "New Appointment",
    desc: "John Doe has booked an appointment for Dec 15, 2025",
    time: "1 hour ago",
    isRead: false,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    icon: <FiActivity />,
    title: "Scan Uploaded",
    desc: "Patient Mary Smith uploaded a new CT scan for review",
    time: "4 hours ago",
    isRead: false,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    icon: <FiBell />,
    title: "Schedule Updated",
    desc: "Your availability has been updated for next week",
    time: "1 day ago",
    isRead: true,
    color: "text-gray-600",
    bgColor: "bg-gray-50",
  },
];

const Notifications = () => {
  return (
    <DashboardLayout pageTitle={"Doctor Notifications"}>
      <div className="p-10 bg-gray-50/50 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-end mb-10 pb-4 border-b border-gray-100">
            <h1 className="text-3xl font-bold text-gray-900">
              Notifications
            </h1>
            <button className="text-blue-600 font-bold text-sm hover:text-blue-700 transition-colors">
              Mark all as read
            </button>
          </div>
          
          <div className="flex flex-col gap-4">
            {notificationsData.map((notification, index) => (
              <Card key={index} {...notification} />
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Notifications;
