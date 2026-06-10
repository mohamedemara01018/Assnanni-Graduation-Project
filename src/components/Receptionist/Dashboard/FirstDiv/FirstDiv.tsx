import { NavLink } from "react-router";
import { BsCalendar3 } from "react-icons/bs";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import type { RecentPatient } from "@/interfaces/doctorInterfaces";
import Patient from "@/components/Doctor/Dashboard/FirstDiv/Patient";
import PatientQueueCard, { type PatientInQueue } from "./PatientQueueCard";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { HiPlus } from "react-icons/hi";
import { X } from "lucide-react";

export interface DashboardAppointment {
  id: string | number;
  doctorName: string;
  specialty: string;
  time: string;
  status: "confirmed" | "pending" | "completed";
}

export interface CheckedInAppointment {
  appointmentId: number;
  patientId: number;
  patientName: string;
  date: string;
  startTime: string;
  arrivedAt: string;
  queueStatus: string;
}

type ReceptionistDashboardData = {
  patientQueue: PatientInQueue[];
  todayAppointments: DashboardAppointment[];
  recentPatients: RecentPatient[];
  checkedInAppointments: CheckedInAppointment[];
};

const getResponseData = <T,>(responseData: unknown): T => {
  const data = responseData as {
    data?: T;
    value?: T;
  };

  return data?.data || data?.value || (responseData as T);
};

const AppointmentCard = ({
  appointment,
  onConfirm,
  isConfirming,
}: {
  appointment: DashboardAppointment;
  onConfirm: (id: string | number) => void;
  isConfirming: boolean;
}) => {
  const { doctorName, specialty, time, status } = appointment;
  const statusStyles = {
    confirmed: "bg-emerald-50 text-emerald-600 border-emerald-100",
    Confirmed: "bg-emerald-50 text-emerald-600 border-emerald-100",
    pending: "bg-yellow-50 text-yellow-600 border-yellow-100",
    Pending: "bg-yellow-50 text-yellow-600 border-yellow-100",
    completed: "bg-gray-100 text-gray-600 border-gray-200",
    Completed: "bg-gray-100 text-gray-600 border-gray-200",
  };

  return (
    <div className="relative group">
      <NavLink
        to={`/receptionist/${appointment.id}/check-in`}
        className="flex bg-gray-50/50 dark:bg-gray-800/20 items-center justify-between p-4 rounded-2xl border border-(--color-border) hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors cursor-pointer"
      >
        <div className="flex gap-4 items-center">
          <div className="w-12 h-12 flex items-center justify-center bg-blue-50 text-blue-500 rounded-xl border border-blue-100 shadow-sm group-hover:bg-blue-500 group-hover:text-white transition-colors">
            <BsCalendar3 size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-(--color-text)">
              Dr. {doctorName}
            </h3>
            <p className="text-xs text-(--color-text-light) font-medium">
              {specialty}
            </p>
            <p className="text-[10px] text-(--color-text-light) font-medium mt-0.5">
              {time}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {status.toLowerCase() === "pending" && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onConfirm(appointment.id);
              }}
              disabled={isConfirming}
              className="px-3 py-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm font-bold rounded-full transition-all shadow-sm shadow-green-100 cursor-pointer"
            >
              Confirm
            </button>
          )}
          <div
            className={`px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${
              statusStyles[status as keyof typeof statusStyles] ||
              statusStyles.pending
            }`}
          >
            {status}
          </div>
        </div>
      </NavLink>
    </div>
  );
};

