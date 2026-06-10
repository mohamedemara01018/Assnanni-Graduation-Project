import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import Card from "../../../components/Student Doctor/appointments/Card";
import AppointmentsCard from "../../../components/Student Doctor/appointments/AppointmentsCard";

import { FaRegClock } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { SlCalender } from "react-icons/sl";
import { FaRegCheckCircle } from "react-icons/fa";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import Cookies from "js-cookie";
import type { AppointmentData } from "@/interfaces/studentInterfaces";
import { useState, useEffect } from "react";

interface AppointmentAPI {
  id: number;
  patientName: string;
  type: string;
  date: string;
  time: string;
  status: string;
  mode: string;
}

interface StudentAppointmentsResponse {
  total: number;
  upcoming: number;
  completed: number;
  cancelled: number;
  appointments: AppointmentAPI[];
  // pagination (if backend supports it)
  pageNumber?: number;
  pageSize?: number;
  totalCount?: number;
}

interface ApiResponse<T> {
  succeeded: boolean;
  message: string;
  data: T;
  meta: any;
}

const StudentAppointments = () => {
  const queryClient = useQueryClient();
  const backendUrl = useSelector((state: RootState) => state.config.backendUrl);
  const token = Cookies.get("jwtToken");
  const role = useSelector((state: RootState) => state.auth.role);

  const [search, setSearch] = useState("");
  const [bookingType, setBookingType] = useState("");
  const [appointmentStatus, setAppointmentStatus] = useState("");

  const {
    data: responseBody,
    isLoading,
    isError,
    error,
    isSuccess,
  } = useQuery<ApiResponse<StudentAppointmentsResponse>, Error>({
    queryKey: [
      "studentAppointments",
      role,
      search,
      bookingType,
      appointmentStatus,
    ],

    queryFn: async () => {
      const endpoint =
        role === "studentDoctor"
          ? "StudentDoctor/appointments-dashboard"
          : "Receptionist/dashboard/appointments";

      const response = await axios.get(`${backendUrl}${endpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          search: search || undefined,
          BookingType: bookingType || undefined,
          AppointmentStatus: appointmentStatus || undefined,
        },
      });

      if (!response.data.succeeded) {
        throw new Error(
          response.data.message || "Failed to fetch appointments",
        );
      }

      return response.data;
    },
    enabled: !!token && !!backendUrl,
  });

  const confirmAppointmentMutation = useMutation({
    mutationFn: async (appointmentId: number) => {
      const response = await axios.patch(
        `${backendUrl}Receptionist/${appointmentId}/confirm`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data?.succeeded === false) {
        throw new Error(
          response.data.message || "Failed to confirm appointment",
        );
      }

      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Appointment confirmed successfully");
      queryClient.invalidateQueries({ queryKey: ["studentAppointments"] });
    },
    onError: (err: any) => {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Failed to confirm appointment",
      );
    },
  });

  // Success and failure toast notifications
  useEffect(() => {
    if (isSuccess && responseBody) {
      toast.success(responseBody.message || "Appointments loaded successfully");
    }
  }, [isSuccess, responseBody]);

  useEffect(() => {
    if (isError && error) {
      const err = error as any;
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Failed to load appointments",
      );
    }
  }, [isError, error]);

  const mapAppointment = (apiApp: AppointmentAPI): AppointmentData => ({
    id: apiApp.id,
    name: apiApp.patientName,
    desc: apiApp.type,
    date: apiApp.date,
    time: apiApp.time,
    status:
      apiApp.status === "Confirmed"
        ? "Upcoming"
        : apiApp.status === "Pending"
          ? "Pending"
          : apiApp.status === "Completed"
            ? "Completed"
            : apiApp.status === "Cancelled"
              ? "Cancelled"
              : (apiApp.status as AppointmentData["status"]),
    meetingType: apiApp.mode === "Online" ? "Video Call" : "In-Person",
  });

  const appointmentsData = responseBody?.data;
  const appointments = appointmentsData?.appointments.map(mapAppointment) || [];

  const filterSelectClass =
    "px-4 py-3 bg-(--color-surface) border border-(--color-border) rounded-xl text-sm font-medium text-(--color-text-light) focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm cursor-pointer min-w-[140px]";

  return (
    <DashboardLayout pageTitle="Appointments">
      <div className="bg-(--color-bg) -mt-6 p-6 rounded-2xl min-h-screen">
        <div className="flex flex-col gap-2 mb-10">
          <h1 className="text-3xl font-bold text-(--color-text)">
            Appointments
          </h1>
          <p className="text-sm text-(--color-text-light) font-medium">
            Manage and view all your appointments
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card
            title="Total Appointments"
            color="blue"
            logo={<SlCalender size={20} />}
            num={isLoading ? "..." : appointmentsData?.total || 0}
          />
          <Card
            title="Upcoming"
            color="violet"
            logo={<FaRegClock size={20} />}
            num={isLoading ? "..." : appointmentsData?.upcoming || 0}
          />
          <Card
            title="Completed"
            color="green"
            logo={<FaRegCheckCircle size={20} />}
            num={isLoading ? "..." : appointmentsData?.completed || 0}
          />
          <Card
            title="Cancelled"
            color="red"
            logo={<IoMdCloseCircleOutline size={22} />}
            num={isLoading ? "..." : appointmentsData?.cancelled || 0}
          />
        </div>

        {/* Search and Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="grow min-w-[280px] relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search appointments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-(--color-surface) border border-(--color-border) rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
            />
          </div>

          <div className="flex gap-3 flex-wrap">
            <select
              value={bookingType}
              onChange={(e) => setBookingType(e.target.value)}
              className={filterSelectClass}
            >
              <option value="">All Types</option>
              <option value="Online">Online</option>
              <option value="WalkIn">Walk-In</option>
              <option value="PhoneCall">Phone Call</option>
              <option value="Emergency">Emergency</option>
              <option value="Reffered">Reffered</option>
            </select>

            <select
              value={appointmentStatus}
              onChange={(e) => setAppointmentStatus(e.target.value)}
              className={filterSelectClass}
            >
              <option value="">All Statuses</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Appointments List */}
        <div className="flex flex-col gap-6 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-10 h-10 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          ) : appointments.length > 0 ? (
            appointments.map((appointment) => (
              <AppointmentsCard
                key={appointment.id}
                appointment={appointment}
                onConfirm={
                  role === "receptionist"
                    ? (id) => confirmAppointmentMutation.mutate(Number(id))
                    : undefined
                }
                isConfirming={confirmAppointmentMutation.isPending}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-(--color-surface) rounded-2xl border border-dashed border-(--color-border)">
              <SlCalender size={48} className="text-gray-300 mb-4" />
              <p className="text-(--color-text-light) font-medium">
                No appointments found
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentAppointments;
