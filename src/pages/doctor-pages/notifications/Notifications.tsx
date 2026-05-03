import { useState } from "react";
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import Card from "../../../components/Doctor/Notifications/Card";
import { LuCalendar, LuClock, LuActivity } from "react-icons/lu";

const initialNotifications = [
  {
    id: 1,
    icon: <LuCalendar />,
    title: "Appointment Confirmed",
    desc: "Your appointment with Dr. Sarah Johnson is confirmed for Dec 15, 2025 at 10:00 AM",
    time: "2 hours ago",
    isRead: false,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    id: 2,
    icon: <LuClock />,
    title: "Appointment Reminder",
    desc: "You have an appointment tomorrow with Dr. Emily Rodriguez",
    time: "1 day ago",
    isRead: false,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    id: 3,
    icon: <LuActivity />,
    title: "Scan Results Ready",
    desc: "Your X Ray scan results are now available",
    time: "3 days ago",
    isRead: true,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
];

const Notifications = () => {
  const [notifications, setNotifications] = useState(initialNotifications);

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <DashboardLayout pageTitle={"Notifications"}>
      <div className="p-10 bg-(--color-bg) min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-10 pb-6 border-b border-(--color-border)">
            <h1 className="text-3xl font-bold text-(--color-text)">
              Notifications
            </h1>
            <button
              onClick={markAllAsRead}
              className="text-blue-500 font-bold text-sm hover:text-blue-600 transition-colors cursor-pointer"
            >
              Mark all as read
            </button>
          </div>

          <div className="flex flex-col gap-5">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
              >
                <Card {...notification} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Notifications;
