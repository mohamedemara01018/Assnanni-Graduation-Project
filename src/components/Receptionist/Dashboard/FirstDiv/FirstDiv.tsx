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

export interface DashboardAppointment {
  id: string | number;
  doctorName: string;
  specialty: string;
  time: string;
  status: "confirmed" | "pending" | "completed";
}

type ReceptionistDashboardData = {
  patientQueue: PatientInQueue[];
  todayAppointments: DashboardAppointment[];
  recentPatients: RecentPatient[];
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
}: {
  appointment: DashboardAppointment;
}) => {
  const { doctorName, specialty, time, status } = appointment;
  const statusStyles = {
    confirmed: "bg-emerald-50 text-emerald-600 border-emerald-100",
    pending: "bg-yellow-50 text-yellow-600 border-yellow-100",
    completed: "bg-gray-100 text-gray-600 border-gray-200",
  };

  return (
    <div className="flex bg-gray-50/50 dark:bg-gray-800/20 items-center justify-between p-4 rounded-2xl border border-(--color-border) hover:bg-gray-50 transition-colors group">
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
      <div
        className={`px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${statusStyles[status]}`}
      >
        {status}
      </div>
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

  const { data, isSuccess, isError, error } = useQuery<ReceptionistDashboardData>({
    queryKey: ["ReceptionistDashboardFirstDiv"],
    queryFn: async () => {
      const [queueRes, appointmentsRes, recentPatientsRes] = await Promise.all([
        axios.get(`${backendUrl}patient-queue`, config),
        axios.get(`${backendUrl}todays-appointment`, config),
        axios.get(`${backendUrl}Doctors/recent-patients`, config),
      ]);

      return {
        patientQueue: getResponseData<PatientInQueue[]>(queueRes.data),
        todayAppointments: getResponseData<DashboardAppointment[]>(
          appointmentsRes.data
        ),
        recentPatients: getResponseData<RecentPatient[]>(recentPatientsRes.data),
      };
    },
  });

  const patientQueue = data?.patientQueue || [];
  const todayAppointments = data?.todayAppointments || [];
  const recentPatients = data?.recentPatients || [];
  const waitingPatients = patientQueue.filter(
    (patient) => patient.status === "Waiting"
  ).length;

  useEffect(() => {
    if (isSuccess) {
      toast.success("Receptionist dashboard details loaded");
    }

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
          <span className="text-xs font-bold text-(--color-text-light) bg-gray-100 px-3 py-1 rounded-full">
            {waitingPatients} waiting
          </span>
        </div>
        <div className="flex flex-col gap-4">
          {patientQueue.length > 0 ? (
            patientQueue.map((patient) => (
              <PatientQueueCard key={patient.id} patient={patient} />
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
        <div className="flex flex-col gap-4">
          {todayAppointments.length > 0 ? (
            todayAppointments.map((app) => (
              <AppointmentCard key={app.id} appointment={app} />
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
    </div>
  );
};

export default FirstDiv;
