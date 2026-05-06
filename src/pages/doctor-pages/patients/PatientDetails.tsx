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
import { useEffect } from "react";

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
  title: string;
  doctorName: string;
  date: string;
  status: string;
}

interface PatientData {
  personalInfo: PersonalInfo;
  allergies: string[];
  medicalHistories: any[];
  prescriptions: any[];
  appointments: Appointment[];
}

const PatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const backendUrl = useSelector((state: RootState) => state.config.backendUrl);
  const token = Cookies.get("jwtToken");

  const { data, isLoading, isError, error, isSuccess } = useQuery({
    queryKey: ["PatientInfo", id],
    queryFn: async () => {
      const response = await axios.get(`${backendUrl}Doctors/patient-info/${id}`, {
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
        (error as any)?.response?.data?.message || "Failed to load patient information"
      );
    }
  }, [isSuccess, isError, error, data]);

  const patient = data?.data as PatientData;

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
          <h2 className="text-xl font-bold text-(--color-text)">Error Loading Data</h2>
          <p className="text-(--color-text-light)">
            {(error as any)?.response?.data?.message || "Something went wrong while fetching patient details."}
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
                  <p className="text-xs text-(--color-text-light) italic">No allergies recorded.</p>
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
                      className="p-4 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl flex justify-between items-center border border-border/50"
                    >
                      <div>
                        <p className="text-sm font-bold text-(--color-text)">
                          {item.condition || item.title || "Medical Record"}
                        </p>
                        <p className="text-xs text-(--color-text-light) mt-1">
                          Date: {item.date}
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        {item.status || "Recorded"}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-(--color-text-light) italic px-2">No medical history found.</p>
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
                          {pill.name || pill.medicineName}
                        </p>
                        <span className="text-xs font-medium text-(--color-text-light)">
                          {pill.frequency}
                        </span>
                      </div>
                      <p className="text-xs text-(--color-text-light)">
                        Prescribed by{" "}
                        <span className="text-(--color-text) font-semibold">
                          {pill.prescribedBy || pill.doctorName}
                        </span>{" "}
                        on {pill.date}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-(--color-text-light) italic px-2">No active prescriptions.</p>
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
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        app.status === "Confirmed" 
                          ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                          : "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                      }`}>
                        {app.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-(--color-text-light) italic px-2">No recent appointments.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
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

