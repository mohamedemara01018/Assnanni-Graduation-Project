import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import {
  BsFileEarmarkCheck,
  BsArrowLeft,
  BsCheckCircle,
  BsXCircle,
  BsPersonBadge,
} from "react-icons/bs";
import { ScaleLoader } from "react-spinners";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";

interface StudentDraft {
  id: number;
  appointmentId: number;
  studentName: string;
  studentId: number;
  title: string;
  notes: string;
  diagnosis: string;
  submittedAt: string;
}

// const tempStudentDrafts: StudentDraft[] = [
//   {
//     id: 1,
//     appointmentId: 10,
//     studentName: "Ahmed Ali",
//     studentId: 22,
//     title: "Root Canal - Phase 1",
//     diagnosis: "Acute Pulpitis",
//     notes:
//       "Accessed pulp chamber, cleared canals, placed temporary dressing. Patient tolerated procedure well.",
//     submittedAt: "2026-05-13T10:30:00Z",
//   },
//   {
//     id: 2,
//     appointmentId: 14,
//     studentName: "Sara Hassan",
//     studentId: 25,
//     title: "Initial Consultation",
//     diagnosis: "Multiple Caries",
//     notes:
//       "Full mouth exam completed. Multiple cavities in upper right quadrant. Proposed treatment plan discussed.",
//     submittedAt: "2026-05-13T14:15:00Z",
//   },
// ];

