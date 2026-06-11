import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import { useParams, useNavigate, NavLink } from "react-router";
import { useSelector } from "react-redux";
import { FaArrowLeft, FaRegClock, FaEnvelope, FaPhone } from "react-icons/fa6";
import { BsCalendar3, BsFillPersonFill } from "react-icons/bs";
import { GrLocation } from "react-icons/gr";
import { MdOutlineMedicalServices } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import type { RootState } from "@/store/store";
import Cookies from "js-cookie";

interface AppointmentDetails {
  id: number;
  status: string;
  date: string;
  time: string;
  location: string | null;
  duration: number;
  type: string;
  notes: string;
  patientName: string;
  doctorName: string | null;
  mode: string;
  paymentStatus: string;
}

const StudentAppointmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const backendUrl = useSelector((state: RootState) => state.config.backendUrl);
  const token = Cookies.get("jwtToken");
  const role = useSelector((state: any) => state.auth.role);
  const endpoint =
    role === "studentDoctor"
      ? "StudentDoctor/appointments/"
      : "Receptionist/dashboard/appointments/";

  const {
    data: appointment,
    isLoading,
    isError,
    error,
  } = useQuery<AppointmentDetails, Error>({
    queryKey: ["appointmentDetails", id],
    queryFn: async () => {
      const response = await axios.get(`${backendUrl}${endpoint}${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.data.succeeded) {
        throw new Error(
          response.data.message || "Failed to fetch appointment details",
        );
      }

      return response.data.data;
    },
    enabled: !!id && !!token,
  });

  if (isLoading) {
    return (
      <DashboardLayout pageTitle="Appointment Details">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (isError) {
    toast.error(error.message);
    return (
      <DashboardLayout pageTitle="Appointment Details">
        <div className="p-8 text-center">
          <p className="text-red-500 font-medium">
            Error loading appointment details.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 text-blue-600 hover:underline"
          >
            Go back
          </button>
        </div>
      </DashboardLayout>
    );
  }

  if (!appointment) return null;

  const initials = appointment.patientName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const getStatusStyles = () => {
    switch (appointment.status) {
      case "Upcoming":
      case "Confirmed":
        return "bg-blue-50 text-blue-600 border-blue-100";
      case "Completed":
        return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "Cancelled":
        return "bg-red-50 text-red-600 border-red-100";
      case "Pending":
        return "bg-yellow-50 text-yellow-600 border-yellow-100";
      case "Rescheduled":
        return "bg-purple-50 text-purple-600 border-purple-100";
      default:
        return "bg-gray-50 text-gray-600 border-gray-100";
    }
  };

  return (
    <DashboardLayout pageTitle="Appointment Details">
      <div className="-mt-6 -ml-6 bg-(--color-bg) min-h-screen p-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-(--color-text-light) hover:text-(--color-text) transition-colors mb-8 font-medium cursor-pointer"
        >
          <FaArrowLeft />
          Back
        </button>

        <div className="max-w-4xl bg-(--color-surface) rounded-2xl shadow-sm border border-(--color-border) p-10">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h1 className="text-2xl font-bold text-(--color-text) mb-1">
                Appointment Details
              </h1>
              <p className="text-sm text-(--color-text-light) font-medium">
                Appointment ID: {appointment.id}
              </p>
            </div>
            <div
              className={`${getStatusStyles()} px-4 py-1.5 rounded-xl border text-sm font-bold`}
            >
              {appointment.status}
            </div>
          </div>

          {/* Patient Information Section */}
          <div className="bg-gray-50/50 dark:bg-gray-800/20 rounded-2xl p-8 mb-10 border border-(--color-border)">
            <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-6">
              Patient Information
            </h2>
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-linear-to-br from-blue-400 to-emerald-400 flex items-center justify-center text-white text-2xl font-bold shadow-sm border-4 border-white dark:border-gray-800">
                  {initials}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-1.5 rounded-full border-2 border-white dark:border-gray-800">
                  <BsFillPersonFill size={12} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 grow">
                <div>
                  <h3 className="text-xl font-bold text-(--color-text)">
                    {appointment.patientName}
                  </h3>
                  <p className="text-sm text-(--color-text-light) font-medium">
                    Mode: {appointment.mode} • Payment:{" "}
                    {appointment.paymentStatus}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 text-sm text-(--color-text-light) font-medium">
                    <FaPhone className="text-blue-500" />
                    {"Not Provided"}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-(--color-text-light) font-medium">
                    <FaEnvelope className="text-blue-500" />
                    {"Not Provided"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Appointment Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="flex items-start gap-4">
              <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                <BsCalendar3 size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-(--color-text-light) uppercase tracking-wider mb-1">
                  Date
                </p>
                <p className="text-base font-bold text-(--color-text)">
                  {appointment.date}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                <GrLocation size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-(--color-text-light) uppercase tracking-wider mb-1">
                  Location
                </p>
                <p className="text-base font-bold text-(--color-text)">
                  {appointment.location || "Online Consultation"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                <FaRegClock size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-(--color-text-light) uppercase tracking-wider mb-1">
                  Time
                </p>
                <p className="text-base font-bold text-(--color-text)">
                  {appointment.time}
                </p>
                <p className="text-xs text-(--color-text-light) font-medium">
                  Duration: {appointment.duration} minutes
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                <MdOutlineMedicalServices size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-(--color-text-light) uppercase tracking-wider mb-1">
                  Type
                </p>
                <p className="text-base font-bold text-(--color-text)">
                  {appointment.type}
                </p>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          {appointment.notes && (
            <div className="mt-10 pt-8 border-t border-(--color-border)">
              <h2 className="text-xs font-bold text-(--color-text-light) uppercase tracking-wider mb-3">
                Appointment Notes
              </h2>
              <div className="bg-gray-50/50 dark:bg-gray-800/20 rounded-xl p-4 text-sm text-(--color-text) italic border border-(--color-border)">
                "{appointment.notes}"
              </div>
            </div>
          )}

          {/* Receptionist Actions */}
          {role === "receptionist" &&
            appointment.status !== "Cancelled" &&
            appointment.status !== "Completed" && (
              <div className="flex gap-4 mt-12 pt-10 border-t border-(--color-border)">
                {appointment.status !== "Rescheduled" && (
                  <NavLink
                    to={`/receptionist/reschedule/${appointment.id}`}
                    className="flex-1 py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-sm hover:shadow-md active:scale-[0.98] text-center"
                  >
                    Reschedule
                  </NavLink>
                )}
                <button className="flex-1 py-3 px-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-bold rounded-xl transition-all hover:bg-gray-50 dark:hover:bg-gray-700 active:scale-[0.98]">
                  Cancel Appointment
                </button>
              </div>
            )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentAppointmentDetails;
