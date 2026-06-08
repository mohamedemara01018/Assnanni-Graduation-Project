import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import Card from "../../../components/Doctor/Notifications/Card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { ScaleLoader } from "react-spinners";
import {
  FiBell,
  FiAlertCircle,
  FiCheckCircle,
  FiInfo,
  FiAlertTriangle,
  FiMessageSquare,
} from "react-icons/fi";

interface Notification {
  id: number;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  type: string;
  timeAgo: string;
}

interface NotificationsResponse {
  succeeded: boolean;
  message: string;
  data: Notification[];
}

const Notifications = () => {
  const queryClient = useQueryClient();
  const backendUrl = useSelector((state: RootState) => state.config.backendUrl);
  const token = Cookies.get("jwtToken");

  const {
    data: responseData,
    isLoading,
    error,
  } = useQuery<NotificationsResponse>({
    queryKey: ["notifications"],
    queryFn: async () => {
      const response = await axios.get(`${backendUrl}Notification`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    enabled: !!token && !!backendUrl,
  });

  const { data: unreadCountData } = useQuery({
    queryKey: ["unread-count"],
    queryFn: async () => {
      const response = await axios.get(
        `${backendUrl}Notification/unread-count`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data;
    },
    enabled: !!token && !!backendUrl,
  });

  const unreadCount = unreadCountData?.data ?? 0;

  const markAsReadMutation = useMutation({
    mutationFn: async (id: number) => {
      await axios.patch(
        `${backendUrl}Notification/${id}/mark-as-read`,
        { notificationId: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] });
      await queryClient.cancelQueries({ queryKey: ["unread-count"] });

      const previousNotifications =
        queryClient.getQueryData<NotificationsResponse>(["notifications"]);
      const previousCount = queryClient.getQueryData<{ data: number }>([
        "unread-count",
      ]);

      if (previousNotifications) {
        queryClient.setQueryData<NotificationsResponse>(["notifications"], {
          ...previousNotifications,
          data: previousNotifications.data.map((n) =>
            n.id === id ? { ...n, isRead: true } : n,
          ),
        });
      }

      if (previousCount) {
        queryClient.setQueryData<{ data: number }>(["unread-count"], {
          data: Math.max(0, previousCount.data - 1),
        });
      }

      return { previousNotifications, previousCount };
    },
    onError: (_err, _id, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          ["notifications"],
          context.previousNotifications,
        );
      }
      if (context?.previousCount) {
        queryClient.setQueryData(["unread-count"], context.previousCount);
      }
      toast.error("Failed to mark notification as read");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unread-count"] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      await axios.patch(
        `${backendUrl}Notification/mark-all-as-read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] });
      await queryClient.cancelQueries({ queryKey: ["unread-count"] });

      const previousNotifications =
        queryClient.getQueryData<NotificationsResponse>(["notifications"]);
      const previousCount = queryClient.getQueryData<{ data: number }>([
        "unread-count",
      ]);

      if (previousNotifications) {
        queryClient.setQueryData<NotificationsResponse>(["notifications"], {
          ...previousNotifications,
          data: previousNotifications.data.map((n) => ({ ...n, isRead: true })),
        });
      }

      queryClient.setQueryData<{ data: number }>(["unread-count"], { data: 0 });

      return { previousNotifications, previousCount };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          ["notifications"],
          context.previousNotifications,
        );
      }
      if (context?.previousCount) {
        queryClient.setQueryData(["unread-count"], context.previousCount);
      }
      toast.error("Failed to mark all as read");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unread-count"] });
    },
  });

  const clearAllMutation = useMutation({
    mutationFn: async () => {
      await axios.delete(`${backendUrl}Notification/clear-all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] });
      await queryClient.cancelQueries({ queryKey: ["unread-count"] });

      const previousNotifications =
        queryClient.getQueryData<NotificationsResponse>(["notifications"]);
      const previousCount = queryClient.getQueryData<{ data: number }>([
        "unread-count",
      ]);

      if (previousNotifications) {
        queryClient.setQueryData<NotificationsResponse>(["notifications"], {
          ...previousNotifications,
          data: [],
        });
      }

      if (previousCount) {
        queryClient.setQueryData<{ data: number }>(["unread-count"], {
          data: 0,
        });
      }

      return { previousNotifications, previousCount };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          ["notifications"],
          context.previousNotifications,
        );
      }
      if (context?.previousCount) {
        queryClient.setQueryData(["unread-count"], context.previousCount);
      }
      toast.error("Failed to clear notifications");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unread-count"] });
    },
  });

  if (error) {
    toast.error("Failed to load notifications");
  }

  const notifications = responseData?.data || [];

  const getIconConfig = (type: string) => {
    switch (type) {
      case "Warning":
        return {
          icon: <FiAlertTriangle />,
          color: "text-orange-500",
          bgColor: "bg-orange-500/10",
        };
      case "Success":
        return {
          icon: <FiCheckCircle />,
          color: "text-emerald-500",
          bgColor: "bg-emerald-500/10",
        };
      case "Error":
        return {
          icon: <FiAlertCircle />,
          color: "text-red-500",
          bgColor: "bg-red-500/10",
        };
      case "Message":
        return {
          icon: <FiMessageSquare />,
          color: "text-indigo-500",
          bgColor: "bg-indigo-500/10",
        };
      case "Info":
      default:
        return {
          icon: <FiInfo />,
          color: "text-blue-500",
          bgColor: "bg-blue-500/10",
        };
    }
  };

  return (
    <DashboardLayout pageTitle={"Notifications"}>
      <div className="p-4 sm:p-10 bg-(--color-bg) min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-10 pb-6 border-b border-(--color-border)">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
                <FiBell className="text-2xl" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-(--color-text)">
                Notifications
              </h1>
              {unreadCount >= 0 && (
                <span
                  className={`px-2.5 py-0.5 text-white text-sm font-bold rounded-full animate-in fade-in zoom-in duration-300 ${unreadCount > 0 ? "bg-blue-600" : "bg-gray-400"}`}
                >
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => markAllAsReadMutation.mutate()}
                disabled={
                  markAllAsReadMutation.isPending ||
                  notifications.every((n) => n.isRead)
                }
                className="text-blue-500 font-bold text-sm hover:text-blue-600 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {markAllAsReadMutation.isPending
                  ? "Marking..."
                  : "Mark all as read"}
              </button>

              {notifications.length > 0 && (
                <button
                  onClick={() => clearAllMutation.mutate()}
                  disabled={clearAllMutation.isPending}
                  className="text-red-500 font-bold text-sm hover:text-red-600 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {clearAllMutation.isPending ? "Clearing..." : "Clear all"}
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-5">
            {isLoading ? (
              <div className="py-20 flex justify-center items-center">
                <ScaleLoader color="#2563eb" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-20 text-center text-(--color-text-light)">
                <p className="text-lg font-medium">No notifications yet</p>
                <p className="text-sm">
                  We'll notify you when something important happens.
                </p>
              </div>
            ) : (
              notifications.map((notification) => {
                const config = getIconConfig(notification.type);
                return (
                  <div
                    key={notification.id}
                    onClick={() => {
                      if (!notification.isRead) {
                        markAsReadMutation.mutate(notification.id);
                      }
                    }}
                  >
                    <Card
                      icon={config.icon}
                      title={notification.title}
                      desc={notification.message}
                      time={notification.timeAgo}
                      isRead={notification.isRead}
                      color={config.color}
                      bgColor={config.bgColor}
                    />
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Notifications;