const StudentRecordApprovals = () => {
  const backendUrl = useSelector((state: RootState) => state.config.backendUrl);
  const token = Cookies.get("jwtToken");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: apiResponse,
    isLoading,
    isError,
    error,
    isSuccess,
  } = useQuery({
    queryKey: ["student-approvals"],
    queryFn: async () => {
      const response = await axios.get(
        `${backendUrl}StudentDoctor/medical-record-drafts-for-doctor`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return response.data;
    },
    enabled: !!token && !!backendUrl,
  });

  // Handle toast notifications on query fetch
  useEffect(() => {
    if (isSuccess && apiResponse) {
      toast.success(
        apiResponse.message || "Student record drafts loaded successfully",
      );
    }
  }, [isSuccess, apiResponse]);

  useEffect(() => {
    if (isError && error) {
      const err = error as any;
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Failed to load student record drafts",
      );
    }
  }, [isError, error]);

  const rawDrafts = apiResponse?.data || [];
  const mappedDrafts: StudentDraft[] = rawDrafts.map((apiDraft: any) => ({
    id: apiDraft.draftId,
    appointmentId: apiDraft.appointmentId,
    studentName: apiDraft.studentName || "Unknown Student",
    studentId: apiDraft.studentDoctorId || 0,
    title: apiDraft.title || "Untitled Draft",
    notes: apiDraft.notes || "",
    diagnosis: apiDraft.diagnosis || "No Diagnosis",
    submittedAt: new Date().toISOString(),
  }));

  const drafts = [...mappedDrafts];

  const [rejectingDraftId, setRejectingDraftId] = useState<number | null>(null);

  const {
    register: registerReject,
    handleSubmit: handleRejectSubmit,
    reset: resetReject,
    formState: { errors: rejectErrors },
  } = useForm<{ reason: string }>();

  const approveMutation = useMutation({
    mutationFn: async (draftId: number) => {
      await axios.post(
        `${backendUrl}StudentDoctor/medical-records/${draftId}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
    },
    onSuccess: () => {
      toast.success("Medical record approved and finalized");
      queryClient.invalidateQueries({ queryKey: ["student-approvals"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to approve record");
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ id, reason }: { id: number; reason: string }) => {
      await axios.post(
        `${backendUrl}StudentDoctor/medical-records/${id}/reject`,
        { id, reason },
        { headers: { Authorization: `Bearer ${token}` } },
      );
    },
    onSuccess: () => {
      toast.info("Medical record rejected and sent back to student");
      setRejectingDraftId(null);
      resetReject();
      queryClient.invalidateQueries({ queryKey: ["student-approvals"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to reject record");
    },
  });

  const onRejectFormSubmit = (data: { reason: string }) => {
    if (rejectingDraftId) {
      rejectMutation.mutate({ id: rejectingDraftId, reason: data.reason });
    }
  };

  return (
    <DashboardLayout pageTitle="Student Record Approvals">
      <div className="-mt-6 p-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-(--color-text-light) hover:text-(--color-text) transition-colors mb-6 cursor-pointer group"
        >
          <BsArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Dashboard</span>
        </button>

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-(--color-text)">
              Clinical Oversight
            </h1>
            <p className="text-sm text-(--color-text-light) mt-1">
              Review and finalize student clinical documentations
            </p>
          </div>
          <div className="bg-purple-50 text-purple-600 px-4 py-2 rounded-xl border border-purple-100 flex items-center gap-2 text-sm font-bold">
            <BsFileEarmarkCheck />
            {drafts.length} Pending Approvals
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <ScaleLoader color="#8B5CF6" />
            <p className="text-sm text-(--color-text-light) font-medium animate-pulse">
              Fetching pending student records...
            </p>
          </div>
        ) : drafts.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {drafts.map((draft, i) => (
              <div
                key={`${draft.id}-${i}`}
                className="bg-(--color-surface) rounded-2xl border border-(--color-border) overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
              >
                <div className="p-5 border-b border-(--color-border) bg-gray-50/50 dark:bg-gray-800/30 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                      <BsPersonBadge size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-(--color-text)">
                        {draft.studentName}
                      </h4>
                      <p className="text-[10px] text-(--color-text-light) font-medium">
                        Student ID: {draft.studentId}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 bg-white dark:bg-gray-800 px-2 py-1 rounded-md border border-gray-100 dark:border-gray-700">
                    Appt #{draft.appointmentId}
                  </span>
                </div>

                <div className="p-6 flex-grow space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-(--color-text) mb-1">
                      {draft.title}
                    </h3>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-violet-500"></div>
                      <span className="text-[10px] font-bold text-violet-500 uppercase">
                        Diagnosis: {draft.diagnosis}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-gray-900/40 rounded-xl border border-gray-100 dark:border-gray-800">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                      Clinical Findings
                    </span>
                    <p className="text-xs text-(--color-text-light) leading-relaxed">
                      {draft.notes}
                    </p>
                  </div>
                </div>

                <div className="p-5 bg-gray-50/30 dark:bg-gray-800/20 border-t border-(--color-border) flex gap-3">
                  <button
                    onClick={() => setRejectingDraftId(draft.id)}
                    disabled={
                      rejectMutation.isPending || approveMutation.isPending
                    }
                    className="flex-1 py-2.5 bg-white dark:bg-gray-800 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <BsXCircle /> Reject Draft
                  </button>
                  <button
                    onClick={() => approveMutation.mutate(draft.id)}
                    disabled={
                      approveMutation.isPending || rejectMutation.isPending
                    }
                    className="flex-1 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <BsCheckCircle />{" "}
                    {approveMutation.isPending
                      ? "Approving..."
                      : "Approve & Finalize"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-(--color-surface) rounded-3xl border-2 border-dashed border-(--color-border) p-20 flex flex-col items-center text-center">
            <BsFileEarmarkCheck
              size={48}
              className="text-(--color-text-light) opacity-20 mb-4"
            />
            <h2 className="text-xl font-bold text-(--color-text) mb-2">
              No Records Pending
            </h2>
            <p className="text-sm text-(--color-text-light) max-w-xs">
              All student clinical documentations have been reviewed.
            </p>
          </div>
        )}
      </div>

      {/* Rejection Reason Modal */}
      {rejectingDraftId && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative max-w-md w-full bg-(--color-surface) rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 border border-(--color-border)">
            <div className="p-6 border-b border-(--color-border) bg-red-50 dark:bg-red-950/20 flex items-center gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
                <BsXCircle size={20} />
              </div>
              <h3 className="text-lg font-bold text-(--color-text)">
                Reject Clinical Draft
              </h3>
            </div>

            <form
              onSubmit={handleRejectSubmit(onRejectFormSubmit)}
              className="p-6 space-y-4"
            >
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-(--color-text-light) uppercase tracking-wider ml-1">
                  Reason for Rejection
                </label>
                <textarea
                  {...registerReject("reason", {
                    required: "Please provide a reason for rejection",
                  })}
                  rows={4}
                  placeholder="e.g., Incomplete findings, needs more detail on treatment..."
                  className={`w-full px-4 py-3 rounded-xl border ${
                    rejectErrors.reason
                      ? "border-red-500"
                      : "border-(--color-border)"
                  } bg-(--color-bg) text-(--color-text) focus:ring-2 focus:ring-red-500/20 outline-none transition-all text-sm resize-none`}
                />
                {rejectErrors.reason && (
                  <p className="text-[10px] text-red-500 font-bold uppercase ml-1 tracking-wider">
                    {rejectErrors.reason.message}
                  </p>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setRejectingDraftId(null);
                    resetReject();
                  }}
                  className="flex-1 py-3 text-sm font-bold text-(--color-text-light) border border-(--color-border) rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={rejectMutation.isPending}
                  className="flex-[2] bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white py-3 rounded-xl text-sm font-bold shadow-lg shadow-red-500/20 transition-all flex items-center justify-center gap-2"
                >
                  {rejectMutation.isPending ? (
                    <ScaleLoader color="#fff" height={10} width={2} />
                  ) : (
                    "Confirm Rejection"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default StudentRecordApprovals;
