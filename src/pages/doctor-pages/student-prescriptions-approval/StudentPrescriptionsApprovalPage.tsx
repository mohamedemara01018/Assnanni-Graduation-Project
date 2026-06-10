import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import {
  CheckCircle,
  XCircle,
  FileText,
  User,
  Calendar,
  Clock,
} from "lucide-react";
import Cookies from "js-cookie";
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// ─── Interfaces ───────────────────────────────────────────────────────────────

interface PrescriptionItem {
  medicationName: string;
  dosage: string;
  frequency: string;
  durationInDays: number;
}

interface Prescription {
  prescriptionId: number;
  medicalRecordId: number;
  diagnosis: string;
  date: string;
  status: string;
  items: PrescriptionItem[];
}

interface Patient {
  patientId: number;
  patientName: string;
  prescriptions: Prescription[];
}

interface StudentDoctor {
  studentDoctorId: number;
  studentDoctorName: string;
  patients: Patient[];
}

interface ApiResponse {
  succeeded: boolean;
  message: string;
  data: StudentDoctor[];
  meta: null;
}

interface RejectRequest {
  prescriptionId: number;
  rejectionReason: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

function StudentPrescriptionsApprovalPage() {
  const queryClient = useQueryClient();
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState<
    number | null
  >(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const token = Cookies.get("jwtToken");

  // Fetch prescriptions
  const { data, isLoading, error } = useQuery<ApiResponse>({
    queryKey: ["student-prescriptions-approval"],
    queryFn: async () => {
      const response = await axios.get(
        `${backendUrl}Doctors/doctors-studetndoctor-prescriptions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data;
    },
  });

  // Approve mutation
  const approveMutation = useMutation({
    mutationFn: async (prescriptionId: number) => {
      const response = await axios.put(
        `${backendUrl}StudentDoctor/prescriptions/${prescriptionId}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["student-prescriptions-approval"],
      });
    },
    onError: () => {
      toast.error("Failed to approve prescription");
    },
  });

  // Reject mutation
  const rejectMutation = useMutation({
    mutationFn: async (data: RejectRequest) => {
      const response = await axios.put(
        `${backendUrl}StudentDoctor/prescriptions/${data.prescriptionId}/reject`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["student-prescriptions-approval"],
      });
      setRejectModalOpen(false);
      setRejectionReason("");
      setSelectedPrescription(null);
    },
    onError: () => {
      toast.error("Failed to reject prescription");
    },
  });

  const handleApprove = (prescriptionId: number) => {
    approveMutation.mutate(prescriptionId);
  };

  const handleRejectClick = (prescriptionId: number) => {
    setSelectedPrescription(prescriptionId);
    setRejectModalOpen(true);
  };

  const handleRejectSubmit = () => {
    if (selectedPrescription && rejectionReason.trim()) {
      rejectMutation.mutate({
        prescriptionId: selectedPrescription,
        rejectionReason: rejectionReason.trim(),
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <DashboardLayout pageTitle="Doctor">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-(--color-primary)"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout pageTitle="Doctor">
        <div className="flex items-center justify-center h-64">
          <p className="text-red-500">
            Failed to load prescriptions. Please try again.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle="Doctor">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-(--color-text)">
            Student Doctor Prescriptions Approval
          </h1>
          <p className="text-sm text-(--color-text-light) mt-0.5">
            Review and approve or reject student doctor prescriptions
          </p>
        </div>

        {/* Content */}
        {data?.data && data.data.length > 0 ? (
          data.data.map((studentDoctor) => (
            <div key={studentDoctor.studentDoctorId} className="space-y-4">
              <h2 className="text-lg font-medium text-(--color-text) flex items-center gap-2">
                <User className="w-5 h-5" />
                {studentDoctor.studentDoctorName}
              </h2>

              {studentDoctor.patients.map((patient) => (
                <div
                  key={patient.patientId}
                  className="bg-(--color-surface) rounded-xl border border-(--color-border) p-4 space-y-4"
                >
                  <div className="flex items-center gap-2 text-(--color-text-light)">
                    <User className="w-4 h-4" />
                    <span className="font-medium">{patient.patientName}</span>
                  </div>

                  {patient.prescriptions.map((prescription) => (
                    <div
                      key={prescription.prescriptionId}
                      className="bg-(--color-surface) rounded-lg border border-(--color-border) p-4 space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-(--color-primary)" />
                            <span className="font-medium text-(--color-text)">
                              Prescription #{prescription.prescriptionId}
                            </span>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-(--color-text-light)">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>{formatDate(prescription.date)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span
                                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                  prescription.status === "PendingApproval"
                                    ? "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400"
                                    : prescription.status === "Approved"
                                      ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                                      : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                                }`}
                              >
                                {prescription.status}
                              </span>
                            </div>
                          </div>

                          <div>
                            <p className="text-sm text-(--color-text-light)">
                              Diagnosis:
                            </p>
                            <p className="text-sm text-(--color-text)">
                              {prescription.diagnosis}
                            </p>
                          </div>

                          <div>
                            <p className="text-sm text-(--color-text-light) mb-2">
                              Medications:
                            </p>
                            <div className="space-y-2">
                              {prescription.items.map((item, idx) => (
                                <div
                                  key={idx}
                                  className="bg-(--color-surface) rounded-lg border border-(--color-border) p-3"
                                >
                                  <p className="text-sm font-medium text-(--color-text)">
                                    {item.medicationName}
                                  </p>
                                  <div className="text-xs text-(--color-text-light) mt-1 space-y-1">
                                    <p>Dosage: {item.dosage}</p>
                                    <p>Frequency: {item.frequency}</p>
                                    <p>Duration: {item.durationInDays} days</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {prescription.status === "PendingApproval" && (
                          <div className="flex flex-col gap-2">
                            <button
                              onClick={() =>
                                handleApprove(prescription.prescriptionId)
                              }
                              disabled={approveMutation.isPending}
                              className="flex items-center gap-2 px-3 py-2 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg text-sm font-medium transition-all disabled:opacity-50 cursor-pointer"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Approve
                            </button>
                            <button
                              onClick={() =>
                                handleRejectClick(prescription.prescriptionId)
                              }
                              disabled={rejectMutation.isPending}
                              className="flex items-center gap-2 px-3 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-sm font-medium transition-all disabled:opacity-50 cursor-pointer"
                            >
                              <XCircle className="w-4 h-4" />
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-(--color-text-light) mx-auto mb-4" />
            <p className="text-(--color-text-light)">
              No pending prescriptions to review
            </p>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {rejectModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-(--color-surface) rounded-xl border border-(--color-border) p-6 w-full max-w-md space-y-4">
            <h3 className="text-lg font-semibold text-(--color-text)">
              Reject Prescription
            </h3>
            <p className="text-sm text-(--color-text-light)">
              Please provide a reason for rejecting this prescription.
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full px-3 py-2 border border-(--color-border) rounded-lg bg-(--color-surface) text-(--color-text) text-sm resize-none"
              rows={4}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setRejectModalOpen(false);
                  setRejectionReason("");
                  setSelectedPrescription(null);
                }}
                className="px-4 py-2 text-(--color-text) hover:bg-(--color-border) rounded-lg text-sm font-medium transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectSubmit}
                disabled={!rejectionReason.trim() || rejectMutation.isPending}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-all disabled:opacity-50"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default StudentPrescriptionsApprovalPage;
