import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";
import { useFieldArray, useForm } from "react-hook-form";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { toast } from "react-toastify";
import { ScaleLoader } from "react-spinners";
import { BsArrowLeft } from "react-icons/bs";
import { LuPill } from "react-icons/lu";

type PrescriptionItem = {
  medicationName: string;
  dosage: string;
  frequency: string;
  durationInDays: number;
};

type PrescriptionFormValues = {
  diagnosis: string;
  notes: string;
  items: PrescriptionItem[];
};

const AddPrescriptionPage = () => {
  const { patientId, medicalRecordId } = useParams<{
    patientId: string;
    medicalRecordId: string;
  }>();
  const navigate = useNavigate();
  const backendUrl = useSelector((state: RootState) => state.config.backendUrl);
  const token = Cookies.get("jwtToken");

  const parsedPatientId = Number(patientId);
  const parsedMedicalRecordId = Number(medicalRecordId);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PrescriptionFormValues>({
    defaultValues: {
      diagnosis: "",
      notes: "",
      items: [
        {
          medicationName: "",
          dosage: "",
          frequency: "",
          durationInDays: 1,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  useEffect(() => {
    if (!Number.isFinite(parsedPatientId)) {
      toast.error("Invalid patient id");
      navigate(-1);
    }
    if (!Number.isFinite(parsedMedicalRecordId)) {
      toast.error("Invalid medical record id");
      navigate(-1);
    }
  }, [navigate, parsedPatientId, parsedMedicalRecordId]);

  const mutation = useMutation({
    mutationFn: async (data: PrescriptionFormValues) => {
      await axios.post(
        `${backendUrl}StudentDoctor/prescriptions`,
        {
          patientId: parsedPatientId,
          medicalRecordId: parsedMedicalRecordId,
          diagnosis: data.diagnosis,
          notes: data.notes,
          items: data.items.map((item) => ({
            medicationName: item.medicationName,
            dosage: item.dosage,
            frequency: item.frequency,
            durationInDays: Number(item.durationInDays),
          })),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    },
    onSuccess: () => {
      toast.success("Prescription added successfully");
      navigate("/student-doctor");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to add prescription",
      );
    },
  });

  const onSubmit = (data: PrescriptionFormValues) => {
    mutation.mutate(data);
  };

  return (
    <DashboardLayout pageTitle="Add Prescription">
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
            <div className="p-3 bg-violet-100 text-violet-600 rounded-xl dark:bg-violet-900/30 dark:text-violet-400">
              <LuPill size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-(--color-text)">
                Add Prescription
              </h2>
              <p className="text-xs text-(--color-text-light) mt-0.5">
                Patient ID:{" "}
                <span className="font-mono text-violet-500 font-bold">
                  {patientId}
                </span>
                {" | Medical Record ID: "}
                <span className="font-mono text-violet-500 font-bold">
                  {medicalRecordId}
                </span>
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-(--color-text) ml-1">
                  Diagnosis
                </label>
                <input
                  {...register("diagnosis", {
                    required: "Diagnosis is required",
                  })}
                  type="text"
                  placeholder="Enter diagnosis"
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.diagnosis
                      ? "border-red-500"
                      : "border-(--color-border)"
                  } bg-(--color-bg) text-(--color-text) focus:ring-2 focus:ring-violet-500/20 outline-none transition-all text-sm`}
                />
                {errors.diagnosis && (
                  <p className="text-[10px] text-red-500 font-bold uppercase ml-1 tracking-wider">
                    {errors.diagnosis.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-(--color-text) ml-1">
                  Notes
                </label>
                <textarea
                  {...register("notes", { required: "Notes are required" })}
                  rows={5}
                  placeholder="Add clinical notes"
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.notes ? "border-red-500" : "border-(--color-border)"
                  } bg-(--color-bg) text-(--color-text) focus:ring-2 focus:ring-violet-500/20 outline-none transition-all text-sm resize-none`}
                />
                {errors.notes && (
                  <p className="text-[10px] text-red-500 font-bold uppercase ml-1 tracking-wider">
                    {errors.notes.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-(--color-text)">
                    Prescription Items
                  </h3>
                  <p className="text-xs text-(--color-text-light)">
                    Add one or more medications to the prescription.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    append({
                      medicationName: "",
                      dosage: "",
                      frequency: "",
                      durationInDays: 1,
                    })
                  }
                  className="px-4 py-2 rounded-xl bg-violet-50 text-violet-600 text-sm font-bold hover:bg-violet-100 transition-colors cursor-pointer"
                >
                  Add Item
                </button>
              </div>

              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="p-5 rounded-2xl border border-(--color-border) bg-gray-50/50 dark:bg-gray-800/20 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-(--color-text)">
                        Medication #{index + 1}
                      </h4>
                      {fields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="text-xs font-bold text-red-500 hover:text-red-600 cursor-pointer"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-(--color-text-light) uppercase tracking-wider">
                          Medication Name
                        </label>
                        <input
                          {...register(`items.${index}.medicationName`, {
                            required: "Medication name is required",
                          })}
                          type="text"
                          placeholder="e.g. Amoxicillin"
                          className="w-full px-4 py-3 rounded-xl border border-(--color-border) bg-(--color-bg) text-(--color-text) focus:ring-2 focus:ring-violet-500/20 outline-none transition-all text-sm"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-(--color-text-light) uppercase tracking-wider">
                          Dosage
                        </label>
                        <input
                          {...register(`items.${index}.dosage`, {
                            required: "Dosage is required",
                          })}
                          type="text"
                          placeholder="e.g. 500mg"
                          className="w-full px-4 py-3 rounded-xl border border-(--color-border) bg-(--color-bg) text-(--color-text) focus:ring-2 focus:ring-violet-500/20 outline-none transition-all text-sm"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-(--color-text-light) uppercase tracking-wider">
                          Frequency
                        </label>
                        <input
                          {...register(`items.${index}.frequency`, {
                            required: "Frequency is required",
                          })}
                          type="text"
                          placeholder="e.g. Twice a day"
                          className="w-full px-4 py-3 rounded-xl border border-(--color-border) bg-(--color-bg) text-(--color-text) focus:ring-2 focus:ring-violet-500/20 outline-none transition-all text-sm"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-(--color-text-light) uppercase tracking-wider">
                          Duration In Days
                        </label>
                        <input
                          {...register(`items.${index}.durationInDays`, {
                            required: "Duration is required",
                            valueAsNumber: true,
                            min: {
                              value: 1,
                              message: "Duration must be at least 1 day",
                            },
                          })}
                          type="number"
                          min={1}
                          placeholder="e.g. 7"
                          className="w-full px-4 py-3 rounded-xl border border-(--color-border) bg-(--color-bg) text-(--color-text) focus:ring-2 focus:ring-violet-500/20 outline-none transition-all text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
                className="px-10 py-3 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold shadow-lg shadow-violet-500/20 transition-all flex items-center justify-center gap-2"
              >
                {mutation.isPending ? (
                  <>
                    <ScaleLoader color="#fff" height={10} width={2} />
                    Saving...
                  </>
                ) : (
                  "Submit Prescription"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AddPrescriptionPage;
