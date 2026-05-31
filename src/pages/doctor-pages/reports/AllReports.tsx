import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import Card from "@/components/Doctor/Reports/Card";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { ScaleLoader } from "react-spinners";
import { toast } from "react-toastify";
import { useEffect } from "react";

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

const AllReports = () => {
  const backendUrl = useSelector((state: RootState) => state.config.backendUrl);
  const token = Cookies.get("jwtToken");

  const { data: responseData, isLoading, error } = useQuery<RecentReportsResponse>(
    {
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
    },
  );

  const reports = responseData?.data || [];

  useEffect(() => {
    if (error) {
      toast.error("Failed to load reports");
    }
  }, [error]);

  return (
    <DashboardLayout pageTitle="All Reports">
      <div className="p-8 bg-gray-50/50 min-h-screen">
        <div className="mb-10 flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-gray-900">All Recent Reports</h1>
          <p className="text-gray-500 font-medium">
            Browse the full list of generated reports and download files when available.
          </p>
        </div>

        <div className="bg-(--color-surface) border border-(--color-border) rounded-2xl shadow-sm p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <ScaleLoader color="#2563eb" />
            </div>
          ) : reports.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-(--color-text-light)">
              <p className="text-sm font-medium">No reports found</p>
            </div>
          ) : (
            <div className="space-y-1">
              {reports.map((report, index) => (
                <Card key={index} {...report} />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AllReports;
