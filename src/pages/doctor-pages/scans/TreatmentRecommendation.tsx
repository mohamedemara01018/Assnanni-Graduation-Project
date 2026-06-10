import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, useNavigate, useParams } from "react-router";
import axios from "axios";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import Cookies from "js-cookie";
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import { IoArrowBack } from "react-icons/io5";
import {
  HiOutlineClipboardDocumentList,
  HiOutlinePrinter,
  HiOutlineSparkles,
} from "react-icons/hi2";
import { LuUser, LuScanLine } from "react-icons/lu";
import { resolveAssetUrl } from "@/utils/resolveAssetUrl";
import { toast } from "react-toastify";

export interface TreatmentRecommendationData {
  by_Class: Record<string, number>;
  error: string | null;
  imageUrl: string;
  report: string;
  total: number;
}

export interface TreatmentRecommendationCache {
  recommendation: TreatmentRecommendationData;
  patientName: string;
  patientId: number;
  scanId: number;
}

export type TreatmentRecommendationLocationState = TreatmentRecommendationCache;

export const treatmentRecommendationQueryKey = (scanId?: string) =>
  ["TreatmentRecommendation", scanId] as const;

const formatClassName = (key: string) =>
  (key || "")
    ?.replace(/_/g, " ")
    ?.replace(/\b\w/g, (char) => char.toUpperCase()) || "";

const injectPatientNameIntoReport = (report: string, patientName?: string) => {
  if (!patientName || !report) return report || "";
  return report.replace(/\[Patient Name[^\]]*\]/gi, patientName);
};

