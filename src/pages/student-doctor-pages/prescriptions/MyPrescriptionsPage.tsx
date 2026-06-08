import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { toast } from "react-toastify";
import { ScaleLoader } from "react-spinners";
import { BsArrowLeft } from "react-icons/bs";
import { FaPrescriptionBottleMedical } from "react-icons/fa6";
import { FiEdit3, FiEye, FiPlus, FiX } from "react-icons/fi";
import { useNavigate } from "react-router";

type PrescriptionItem = {
  itemId?: number;
  medicationName: string;
  dosage: string;
  frequency: string;
  durationInDays: number;
};

type Prescription = {
  prescriptionId: number;
  patientId: number;
  patientName: string;
  notes: string;
  date: string;
  items: PrescriptionItem[];
};

type MyPrescriptionsResponse = {
  isSuccess: boolean;
  status: string;
  error: string;
  value: Prescription[];
  message: string;
};

type PrescriptionDetailsResponse = {
  isSuccess: boolean;
  status: string;
  error: string;
  value: Prescription;
  message: string;
};

type UpdatePrescriptionForm = {
  prescriptionId: number;
  notes: string;
  items: PrescriptionItem[];
};

const demoPrescriptions: Prescription[] = [
  {
    prescriptionId: 9001,
    patientId: 101,
    patientName: "Amina Hassan",
    notes: "Rest, hydration, and follow-up if symptoms persist.",
    date: "2026-06-07T10:30:00.000Z",
    items: [
      {
        itemId: 1,
        medicationName: "Amoxicillin",
        dosage: "500mg",
        frequency: "Twice a day",
        durationInDays: 5,
      },
    ],
  },
  {
    prescriptionId: 9002,
    patientId: 102,
    patientName: "Kareem Ali",
    notes: "Take after meals and return in one week.",
    date: "2026-06-08T14:00:00.000Z",
    items: [
      {
        itemId: 2,
        medicationName: "Ibuprofen",
        dosage: "200mg",
        frequency: "Three times a day",
        durationInDays: 3,
      },
      {
        itemId: 3,
        medicationName: "Paracetamol",
        dosage: "500mg",
        frequency: "Every 8 hours",
        durationInDays: 4,
      },
    ],
  },
];

