import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import Card from "@/components/Doctor/Reports/Card";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { ScaleLoader } from "react-spinners";
import { toast } from "react-toastify";
import { useEffect, useMemo, useState } from "react";
import { FiChevronLeft, FiChevronRight, FiLayers, FiSliders } from "react-icons/fi";
import { FiFileText, FiX } from "react-icons/fi";

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
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<3 | 5 | 10>(5);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

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
  const totalPages = Math.max(1, Math.ceil(reports.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedReports = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return reports.slice(start, start + pageSize);
  }, [reports, currentPage, pageSize]);

  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  useEffect(() => {
    if (error) {
      toast.error("Failed to load reports");
    }
  }, [error]);

  useEffect(() => {
    setPage(1);
  }, [pageSize]);

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
          <div className="mb-6 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <FiSliders className="text-lg" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-(--color-text)">
                  Filter by Count
                </h2>
                <p className="text-xs text-(--color-text-light) mt-1">
                  Show a smaller batch of report files or the full list.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { label: "10 / page", value: 10 as const },
                { label: "5 / page", value: 5 as const },
                { label: "3 / page", value: 3 as const },
              ].map((option) => {
                const active = pageSize === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setPageSize(option.value)}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-semibold transition-all cursor-pointer ${
                      active
                        ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20"
                        : "bg-(--color-bg) text-(--color-text) border-(--color-border) hover:border-blue-300 hover:bg-blue-50/60"
                    }`}
                  >
                    <FiLayers className="text-sm" />
                    <span>{option.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between gap-3 flex-wrap pt-2">
              <p className="text-xs text-(--color-text-light) font-medium">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={!canGoPrev}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-(--color-border) bg-(--color-bg) text-sm font-semibold text-(--color-text) disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-50/60 transition-all"
                >
                  <FiChevronLeft />
                  Prev
                </button>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={!canGoNext}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-(--color-border) bg-(--color-bg) text-sm font-semibold text-(--color-text) disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-50/60 transition-all"
                >
                  Next
                  <FiChevronRight />
                </button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <ScaleLoader color="#2563eb" />
            </div>
          ) : paginatedReports.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-(--color-text-light)">
              <p className="text-sm font-medium">No reports found</p>
            </div>
          ) : (
            <div className="space-y-1">
              {paginatedReports.map((report, index) => (
                <Card key={index} {...report} onClick={() => setSelectedReport(report)} />
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedReport && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedReport(null)}
        >
          <div
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-(--color-surface) rounded-3xl border border-(--color-border) shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-(--color-border) flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-blue-50 text-blue-600">
                  <FiFileText className="text-xl" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-(--color-text)">
                    Report Details
                  </h2>
                  <p className="text-sm text-(--color-text-light) mt-1">
                    Opened from the report list
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
              >
                <FiX className="text-2xl text-(--color-text-light)" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="p-5 rounded-2xl border border-(--color-border) bg-gray-50/60 dark:bg-gray-800/30">
                <p className="text-xs uppercase tracking-wider text-(--color-text-light) font-bold mb-1">
                  Title
                </p>
                <p className="text-lg font-bold text-(--color-text)">
                  {selectedReport.title}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <InfoBox label="Date" value={selectedReport.date} />
                <InfoBox label="Size" value={selectedReport.size} />
                <InfoBox label="Type" value={selectedReport.type} />
              </div>

              {selectedReport.fileUrl ? (
                <a
                  href={selectedReport.fileUrl}
                  download
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors"
                >
                  <FiFileText />
                  Download Report
                </a>
              ) : (
                <p className="text-sm text-(--color-text-light)">
                  No downloadable file is attached to this report.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

const InfoBox = ({ label, value }: { label: string; value: string }) => (
  <div className="p-4 rounded-2xl border border-(--color-border) bg-(--color-bg)">
    <p className="text-[10px] uppercase tracking-wider font-bold text-(--color-text-light) mb-1">
      {label}
    </p>
    <p className="text-sm font-semibold text-(--color-text) break-words">
      {value}
    </p>
  </div>
);

export default AllReports;