const FirstDiv = () => {
  const backendUrl = useSelector((state: RootState) => state.config.backendUrl);
  const token = Cookies.get("jwtToken");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const { data, isSuccess, isError, error } =
    useQuery<ReceptionistDashboardData>({
      queryKey: ["ReceptionistDashboardFirstDiv"],
      queryFn: async () => {
        const [queueRes, appointmentsRes, recentPatientsRes, checkedInRes] =
          await Promise.all([
            axios.get(`${backendUrl}Receptionist/patient-queue`, config),
            axios.get(`${backendUrl}Receptionist/today-appointments`, config),
            axios.get(`${backendUrl}Receptionist/recent-patients`, config),
            axios.get(
              `${backendUrl}Receptionist/checked-in-appointments`,
              config,
            ),
          ]);

        return {
          patientQueue: getResponseData<PatientInQueue[]>(queueRes.data),
          todayAppointments: getResponseData<DashboardAppointment[]>(
            appointmentsRes.data,
          ),
          recentPatients: getResponseData<RecentPatient[]>(
            recentPatientsRes.data,
          ),
          checkedInAppointments: getResponseData<CheckedInAppointment[]>(
            checkedInRes.data,
          ),
        };
      },
    });
  const queryClient = useQueryClient();

  const [isQueueModalOpen, setIsQueueModalOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    number | null
  >(null);

  const addToQueueMutation = useMutation({
    mutationFn: async (appointmentId: string | number) => {
      await axios.post(
        `${backendUrl}Receptionist/add-to-queue/${appointmentId}`,
        {},
        config,
      );
    },
    onSuccess: () => {
      setIsQueueModalOpen(false);
      setSelectedAppointmentId(null);
      queryClient.invalidateQueries({
        queryKey: ["ReceptionistDashboardFirstDiv"],
      });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to add to queue");
    },
  });

  const handleQueueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppointmentId) {
      toast.warning("Please select a checked-in appointment");
      return;
    }
    addToQueueMutation.mutate(selectedAppointmentId);
  };

  const confirmAppointmentMutation = useMutation({
    mutationFn: async (id: string | number) => {
      await axios.patch(`${backendUrl}Receptionist/${id}/confirm`, {}, config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["ReceptionistDashboardFirstDiv"],
      });
    },
    onError: (err: any) => {
      toast.error(
        err.response?.data?.message || "Failed to confirm appointment",
      );
    },
  });

  const startConsultationMutation = useMutation({
    mutationFn: async (id: string | number) => {
      await axios.post(`${backendUrl}Receptionist/start/${id}`, {}, config);
    },
    onSuccess: () => {
      toast.success("Consultation started");
      queryClient.invalidateQueries({
        queryKey: ["ReceptionistDashboardFirstDiv"],
      });
    },
    onError: (err: any) => {
      toast.error(
        err.response?.data?.message || "Failed to start consultation",
      );
    },
  });

  const completeConsultationMutation = useMutation({
    mutationFn: async (id: string | number) => {
      await axios.post(
        `${backendUrl}Receptionist/complete`,
        { appointmentId: Number(id) },
        config,
      );
    },
    onSuccess: () => {
      toast.success("Consultation completed");
      queryClient.invalidateQueries({
        queryKey: ["ReceptionistDashboardFirstDiv"],
      });
    },
    onError: (err: any) => {
      toast.error(
        err.response?.data?.message || "Failed to complete consultation",
      );
    },
  });

  const patientQueue = data?.patientQueue || [];
  const todayAppointments = data?.todayAppointments || [];
  const recentPatients = data?.recentPatients || [];
  const checkedInAppointments = data?.checkedInAppointments || [];
  const waitingPatients = patientQueue.filter(
    (patient) => patient.status === "Waiting",
  ).length;

  useEffect(() => {
    if (isError) {
      console.error("Failed to fetch receptionist dashboard details:", error);
      toast.error(error.message || "Failed to load receptionist dashboard");
    }
  }, [isSuccess, isError, error]);

  return (
    <div className="flex-[2] flex flex-col gap-8 w-full">
      {/* Patient Queue */}
      <div className="bg-(--color-surface) p-8 rounded-2xl border border-(--color-border) shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold text-(--color-text)">
            Patient Queue
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-(--color-text-light) bg-gray-100 px-3 py-1 rounded-full">
              {waitingPatients} waiting
            </span>
            <button
              onClick={() => setIsQueueModalOpen(true)}
              className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md shadow-blue-100 active:scale-95 cursor-pointer"
              title="Add to Queue"
            >
              <HiPlus size={18} />
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          {patientQueue.length > 0 ? (
            patientQueue.map((patient) => (
              <PatientQueueCard
                key={patient.id}
                patient={patient}
                onStart={(id) => startConsultationMutation.mutate(id)}
                isStarting={startConsultationMutation.isPending}
                onComplete={(id) => completeConsultationMutation.mutate(id)}
                isCompleting={completeConsultationMutation.isPending}
              />
            ))
          ) : (
            <p className="text-(--color-text-light)">No patients in queue.</p>
          )}
        </div>
      </div>

      {/* Today's Appointments */}
      <div className="bg-(--color-surface) p-8 rounded-2xl border border-(--color-border) shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold text-(--color-text)">
            Today's Appointments
          </h2>
          <NavLink
            to="/doctor-appointments"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 underline-offset-4 hover:underline"
          >
            View All
          </NavLink>
        </div>
        <div className="flex flex-col gap-4 max-h-96 overflow-y-auto">
          {todayAppointments.length > 0 ? (
            todayAppointments.map((app) => (
              <AppointmentCard
                key={app.id}
                appointment={app}
                onConfirm={(id) => confirmAppointmentMutation.mutate(id)}
                isConfirming={confirmAppointmentMutation.isPending}
              />
            ))
          ) : (
            <p className="text-(--color-text-light)">
              No appointments scheduled today.
            </p>
          )}
        </div>
      </div>

      {/* Recent Patients */}
      <div className="bg-(--color-surface) p-8 rounded-2xl border border-(--color-border) shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold text-(--color-text)">
            Recent Patients
          </h2>
          <NavLink
            to="/doctor-patients"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 underline-offset-4 hover:underline"
          >
            View All
          </NavLink>
        </div>
        <div className="flex flex-col gap-4">
          {recentPatients.length > 0 ? (
            recentPatients.map((patient) => (
              <Patient
                key={patient.id}
                id={patient.id}
                name={patient.name}
                imageUrl={patient.imageUrl}
                lastInteractionDate={patient.lastInteractionDate}
              />
            ))
          ) : (
            <p className="text-(--color-text-light)">No recent patients.</p>
          )}
        </div>
      </div>
      {/* Add to Queue Modal */}
      {isQueueModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-(--color-surface) w-full max-w-sm rounded-2xl shadow-2xl border border-(--color-border) overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-(--color-border)">
              <h2 className="text-lg font-bold text-(--color-text)">
                Add to Queue
              </h2>
              <button
                onClick={() => setIsQueueModalOpen(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
              >
                <X size={20} className="text-(--color-text-light)" />
              </button>
            </div>

            <form onSubmit={handleQueueSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-(--color-text-light)">
                  Select Checked-in Appointment{" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="max-h-72 overflow-y-auto space-y-3 pr-1">
                  {checkedInAppointments.length > 0 ? (
                    checkedInAppointments.map((appointment) => {
                      const isSelected =
                        selectedAppointmentId === appointment.appointmentId;

                      return (
                        <button
                          key={appointment.appointmentId}
                          type="button"
                          onClick={() =>
                            setSelectedAppointmentId(appointment.appointmentId)
                          }
                          className={`w-full text-left rounded-2xl border p-4 transition-all cursor-pointer ${
                            isSelected
                              ? "border-blue-500 bg-blue-50/60 shadow-sm"
                              : "border-(--color-border) bg-gray-50/50 dark:bg-gray-800/20 hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <h3 className="text-sm font-bold text-(--color-text)">
                                {appointment.patientName}
                              </h3>
                              <p className="text-xs text-(--color-text-light) font-medium mt-1">
                                Appointment #{appointment.appointmentId} |
                                Patient ID: {appointment.patientId}
                              </p>
                              <p className="text-xs text-(--color-text-light) font-medium mt-1">
                                Date: {appointment.date} | Start:{" "}
                                {appointment.startTime}
                              </p>
                              <p className="text-xs text-(--color-text-light) font-medium mt-1">
                                Arrived at: {appointment.arrivedAt}
                              </p>
                            </div>
                            <span
                              className={`shrink-0 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${
                                appointment.queueStatus === "Arrived"
                                  ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                  : "bg-gray-100 text-gray-600 border-gray-200"
                              }`}
                            >
                              {appointment.queueStatus}
                            </span>
                          </div>
                        </button>
                      );
                    })
                  ) : (
                    <p className="text-sm text-(--color-text-light) py-3">
                      No checked-in appointments found.
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={addToQueueMutation.isPending}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-3 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98] cursor-pointer"
              >
                {addToQueueMutation.isPending ? "Adding..." : "Add Patient"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FirstDiv;
