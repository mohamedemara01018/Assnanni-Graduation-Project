import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
} from "react-icons/bs";
import { ScaleLoader } from "react-spinners";

interface UpdateDraftFormInputs {
  title: string;
  notes: string;
  diagnosis: string;
}

const UpdateMedicalRecordDraft = () => {
  const { draftId } = useParams<{ draftId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const backendUrl = useSelector((state: RootState) => state.config.backendUrl);
  const token = Cookies.get("jwtToken");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateDraftFormInputs>();

  // Fetch the current draft values
  const {
    data: responseBody,
    isLoading,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ["medical-draft-details", draftId],
    queryFn: async () => {
      const response = await axios.get(
        `${backendUrl}StudentDoctor/medical-record-drafts/${draftId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return response.data;
    },
    enabled: !!token && !!backendUrl && !!draftId,
    retry: 1,
  });

  // Pre-populate mock details if fetching fails
  const fallbackDetail = {
    id: parseInt(draftId || "3"),
    appointmentId: parseInt(draftId || "3"),
    title: "aaaaaaaaa",
    notes: "aaaaaaaaaaaaaaaaaaaaa",
    diagnosis: "aaaaaaaaaaaa",
  };

  // Toast load results
  useEffect(() => {
    if (isSuccess && responseBody?.data) {
      reset({
        title: responseBody.data.title,
        notes: responseBody.data.notes,
        diagnosis: responseBody.data.diagnosis,
      });
    }
  }, [isSuccess, responseBody, reset]);

  useEffect(() => {
    if (isError) {
      reset({
        title: fallbackDetail.title,
        notes: fallbackDetail.notes,
        diagnosis: fallbackDetail.diagnosis,
      });
      toast.info("Offline pre-load mode. Using local draft data.");
    }
  }, [isError, reset]);

  // Mutation to PUT update draft
  const updateMutation = useMutation({
    mutationFn: async (formData: UpdateDraftFormInputs) => {
      const payload = {
        draftId: parseInt(draftId || "0"),
        ...formData,
      };

      const response = await axios.put(
        `${backendUrl}StudentDoctor/medical-record-drafts/${draftId}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medical-drafts"] });
      queryClient.invalidateQueries({
        queryKey: ["medical-draft-details", draftId],
      });
      navigate("/student-doctor/medical-record-drafts");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message ||
          "Failed to update medical record draft",
      );
    },
  });

  const onSubmit = (data: UpdateDraftFormInputs) => {
    updateMutation.mutate(data);
  };

  return (
    <DashboardLayout pageTitle="Update Medical Draft">
      <div className="-mt-6 p-6 max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-(--color-text-light) hover:text-(--color-text) transition-colors mb-6 cursor-pointer group"
        >
          <BsArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back</span>
        </button>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <ScaleLoader color="#3B82F6" />
            <p className="text-sm text-(--color-text-light) font-medium animate-pulse">
              Pre-fetching draft details...
            </p>
          </div>
        ) : (
          <div className="bg-(--color-surface) rounded-2xl border border-(--color-border) shadow-sm overflow-hidden animate-in fade-in duration-200">
            {/* Header Area */}
            <div className="p-6 border-b border-(--color-border) bg-gray-50/50 dark:bg-gray-800/30 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-xl shadow-sm">
                  <BsFileMedicalFill size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-(--color-text)">
                    Update Medical Record Draft
                  </h2>
                  <p className="text-xs text-(--color-text-light) mt-0.5">
                    Modifying draft ID:{" "}
                    <span className="font-mono text-blue-500 font-bold">
                      {draftId}
                    </span>
                  </p>
                </div>
              </div>

              {isError && (
                <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 text-xs font-semibold rounded-xl border border-amber-200 dark:border-amber-900/30 self-start sm:self-auto">
                  <BsInfoCircleFill />
                  <span>Offline Edit Mode</span>
                </div>
              )}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-(--color-text) ml-1">
                    Record Title
                  </label>
                  <input
                    {...register("title", { required: "Title is required" })}
                    type="text"
                    placeholder="e.g., Routine Checkup, Emergency Root Canal"
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.title
                        ? "border-red-500"
                        : "border-(--color-border)"
                    } bg-(--color-bg) text-(--color-text) focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm`}
                  />
                  {errors.title && (
                    <p className="text-[10px] text-red-500 font-bold uppercase ml-1 tracking-wider">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                {/* Diagnosis */}
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-(--color-text) ml-1">
                    Primary Diagnosis
                  </label>
                  <input
                    {...register("diagnosis", {
                      required: "Diagnosis is required",
                    })}
                    type="text"
                    placeholder="Clinical diagnosis..."
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.diagnosis
                        ? "border-red-500"
                        : "border-(--color-border)"
                    } bg-(--color-bg) text-(--color-text) focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm`}
                  />
                  {errors.diagnosis && (
                    <p className="text-[10px] text-red-500 font-bold uppercase ml-1 tracking-wider">
                      {errors.diagnosis.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-(--color-text) ml-1">
                  Clinical Notes & Observations
                </label>
                <textarea
                  {...register("notes", {
                    required: "Clinical notes are required",
                  })}
                  rows={8}
                  placeholder="Detailed findings, treatment provided, and recommendations..."
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.notes ? "border-red-500" : "border-(--color-border)"
                  } bg-(--color-bg) text-(--color-text) focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm resize-none`}
                />
                {errors.notes && (
                  <p className="text-[10px] text-red-500 font-bold uppercase ml-1 tracking-wider">
                    {errors.notes.message}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex justify-end gap-4 border-t border-(--color-border)">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-8 py-3 text-sm font-bold text-(--color-text-light) border border-(--color-border) rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="px-10 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
                >
                  {updateMutation.isPending ? (
                    <>
                      <ScaleLoader color="#fff" height={10} width={2} />
                      Updating Draft...
                    </>
                  ) : (
                    "Update Medical Record Draft"
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default UpdateMedicalRecordDraft;
