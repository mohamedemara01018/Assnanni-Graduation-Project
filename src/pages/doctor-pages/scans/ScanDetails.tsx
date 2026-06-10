import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import Cookies from "js-cookie";
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import { IoArrowBack } from "react-icons/io5";
import {
  HiOutlineCalendar,
  HiOutlineCpuChip,
  HiOutlineSparkles,
} from "react-icons/hi2";
import { LuUser, LuScanLine, LuSquareCheck } from "react-icons/lu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useEffect, useRef, useState } from "react";
import type { TreatmentRecommendationCache } from "./TreatmentRecommendation";
import { treatmentRecommendationQueryKey } from "./TreatmentRecommendation";
import { useForm } from "react-hook-form";
import { FiPlus } from "react-icons/fi";
import { LuClipboardList } from "react-icons/lu";
import {
  resolveAssetUrl,
  resolveFetchableAssetUrl,
} from "@/utils/resolveAssetUrl";
interface ScanDetection {
  className: string;
  confidence: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface ScanDetailsData {
  scanId: number;
  patientId: number;
  patientName: string;
  patientImage: string;
  scanType: string;
  priority: string;
  status: string;
  aiStatus: string;
  fileUrl: string;
  annotatedImageUrl: string;
  uploadedAt: string;
  detections: ScanDetection[];
  findings?: string;
  recommendations?: string;
}

interface ReviewFormData {
  findings: string;
  diagnosis: string;
  notes: string;
  recommendations: string;
}

interface ScanReviewData {
  scanId: number;
  patientId: number;
  patientImage: string;
  patientName: string;
  doctorName: string | null;
  finding: string;
  diagnosis: string;
  notes: string;
  recommendations: string;
  reviewDate: string;
}

const ScanDetails = () => {
  const { scanId } = useParams();
  const navigate = useNavigate();
  const backendUrl = useSelector((state: RootState) => state.config.backendUrl);
  const token = Cookies.get("jwtToken");
  const queryClient = useQueryClient();

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isViewReviewOpen, setIsViewReviewOpen] = useState(false);
  const [hasSubmittedReview, setHasSubmittedReview] = useState(false);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStage, setGenerationStage] = useState<
    "idle" | "loading-image" | "uploading" | "analyzing"
  >("idle");
  const analyzingProgressRef = useRef<number | null>(null);

  const clearAnalyzingProgress = () => {
    if (analyzingProgressRef.current) {
      window.clearInterval(analyzingProgressRef.current);
      analyzingProgressRef.current = null;
    }
  };

  const resetGenerationProgress = () => {
    clearAnalyzingProgress();
    setGenerationStage("idle");
    setGenerationProgress(0);
  };

  const startAnalyzingProgress = () => {
    clearAnalyzingProgress();
    setGenerationStage("analyzing");
    analyzingProgressRef.current = window.setInterval(() => {
      setGenerationProgress((prev) => (prev >= 95 ? prev : prev + 1));
    }, 350);
  };

  useEffect(() => () => clearAnalyzingProgress(), []);

  const {
    register: registerReview,
    handleSubmit: handleReviewSubmit,
    reset: resetReview,
    formState: { errors: reviewErrors },
  } = useForm<ReviewFormData>();

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
      return response.data;
    },
    enabled: !!scanId,
    refetchInterval: (query) => {
      const currentScan = query.state.data?.data as ScanDetailsData | undefined;
      const currentStatus = currentScan?.status?.toLowerCase();

      if (!currentStatus) return 4000;

      return currentStatus === "complete" || currentStatus === "completed"
        ? false
        : 4000;
    },
  });

  const scan = scanData?.data as ScanDetailsData;

  const { data: annotatedImageUrlData } = useQuery({
    queryKey: ["ScanAnnotatedImage", scanId],
    queryFn: async () => {
      const response = await axios.get(
        `${backendUrl}Scans/${scanId}/annotated-image`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return response.data;
    },
    enabled: !!scanId && !!backendUrl && !!token,
    retry: 1,
  });

  const annotatedImageUrl = annotatedImageUrlData?.data as string | null;
  // Prefer: dedicated annotated-image endpoint → annotatedImageUrl field → fileUrl
  const displayImageUrl = resolveAssetUrl(
    annotatedImageUrl || scan?.annotatedImageUrl || scan?.fileUrl || "",
  );

  const { data: reportData, isLoading: isReportLoading } = useQuery({
    queryKey: ["ScanReport", scanId],
    queryFn: async () => {
      const response = await axios.get(`${backendUrl}Scans/${scanId}/report`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    enabled: !!scanId && !!backendUrl && !!token,
    retry: 1,
  });

  const scanReport = reportData?.data as {
    totalDetections: number;
    findings: { className: string; count: number }[];
  } | null;

  const reviewMutation = useMutation({
    mutationFn: async (payload: ReviewFormData) => {
      await axios.post(
        `${backendUrl}Scans/review`,
        {
          scanId: scan.scanId,
          findings: payload.findings,
          diagnosis: payload.diagnosis,
          notes: payload.notes,
          recommendations: payload.recommendations,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
    },
    onSuccess: () => {
      setHasSubmittedReview(true);
      setIsReviewModalOpen(false);
      resetReview();
      queryClient.invalidateQueries({ queryKey: ["ScanDetails", scanId] });
      queryClient.invalidateQueries({ queryKey: ["ScanReview", scanId] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to submit review");
    },
  });

  const onReviewSubmit = (data: ReviewFormData) => {
    reviewMutation.mutate(data);
  };

  const treatmentRecommendationMutation = useMutation({
    mutationFn: async () => {
      if (!scan?.fileUrl) throw new Error("Scan image not available");

      setGenerationStage("loading-image");
      setGenerationProgress(12);

      const imageUrl = resolveFetchableAssetUrl(scan.fileUrl);

      const imageResponse = await axios.get(imageUrl, {
        responseType: "blob",
      });

      setGenerationProgress(28);

      const extension = scan.fileUrl.split(".").pop()?.split("?")[0] || "jpg";
      const file = new File(
        [imageResponse.data],
        `scan-${scan.scanId}.${extension}`,
        { type: imageResponse.data.type || "image/jpeg" },
      );

      if (!file || file.size === 0) {
        throw new Error("Failed to create file from scan image");
      }

      const formData = new FormData();
      formData.append("formFile", file);
      console.log("File:", file);
      console.log("FormData file:", file.name, file.size, file.type);
      console.log("new");
      setGenerationStage("uploading");
      setGenerationProgress(35);
      console.log("FormData:", formData);
      const response = await axios.post(
        `${backendUrl}Scans/treatment-recommendation`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          onUploadProgress: (event) => {
            const total = event.total || 0;
            if (!total) {
              setGenerationStage("analyzing");
              startAnalyzingProgress();
              return;
            }

            const uploadPercent = Math.round((event.loaded / total) * 100);
            setGenerationProgress(35 + Math.round(uploadPercent * 0.35));

            if (event.loaded >= total) {
              setGenerationStage("analyzing");
              startAnalyzingProgress();
              setGenerationProgress((prev) => Math.max(prev, 72));
            }
          },
        },
      );
      console.log(response);
      return response.data;
    },
    onSuccess: (response) => {
      clearAnalyzingProgress();

      if (!response.succeeded) {
        resetGenerationProgress();
        toast.error(
          response.message || "Failed to get treatment recommendation",
        );
        return;
      }

      setGenerationProgress(100);

      const cacheData: TreatmentRecommendationCache = {
        recommendation: response.data,
        patientName: scan.patientName,
        patientId: scan.patientId,
        scanId: scan.scanId,
      };

      queryClient.setQueryData(
        treatmentRecommendationQueryKey(scanId),
        cacheData,
      );

      window.setTimeout(() => {
        resetGenerationProgress();
        navigate(`/scan/analysis/${scanId}/treatment-recommendation`);
      }, 400);
    },
    onError: (err: any) => {
      resetGenerationProgress();
      toast.error(
        err.response?.data?.message || "Failed to get treatment recommendation",
      );
    },
  });

  const isGeneratingTreatment =
    treatmentRecommendationMutation.isPending || generationStage !== "idle";

  const generationStageLabel =
    generationStage === "loading-image"
      ? "Loading scan image..."
      : generationStage === "uploading"
        ? "Sending scan to AI model..."
        : generationStage === "analyzing"
          ? "AI is generating treatment recommendations..."
          : "";

  const startReviewMutation = useMutation({
    mutationFn: async () => {
      await axios.patch(
        `${backendUrl}Scans/${scan.scanId}/start-review`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ScanDetails", scanId] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to start review");
    },
  });

  const scanReviewQuery = useQuery({
    queryKey: ["ScanReview", scanId],
    queryFn: async () => {
      const response = await axios.get(`${backendUrl}Scans/${scanId}/review`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    enabled: false,
    retry: 1,
  });

  const scanReview = scanReviewQuery.data?.data as ScanReviewData | undefined;
  const isCompletedStatus =
    scan?.status?.toLowerCase() === "complete" ||
    scan?.status?.toLowerCase() === "completed";
  const canShowReview = isCompletedStatus || hasSubmittedReview;

  useEffect(() => {
    if (scanReviewQuery.isError && isViewReviewOpen) {
      toast.error("Failed to load review details");
    }
  }, [isViewReviewOpen, scanReviewQuery.isError]);

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

          <div className="flex flex-wrap items-center gap-3">
            {scan.fileUrl && (
              <button
                onClick={() => treatmentRecommendationMutation.mutate()}
                disabled={treatmentRecommendationMutation.isPending}
                className="flex items-center justify-center gap-2 bg-teal-50 hover:bg-teal-100 dark:bg-teal-900/10 dark:hover:bg-teal-900/20 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-800 px-6 py-4 rounded-2xl font-bold transition-all active:scale-95 cursor-pointer h-fit disabled:opacity-50"
              >
                <HiOutlineSparkles className="text-xl" />
                <span>
                  {treatmentRecommendationMutation.isPending
                    ? "Generating..."
                    : "Treatment Recommendations"}
                </span>
              </button>
            )}

            {canShowReview && (
              <button
                onClick={() => {
                  setIsViewReviewOpen(true);
                  scanReviewQuery.refetch();
                }}
                className="flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/10 dark:hover:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 px-6 py-4 rounded-2xl font-bold transition-all active:scale-95 cursor-pointer h-fit"
              >
                <LuClipboardList className="text-xl" />
                <span>Show Review</span>
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
            ) : scan.status === "InProgress" && !hasSubmittedReview ? (
              <button
                onClick={() => {
                  resetReview();
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

        {isGeneratingTreatment && (
          <div className="mb-8 p-6 bg-(--color-surface) rounded-3xl border border-teal-200 dark:border-teal-800 shadow-sm">
            <div className="flex items-center justify-between gap-4 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-900/20 text-teal-600 flex items-center justify-center">
                  <HiOutlineSparkles size={20} className="animate-pulse" />
                </div>
                <div>
                  <p className="text-sm font-bold text-(--color-text)">
                    Generating Treatment Recommendations
                  </p>
                  <p className="text-xs text-(--color-text-light) font-medium">
                    {generationStageLabel}
                  </p>
                </div>
              </div>
              <span className="text-sm font-extrabold text-teal-700 dark:text-teal-400">
                {generationProgress}%
              </span>
            </div>
            <div className="h-3 w-full rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-linear-to-r from-teal-500 to-emerald-500 transition-all duration-300 ease-out"
                style={{ width: `${generationProgress}%` }}
              />
            </div>
          </div>
        )}

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
                    isCompletedStatus
                      ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                      : "bg-yellow-50 text-yellow-600 border-yellow-100"
                  }`}
                >
                  {scan.status}
                </span>
              </div>
              <div className="p-8 flex justify-center bg-black/5 dark:bg-black/20">
                <img
                  src={displayImageUrl}
                  alt="Radiographic Scan"
                  onClick={() => setIsImageViewerOpen(true)}
                  className="max-h-[500px] rounded-2xl shadow-2xl object-contain border-4 border-white dark:border-gray-800 cursor-zoom-in"
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

              {isReportLoading ? (
                <div className="flex items-center justify-center py-10 gap-3 text-(--color-text-light)">
                  <div className="w-5 h-5 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                  <span className="text-sm font-medium">
                    Fetching AI analysis report...
                  </span>
                </div>
              ) : scanReport ? (
                <div className="space-y-6">
                  {/* Total Detections Banner */}
                  <div className="p-6 bg-purple-50/40 dark:bg-purple-900/10 rounded-2xl border border-purple-100/60 dark:border-purple-800/30 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-extrabold text-purple-500 uppercase tracking-widest mb-1">
                        Total Detections
                      </p>
                      <span className="text-4xl font-black text-purple-700 dark:text-purple-400">
                        {scanReport.totalDetections}
                      </span>
                    </div>
                    <div className="w-16 h-16 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <HiOutlineCpuChip
                        size={32}
                        className="text-purple-600 dark:text-purple-400"
                      />
                    </div>
                  </div>

                  {/* Per-class Findings */}
                  {scanReport.findings && scanReport.findings.length > 0 ? (
                    <div>
                      <h3 className="text-sm font-bold text-(--color-text) mb-3 uppercase tracking-wider">
                        Detected Findings
                      </h3>
                      <div className="space-y-3">
                        {scanReport.findings.map((finding, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-4 bg-gray-50/60 dark:bg-gray-800/30 rounded-xl border border-(--color-border)"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                              <span className="text-sm font-semibold text-(--color-text) capitalize">
                                {finding.className}
                              </span>
                            </div>
                            <span className="text-xs font-extrabold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-3 py-1.5 rounded-lg">
                              {finding.count} detected
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-(--color-text-light) italic text-center py-4">
                      No specific findings detected by AI analysis.
                    </p>
                  )}

                  {/* Supplementary scan fields if available */}
                  {(scan.findings || scan.recommendations) && (
                    <div className="space-y-4 pt-4 border-t border-(--color-border)">
                      {scan.findings && (
                        <div>
                          <h3 className="text-sm font-bold text-(--color-text) mb-2 uppercase tracking-wider">
                            Clinical Findings
                          </h3>
                          <div className="p-5 bg-gray-50/50 dark:bg-gray-800/30 rounded-2xl border border-(--color-border)">
                            <p className="text-(--color-text) leading-relaxed text-sm">
                              {scan.findings}
                            </p>
                          </div>
                        </div>
                      )}
                      {scan.recommendations && (
                        <div>
                          <h3 className="text-sm font-bold text-(--color-text) mb-2 uppercase tracking-wider">
                            Recommended Actions
                          </h3>
                          <div className="p-5 bg-emerald-50/30 dark:bg-emerald-900/5 rounded-2xl border border-emerald-100/50">
                            <p className="text-(--color-text) leading-relaxed text-sm">
                              {scan.recommendations}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-10">
                  <div className="w-14 h-14 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <HiOutlineCpuChip size={28} className="text-gray-400" />
                  </div>
                  <p className="text-sm font-semibold text-(--color-text-light)">
                    No AI report available yet for this scan.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Patient & Meta Info */}
          <div className="space-y-6">
            <div className="bg-(--color-surface) rounded-3xl border border-(--color-border) p-8 shadow-sm">
              <h2 className="text-lg font-bold text-(--color-text) mb-6 pb-4 border-b border-(--color-border)">
                Patient Summary
              </h2>

              <div className="space-y-5">
                {/* Patient Image */}
                {scan.patientImage && (
                  <div className="flex justify-center mb-2">
                    <img
                      src={scan.patientImage}
                      alt={scan.patientName}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                      className="w-20 h-20 rounded-2xl object-cover border-2 border-(--color-border) shadow-sm"
                    />
                  </div>
                )}

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center border border-blue-100 shrink-0">
                    <LuUser size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-(--color-text-light) font-bold uppercase tracking-wider mb-0.5">
                      Patient Name
                    </p>
                    <p className="font-bold text-(--color-text)">
                      {scan.patientName}
                    </p>
                    <p className="text-xs text-(--color-text-light)">
                      ID: {scan.patientId}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center border border-emerald-100 shrink-0">
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
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center border border-orange-100 shrink-0">
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

                {/* Priority & AI Status */}
                <div className="pt-4 border-t border-(--color-border) grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 dark:bg-gray-800/30 rounded-xl">
                    <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1">
                      Priority
                    </p>
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded-lg ${
                        scan.priority?.toLowerCase() === "urgent" ||
                        scan.priority?.toLowerCase() === "emergency"
                          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {scan.priority}
                    </span>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800/30 rounded-xl">
                    <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1">
                      AI Status
                    </p>
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded-lg ${
                        scan.aiStatus?.toLowerCase() === "completed"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                      }`}
                    >
                      {scan.aiStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Detections Card */}
            {scan.detections && scan.detections.length > 0 && (
              <div className="bg-(--color-surface) rounded-3xl border border-(--color-border) p-6 shadow-sm">
                <h2 className="text-sm font-bold text-(--color-text) mb-4 uppercase tracking-wider">
                  Detection Details
                </h2>
                <div className="space-y-3">
                  {scan.detections.map((det, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-gray-50/60 dark:bg-gray-800/30 rounded-xl border border-(--color-border)"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-(--color-text) capitalize">
                          {det.className}
                        </span>
                        <span className="text-xs font-extrabold bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-2.5 py-1 rounded-lg">
                          {(det.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                      <p className="text-[10px] text-(--color-text-light) font-mono">
                        ({det.x1}, {det.y1}) → ({det.x2}, {det.y2})
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
                onClick={() => {
                  setIsReviewModalOpen(false);
                  resetReview();
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors cursor-pointer"
              >
                <FiPlus className="text-2xl rotate-45 text-(--color-text-light)" />
              </button>
            </div>

            <form
              onSubmit={handleReviewSubmit(onReviewSubmit)}
              className="p-8 space-y-5"
            >
              {/* Findings */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-(--color-text-light) uppercase tracking-wider">
                  Expert Findings <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...registerReview("findings", {
                    required: "Findings are required",
                  })}
                  rows={4}
                  placeholder="Describe your radiographic observations..."
                  className={`bg-gray-50 dark:bg-gray-800/30 border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none ${
                    reviewErrors.findings
                      ? "border-red-500"
                      : "border-(--color-border)"
                  }`}
                />
                {reviewErrors.findings && (
                  <p className="text-[11px] text-red-500 font-bold uppercase tracking-wide">
                    {reviewErrors.findings.message}
                  </p>
                )}
              </div>

              {/* Diagnosis */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-(--color-text-light) uppercase tracking-wider">
                  Diagnosis <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...registerReview("diagnosis", {
                    required: "Diagnosis is required",
                  })}
                  rows={3}
                  placeholder="State the radiographic diagnosis..."
                  className={`bg-gray-50 dark:bg-gray-800/30 border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none ${
                    reviewErrors.diagnosis
                      ? "border-red-500"
                      : "border-(--color-border)"
                  }`}
                />
                {reviewErrors.diagnosis && (
                  <p className="text-[11px] text-red-500 font-bold uppercase tracking-wide">
                    {reviewErrors.diagnosis.message}
                  </p>
                )}
              </div>

              {/* Notes */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-(--color-text-light) uppercase tracking-wider">
                  Clinical Notes
                </label>
                <textarea
                  {...registerReview("notes")}
                  rows={3}
                  placeholder="Any additional clinical notes or context..."
                  className="bg-gray-50 dark:bg-gray-800/30 border border-(--color-border) rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
                />
              </div>

              {/* Recommendations */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-(--color-text-light) uppercase tracking-wider">
                  Professional Recommendations{" "}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...registerReview("recommendations", {
                    required: "Recommendations are required",
                  })}
                  rows={4}
                  placeholder="Recommended treatment or follow-up actions..."
                  className={`bg-gray-50 dark:bg-gray-800/30 border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none ${
                    reviewErrors.recommendations
                      ? "border-red-500"
                      : "border-(--color-border)"
                  }`}
                />
                {reviewErrors.recommendations && (
                  <p className="text-[11px] text-red-500 font-bold uppercase tracking-wide">
                    {reviewErrors.recommendations.message}
                  </p>
                )}
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsReviewModalOpen(false);
                    resetReview();
                  }}
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

      {/* Show Review Modal */}
      {isViewReviewOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-(--color-surface) rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-(--color-border) animate-in zoom-in duration-300">
            <div className="p-8 border-b border-(--color-border) flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-(--color-text)">
                  Scan Review
                </h2>
                <p className="text-sm text-(--color-text-light) mt-1">
                  Submitted professional review details
                </p>
              </div>
              <button
                onClick={() => setIsViewReviewOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors cursor-pointer"
              >
                <FiPlus className="text-2xl rotate-45 text-(--color-text-light)" />
              </button>
            </div>

            <div className="p-8">
              {scanReviewQuery.isFetching ? (
                <div className="flex items-center justify-center py-12 gap-3 text-(--color-text-light)">
                  <div className="w-6 h-6 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
                  <span className="text-sm font-medium">
                    Loading submitted review...
                  </span>
                </div>
              ) : scanReviewQuery.isError ? (
                <div className="text-center py-10">
                  <p className="text-red-500 font-bold">
                    Failed to load review details.
                  </p>
                  <button
                    onClick={() => scanReviewQuery.refetch()}
                    className="mt-4 text-blue-600 font-bold hover:underline cursor-pointer"
                  >
                    Try Again
                  </button>
                </div>
              ) : scanReview ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 pb-6 border-b border-(--color-border)">
                    {scanReview.patientImage && (
                      <img
                        src={scanReview.patientImage}
                        alt={scanReview.patientName}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-(--color-border) shadow-sm"
                      />
                    )}
                    <div>
                      <p className="font-bold text-(--color-text)">
                        {scanReview.patientName}
                      </p>
                      <p className="text-xs text-(--color-text-light) font-semibold">
                        Patient ID: {scanReview.patientId} | Scan ID:{" "}
                        {scanReview.scanId}
                      </p>
                      <p className="text-xs text-(--color-text-light) mt-1">
                        Reviewed by {scanReview.doctorName || "Doctor"} on{" "}
                        {new Date(scanReview.reviewDate).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {[
                    ["Findings", scanReview.finding],
                    ["Diagnosis", scanReview.diagnosis],
                    ["Notes", scanReview.notes],
                    ["Recommendations", scanReview.recommendations],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <h3 className="text-xs font-bold text-(--color-text-light) uppercase tracking-wider mb-2">
                        {label}
                      </h3>
                      <div className="p-5 bg-gray-50/50 dark:bg-gray-800/30 rounded-2xl border border-(--color-border)">
                        <p className="text-sm text-(--color-text) leading-relaxed whitespace-pre-wrap">
                          {value || "No details provided."}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-10 text-sm font-semibold text-(--color-text-light)">
                  No review details available yet.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {isImageViewerOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsImageViewerOpen(false)}
        >
          <div
            className="relative w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsImageViewerOpen(false)}
              className="absolute top-4 right-4 z-[61] rounded-full bg-white/10 hover:bg-white/20 text-white px-4 py-2 text-sm font-bold transition-colors"
            >
              Close
            </button>
            <img
              src={displayImageUrl}
              alt="Radiographic Scan Enlarged"
              className="max-w-[96vw] max-h-[92vh] object-contain rounded-2xl shadow-2xl border-4 border-white/20"
            />
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ScanDetails;