const TreatmentRecommendation = () => {
  const { scanId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const locationState =
    location.state as TreatmentRecommendationLocationState | null;
  const backendUrl = useSelector((state: RootState) => state.config.backendUrl);
  const token = Cookies.get("jwtToken");

  const [manualUploadMode, setManualUploadMode] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const { data: cachedState } = useQuery({
    queryKey: treatmentRecommendationQueryKey(scanId),
    queryFn: async (): Promise<TreatmentRecommendationCache | null> => null,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60,
  });

  const state = cachedState ?? locationState;
  const recommendation = state?.recommendation;

  const retryRecommendationMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("formFile", file);

      const response = await axios.post(
        `${backendUrl}Scans/treatment-recommendation`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      return response.data;
    },
    onSuccess: (response) => {
      if (!response.succeeded) {
        toast.error(
          response.message || "Failed to get treatment recommendation",
        );
        return;
      }

      window.location.reload();
    },
    onError: (err: any) => {
      toast.error(
        err.response?.data?.message || "Failed to get treatment recommendation",
      );
    },
  });

  useEffect(() => {
    const style = document.createElement("style");
    style.id = "treatment-recommendation-print-styles";
    style.textContent = `
      @media print {
        body * { visibility: hidden; }
        #treatment-report-print, #treatment-report-print * { visibility: visible; }
        #treatment-report-print {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          padding: 24px;
          background: white !important;
          color: #111827 !important;
        }
        #treatment-report-print img {
          max-height: 320px;
          page-break-inside: avoid;
        }
        #treatment-report-print .treatment-report {
          color: #111827 !important;
        }
      }
    `;
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (!recommendation) {
    return (
      <DashboardLayout pageTitle="Treatment Recommendation">
        <div className="p-8 text-center max-w-lg mx-auto">
          <p className="text-(--color-text-light) font-medium mb-6">
            No treatment recommendation data found. Please generate one from the
            scan details page.
          </p>
          <button
            onClick={() => navigate(`/scan/analysis/${scanId}`)}
            className="text-blue-600 font-bold hover:underline"
          >
            Back to Scan Details
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const classEntries = Object.entries(recommendation.by_Class || {});
  const reportHtml = injectPatientNameIntoReport(
    recommendation.report,
    state?.patientName,
  );
  const printedAt = new Date().toLocaleString();

  return (
    <DashboardLayout pageTitle="Treatment Recommendation">
      <div className="-mt-6 p-8 bg-(--color-bg) min-h-screen rounded-2xl">
        <button
          onClick={() => navigate(`/scan/analysis/${scanId}`)}
          className="flex items-center gap-2 text-(--color-text-light) hover:text-(--color-text) transition-colors mb-6 cursor-pointer font-medium print:hidden"
        >
          <IoArrowBack />
          <span>Back to Scan Analysis</span>
        </button>

        <div className="mb-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-100 text-xs font-bold uppercase tracking-wider mb-4">
              <HiOutlineSparkles size={14} />
              AI Treatment Plan
            </div>
            <h1 className="text-3xl font-bold text-(--color-text) tracking-tight">
              Treatment Recommendations
            </h1>
            <p className="text-(--color-text-light) font-medium mt-1">
              AI-generated clinical chart note and proposed treatment plan
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center justify-center gap-2 bg-(--color-surface) hover:bg-gray-50 dark:hover:bg-gray-800 border border-(--color-border) text-(--color-text) px-6 py-3 rounded-2xl font-bold transition-all active:scale-95 cursor-pointer print:hidden"
            >
              <HiOutlinePrinter size={18} />
              <span>Print Report</span>
            </button>

            {state && (
              <>
                <div className="flex items-center gap-3 px-5 py-3 bg-(--color-surface) border border-(--color-border) rounded-2xl print:hidden">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center border border-blue-100">
                    <LuUser size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-(--color-text-light) uppercase tracking-wider">
                      Patient
                    </p>
                    <p className="text-sm font-bold text-(--color-text)">
                      {state.patientName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-5 py-3 bg-(--color-surface) border border-(--color-border) rounded-2xl print:hidden">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center border border-orange-100">
                    <LuScanLine size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-(--color-text-light) uppercase tracking-wider">
                      Scan ID
                    </p>
                    <p className="text-sm font-bold text-(--color-text)">
                      #{state.scanId}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {recommendation.error && (
          <div className="mb-8 p-5 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-2xl">
            <p className="text-sm font-bold text-red-700 dark:text-red-400 mb-4">
              {recommendation.error}
            </p>
            {!manualUploadMode && (
              <button
                onClick={() => setManualUploadMode(true)}
                className="text-sm font-bold text-red-700 dark:text-red-400 underline hover:text-red-800 dark:hover:text-red-300"
              >
                Upload image manually to retry
              </button>
            )}
            {manualUploadMode && (
              <div className="mt-4 space-y-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setUploadedFile(file);
                    }
                  }}
                  className="text-sm text-gray-600 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-100 dark:file:bg-red-800 file:text-red-700 dark:file:text-red-300 hover:file:bg-red-200 dark:hover:file:bg-red-700"
                />
                {uploadedFile && (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        retryRecommendationMutation.mutate(uploadedFile)
                      }
                      disabled={retryRecommendationMutation.isPending}
                      className="flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl font-bold transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                    >
                      <HiOutlineSparkles className="text-lg" />
                      <span>
                        {retryRecommendationMutation.isPending
                          ? "Generating..."
                          : "Retry with uploaded image"}
                      </span>
                    </button>
                    <button
                      onClick={() => {
                        setManualUploadMode(false);
                        setUploadedFile(null);
                      }}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 px-2 py-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div
          id="treatment-report-print"
          className="grid grid-cols-1 xl:grid-cols-3 gap-8"
        >
          <div className="hidden print:block xl:col-span-3 border-b border-gray-300 pb-6 mb-2">
            <h1 className="text-2xl font-bold text-gray-900">
              Treatment Recommendation Report
            </h1>
            {state && (
              <div className="mt-3 text-sm text-gray-700 space-y-1">
                <p>
                  <strong>Patient:</strong> {state.patientName}
                </p>
                <p>
                  <strong>Patient ID:</strong> {state.patientId}
                </p>
                <p>
                  <strong>Scan ID:</strong> #{state.scanId}
                </p>
                <p>
                  <strong>Printed:</strong> {printedAt}
                </p>
              </div>
            )}
          </div>
          <div className="xl:col-span-1 space-y-6">
            <div className="bg-(--color-surface) rounded-3xl border border-(--color-border) overflow-hidden shadow-sm">
              <div className="p-5 border-b border-(--color-border) bg-gray-50/50 dark:bg-gray-800/30">
                <p className="text-sm font-bold text-(--color-text)">
                  Annotated Treatment Image
                </p>
              </div>
              <div className="p-6 flex justify-center bg-black/5 dark:bg-black/20">
                <img
                  src={resolveAssetUrl(recommendation.imageUrl)}
                  alt="Treatment recommendation visualization"
                  className="max-h-[420px] rounded-2xl shadow-xl object-contain border-4 border-white dark:border-gray-800"
                />
              </div>
            </div>

            <div className="bg-(--color-surface) rounded-3xl border border-(--color-border) p-6 shadow-sm">
              <p className="text-xs font-extrabold text-teal-600 uppercase tracking-widest mb-4">
                Detection Summary
              </p>
              <div className="p-5 bg-teal-50/40 dark:bg-teal-900/10 rounded-2xl border border-teal-100/60 dark:border-teal-800/30 mb-5">
                <p className="text-xs font-bold text-teal-600 uppercase tracking-wider mb-1">
                  Total Detections
                </p>
                <span className="text-4xl font-black text-teal-700 dark:text-teal-400">
                  {recommendation.total}
                </span>
              </div>

              {classEntries.length > 0 ? (
                <div className="space-y-3">
                  {classEntries.map(([className, count]) => (
                    <div
                      key={className}
                      className="flex items-center justify-between p-4 bg-gray-50/60 dark:bg-gray-800/30 rounded-xl border border-(--color-border)"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                        <span className="text-sm font-semibold text-(--color-text)">
                          {formatClassName(className)}
                        </span>
                      </div>
                      <span className="text-xs font-extrabold bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 px-3 py-1.5 rounded-lg">
                        {count}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-(--color-text-light) italic text-center py-4">
                  No class detections reported.
                </p>
              )}
            </div>
          </div>

          <div className="xl:col-span-2">
            <div className="bg-(--color-surface) rounded-3xl border border-(--color-border) shadow-sm overflow-hidden">
              <div className="p-6 border-b border-(--color-border) flex items-center justify-between gap-3 bg-gray-50/50 dark:bg-gray-800/30">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-teal-50 dark:bg-teal-900/20 text-teal-600 rounded-xl print:hidden">
                    <HiOutlineClipboardDocumentList size={22} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-(--color-text)">
                      Clinical Chart Note
                    </h2>
                    <p className="text-xs text-(--color-text-light) font-medium print:hidden">
                      AI-generated findings, impression, and treatment plan
                    </p>
                  </div>
                </div>
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-(--color-border) bg-white dark:bg-gray-800 text-sm font-bold text-(--color-text) hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors print:hidden"
                >
                  <HiOutlinePrinter size={16} />
                  Print
                </button>
              </div>

              <div className="p-8">
                <div
                  className="treatment-report text-(--color-text) text-sm leading-relaxed [&_p]:mb-4 [&_p:last-child]:mb-0 [&_strong]:font-bold [&_strong]:text-(--color-text) [&_hr]:my-6 [&_hr]:border-(--color-border)"
                  dangerouslySetInnerHTML={{ __html: reportHtml }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TreatmentRecommendation;
