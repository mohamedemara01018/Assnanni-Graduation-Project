import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import { useParams, useNavigate } from "react-router";
import {
  IoArrowBack,
  IoPersonOutline,
  IoCalendarOutline,
  IoCallOutline,
  IoMailOutline,
  IoLocationOutline,
  IoWaterOutline,
  IoAlertCircleOutline,
  IoMedicalOutline,
  IoPinOutline,
  IoTimeOutline,
} from "react-icons/io5";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import GenerateReport from "@/components/Doctor/Reports/GenerateReport";
import { FiPlus } from "react-icons/fi";

interface PersonalInfo {
  fullName: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  address: string;
  bloodType: string;
}

interface Appointment {
  appointmentId: number;
  title: string;
  doctorName: string;
  date: string;
  status: string;
}

interface MedicalHistory {
  diagnosis: string;
  diagnosedDate: string;
  doctorNotes: string;
  createdBy: string;
}

interface Prescription {
  medicationName: string;
  dosage: string;
  frequency: string;
  doctorName: string;
  date: string;
}

interface PatientData {
  personalInfo: PersonalInfo;
  allergies: string[];
  medicalHistories: MedicalHistory[];
  prescriptions: Prescription[];
  appointments: Appointment[];
}

interface PatientScan {
  scanId: number;
  fileUrl: string;
  annotatedImageUrl: string;
  scanType: string;
  status: string;
  aiStatus: string;
  priority: string;
  uploadedAt: string;
  detectionsCount: number;
}

const PatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const backendUrl = useSelector((state: RootState) => state.config.backendUrl);
  const token = Cookies.get("jwtToken");
  const [selectedScan, setSelectedScan] = useState<PatientScan | null>(null);

  const { role } = useSelector(
    (state: {
      auth: {
        role: string;
      };
    }) => state.auth,
  );

  const { data, isLoading, isError, error, isSuccess } = useQuery({
    queryKey: ["PatientInfo", id, role],
    queryFn: async () => {
      console.log(id);
      const endpoint =
        role === "receptionist"
          ? `Receptionist/${id}/doctor-info`
          : `Doctors/patient-info/${id}`;

      const response = await axios.get(`${backendUrl}${endpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    enabled: !!id && !!token,
  });

  useEffect(() => {
    if (isSuccess && data?.succeeded) {
      toast.success(data?.message || "Patient information loaded successfully");
    }
    if (isError) {
      console.error("Error fetching patient info:", error);
      toast.error(
        (error as any)?.response?.data?.message ||
          "Failed to load patient information",
      );
    }
  }, [isSuccess, isError, error, data]);

  const {
    data: scansData,
    isLoading: isScansLoading,
    isError: isScansError,
    error: scansError,
    isSuccess: isScansSuccess,
  } = useQuery({
    queryKey: ["PatientScans", id],
    queryFn: async () => {
      const response = await axios.get(`${backendUrl}Scans/patient/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    enabled: !!id && !!token && !!backendUrl,
  });

  useEffect(() => {
    if (isScansSuccess && scansData?.succeeded) {
      toast.success(scansData?.message || "Patient scans loaded successfully");
    }
    if (isScansError) {
      toast.error(
        (scansError as any)?.response?.data?.message ||
          "Failed to load patient scans",
      );
    }
  }, [isScansSuccess, isScansError, scansError, scansData]);

  const patient = data?.data as PatientData;
  const patientScans = (scansData?.data as PatientScan[]) || [];
  const confirmedAppointment = patient?.appointments?.find(
    (app) => app.status === "Confirmed",
  );
  const appointmentId = confirmedAppointment?.appointmentId;

  if (isLoading) {
    return (
      <DashboardLayout pageTitle="Patient Information">
        <div className="-mt-6 p-6 bg-(--color-bg) min-h-[85vh] rounded-2xl flex justify-center items-center">
          <div className="w-10 h-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (isError || !patient) {
    return (
      <DashboardLayout pageTitle="Patient Information">
        <div className="-mt-6 p-6 bg-(--color-bg) min-h-[85vh] rounded-2xl flex flex-col justify-center items-center gap-4">
          <div className="text-red-500 text-5xl mb-2">
            <IoAlertCircleOutline />
          </div>
          <h2 className="text-xl font-bold text-(--color-text)">
            Error Loading Data
          </h2>
          <p className="text-(--color-text-light)">
            {(error as any)?.response?.data?.message ||
              "Something went wrong while fetching patient details."}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle="Patient Information">
      <div className="-mt-6 p-6 bg-(--color-bg) min-h-[85vh] rounded-2xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-(--color-text-light) hover:text-(--color-text) transition-colors mb-4 cursor-pointer"
          >
            <IoArrowBack />
            <span>Back</span>
          </button>
          <h1 className="text-2xl text-(--color-text) font-bold">
            Patient Information
          </h1>
          <p className="text-sm text-(--color-text-light) mt-1 font-medium">
            Patient ID: {id}
          </p>
        </div>
        {patient.appointments.length > 0 && (
          <div className=" mb-6 bg-(--color-surface) rounded-2xl border border-(--color-border)   ">
            <GenerateReport
              patientId={id ? Number(id) : undefined}
              appointmentId={appointmentId}
            />
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Personal Details */}
          <div className="lg:col-span-1">
            <div className="bg-(--color-surface) rounded-2xl border border-(--color-border) p-6 shadow-sm">
              <h2 className="text-sm font-bold text-(--color-text) mb-6">
                Personal Details
              </h2>

              <div className="space-y-6">
                <DetailItem
                  icon={<IoPersonOutline />}
                  label="Full Name"
                  value={patient.personalInfo.fullName}
                />
                <DetailItem
                  icon={<IoCalendarOutline />}
                  label="Age / Gender"
                  value={`${patient.personalInfo.age} years / ${patient.personalInfo.gender}`}
                />
                <DetailItem
                  icon={<IoCallOutline />}
                  label="Phone"
                  value={patient.personalInfo.phone}
                />
                <DetailItem
                  icon={<IoMailOutline />}
                  label="Email"
                  value={patient.personalInfo.email}
                />
                <DetailItem
                  icon={<IoLocationOutline />}
                  label="Address"
                  value={patient.personalInfo.address}
                />
                <DetailItem
                  icon={<IoWaterOutline />}
                  label="Blood Type"
                  value={patient.personalInfo.bloodType.replace("_", " ")}
                />

                {/* Emergency Contact section removed or kept if available in real data */}
                {/* Based on the provided response, it's not there, so I'll hide it if not present */}
              </div>
            </div>
          </div>

          {/* Right Column - Medical Data */}
          <div className="lg:col-span-2 space-y-6">
            {/* Allergies */}
            <div className="bg-(--color-surface) rounded-2xl border border-(--color-border) p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <IoAlertCircleOutline className="text-red-500 text-xl" />
                <h2 className="text-sm font-bold text-(--color-text)">
                  Allergies
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {patient.allergies.length > 0 ? (
                  patient.allergies.map((allergy, i) => (
                    <span
                      key={i}
                      className="px-4 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full text-xs font-bold"
                    >
                      {allergy}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-(--color-text-light) italic">
                    No allergies recorded.
                  </p>
                )}
              </div>
            </div>

            {/* Medical History */}
            <div className="bg-(--color-surface) rounded-2xl border border-(--color-border) p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <IoMedicalOutline className="text-blue-500 text-xl" />
                <h2 className="text-sm font-bold text-(--color-text)">
                  Medical History
                </h2>
              </div>
              <div className="space-y-3">
                {patient.medicalHistories.length > 0 ? (
                  patient.medicalHistories.map((item, i) => (
                    <div
                      key={i}
                      className="p-4 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl flex flex-col gap-2 border border-border/50"
                    >
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-bold text-(--color-text)">
                          {item.diagnosis}
                        </p>
                        <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-[10px] font-bold uppercase tracking-wider">
                          {new Date(item.diagnosedDate).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-(--color-text-light)">
                        <span className="font-semibold text-(--color-text)">
                          Notes:
                        </span>{" "}
                        {item.doctorNotes}
                      </p>
                      <p className="text-[10px] text-(--color-text-light) italic">
                        Created by: {item.createdBy}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-(--color-text-light) italic px-2">
                    No medical history found.
                  </p>
                )}
              </div>
            </div>

            {/* Current Prescriptions */}
            <div className="bg-(--color-surface) rounded-2xl border border-(--color-border) p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <IoPinOutline className="text-green-500 text-xl" />
                <h2 className="text-sm font-bold text-(--color-text)">
                  Current Prescriptions
                </h2>
              </div>
              <div className="space-y-3">
                {patient.prescriptions.length > 0 ? (
                  patient.prescriptions.map((pill, i) => (
                    <div
                      key={i}
                      className="p-4 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl border border-border/50"
                    >
                      <div className="flex justify-between mb-1">
                        <p className="text-sm font-bold text-(--color-text)">
                          {pill.medicationName} ({pill.dosage})
                        </p>
                        <span className="text-xs font-medium text-(--color-text-light)">
                          {pill.frequency}
                        </span>
                      </div>
                      <p className="text-xs text-(--color-text-light)">
                        Prescribed by{" "}
                        <span className="text-(--color-text) font-semibold">
                          {pill.doctorName}
                        </span>{" "}
                        on {new Date(pill.date).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-(--color-text-light) italic px-2">
                    No active prescriptions.
                  </p>
                )}
              </div>
            </div>

            {/* Recent Appointments */}
            <div className="bg-(--color-surface) rounded-2xl border border-(--color-border) p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <IoTimeOutline className="text-purple-500 text-xl" />
                <h2 className="text-sm font-bold text-(--color-text)">
                  Recent Appointments
                </h2>
              </div>
              <div className="space-y-3">
                {patient.appointments.length > 0 ? (
                  patient.appointments.map((app, i) => (
                    <div
                      key={i}
                      className="p-4 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl flex justify-between items-center border border-border/50"
                    >
                      <div>
                        <p className="text-sm font-bold text-(--color-text)">
                          {app.title}
                        </p>
                        <p className="text-xs text-(--color-text-light) mt-1">
                          {app.doctorName} • {app.date}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          app.status === "Confirmed"
                            ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                            : "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-(--color-text-light) italic px-2">
                    No recent appointments.
                  </p>
                )}
              </div>
            </div>

            {/* Patient Scans */}
            <div className="bg-(--color-surface) rounded-2xl border border-(--color-border) p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <IoMedicalOutline className="text-indigo-500 text-xl" />
                  <h2 className="text-sm font-bold text-(--color-text)">
                    Patient Scans
                  </h2>
                </div>
                <span className="text-xs font-semibold text-(--color-text-light)">
                  {patientScans.length} records
                </span>
              </div>

              <div className="space-y-3">
                {isScansLoading ? (
                  <div className="py-8 flex justify-center">
                    <div className="w-8 h-8 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
                  </div>
                ) : patientScans.length > 0 ? (
                  patientScans.map((scan) => (
                    <button
                      key={scan.scanId}
                      onClick={() => setSelectedScan(scan)}
                      className="w-full text-left p-4 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl border border-border/50 hover:border-blue-300 hover:bg-blue-50/40 transition-all cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-bold text-(--color-text)">
                            {scan.scanType}
                          </p>
                          <p className="text-xs text-(--color-text-light) mt-1">
                            Uploaded on{" "}
                            {new Date(scan.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            scan.status?.toLowerCase() === "completed" ||
                            scan.status?.toLowerCase() === "complete"
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-amber-50 text-amber-600"
                          }`}
                        >
                          {scan.status}
                        </span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2 text-[10px] font-semibold">
                        <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-600">
                          AI: {scan.aiStatus}
                        </span>
                        <span className="px-2 py-1 rounded-full bg-purple-50 text-purple-600">
                          Priority: {scan.priority}
                        </span>
                        <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                          Detections: {scan.detectionsCount}
                        </span>
                      </div>
                    </button>
                  ))
                ) : (
                  <p className="text-xs text-(--color-text-light) italic px-2">
                    No scans found for this patient.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedScan && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedScan(null)}
        >
          <div
            className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-(--color-surface) rounded-3xl border border-(--color-border) shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-(--color-border) flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-(--color-text)">
                  Scan Details
                </h2>
                <p className="text-sm text-(--color-text-light) mt-1">
                  Full scan information for patient {id}
                </p>
              </div>
              <button
                onClick={() => setSelectedScan(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
              >
                <FiPlus className="text-2xl rotate-45 text-(--color-text-light)" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailItem
                  label="Scan ID"
                  value={selectedScan.scanId}
                  icon={<IoMedicalOutline />}
                />
                <DetailItem
                  label="Type"
                  value={selectedScan.scanType}
                  icon={<IoMedicalOutline />}
                />
                <DetailItem
                  label="Status"
                  value={selectedScan.status}
                  icon={<IoMedicalOutline />}
                />
                <DetailItem
                  label="AI Status"
                  value={selectedScan.aiStatus}
                  icon={<IoMedicalOutline />}
                />
                <DetailItem
                  label="Priority"
                  value={selectedScan.priority}
                  icon={<IoMedicalOutline />}
                />
                <DetailItem
                  label="Detections"
                  value={selectedScan.detectionsCount}
                  icon={<IoMedicalOutline />}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedScan.fileUrl && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-(--color-text-light)">
                      Original Image
                    </h3>
                    <img
                      src={selectedScan.fileUrl}
                      alt="Original scan"
                      className="w-full rounded-2xl border border-(--color-border) object-contain max-h-[280px]"
                    />
                  </div>
                )}
                {selectedScan.annotatedImageUrl && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-(--color-text-light)">
                      Annotated Image
                    </h3>
                    <img
                      src={selectedScan.annotatedImageUrl}
                      alt="Annotated scan"
                      className="w-full rounded-2xl border border-(--color-border) object-contain max-h-[280px]"
                    />
                  </div>
                )}
              </div>

              <div className="text-xs text-(--color-text-light)">
                Uploaded at: {new Date(selectedScan.uploadedAt).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

const DetailItem = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) => (
  <div className="flex gap-4 items-start">
    <div className="mt-1 text-gray-400 text-lg">{icon}</div>
    <div>
      <p className="text-xs text-(--color-text-light) font-medium mb-1">
        {label}
      </p>
      <p className="text-sm font-bold text-(--color-text)">{value}</p>
    </div>
  </div>
);

export default PatientDetails;
