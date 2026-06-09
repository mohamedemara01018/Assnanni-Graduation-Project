import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import Pagination from "@/components/pagination/Pagination";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { NavLink } from "react-router";
import { CancelAppointmentModal } from "@/components/cancel-appointment-modal/CancelAppointmentModal";

import { useQueryClient } from "@tanstack/react-query";

import { IoEyeOutline } from "react-icons/io5";

type BookingType = "OnlineWalkInPhoneCallEmergencyReferred";

type AppointmentStatus = "UpcomingCompletedCancelledMissedRescheduled";

interface AppointmentsDashboardResponse {
  succeeded: boolean;
  message: string;
  data: {
    total: number;
    upcoming: number;
    completed: number;
    cancelled: number;
    missedAppointments: number;
    rescheduledAppointments: number;
    appointments: {
      items: AppointmentItem[];
      pageNumber: number;
      pageSize: number;
      totalCount: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      nextPageNumber: number | null;
      previousPageNumber: number | null;
    };
  };
  meta: any;
}

interface AppointmentItem {
  appointmentId: number;
  patientId: number;
  patientName: string;
  patientImage: string | null;
  gender: string;
  age: number;
  type: string;
  date: string; // yyyy-MM-dd
  time: string; // HH:mm:ss
  status: string;
  mode: string;
  reason: string | null;
  isCheckedIn: boolean;
}

const FALLBACK_AVATAR =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96'><rect width='100%25' height='100%25' fill='%23e5e7eb'/><text x='50%25' y='54%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='40' fill='%236b7280'>?</text></svg>";

