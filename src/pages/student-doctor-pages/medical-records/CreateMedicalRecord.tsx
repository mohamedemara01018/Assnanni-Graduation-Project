import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import Cookies from "js-cookie";
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import { BsFileMedical, BsArrowLeft } from "react-icons/bs";
import { ScaleLoader } from "react-spinners";

interface MedicalRecordForm {
  title: string;
  diagnosis: string;
  notes: string;
}

const CreateMedicalRecord = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const backendUrl = useSelector((state: RootState) => state.config.backendUrl);
  const token = Cookies.get("jwtToken");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MedicalRecordForm>();

  const mutation = useMutation({
    mutationFn: async (data: MedicalRecordForm) => {
      await axios.post(
        `${backendUrl}StudentDoctor/medical-record-draft`,
        {
          appointmentId: id,
          ...data,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
    },
    onSuccess: () => {
      navigate("/student-doctor");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to save medical record",
      );
    },
  });

  const onSubmit = (data: MedicalRecordForm) => {
    mutation.mutate(data);
  };

  return (
    <DashboardLayout pageTitle="New Medical Record">
      <div className="-mt-6 p-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-(--color-text-light) hover:text-(--color-text) transition-colors mb-6 cursor-pointer group"
        >
          <BsArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Dashboard</span>
        </button>

        <div className="bg-(--color-surface) rounded-2xl border border-(--color-border) shadow-sm overflow-hidden">
          <div className="p-6 border-b border-(--color-border) bg-gray-50/50 dark:bg-gray-800/30 flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl dark:bg-blue-900/30 dark:text-blue-400">
              <BsFileMedical size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-(--color-text)">
                Create Clinical Record Draft
              </h2>
              <p className="text-xs text-(--color-text-light) mt-0.5">
                Appointment ID:{" "}
                <span className="font-mono text-blue-500 font-bold">{id}</span>
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-(--color-text) ml-1">
                  Record Title
                </label>
                <input
                  {...register("title", { required: "Title is required" })}
                  type="text"
                  placeholder="e.g., Routine Checkup, Emergency Root Canal"
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.title ? "border-red-500" : "border-(--color-border)"
                  } bg-(--color-bg) text-(--color-text) focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm`}
                />
                {errors.title && (
                  <p className="text-[10px] text-red-500 font-bold uppercase ml-1 tracking-wider">
                    {errors.title.message}
                  </p>
                )}
              </div>

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

            <div className="pt-4 flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-8 py-3 text-sm font-bold text-(--color-text-light) border border-(--color-border) rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={mutation.isPending}
                className="px-10 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
              >
                {mutation.isPending ? (
                  <>
                    <ScaleLoader color="#fff" height={10} width={2} />
                    Saving Draft...
                  </>
                ) : (
                  "Save Medical Record Draft"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateMedicalRecord;
