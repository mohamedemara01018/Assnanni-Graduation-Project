import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import SearchInput from "@/components/search-input/SearchInput";
import { useEffect, useState } from "react";
import { CiClock2 } from "react-icons/ci";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router";
import LazyImage from "@/components/ui/LazyImage";
import {
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  Stethoscope,
  CalendarX,
  RefreshCw,
  Eye,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/store";
import {
  allAppointmentsState,
  fetchAllAppointments,
  type AppointmentStatus,
} from "@/store/slices/patient-slice/all-appointments-slice/allAppointmentsSlice";
import MiniLoading from "@/components/mini-loading/MiniLoading";
import Error from "@/components/error/Error";
import { RescheduleAppointmentModal } from "@/components/reschedule-appointment-modal/RescheduleAppointmentModal";
import { CancelAppointmentModal } from "@/components/cancel-appointment-modal/CancelAppointmentModal";

// ── Types ─────────────────────────────────────────────────────────────────────

interface SelectedAppointment {
  id: string;
  date: string;
  time: string;
  doctorName: string;
  doctorSpecialty?: string;
  doctorImage?: string;
}

// ── Status config ─────────────────────────────────────────────────────────────

type StatusKey = "upcoming" | "confirmed" | "cancelled";

const STATUS_CONFIG: Record<StatusKey, { pill: string; dot: string }> = {
  upcoming: {
    pill: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/50",
    dot: "bg-blue-500",
  },
  confirmed: {
    pill: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50",
    dot: "bg-emerald-500",
  },
  cancelled: {
    pill: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800/50",
    dot: "bg-red-400",
  },
};

const getStatusCfg = (status: AppointmentStatus) =>
  STATUS_CONFIG[(status.toLowerCase() as StatusKey)] ?? STATUS_CONFIG.upcoming;

// ── Filter tabs ───────────────────────────────────────────────────────────────

const TABS = [
  { label: "All", value: "" },
  { label: "Upcoming", value: "upcoming" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Cancelled", value: "cancelled" },
];

// ── Component ─────────────────────────────────────────────────────────────────

function AppointmentsPage() {
  const [search, setSearch] = useState("");
  const [appointmentStatus, setAppointmentStatus] = useState("");
  const [showReschedule, setShowReschedule] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<SelectedAppointment | null>(null);

  const dispatch: AppDispatch = useDispatch();
  const { data, loading, error } = useSelector(allAppointmentsState);
  const appointments = data?.appointments ?? [];

  useEffect(() => {
    dispatch(
      fetchAllAppointments({
        search,
        AppointmentStatus: appointmentStatus,
        BookingType: "",
      })
    );
  }, [dispatch, search, appointmentStatus]);

  // ── Handlers ────────────────────────────────────────────────────────────────

  const openReschedule = (appt: any) => {
    setSelectedAppointment({
      id: String(appt.id),
      date: appt.date ?? "",
      time: appt.time ?? "",
      doctorName: appt.doctorName ?? "",
      doctorSpecialty: appt.specialty ?? "",
      doctorImage: appt.doctorImage ?? "",
    });
    setShowReschedule(true);
  };

  const openCancel = (appt: any) => {
    setSelectedAppointment({
      id: String(appt.id),
      date: appt.date ?? "",
      time: appt.time ?? "",
      doctorName: appt.doctorName ?? "",
      doctorSpecialty: appt.specialty ?? "",
      doctorImage: appt.doctorImage ?? "",
    });
    setShowCancel(true);
  };

  const closeReschedule = () => {
    setShowReschedule(false);
    setSelectedAppointment(null);
  };
  const closeCancel = () => {
    setShowCancel(false);
    setSelectedAppointment(null);
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <DashboardLayout pageTitle="Patient">
      <div className="space-y-5">

        {/* ── Header ── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-(--color-text)">
              Appointments
            </h1>
            <p className="text-sm text-(--color-text-light) mt-0.5">
              Manage and view all your scheduled visits
            </p>
          </div>
          <Link
            to="/doctors-list"
            className="flex items-center gap-2 bg-(--color-primary) hover:bg-(--color-primary-light) active:scale-95 transition-all duration-150 px-4 py-2.5 rounded-xl text-white text-sm font-medium"
          >
            <FaPlus className="w-3 h-3" />
            Book Appointment
          </Link>
        </div>

        {/* ── Search + Tabs ── */}
        <div
          className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-4 space-y-3"
          style={{ boxShadow: "var(--shadow)" }}
        >
          <SearchInput style="w-full" setSearch={setSearch} />
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            {TABS.map((tab) => {
              const active = appointmentStatus === tab.value;
              return (
                <button
                  key={tab.value}
                  onClick={() => setAppointmentStatus(tab.value)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150 cursor-pointer ${active
                      ? "bg-(--color-primary) text-white border-(--color-primary)"
                      : "bg-(--color-bg) text-(--color-text-light) border-(--color-border) hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Cards list ── */}
        {loading ? (
          <div className="p-10 flex justify-center">
            <MiniLoading />
          </div>
        ) : error ? (
          <div className="p-8">
            <Error message={error} />
          </div>
        ) : appointments.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-16 px-8 text-center rounded-2xl border border-(--color-border) bg-(--color-surface)"
            style={{ boxShadow: "var(--shadow)" }}
          >
            <div className="w-14 h-14 rounded-2xl bg-(--color-bg) border border-(--color-border) flex items-center justify-center mb-4">
              <CalendarX className="w-6 h-6 text-(--color-text-light)" />
            </div>
            <p className="text-sm font-medium text-(--color-text) mb-1">
              No appointments found
            </p>
            <p className="text-xs text-(--color-text-light)">
              Try adjusting your filters or book a new visit
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {appointments.map((appointment, index) => {
                const cfg = getStatusCfg(appointment.status);
                const isCancelled =
                  appointment.status.toLowerCase() === "cancelled";

                return (
                  <div
                    key={appointment.id ?? index}
                    className="group flex items-start justify-between gap-4 px-5 py-4 rounded-2xl border border-(--color-border) bg-(--color-surface) hover:border-(--color-primary) transition-all duration-150"
                    style={{ boxShadow: "var(--shadow)" }}
                  >
                    {/* Avatar + info */}
                    <div className="flex items-start gap-4 min-w-0">
                      {/* Avatar with status dot */}
                      <div className="relative shrink-0">
                        <LazyImage
                          src={
                            appointment.doctorImage?.trim()
                              ? appointment.doctorImage
                              : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjtHioeP3798yMa6QIJsA3piLZlDdOMuA17Q&s"
                          }
                          alt={appointment.doctorName}
                          className="w-12 h-12 rounded-xl object-cover ring-2 ring-(--color-border)"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjtHioeP3798yMa6QIJsA3piLZlDdOMuA17Q&s";
                          }}
                        />
                        <span
                          className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-(--color-surface) ${cfg.dot}`}
                        />
                      </div>

                      {/* Text */}
                      <div className="min-w-0 space-y-2">
                        <div>
                          {appointment.doctorName && (
                            <h3 className="text-sm font-semibold text-(--color-text) truncate">
                              {appointment.doctorName}
                            </h3>
                          )}
                          {appointment.specialty && (
                            <p className="text-xs text-(--color-text-light) flex items-center gap-1 mt-0.5">
                              <Stethoscope className="w-3 h-3 shrink-0" />
                              {appointment.specialty}
                            </p>
                          )}
                        </div>

                        {/* Meta pills */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {appointment.date && (
                            <span className="inline-flex items-center gap-1 text-[11px] text-(--color-text-light) bg-(--color-bg) border border-(--color-border) rounded-md px-2 py-0.5">
                              <Calendar className="w-3 h-3 shrink-0" />
                              {appointment.date}
                            </span>
                          )}
                          {appointment.time && (
                            <span className="inline-flex items-center gap-1 text-[11px] text-(--color-text-light) bg-(--color-bg) border border-(--color-border) rounded-md px-2 py-0.5">
                              <Clock className="w-3 h-3 shrink-0" />
                              {appointment.time}
                            </span>
                          )}
                          {appointment.type && (
                            <span className="inline-flex items-center gap-1 text-[11px] text-(--color-text-light) bg-(--color-bg) border border-(--color-border) rounded-md px-2 py-0.5">
                              <MapPin className="w-3 h-3 shrink-0" />
                              {appointment.type}
                            </span>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 pt-0.5">
                          <Link
                            to={`/appointments/${appointment.id}`}
                            className="inline-flex items-center gap-1 text-xs font-medium text-(--color-primary) hover:text-(--color-primary-light) transition-colors"
                          >
                            <Eye className="w-3 h-3" />
                            View
                          </Link>

                          {!isCancelled && (
                            <>
                              <span className="w-px h-3 bg-(--color-border)" />
                              <button
                                onClick={() => openReschedule(appointment)}
                                className="inline-flex items-center gap-1 text-xs font-medium text-(--color-text-light) hover:text-(--color-text) transition-colors cursor-pointer"
                              >
                                <RefreshCw className="w-3 h-3" />
                                Reschedule
                              </button>
                              <span className="w-px h-3 bg-(--color-border)" />
                              <button
                                onClick={() => openCancel(appointment)}
                                className="inline-flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors cursor-pointer"
                              >
                                <CalendarX className="w-3 h-3" />
                                Cancel
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Status badge + chevron */}
                    <div className="flex items-center gap-1.5 shrink-0 self-center">
                      <span
                        className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-lg border ${cfg.pill}`}
                      >
                        <CiClock2 className="w-3 h-3" />
                        <span className="capitalize">{appointment.status}</span>
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-(--color-border) opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Count footer */}
            <p className="text-xs text-(--color-text-light) px-1">
              Showing{" "}
              <span className="font-semibold text-(--color-text)">
                {appointments.length}
              </span>{" "}
              appointment{appointments.length !== 1 ? "s" : ""}
            </p>
          </>
        )}
      </div>

      {/* ── Modals ── */}
      {selectedAppointment && (
        <>
          <RescheduleAppointmentModal
            isOpen={showReschedule}
            onClose={closeReschedule}
            appointment={selectedAppointment}
            id={selectedAppointment.id}
          />
          <CancelAppointmentModal
            isOpen={showCancel}
            onClose={closeCancel}
            appointment={selectedAppointment}
          />
        </>
      )}
    </DashboardLayout>
  );
}

export default AppointmentsPage;
