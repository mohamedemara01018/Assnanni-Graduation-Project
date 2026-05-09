import { FiTrendingUp, FiTrendingDown, FiUsers, FiCalendar, FiFileText, FiDollarSign } from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { ScaleLoader } from "react-spinners";

interface InsightValue {
  value: number;
  change: number;
}

interface InsightsData {
  totalPatients: InsightValue;
  appointment: InsightValue;
  scanProcessed: InsightValue;
  revenue: InsightValue;
}

interface InsightsResponse {
  succeeded: boolean;
  message: string;
  data: InsightsData;
}

const Insights = () => {
  const backendUrl = useSelector((state: RootState) => state.config.backendUrl);
  const token = Cookies.get("jwtToken");

  const { data, isLoading, error } = useQuery<InsightsResponse>({
    queryKey: ["doctor-insights"],
    queryFn: async () => {
      const response = await axios.get(`${backendUrl}Doctors/insights`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    enabled: !!token && !!backendUrl,
  });

  if (error) {
    toast.error("Failed to load insights data");
  }

  const insights = data?.data;

  const statCards = [
    {
      title: "Total Patients",
      value: insights?.totalPatients.value.toLocaleString() || "0",
      change: `${insights?.totalPatients.change || 0}%`,
      icon: <FiUsers className="text-blue-600 text-xl" />,
      iconBg: "bg-blue-50",
      trend: (insights?.totalPatients.change || 0) >= 0 ? "up" : "down",
    },
    {
      title: "Appointments",
      value: insights?.appointment.value.toLocaleString() || "0",
      change: `${insights?.appointment.change || 0}%`,
      icon: <FiCalendar className="text-green-600 text-xl" />,
      iconBg: "bg-green-50",
      trend: (insights?.appointment.change || 0) >= 0 ? "up" : "down",
    },
    {
      title: "Scans Processed",
      value: insights?.scanProcessed.value.toLocaleString() || "0",
      change: `${insights?.scanProcessed.change || 0}%`,
      icon: <FiFileText className="text-purple-600 text-xl" />,
      iconBg: "bg-purple-50",
      trend: (insights?.scanProcessed.change || 0) >= 0 ? "up" : "down",
    },
    {
      title: "Revenue",
      value: `$${insights?.revenue.value.toLocaleString() || "0"}`,
      change: `${insights?.revenue.change || 0}%`,
      icon: <FiDollarSign className="text-orange-600 text-xl" />,
      iconBg: "bg-orange-50",
      trend: (insights?.revenue.change || 0) >= 0 ? "up" : "down",
    },
  ];

  if (isLoading) {
    return (
      <div className="w-full py-10 flex items-center justify-center bg-white border border-gray-100 rounded-2xl shadow-sm mb-8">
        <ScaleLoader color="#2563eb" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((card, index) => (
        <div
          key={index}
          className="bg-(--color-surface) border border-(--color-border) p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200"
        >
          <div className="flex justify-between items-start mb-4">
            <div className={`${card.iconBg} p-3 rounded-xl`}>{card.icon}</div>
            <div className={`flex items-center gap-1 font-medium text-sm ${card.trend === "up" ? "text-(--color-success)" : "text-red-500"}`}>
              {card.trend === "up" ? <FiTrendingUp /> : <FiTrendingDown />}
              <span>{card.change}</span>
            </div>
          </div>
          <div>
            <p className="text-(--color-text-light) text-sm font-medium mb-1">
              {card.title}
            </p>
            <h3 className="text-2xl font-bold text-(--color-text)">{card.value}</h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Insights;