const AllAppointments = () => {
  const queryClient = useQueryClient();

  const backendUrl = useSelector((state: RootState) => state.config.backendUrl);
  console.log(backendUrl);
  const token = Cookies.get("jwtToken");
  const [nameDescription, setNameDescription] = useState("");

  // Note: backend expects a single string; UI keeps a user-friendly selection.
  const [bookingType, setBookingType] = useState<BookingType | "">("");
  const [appointmentStatus, setAppointmentStatus] = useState<
    AppointmentStatus | ""
  >("");

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [debouncedNameDescription, setDebouncedNameDescription] = useState("");

  useEffect(() => {
    const t = window.setTimeout(() => {
      setDebouncedNameDescription(nameDescription);
    }, 300);

    return () => window.clearTimeout(t);
  }, [nameDescription]);

  useEffect(() => {
    setPageNumber(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedNameDescription, bookingType, appointmentStatus]);

  const queryParams = useMemo(() => {
    const params: Record<string, any> = {
      BookingType: bookingType || undefined,
      AppointmentStatus: appointmentStatus || undefined,
      PageNumber: pageNumber,
      PageSize: pageSize,
    };

    // NOTE: NameDescription is sent to backend, but we debounce it
    // so reload happens only after the user stops typing.
    const trimmed = debouncedNameDescription.trim();
    if (trimmed) params.NameDescription = trimmed;

    return params;
  }, [
    bookingType,
    appointmentStatus,
    pageNumber,
    pageSize,
    debouncedNameDescription,
  ]);

  const {
    data: response,
    isLoading,
    isError,
    error,
    isSuccess,
  } = useQuery<AppointmentsDashboardResponse>({
    queryKey: [
      "doctor-appointments-dashboard",
      debouncedNameDescription,
      bookingType,
      appointmentStatus,
      pageNumber,
      pageSize,
    ],
    queryFn: async () => {
      const res = await axios.get(
        `${backendUrl}Doctors/appointments-dashboard`,
        {
          params: queryParams,
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        },
      );
      return res.data;
    },
    refetchOnWindowFocus: false,
  });

  const dashboard = response?.data;
  const appointments = dashboard?.appointments?.items ?? [];

  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelAppointment, setCancelAppointment] = useState<{
    id: string;
    date: string;
    time: string;
    doctorName: string;
    doctorSpecialty?: string;
  } | null>(null);

  const filteredAppointments = useMemo(() => {
    const q = nameDescription.trim().toLowerCase();
    if (!q) return appointments;

    return appointments.filter((app) => {
      const patientName = app.patientName?.toLowerCase() ?? "";
      const type = app.type?.toLowerCase() ?? "";
      const status = app.status?.toLowerCase() ?? "";

      return patientName.includes(q) || type.includes(q) || status.includes(q);
    });
  }, [appointments, nameDescription]);

  useEffect(() => {
    if (isError) {
      console.error(error);
      toast.error(
        (error as any)?.response?.data?.message ||
          (error as any)?.message ||
          "Failed to load appointments",
      );
    }

    if (isSuccess && response?.message) {
      toast.success(response.message);
    }
  }, [isError, error, isSuccess, response?.message]);

  const totalCount = dashboard?.appointments?.totalCount ?? 0;

  return (
    <DashboardLayout pageTitle="Appointments">
      <div className="flex flex-col gap-6 px-1">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold text-(--color-text)">
            Appointments Dashboard
          </h1>
          <p className="text-gray-500 text-sm">
            Search and filter your appointments.
          </p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="bg-(--color-surface) border border-(--color-border) rounded-2xl p-4 shadow-sm">
            <p className="text-sm font-medium text-(--color-text-light)">
              Total
            </p>
            <p className="text-2xl font-bold text-(--color-text)">
              {dashboard?.total ?? 0}
            </p>
          </div>
          <div className="bg-(--color-surface) border border-(--color-border) rounded-2xl p-4 shadow-sm">
            <p className="text-sm font-medium text-(--color-text-light)">
              Upcoming
            </p>
            <p className="text-2xl font-bold text-(--color-text)">
              {dashboard?.upcoming ?? 0}
            </p>
          </div>
          <div className="bg-(--color-surface) border border-(--color-border) rounded-2xl p-4 shadow-sm">
            <p className="text-sm font-medium text-(--color-text-light)">
              Completed
            </p>
            <p className="text-2xl font-bold text-(--color-text)">
              {dashboard?.completed ?? 0}
            </p>
          </div>
          <div className="bg-(--color-surface) border border-(--color-border) rounded-2xl p-4 shadow-sm">
            <p className="text-sm font-medium text-(--color-text-light)">
              Cancelled
            </p>
            <p className="text-2xl font-bold text-(--color-text)">
              {dashboard?.cancelled ?? 0}
            </p>
          </div>
          <div className="bg-(--color-surface) border border-(--color-border) rounded-2xl p-4 shadow-sm">
            <p className="text-sm font-medium text-(--color-text-light)">
              Missed
            </p>
            <p className="text-2xl font-bold text-(--color-text)">
              {dashboard?.missedAppointments ?? 0}
            </p>
          </div>
          <div className="bg-(--color-surface) border border-(--color-border) rounded-2xl p-4 shadow-sm">
            <p className="text-sm font-medium text-(--color-text-light)">
              Rescheduled
            </p>
            <p className="text-2xl font-bold text-(--color-text)">
              {dashboard?.rescheduledAppointments ?? 0}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-(--color-surface) border border-(--color-border) rounded-2xl p-4 shadow-sm">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-(--color-text)">
                  Search (Name / Description)
                </label>
                <input
                  value={nameDescription}
                  onChange={(e) => setNameDescription(e.target.value)}
                  className="px-4 py-3 bg-(--color-bg) border border-(--color-border) rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-(--color-text)"
                  placeholder="e.g. Mohamed"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-(--color-text)">
                  Booking Type
                </label>
                <select
                  value={bookingType}
                  onChange={(e) => setBookingType(e.target.value as any)}
                  className="px-4 py-3 bg-(--color-bg) border border-(--color-border) rounded-xl text-sm font-medium text-(--color-text) focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                >
                  <option value="">All</option>
                  <option value="Online">Online</option>
                  <option value="Referred">Referred</option>
                  <option value="Referred">WalkIn</option>
                  <option value="PhoneCall">PhoneCall</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-(--color-text)">
                  Appointment Status
                </label>
                <select
                  value={appointmentStatus}
                  onChange={(e) => setAppointmentStatus(e.target.value as any)}
                  className="px-4 py-3 bg-(--color-bg) border border-(--color-border) rounded-xl text-sm font-medium text-(--color-text) focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                >
                  <option value="">All</option>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Missed">Missed</option>
                  <option value="Rescheduled">Rescheduled</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20 bg-(--color-surface) rounded-2xl border border-(--color-border)">
            <div className="w-10 h-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-20 bg-(--color-surface) rounded-2xl border border-(--color-border)">
            <p className="text-(--color-text-light) font-medium">
              No appointments found.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border border-(--color-border) overflow-hidden shadow-sm bg-(--color-surface)">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 dark:bg-gray-800/30 text-(--color-text-light) text-xs uppercase tracking-wider border-b border-(--color-border)">
                    <th className="px-6 py-4 text-left font-semibold">
                      Patient
                    </th>
                    <th className="px-4 py-4 text-left font-semibold">Type</th>
                    <th className="px-4 py-4 text-left font-semibold">Date</th>
                    <th className="px-4 py-4 text-left font-semibold">Time</th>
                    <th className="px-4 py-4 text-left font-semibold">
                      Status
                    </th>
                    <th className="px-4 py-4 text-left font-semibold">Mode</th>
                    <th className="px-4 py-4 text-left font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-(--color-border)">
                  {filteredAppointments.map((app) => (
                    <tr
                      key={app.appointmentId}
                      className="hover:bg-(--color-bg-blue)/5"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={app.patientImage ?? FALLBACK_AVATAR}
                            alt={app.patientName}
                            className="w-10 h-10 rounded-full object-cover bg-gray-100"
                          />
                          <div>
                            <p className="font-semibold text-(--color-text)">
                              {app.patientName}
                            </p>
                            <p className="text-xs text-(--color-text-light)">
                              {app.gender} • {app.age} yrs
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-(--color-text)">
                        <span className="text-sm font-medium">{app.type}</span>
                      </td>
                      <td className="px-4 py-4 text-(--color-text)">
                        {app.date}
                      </td>
                      <td className="px-4 py-4 text-(--color-text)">
                        {app.time?.slice(0, 5) ?? app.time}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${
                            app.status === "Confirmed"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : app.status === "Completed"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : app.status === "Cancelled"
                                  ? "bg-red-50 text-red-700 border-red-200"
                                  : app.status === "Rescheduled"
                                    ? "bg-amber-50 text-amber-700 border-amber-200"
                                    : "bg-gray-50 text-gray-700 border-gray-200"
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-(--color-text-light)">
                        {app.mode}
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <NavLink
                            to={`/appointments/doctor-appointments/${app.appointmentId}`}
                            className=" justify-between w-1/5 flex gap-4"
                          >
                            <IoEyeOutline />
                          </NavLink>

                          {app.status === "Pending" && (
                            <button
                              type="button"
                              className="font-medium text-sm text-green-600 cursor-pointer hover:text-green-700"
                              onClick={async () => {
                                try {
                                  await axios.post(
                                    `${backendUrl}Receptionist/${app.appointmentId}/confirm`,
                                    {},
                                    {
                                      headers: token
                                        ? { Authorization: `Bearer ${token}` }
                                        : undefined,
                                    },
                                  );

                                  toast.success(
                                    "Appointment confirmed successfully",
                                  );
                                  queryClient.invalidateQueries({
                                    queryKey: ["doctor-appointments-dashboard"],
                                  });
                                } catch (err: any) {
                                  toast.error(
                                    err?.response?.data?.message ||
                                      err?.message ||
                                      "Failed to confirm appointment",
                                  );
                                }
                              }}
                            >
                              Confirm
                            </button>
                          )}

                          <button
                            type="button"
                            className={` font-medium text-sm  ${app.status === "Pending" ? "text-red-600 cursor-pointer hover:text-red-700" : "text-red-300 disabled cursor-not-allowed"}`}
                            disabled={app.status !== "Pending"}
                            onClick={() => {
                              setCancelAppointment({
                                id: String(app.appointmentId),
                                date: app.date,
                                time: app.time?.slice(0, 5) ?? app.time,
                                doctorName: app.patientName,
                              });
                              setCancelOpen(true);
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        {dashboard?.appointments && totalCount > 0 && (
          <Pagination
            pageNumber={dashboard.appointments.pageNumber}
            pageSize={dashboard.appointments.pageSize}
            totalItems={totalCount}
            onPageChange={(p) => setPageNumber(p)}
            onPageSizeChange={(s) => {
              setPageSize(s);
              setPageNumber(1);
            }}
          />
        )}
        {/* ── Cancel Modal ── */}
        {cancelAppointment && (
          <CancelAppointmentModal
            isOpen={cancelOpen}
            onClose={() => {
              setCancelOpen(false);
              setCancelAppointment(null);
            }}
            onSuccess={() => {
              queryClient.invalidateQueries({
                queryKey: ["doctor-appointments-dashboard"],
              });
              setCancelOpen(false);
              setCancelAppointment(null);
            }}
            appointment={cancelAppointment}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default AllAppointments;
