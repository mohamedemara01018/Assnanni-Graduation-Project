import { useState } from "react";
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import Card from "../../../components/Doctor/Notifications/Card";
import { initialNotifications } from "@/constants/doctorConstants";

const Notifications = () => {
  const [notifications, setNotifications] = useState(initialNotifications);

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
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
