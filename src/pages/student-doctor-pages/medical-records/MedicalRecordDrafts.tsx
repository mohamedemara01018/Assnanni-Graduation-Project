import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import {
  BsFileEarmarkMedical,
  BsArrowLeft,
  BsClipboardPulse,
  BsInfoCircleFill,
  BsEye,
  BsPencilSquare,
} from "react-icons/bs";
import { ScaleLoader } from "react-spinners";
import { useNavigate } from "react-router";
import { useEffect } from "react";

interface MedicalDraft {
  id: number;
  appointmentId: number;
  title: string;
  notes: string;
  diagnosis: string;
}

const fallbackDrafts: MedicalDraft[] = [
  {
    id: 2,
    appointmentId: 2,
    title: "aaaaaaaaa",
    notes: "aaaaaaaaaaaaaa",
    diagnosis: "aaaaaaaaa",
  },
  {
    id: 3,
    appointmentId: 3,
    title: "aaaaaaaaa",
    notes: "aaaaaaaaaaaaaaaaaaaaa",
    diagnosis: "aaaaaaaaaaaa",
  },
];

const MedicalRecordDrafts = () => {
  const backendUrl = useSelector((state: RootState) => state.config.backendUrl);
  const token = Cookies.get("jwtToken");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const submitMutation = useMutation({
    mutationFn: async (draftId: number) => {
      await axios.post(
        `${backendUrl}StudentDoctor/medical-records/${draftId}/submit`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    onSuccess: () => {
      toast.success("Medical record draft submitted successfully for supervision review!");
      queryClient.invalidateQueries({ queryKey: ["medical-drafts"] });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to submit medical record draft"
      );
    },
  });

  const {
    data: responseBody,
    isLoading,
    isError,
    error,
    isSuccess,
  } = useQuery({
    queryKey: ["medical-drafts"],
    queryFn: async () => {
      const response = await axios.get(
        `${backendUrl}StudentDoctor/medical-record-drafts`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    },
    enabled: !!token && !!backendUrl,
    retry: 1,
  });

  // Handle toast notifications on mount / successful fetch
  useEffect(() => {
    if (isSuccess && responseBody) {
      toast.success(responseBody.message || "Medical drafts loaded successfully");
    }
  }, [isSuccess, responseBody]);

  useEffect(() => {
    if (isError && error) {
      const err = error as any;
      toast.error(
        err.response?.data?.message || "Failed to load medical drafts from server. Using offline data."
      );
    }
  }, [isError, error]);

  const drafts: MedicalDraft[] = responseBody?.data || (isError ? fallbackDrafts : []);

  return (
    <DashboardLayout pageTitle="Medical Record Drafts">
      <div className="-mt-6 p-6 max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/student-doctor")}
          className="flex items-center gap-2 text-(--color-text-light) hover:text-(--color-text) transition-colors mb-6 cursor-pointer group"
        >
          <BsArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Dashboard</span>
        </button>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-(--color-text) tracking-tight">
              Clinical Record Drafts
            </h1>
            <p className="text-sm text-(--color-text-light) mt-1">
              Review and update your clinical documentations before final submission
            </p>
          </div>
          <div className="flex items-center gap-3">
            {isError && (
              <div className="flex items-center gap-2 px-3.5 py-1.5 bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 text-xs font-semibold rounded-xl border border-amber-200 dark:border-amber-900/30">
                <BsInfoCircleFill />
                <span>Offline / Demo Mode</span>
              </div>
            )}
            <div className="bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 px-4 py-2.5 rounded-xl border border-blue-100 dark:border-blue-900/30 flex items-center gap-2 text-sm font-bold shadow-sm">
              <BsFileEarmarkMedical />
              {drafts.length} Total Drafts
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <ScaleLoader color="#3B82F6" />
            <p className="text-sm text-(--color-text-light) font-medium animate-pulse">
              Retrieving your clinical drafts...
            </p>
          </div>
        ) : drafts.length > 0 ? (
          <div className="flex flex-col gap-4">
            {drafts.map((draft) => (
              <div
                key={draft.id}
                className="bg-(--color-surface) rounded-2xl border border-(--color-border) p-5 shadow-sm hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800 transition-all group flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                {/* Left Section: Icon & Info */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400 rounded-xl group-hover:bg-blue-600 group-hover:text-white dark:group-hover:bg-blue-500 transition-colors shadow-sm shrink-0">
                    <BsClipboardPulse size={20} />
                  </div>
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold text-(--color-text) group-hover:text-blue-600 transition-colors truncate">
                        {draft.title}
                      </h3>
                      <span className="text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-lg border border-indigo-100 dark:border-indigo-900/30 shrink-0">
                        Draft ID: {draft.id}
                      </span>
                      <span className="text-[10px] font-bold bg-gray-100 dark:bg-gray-800 text-gray-500 px-2 py-0.5 rounded-lg shrink-0">
                        Appt ID: {draft.appointmentId}
                      </span>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center gap-x-6 gap-y-1.5 text-xs text-(--color-text-light)">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-violet-500 uppercase tracking-tight text-[9px] shrink-0">Diagnosis:</span>
                        <span className="text-(--color-text) font-semibold truncate">{draft.diagnosis}</span>
                      </div>
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="font-bold text-gray-500 uppercase tracking-tight text-[9px] shrink-0">Notes:</span>
                        <span className="truncate">{draft.notes}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Section: Buttons */}
                <div className="flex items-center gap-3 shrink-0 self-end lg:self-auto w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-t-0 border-(--color-border)">
                  <button
                    onClick={() => navigate(`/student-doctor/medical-record-drafts/${draft.id}`)}
                    className="flex-1 lg:flex-initial px-5 py-2.5 bg-gray-50 hover:bg-gray-100 dark:bg-gray-850 dark:hover:bg-gray-800 border border-(--color-border) text-(--color-text) text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                  >
                    <BsEye size={14} className="text-gray-500" />
                    View Details
                  </button>
                  <button
                    onClick={() => navigate(`/student-doctor/medical-record-drafts/update/${draft.id}`)}
                    className="flex-1 lg:flex-initial px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-500/10 cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <BsPencilSquare size={14} />
                    Update Draft
                  </button>
                  <button
                    onClick={() => submitMutation.mutate(draft.id)}
                    disabled={submitMutation.isPending}
                    className="flex-1 lg:flex-initial px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-emerald-500/10 cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    {submitMutation.isPending && submitMutation.variables === draft.id ? (
                      "Submitting..."
                    ) : (
                      <>
                        <BsFileEarmarkMedical size={14} />
                        Submit Draft
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-(--color-surface) rounded-3xl border-2 border-dashed border-(--color-border) p-16 flex flex-col items-center text-center shadow-sm">
            <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800/50 rounded-full flex items-center justify-center mb-6">
              <BsFileEarmarkMedical size={40} className="text-(--color-text-light) opacity-25" />
            </div>
            <h2 className="text-xl font-bold text-(--color-text) mb-2">
              No Drafts Found
            </h2>
            <p className="text-sm text-(--color-text-light) max-w-sm leading-relaxed">
              You don't have any medical record drafts yet. Once clinical record drafts are generated, they will be listed here.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MedicalRecordDrafts;