const emptyPrescriptionItem = (): PrescriptionItem => ({
  medicationName: "",
  dosage: "",
  frequency: "",
  durationInDays: 1,
});

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const MyPrescriptionsPage = () => {
  const navigate = useNavigate();
  const backendUrl = useSelector((state: RootState) => state.config.backendUrl);
  const token = Cookies.get("jwtToken");
  const queryClient = useQueryClient();

  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState<
    number | null
  >(null);
  const [activeModal, setActiveModal] = useState<"details" | "update" | null>(
    null,
  );

  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useQuery<MyPrescriptionsResponse>({
    queryKey: ["student-my-prescriptions"],
    queryFn: async () => {
      const response = await axios.get(
        `${backendUrl}StudentDoctor/my-prescriptions`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!response.data?.isSuccess) {
        throw new Error(
          response.data?.message || response.data?.error || "Failed to load prescriptions",
        );
      }

      return response.data;
    },
    enabled: !!token && !!backendUrl,
  });

  const prescriptions = useMemo(
    () => (response?.value?.length ? response.value : demoPrescriptions),
    [response?.value],
  );

  const selectedPrescriptionQuery = useQuery<PrescriptionDetailsResponse>({
    queryKey: ["student-prescription-details", selectedPrescriptionId],
    queryFn: async () => {
      const response = await axios.get(
        `${backendUrl}StudentDoctor/prescriptions/${selectedPrescriptionId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!response.data?.isSuccess) {
        throw new Error(
          response.data?.message || response.data?.error || "Failed to load prescription details",
        );
      }

      return response.data;
    },
    enabled:
      !!token &&
      !!backendUrl &&
      !!selectedPrescriptionId &&
      activeModal === "details",
  });

  const selectedUpdatePrescriptionQuery = useQuery<PrescriptionDetailsResponse>({
    queryKey: ["student-prescription-update", selectedPrescriptionId],
    queryFn: async () => {
      const response = await axios.get(
        `${backendUrl}StudentDoctor/prescriptions/${selectedPrescriptionId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!response.data?.isSuccess) {
        throw new Error(
          response.data?.message || response.data?.error || "Failed to load prescription details",
        );
      }

      return response.data;
    },
    enabled:
      !!token &&
      !!backendUrl &&
      !!selectedPrescriptionId &&
      activeModal === "update",
  });

  const detailsPrescription = selectedPrescriptionQuery.data?.value;
  const updatePrescription = selectedUpdatePrescriptionQuery.data?.value;

  const updateForm = useForm<UpdatePrescriptionForm>({
    defaultValues: {
      prescriptionId: 0,
      notes: "",
      items: [emptyPrescriptionItem()],
    },
  });

  const {
    register: registerUpdate,
    control: updateControl,
    handleSubmit: handleUpdateSubmit,
    reset: resetUpdateForm,
    formState: { errors: updateErrors },
  } = updateForm;

  const { fields, append, remove } = useFieldArray({
    control: updateControl,
    name: "items",
  });

  useEffect(() => {
    if (activeModal === "update" && updatePrescription) {
      resetUpdateForm({
        prescriptionId: updatePrescription.prescriptionId,
        notes: updatePrescription.notes ?? "",
        items: updatePrescription.items?.length
          ? updatePrescription.items.map((item) => ({
              medicationName: item.medicationName ?? "",
              dosage: item.dosage ?? "",
              frequency: item.frequency ?? "",
              durationInDays: item.durationInDays ?? 1,
            }))
          : [emptyPrescriptionItem()],
      });
    }
  }, [activeModal, updatePrescription, resetUpdateForm]);

  useEffect(() => {
    if (isError && error) {
      const err = error as any;
      toast.error(
        err.response?.data?.message || err.message || "Failed to load prescriptions",
      );
    }
  }, [isError, error]);

  useEffect(() => {
    if (selectedPrescriptionQuery.isError) {
      const err = selectedPrescriptionQuery.error as any;
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Failed to load prescription details",
      );
    }
  }, [selectedPrescriptionQuery.isError, selectedPrescriptionQuery.error]);

  useEffect(() => {
    if (selectedUpdatePrescriptionQuery.isError) {
      const err = selectedUpdatePrescriptionQuery.error as any;
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Failed to load prescription details",
      );
    }
  }, [
    selectedUpdatePrescriptionQuery.isError,
    selectedUpdatePrescriptionQuery.error,
  ]);

  const updateMutation = useMutation({
    mutationFn: async (data: UpdatePrescriptionForm) => {
      if (!selectedPrescriptionId) {
        throw new Error("No prescription selected");
      }

      await axios.put(
        `${backendUrl}StudentDoctor/prescriptions/${selectedPrescriptionId}`,
        {
          prescriptionId: data.prescriptionId,
          notes: data.notes,
          items: data.items.map((item) => ({
            medicationName: item.medicationName,
            dosage: item.dosage,
            frequency: item.frequency,
            durationInDays: Number(item.durationInDays),
          })),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
    },
    onSuccess: async () => {
      toast.success("Prescription updated successfully");
      setActiveModal(null);
      setSelectedPrescriptionId(null);
      await queryClient.invalidateQueries({
        queryKey: ["student-my-prescriptions"],
      });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || err.message || "Failed to update prescription");
    },
  });

  const openDetails = (id: number) => {
    setSelectedPrescriptionId(id);
    setActiveModal("details");
  };

  const openUpdate = (id: number) => {
    setSelectedPrescriptionId(id);
    setActiveModal("update");
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedPrescriptionId(null);
  };

  const submitUpdate = (data: UpdatePrescriptionForm) => {
    updateMutation.mutate(data);
  };

  return (
    <DashboardLayout pageTitle="My Prescriptions">
      <div className="-mt-6 p-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-(--color-text-light) hover:text-(--color-text) transition-colors mb-6 cursor-pointer group"
        >
          <BsArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back</span>
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-violet-100 text-violet-600">
            <FaPrescriptionBottleMedical size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-(--color-text)">
              My Prescriptions
            </h1>
            <p className="text-sm text-(--color-text-light)">
              Review and update your prescriptions
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20 bg-(--color-surface) rounded-2xl border border-(--color-border)">
            <ScaleLoader color="#8B5CF6" height={20} />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {prescriptions.map((prescription) => (
              <div
                key={prescription.prescriptionId}
                className="bg-(--color-surface) border border-(--color-border) rounded-2xl shadow-sm p-6"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-(--color-text)">
                      {prescription.patientName}
                    </h2>
                    <p className="text-sm text-(--color-text-light)">
                      Patient ID: {prescription.patientId}
                    </p>
                    <p className="text-xs text-(--color-text-light) mt-1">
                      Issued: {formatDate(prescription.date)}
                    </p>
                  </div>
                  <div className="px-3 py-1 rounded-full border border-violet-100 bg-violet-50 text-violet-600 text-xs font-bold uppercase tracking-wider">
                    Prescription #{prescription.prescriptionId}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-(--color-text) uppercase tracking-wider mb-2">
                      Notes
                    </h3>
                    <p className="text-sm text-(--color-text-light)">
                      {prescription.notes || "No notes provided."}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-(--color-text) uppercase tracking-wider mb-2">
                      Medication Items
                    </h3>
                    <div className="space-y-3">
                      {prescription.items.map((item, idx) => (
                        <div
                          key={`${prescription.prescriptionId}-${item.itemId ?? idx}`}
                          className="p-4 rounded-xl border border-(--color-border) bg-gray-50/50 dark:bg-gray-800/20"
                        >
                          <p className="font-bold text-(--color-text)">
                            {item.medicationName}
                          </p>
                          <p className="text-sm text-(--color-text-light)">
                            Dosage: {item.dosage}
                          </p>
                          <p className="text-sm text-(--color-text-light)">
                            Frequency: {item.frequency}
                          </p>
                          <p className="text-sm text-(--color-text-light)">
                            Duration: {item.durationInDays} days
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-(--color-border)">
                  <button
                    type="button"
                    onClick={() => openDetails(prescription.prescriptionId)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-100 text-sm font-bold transition-colors cursor-pointer"
                  >
                    <FiEye />
                    Get Details
                  </button>
                  <button
                    type="button"
                    onClick={() => openUpdate(prescription.prescriptionId)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-50 text-violet-700 hover:bg-violet-100 border border-violet-100 text-sm font-bold transition-colors cursor-pointer"
                  >
                    <FiEdit3 />
                    Update
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {activeModal === "details" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-(--color-surface) rounded-3xl border border-(--color-border) shadow-2xl">
            <div className="flex items-center justify-between gap-4 p-6 border-b border-(--color-border)">
              <div>
                <h2 className="text-xl font-bold text-(--color-text)">
                  Prescription Details
                </h2>
                <p className="text-sm text-(--color-text-light)">
                  {selectedPrescriptionId ? `Prescription #${selectedPrescriptionId}` : "Selected prescription"}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <FiX size={20} className="text-(--color-text-light)" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {selectedPrescriptionQuery.isLoading ? (
                <div className="py-16 flex justify-center">
                  <ScaleLoader color="#8B5CF6" height={18} />
                </div>
              ) : detailsPrescription ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-gray-50/50 dark:bg-gray-800/20 border border-(--color-border)">
                      <p className="text-xs font-bold uppercase tracking-wider text-(--color-text-light)">
                        Patient
                      </p>
                      <p className="text-lg font-bold text-(--color-text)">
                        {detailsPrescription.patientName}
                      </p>
                      <p className="text-sm text-(--color-text-light)">
                        Patient ID: {detailsPrescription.patientId}
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-gray-50/50 dark:bg-gray-800/20 border border-(--color-border)">
                      <p className="text-xs font-bold uppercase tracking-wider text-(--color-text-light)">
                        Date
                      </p>
                      <p className="text-lg font-bold text-(--color-text)">
                        {formatDate(detailsPrescription.date)}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-gray-50/50 dark:bg-gray-800/20 border border-(--color-border)">
                    <p className="text-xs font-bold uppercase tracking-wider text-(--color-text-light) mb-2">
                      Notes
                    </p>
                    <p className="text-sm text-(--color-text)">
                      {detailsPrescription.notes || "No notes provided."}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-(--color-text) uppercase tracking-wider">
                      Items
                    </h3>
                    <div className="space-y-3">
                      {detailsPrescription.items.map((item) => (
                        <div
                          key={item.itemId ?? `${item.medicationName}-${item.dosage}`}
                          className="p-4 rounded-2xl border border-(--color-border) bg-gray-50/50 dark:bg-gray-800/20"
                        >
                          <p className="font-bold text-(--color-text)">
                            {item.medicationName}
                          </p>
                          <p className="text-sm text-(--color-text-light)">
                            Dosage: {item.dosage}
                          </p>
                          <p className="text-sm text-(--color-text-light)">
                            Frequency: {item.frequency}
                          </p>
                          <p className="text-sm text-(--color-text-light)">
                            Duration: {item.durationInDays} days
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-sm text-(--color-text-light)">
                  No prescription details available.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {activeModal === "update" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-(--color-surface) rounded-3xl border border-(--color-border) shadow-2xl">
            <div className="flex items-center justify-between gap-4 p-6 border-b border-(--color-border)">
              <div>
                <h2 className="text-xl font-bold text-(--color-text)">
                  Update Prescription
                </h2>
                <p className="text-sm text-(--color-text-light)">
                  {selectedPrescriptionId ? `Prescription #${selectedPrescriptionId}` : "Selected prescription"}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <FiX size={20} className="text-(--color-text-light)" />
              </button>
            </div>

            <form
              onSubmit={handleUpdateSubmit(submitUpdate)}
              className="p-6 space-y-6"
            >
              <input type="hidden" {...registerUpdate("prescriptionId")} />

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-(--color-text) ml-1">
                  Notes
                </label>
                <textarea
                  {...registerUpdate("notes", {
                    required: "Notes are required",
                  })}
                  rows={4}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    updateErrors.notes ? "border-red-500" : "border-(--color-border)"
                  } bg-(--color-bg) text-(--color-text) focus:ring-2 focus:ring-violet-500/20 outline-none transition-all text-sm resize-none`}
                  placeholder="Update the prescription notes"
                />
                {updateErrors.notes && (
                  <p className="text-[10px] text-red-500 font-bold uppercase ml-1 tracking-wider">
                    {updateErrors.notes.message}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-(--color-text)">
                    Medication Items
                  </h3>
                  <p className="text-xs text-(--color-text-light)">
                    Modify the medication list before saving.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => append(emptyPrescriptionItem())}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-50 text-violet-700 hover:bg-violet-100 border border-violet-100 text-sm font-bold transition-colors cursor-pointer"
                >
                  <FiPlus />
                  Add Item
                </button>
              </div>

              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="p-5 rounded-2xl border border-(--color-border) bg-gray-50/50 dark:bg-gray-800/20 space-y-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <h4 className="text-sm font-bold text-(--color-text)">
                        Item #{index + 1}
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
                          {...registerUpdate(`items.${index}.medicationName`, {
                            required: "Medication name is required",
                          })}
                          className="w-full px-4 py-3 rounded-xl border border-(--color-border) bg-(--color-bg) text-(--color-text) focus:ring-2 focus:ring-violet-500/20 outline-none transition-all text-sm"
                          placeholder="Medication name"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-(--color-text-light) uppercase tracking-wider">
                          Dosage
                        </label>
                        <input
                          {...registerUpdate(`items.${index}.dosage`, {
                            required: "Dosage is required",
                          })}
                          className="w-full px-4 py-3 rounded-xl border border-(--color-border) bg-(--color-bg) text-(--color-text) focus:ring-2 focus:ring-violet-500/20 outline-none transition-all text-sm"
                          placeholder="e.g. 500mg"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-(--color-text-light) uppercase tracking-wider">
                          Frequency
                        </label>
                        <input
                          {...registerUpdate(`items.${index}.frequency`, {
                            required: "Frequency is required",
                          })}
                          className="w-full px-4 py-3 rounded-xl border border-(--color-border) bg-(--color-bg) text-(--color-text) focus:ring-2 focus:ring-violet-500/20 outline-none transition-all text-sm"
                          placeholder="e.g. Twice a day"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-(--color-text-light) uppercase tracking-wider">
                          Duration In Days
                        </label>
                        <input
                          type="number"
                          min={1}
                          {...registerUpdate(`items.${index}.durationInDays`, {
                            required: "Duration is required",
                            valueAsNumber: true,
                            min: {
                              value: 1,
                              message: "Duration must be at least 1 day",
                            },
                          })}
                          className="w-full px-4 py-3 rounded-xl border border-(--color-border) bg-(--color-bg) text-(--color-text) focus:ring-2 focus:ring-violet-500/20 outline-none transition-all text-sm"
                          placeholder="7"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-8 py-3 text-sm font-bold text-(--color-text-light) border border-(--color-border) rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="px-10 py-3 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold shadow-lg shadow-violet-500/20 transition-all flex items-center justify-center gap-2"
                >
                  {updateMutation.isPending ? (
                    <>
                      <ScaleLoader color="#fff" height={10} width={2} />
                      Saving...
                    </>
                  ) : (
                    "Update Prescription"
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

export default MyPrescriptionsPage;
