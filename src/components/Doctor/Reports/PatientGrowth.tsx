import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { ScaleLoader } from "react-spinners";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface PatientGrowthData {
  months: string[];
  values: number[];
}

interface PatientGrowthResponse {
  succeeded: boolean;
  message: string;
  data: PatientGrowthData;
}

const PatientGrowth = () => {
  const backendUrl = useSelector((state: RootState) => state.config.backendUrl);
  const token = Cookies.get("jwtToken");

  const { data: responseData, isLoading, error } = useQuery<PatientGrowthResponse>({
    queryKey: ["patient-growth"],
    queryFn: async () => {
      const response = await axios.get(`${backendUrl}Doctors/patient-growth`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    enabled: !!token && !!backendUrl,
  });

  if (error) {
    toast.error("Failed to load patient growth data");
  }

  const chartData = {
    labels: responseData?.data.months || [],
    datasets: [
      {
        label: "Patient Growth",
        data: responseData?.data.values || [],
        fill: true,
        backgroundColor: "rgba(37, 99, 235, 0.1)",
        borderColor: "#2563eb",
        borderWidth: 3,
        pointBackgroundColor: "#2563eb",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "#2563eb",
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
        backgroundColor: "rgba(17, 24, 39, 0.9)",
        padding: 12,
        cornerRadius: 8,
        titleColor: "#fff",
        bodyColor: "#fff",
        titleFont: { size: 14, weight: "bold" as const },
        bodyFont: { size: 13 },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "var(--color-text-light)",
          font: { size: 12 },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(156, 163, 175, 0.1)",
        },
        ticks: {
          color: "var(--color-text-light)",
          font: { size: 12 },
          padding: 8,
        },
      },
    },
  };

  return (
    <div className="bg-(--color-surface) border border-(--color-border) p-6 rounded-2xl shadow-sm h-full flex flex-col">
      <h2 className="mb-6 text-lg font-bold text-(--color-text)">Patient Growth</h2>
      <div className="flex-1 min-h-[300px] flex items-center justify-center relative">
        {isLoading ? (
          <ScaleLoader color="#2563eb" />
        ) : (
          <Line data={chartData} options={chartOptions} />
        )}
      </div>
    </div>
  );
};

export default PatientGrowth;

