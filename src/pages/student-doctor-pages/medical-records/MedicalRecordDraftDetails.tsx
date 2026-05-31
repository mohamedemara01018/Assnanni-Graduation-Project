import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import { useParams, useNavigate } from "react-router";
import { useEffect } from "react";
import {
  BsArrowLeft,
  BsFileMedicalFill,
  BsInfoCircleFill,
  BsPencilSquare,
  BsHourglassSplit,
} from "react-icons/bs";
import { ScaleLoader } from "react-spinners";

interface DraftDetail {
  id: number;
  appointmentId: number;
  title: string;
  notes: string;
  diagnosis: string;
}

const MedicalRecordDraftDetails = () => {
  const { draftId } = useParams<{ draftId: string }>();
  const navigate = useNavigate();
  const backendUrl = useSelector((state: RootState) => state.config.backendUrl);
  const token = Cookies.get("jwtToken");

  const {
    data: responseBody,
    isLoading,
    isError,
    error,
    isSuccess,
  } = useQuery({
    queryKey: ["medical-draft-details", draftId],
    queryFn: async () => {
      const response = await axios.get(
        `${backendUrl}StudentDoctor/medical-record-drafts/${draftId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    },
    enabled: !!token && !!backendUrl && !!draftId,
    retry: 1,
  });

  // Handle toast notifications
  useEffect(() => {
    if (isSuccess && responseBody) {
      toast.success(responseBody.message || "Draft details loaded successfully");
    }
  }, [isSuccess, responseBody]);

  useEffect(() => {
    if (isError && error) {
      const err = error as any;
      toast.error(
        err.response?.data?.message || "Failed to load draft details from server. Showing offline details."
      );
    }
  }, [isError, error]);

  // Fallback detail
  const fallbackDetail: DraftDetail = {
    id: parseInt(draftId || "3"),
    appointmentId: parseInt(draftId || "3"),
    title: "aaaaaaaaa",
    notes: "aaaaaaaaaaaaaaaaaaaaa",
    diagnosis: "aaaaaaaaaaaa",
  };

  const draft: DraftDetail = responseBody?.data || (isError ? fallbackDetail : null);

  return (
    <DashboardLayout pageTitle="Draft Record Details">
      <div className="-mt-6 p-6 max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/student-doctor/medical-record-drafts")}
          className="flex items-center gap-2 text-(--color-text-light) hover:text-(--color-text) transition-colors mb-6 cursor-pointer group"
        >
          <BsArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Drafts Overview</span>
        </button>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <ScaleLoader color="#3B82F6" />
            <p className="text-sm text-(--color-text-light) font-medium animate-pulse">
              Retrieving draft details...
            </p>
          </div>
        ) : draft ? (
          <div className="bg-(--color-surface) rounded-2xl border border-(--color-border) shadow-sm overflow-hidden animate-in fade-in duration-200">
            {/* Header section */}
            <div className="p-6 border-b border-(--color-border) bg-gray-50/50 dark:bg-gray-800/30 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-xl shadow-sm">
                  <BsFileMedicalFill size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-(--color-text)">
                    Draft Record Details
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-lg border border-indigo-100 dark:border-indigo-900/30">
                      Draft ID: {draft.id}
                    </span>
                    <span className="text-[10px] font-bold bg-gray-100 dark:bg-gray-800 text-gray-500 px-2 py-0.5 rounded-lg">
                      Appointment ID: {draft.appointmentId}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {isError && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 text-xs font-semibold rounded-xl border border-amber-200 dark:border-amber-900/30">
                    <BsInfoCircleFill />
                    <span>Demo Mode</span>
                  </div>
                )}
                <button
                  onClick={() => navigate(`/student-doctor/medical-record-drafts/update/${draft.id}`)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-500/10 cursor-pointer flex items-center gap-1.5 active:scale-95"
                >
                  <BsPencilSquare size={13} />
                  Update Draft
                </button>
              </div>
            </div>

            {/* Details body */}
            <div className="p-8 space-y-6">
              {/* Draft Title */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                  Draft Title
                </span>
                <p className="text-lg font-bold text-(--color-text) ml-0.5">
                  {draft.title}
                </p>
              </div>

              <hr className="border-(--color-border)" />

              {/* Diagnosis */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-violet-500 dark:text-violet-400 uppercase tracking-widest">
                  Primary Diagnosis
                </span>
                <p className="text-base font-semibold text-(--color-text) ml-0.5">
                  {draft.diagnosis}
                </p>
              </div>

              <hr className="border-(--color-border)" />

              {/* Notes */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest">
                  Clinical Notes & Observations
                </span>
                <div className="p-5 bg-gray-50 dark:bg-gray-800/40 rounded-2xl border border-gray-100 dark:border-gray-850">
                  <p className="text-sm text-(--color-text-light) leading-relaxed whitespace-pre-wrap">
                    {draft.notes}
                  </p>
                </div>
              </div>

              {/* Footer / Status */}
              <div className="pt-6 border-t border-(--color-border) flex items-center justify-between text-xs text-(--color-text-light)">
                <span className="flex items-center gap-1.5 font-medium">
                  <BsHourglassSplit className="text-indigo-500" />
                  Status: Pending Supervisor submission
                </span>
                <span className="italic">Last updated: Today</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-(--color-surface) rounded-3xl border border-(--color-border) p-16 flex flex-col items-center text-center shadow-sm">
            <BsInfoCircleFill size={40} className="text-red-500 mb-4" />
            <h2 className="text-xl font-bold text-(--color-text) mb-2">
              Draft Not Found
            </h2>
            <p className="text-sm text-(--color-text-light) max-w-sm leading-relaxed">
              We couldn't retrieve the details for this draft record. It might have been deleted or submitted already.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MedicalRecordDraftDetails;
