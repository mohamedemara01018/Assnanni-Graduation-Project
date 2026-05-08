import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

interface ReceptionistOverviewData {
  checkIns: number;
  newRegistrations: number;
  scheduledAppointments: number;
  cancellations: number;
  completedAppointments: number;
  activeQueue: number;
}

const Overview = () => {
  const backendUrl = useSelector((state: RootState) => state.config.backendUrl);
  const token = Cookies.get("jwtToken");

  const { data, isLoading } = useQuery<ReceptionistOverviewData>({
    queryKey: ["receptionist-overview"],
    queryFn: async () => {
      const response = await axios.get(
        `${backendUrl}Receptionist/receptionist-overview`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data.data;
    },
  });

  const stats = [
    { label: "Check-ins", value: data?.checkIns ?? 0 },
    { label: "New Registrations", value: data?.newRegistrations ?? 0 },
    { label: "Scheduled Apps", value: data?.scheduledAppointments ?? 0 },
    { label: "Cancellations", value: data?.cancellations ?? 0 },
    { label: "Completed Apps", value: data?.completedAppointments ?? 0 },
    { label: "Active Queue", value: data?.activeQueue ?? 0 },
  ];

  return (
    <div className="bg-(--color-surface) p-8 rounded-2xl border border-(--color-border) shadow-sm w-full">
      <h2 className="text-xl font-bold text-(--color-text) mb-8">Today's Overview</h2>
      <div className="flex flex-col gap-6">
        {isLoading ? (
          <div className="flex flex-col gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-8"></div>
              </div>
            ))}
          </div>
        ) : (
          stats.map((stat, idx) => (
            <div key={idx} className="flex justify-between items-center group">
              <span className="text-sm font-medium text-(--color-text-light) group-hover:text-(--color-text) transition-colors">
                {stat.label}
              </span>
              <span className="text-lg font-bold text-(--color-text)">
                {stat.value}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Overview;

