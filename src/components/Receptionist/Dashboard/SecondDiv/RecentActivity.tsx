import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

interface Activity {
  title: string;
  description: string;
  time: string;
}

const formatRelativeTime = (dateString: string) => {
  const now = new Date();
  const past = new Date(dateString);
  const diffInMs = now.getTime() - past.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} days ago`;
};

const getColorClass = (title: string) => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes("registered")) return "bg-emerald-500";
  if (lowerTitle.includes("scheduled")) return "bg-blue-500";
  if (lowerTitle.includes("checked in")) return "bg-purple-500";
  if (lowerTitle.includes("updated")) return "bg-orange-500";
  return "bg-gray-400";
};

const RecentActivity = () => {
  const backendUrl = useSelector((state: RootState) => state.config.backendUrl);
  const token = Cookies.get("jwtToken");

  let { data: activities, isLoading } = useQuery<Activity[]>({
    queryKey: ["recent-activity"],
    queryFn: async () => {
      const response = await axios.get(
        `${backendUrl}Receptionist/dashboard/recent-activity`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data.data;
    },
  });

  activities = activities?.slice(0, 6) ?? [];
  return (
    <div className="bg-(--color-surface) p-8 rounded-2xl border border-(--color-border) shadow-sm w-full">
      <h2 className="text-xl font-bold text-(--color-text) mb-8">
        Recent Activity
      </h2>
      <div className="flex flex-col gap-6 relative before:absolute before:left-[5px] before:top-2 before:bottom-2 before:w-[1px] before:bg-gray-100 dark:before:bg-gray-800">
        {isLoading ? (
          <div className="flex flex-col gap-6 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="w-[11px] h-[11px] rounded-full bg-gray-200 dark:bg-gray-700 mt-1.5" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : activities && activities.length > 0 ? (
          activities.map((activity, idx) => (
            <div key={idx} className="flex gap-4 items-start relative">
              <div
                className={`w-[11px] h-[11px] rounded-full ${getColorClass(
                  activity.title,
                )} ring-4 ring-white dark:ring-gray-900 shrink-0 mt-1.5`}
              />
              <div>
                <h3 className="text-sm font-bold text-(--color-text)">
                  {activity.title}
                </h3>
                <p className="text-xs text-(--color-text-light) font-medium mt-0.5">
                  {activity.description} • {formatRelativeTime(activity.time)}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-(--color-text-light)">
            No recent activity found.
          </p>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;
