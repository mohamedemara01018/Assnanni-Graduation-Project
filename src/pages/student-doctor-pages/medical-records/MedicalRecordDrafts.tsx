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
  BsCalendarCheck,
  BsClipboardPulse,
} from "react-icons/bs";
import { ScaleLoader } from "react-spinners";
import { useNavigate } from "react-router";

interface MedicalDraft {
  id: number;
  appointmentId: number;
  title: string;
  notes: string;
  diagnosis: string;
}

const tempDrafts: MedicalDraft[] = [
  {
    id: 1,
    appointmentId: 2,
    title: "Post-Op Restoration Review",
    diagnosis: "Successful Composite Filling",
    notes:
      "Patient reported slight sensitivity which subsided after 24 hours. Margins are clean and occlusion is stable.",
  },
  {
    id: 2,
    appointmentId: 5,
    title: "Periodontal Assessment",
    diagnosis: "Gingivitis - Grade 1",
    notes:
      "Inflammation observed in lower anterior segment. Provided oral hygiene instructions and scheduled scaling.",
  },
];

const MedicalRecordDrafts = () => {
  const backendUrl = useSelector((state: RootState) => state.config.backendUrl);
  const token = Cookies.get("jwtToken");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: apiDrafts,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["medical-drafts"],
    queryFn: async () => {
      const response = await axios.get(
        `${backendUrl}StudentDoctor/medical-record-drafts`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return response.data.data as MedicalDraft[];
    },
    enabled: !!token && !!backendUrl,
  });

  const drafts = [...(apiDrafts || []), ...tempDrafts];

  const submitMutation = useMutation({
    mutationFn: async (draftId: number) => {
      await axios.post(
        `${backendUrl}StudentDoctor/medical-records/${draftId}/submit`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
    },
    onSuccess: () => {
      toast.success("Medical record submitted for supervisor review");
      queryClient.invalidateQueries({ queryKey: ["medical-drafts"] });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to submit medical record",
      );
    },
  });

  if (isError) {
    toast.error("Failed to load medical record drafts");
  }

  return (
    <DashboardLayout pageTitle="Medical Record Drafts">
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
              Clinical Record Drafts
            </h1>
            <p className="text-sm text-(--color-text-light) mt-1">
              Review and submit your pending medical documentations
            </p>
          </div>
          <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl border border-blue-100 flex items-center gap-2 text-sm font-bold">
            <BsFileEarmarkMedical />
            {drafts.length} Pending Drafts
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <ScaleLoader color="#3B82F6" />
            <p className="text-sm text-(--color-text-light) font-medium animate-pulse">
              Loading your clinical drafts...
            </p>
          </div>
        ) : drafts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {drafts.map((draft, i) => (
              <div
                key={`${draft.id || draft.appointmentId}-${i}`}
                className="bg-(--color-surface) rounded-2xl border border-(--color-border) p-6 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group flex flex-col h-full"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <BsClipboardPulse size={20} />
                  </div>
                  <span className="text-[10px] font-bold bg-gray-100 dark:bg-gray-800 text-gray-500 px-2 py-1 rounded-lg">
                    Appt ID: {draft.appointmentId}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-(--color-text) mb-2 line-clamp-1">
                  {draft.title}
                </h3>

                <div className="space-y-3 flex-grow">
                  <div className="flex items-start gap-2">
                    <div className="mt-1 text-violet-500">
                      <BsCalendarCheck size={14} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-violet-500 uppercase tracking-tight">
                        Diagnosis
                      </span>
                      <p className="text-xs text-(--color-text) font-medium line-clamp-2">
                        {draft.diagnosis}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      Clinical Notes
                    </span>
                    <p className="text-xs text-(--color-text-light) line-clamp-3 leading-relaxed">
                      {draft.notes}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex gap-2">
                  <button
                    onClick={() =>
                      navigate(
                        `/student-doctor/create-medical-record/${draft.appointmentId}`,
                      )
                    }
                    className="flex-1 py-2.5 bg-(--color-bg) border border-(--color-border) text-(--color-text) text-xs font-bold rounded-xl hover:bg-gray-100 transition-all cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => submitMutation.mutate(draft.id)}
                    disabled={submitMutation.isPending}
                    className="flex-[2] py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {submitMutation.isPending ? (
                      <ScaleLoader color="#fff" height={8} width={2} />
                    ) : (
                      "Submit to Supervisor"
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-(--color-surface) rounded-3xl border-2 border-dashed border-(--color-border) p-16 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800/50 rounded-full flex items-center justify-center mb-6">
              <BsFileEarmarkMedical
                size={40}
                className="text-(--color-text-light) opacity-20"
              />
            </div>
            <h2 className="text-xl font-bold text-(--color-text) mb-2">
              No Drafts Found
            </h2>
            <p className="text-sm text-(--color-text-light) max-w-xs leading-relaxed">
              You haven't created any medical record drafts yet. Use the "Add
              Medical Record" button in your patient cases to start documenting.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MedicalRecordDrafts;
