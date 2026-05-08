import Card from "./Card";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { ScaleLoader } from "react-spinners";

interface Report {
  title: string;
  date: string;
  size: string;
  type: "PDF" | "Excel" | "File";
  fileUrl?: string;
}

interface RecentReportsResponse {
  succeeded: boolean;
  message: string;
  data: Report[];
}

const RecentReports = () => {
  const backendUrl = useSelector((state: RootState) => state.config.backendUrl);
  const token = Cookies.get("jwtToken");

  const { data: responseData, isLoading, error } = useQuery<RecentReportsResponse>({
    queryKey: ["recent-reports"],
    queryFn: async () => {
      const response = await axios.get(`${backendUrl}Doctors/recent-reports`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    enabled: !!token && !!backendUrl,
  });

  if (error) {
    toast.error("Failed to load recent reports");
  }

  const reports = responseData?.data || [];

  return (
    <div className="bg-(--color-surface) border border-(--color-border) p-6 rounded-2xl shadow-sm h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-(--color-text) font-bold text-lg">Recent Reports</h3>
        <button className="text-(--color-primary) hover:text-(--color-primary-light) font-semibold text-sm transition-colors">
          View All
        </button>
      </div>
      
      <div className="space-y-1 flex-1 overflow-y-auto custom-scrollbar">
        {isLoading ? (
          <div className="h-full flex items-center justify-center py-10">
            <ScaleLoader color="#2563eb" />
          </div>
        ) : reports.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center py-10 text-(--color-text-light)">
            <p className="text-sm font-medium">No recent reports found</p>
          </div>
        ) : (
          reports.map((report, index) => (
            <Card key={index} {...report} />
          ))
        )}
      </div>
    </div>
  );
};

export default RecentReports;

