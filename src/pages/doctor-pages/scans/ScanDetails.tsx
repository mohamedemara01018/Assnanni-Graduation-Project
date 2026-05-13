import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import Cookies from "js-cookie";
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import { IoArrowBack } from "react-icons/io5";
import { HiOutlineCalendar, HiOutlineCpuChip } from "react-icons/hi2";
import { LuUser, LuScanLine, LuSquareCheck } from "react-icons/lu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useState } from "react";
import { FiPlus } from "react-icons/fi";

interface ScanDetailsData {
  id: number;
  patientName: string;
  scanType: string;
  imageUrl: string;
  uploadedAt: string;
  aiConfidence: number;
  result: string;
  findings: string;
  recommendations: string;
  status: string;
}

const ScanDetails = () => {
  const { scanId } = useParams();
  const navigate = useNavigate();
  const backendUrl = useSelector((state: RootState) => state.config.backendUrl);
  const token = Cookies.get("jwtToken");
  const queryClient = useQueryClient();

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewFormData, setReviewFormData] = useState({
    findings: "",
    recommendations: "",
  });

  const {
    data: scanData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["ScanDetails", scanId],
    queryFn: async () => {
      const response = await axios.get(`${backendUrl}Scans/${scanId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response);
      return response.data;
    },
    enabled: !!scanId,
  });

  const scan = scanData?.data as ScanDetailsData;

  const reviewMutation = useMutation({
    mutationFn: async (payload: {
      findings: string;
      recommendations: string;
    }) => {
      await axios.post(`${backendUrl}Scans/${scan.id}/review`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      toast.success("Review submitted successfully");
      setIsReviewModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["ScanDetails", scanId] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to submit review");
    },
  });

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewFormData.findings || !reviewFormData.recommendations) {
      toast.error("Please provide both findings and recommendations");
      return;
    }
    reviewMutation.mutate(reviewFormData);
  };

  const startReviewMutation = useMutation({
    mutationFn: async () => {
      await axios.patch(
        `${backendUrl}Scans/${scan.id}/start-review`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
    },
    onSuccess: () => {
      toast.success("Review session started");
      queryClient.invalidateQueries({ queryKey: ["ScanDetails", scanId] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to start review");
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async () => {
      await axios.patch(
        `${backendUrl}Scans/${scan.id}/reject`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
    },
    onSuccess: () => {
      toast.success("Scan rejected successfully");
      navigate(-1);
      queryClient.invalidateQueries({ queryKey: ["ScanDetails", scanId] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to reject scan");
    },
  });

  const reopenMutation = useMutation({
    mutationFn: async () => {
      await axios.patch(
        `${backendUrl}Scans/${scan.id}/reopen`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
    },
    onSuccess: () => {
      toast.success("Scan reopened successfully");
      queryClient.invalidateQueries({ queryKey: ["ScanDetails", scanId] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to reopen scan");
    },
  });

  if (isLoading) {
    return (
      <DashboardLayout pageTitle="Scan Analysis">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="w-10 h-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (isError || !scan) {
    return (
      <DashboardLayout pageTitle="Scan Analysis">
        <div className="p-8 text-center">
          <p className="text-red-500 font-bold text-lg">
            Failed to load scan details or scan not found.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 text-blue-600 font-medium hover:underline"
          >
            Go Back
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle="Scan Analysis">
      <div className="-mt-6 p-8 bg-(--color-bg) min-h-screen rounded-2xl">
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-(--color-text-light) hover:text-(--color-text) transition-colors mb-6 cursor-pointer font-medium"
            >
              <IoArrowBack />
              <span>Back to Dashboard</span>
            </button>
            <h1 className="text-3xl font-bold text-(--color-text) tracking-tight">
              AI Scan Analysis Report
            </h1>
            <p className="text-(--color-text-light) font-medium mt-1">
              Detailed radiographic findings and AI-assisted insights
            </p>
          </div>

          <div className="flex items-center gap-3">
            {(scan.status === "Pending" || scan.status === "InProgress") && (
              <button
                onClick={() => {
                  if (
                    window.confirm("Are you sure you want to reject this scan?")
                  ) {
                    rejectMutation.mutate();
                  }
                }}
                disabled={rejectMutation.isPending}
                className="flex items-center justify-center gap-2 bg-white dark:bg-transparent border-2 border-red-200 hover:border-red-500 text-red-500 px-6 py-4 rounded-2xl font-bold transition-all active:scale-95 cursor-pointer h-fit disabled:opacity-50"
              >
                <span>
                  {rejectMutation.isPending ? "Rejecting..." : "Reject Scan"}
                </span>
              </button>
            )}

            {scan.status === "Rejected" && (
              <button
                onClick={() => reopenMutation.mutate()}
                disabled={reopenMutation.isPending}
                className="flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 px-8 py-4 rounded-2xl font-bold transition-all active:scale-95 cursor-pointer h-fit disabled:opacity-50 border border-blue-200"
              >
                <span>
                  {reopenMutation.isPending ? "Reopening..." : "Reopen Scan"}
                </span>
              </button>
            )}

            {scan.status === "Pending" ? (
              <button
                onClick={() => startReviewMutation.mutate()}
                disabled={startReviewMutation.isPending}
                className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer h-fit disabled:opacity-50"
              >
                <LuSquareCheck className="text-xl" />
                <span>
                  {startReviewMutation.isPending
                    ? "Starting..."
                    : "Start Review"}
                </span>
              </button>
            ) : scan.status === "InProgress" ? (
              <button
                onClick={() => {
                  setReviewFormData({
                    findings: scan.findings || "",
                    recommendations: scan.recommendations || "",
                  });
                  setIsReviewModalOpen(true);
                }}
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95 cursor-pointer h-fit"
              >
                <LuSquareCheck className="text-xl" />
                <span>Complete Review</span>
              </button>
            ) : null}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Content - Image & Findings */}
          <div className="xl:col-span-2 space-y-8">
            {/* Scan Image Card */}
            <div className="bg-(--color-surface) rounded-3xl border border-(--color-border) overflow-hidden shadow-sm">
              <div className="p-6 border-b border-(--color-border) flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/30">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl">
                    <LuScanLine size={20} />
                  </div>
                  <span className="font-bold text-(--color-text)">
                    Original Radiograph
                  </span>
                </div>
                <span
                  className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                    scan.status === "Completed"
                      ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                      : "bg-yellow-50 text-yellow-600 border-yellow-100"
                  }`}
                >
                  {scan.status}
                </span>
              </div>
              <div className="p-8 flex justify-center bg-black/5 dark:bg-black/20">
                <img
                  src={
                    scan.imageUrl.startsWith("http")
                      ? scan.imageUrl
                      : `${backendUrl}${scan.imageUrl}`
                  }
                  alt="Radiographic Scan"
                  className="max-h-[500px] rounded-2xl shadow-2xl object-contain border-4 border-white dark:border-gray-800"
                />
              </div>
            </div>

            {/* AI Insights Card */}
            <div className="bg-(--color-surface) rounded-3xl border border-(--color-border) p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-xl">
                  <HiOutlineCpuChip size={24} />
                </div>
                <h2 className="text-xl font-bold text-(--color-text)">
                  AI-Assisted Observations
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="p-6 bg-purple-50/30 dark:bg-purple-900/5 rounded-2xl border border-purple-100/50">
                  <p className="text-xs font-bold text-purple-600 uppercase tracking-widest mb-2">
                    Confidence Score
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-purple-700">
                      {(scan.aiConfidence * 100).toFixed(1)}%
                    </span>
                    <span className="text-sm font-bold text-purple-500">
                      Match Probability
                    </span>
                  </div>
                </div>
                <div className="p-6 bg-blue-50/30 dark:bg-blue-900/5 rounded-2xl border border-blue-100/50">
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">
                    AI Result
                  </p>
                  <p className="text-2xl font-bold text-blue-700">
                    {scan.result}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-(--color-text) mb-2 uppercase tracking-wider">
                    Clinical Findings
                  </h3>
                  <div className="p-6 bg-gray-50/50 dark:bg-gray-800/30 rounded-2xl border border-(--color-border)">
                    <p className="text-(--color-text) leading-relaxed">
                      {scan.findings}
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-(--color-text) mb-2 uppercase tracking-wider">
                    Recommended Actions
                  </h3>
                  <div className="p-6 bg-emerald-50/30 dark:bg-emerald-900/5 rounded-2xl border border-emerald-100/50">
                    <p className="text-(--color-text) leading-relaxed">
                      {scan.recommendations}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Patient & Meta Info */}
          <div className="space-y-6">
            <div className="bg-(--color-surface) rounded-3xl border border-(--color-border) p-8 shadow-sm">
              <h2 className="text-lg font-bold text-(--color-text) mb-6 pb-4 border-b border-(--color-border)">
                Patient Summary
              </h2>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center border border-blue-100">
                    <LuUser size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-(--color-text-light) font-bold uppercase tracking-wider mb-0.5">
                      Patient Name
                    </p>
                    <p className="font-bold text-(--color-text)">
                      {scan.patientName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center border border-emerald-100">
                    <HiOutlineCalendar size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-(--color-text-light) font-bold uppercase tracking-wider mb-0.5">
                      Upload Date
                    </p>
                    <p className="font-bold text-(--color-text)">
                      {new Date(scan.uploadedAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center border border-orange-100">
                    <LuScanLine size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-(--color-text-light) font-bold uppercase tracking-wider mb-0.5">
                      Scan Category
                    </p>
                    <p className="font-bold text-(--color-text)">
                      {scan.scanType}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-600 rounded-3xl p-8 text-white shadow-lg shadow-blue-200">
              <h3 className="font-bold mb-3">Professional Note</h3>
              <p className="text-blue-50 text-sm leading-relaxed opacity-90">
                This AI analysis is provided as a supportive tool. Clinical
                decisions should always be cross-verified with manual
                radiographic examination.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-(--color-surface) rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-(--color-border) animate-in zoom-in duration-300">
            <div className="p-8 border-b border-(--color-border) flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-(--color-text)">
                  Professional Scan Review
                </h2>
                <p className="text-sm text-(--color-text-light) mt-1">
                  Validate AI findings and provide expert recommendations
                </p>
              </div>
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors cursor-pointer"
              >
                <FiPlus className="text-2xl rotate-45 text-(--color-text-light)" />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="p-8 space-y-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-(--color-text-light) uppercase tracking-wider">
                  Expert Findings
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Describe your radiographic observations..."
                  className="bg-gray-50 dark:bg-gray-800/30 border border-(--color-border) rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
                  value={reviewFormData.findings}
                  onChange={(e) =>
                    setReviewFormData({
                      ...reviewFormData,
                      findings: e.target.value,
                    })
                  }
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-(--color-text-light) uppercase tracking-wider">
                  Professional Recommendations
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Recommended treatment or follow-up..."
                  className="bg-gray-50 dark:bg-gray-800/30 border border-(--color-border) rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
                  value={reviewFormData.recommendations}
                  onChange={(e) =>
                    setReviewFormData({
                      ...reviewFormData,
                      recommendations: e.target.value,
                    })
                  }
                />
              </div>

              <div className="pt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="flex-1 py-4 text-(--color-text-light) font-bold hover:text-(--color-text) transition-colors cursor-pointer"
                >
                  Discard Changes
                </button>
                <button
                  type="submit"
                  disabled={reviewMutation.isPending}
                  className="flex-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-4 px-8 rounded-2xl transition-all shadow-xl shadow-blue-500/20 active:scale-95 cursor-pointer"
                >
                  {reviewMutation.isPending
                    ? "Submitting..."
                    : "Finalize Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ScanDetails;
