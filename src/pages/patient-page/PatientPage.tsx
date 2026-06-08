import CardComp from "@/components/card-comp/CardComp";
import { Link } from "react-router";
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import {
  Activity,
  Calendar,
  ChevronRight,
  Clock,
  FileText,
  Pill,
  Stethoscope,
  TrendingUp,
  User,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchPatientDashboard,
  patientDashboardState,
  type DashboardState,
} from "@/store/slices/patient-slice/patient-dashboard-slice/patientDashboardSlice";
import type { AppDispatch } from "@/store/store";
import { useEffect, useState } from "react";
import Error from "@/components/error/Error";
import Loading from "@/components/loading/Loading";
import StatCard from "@/components/statical-card/StaticalCard";
import { NotFound } from "@/components/notfound/NotFound";
import { FaStar } from "react-icons/fa";
import { CiClock2 } from "react-icons/ci";
import { formatTime, parseDate } from "@/lib/utils";

type StatusKey =
  | "upcoming"
  | "completed"
  | "confirmed"
  | "cancelled"
  | "noshow";

const STATUS_CONFIG: Record<StatusKey, { pill: string; dot: string }> = {
  upcoming: {
    pill: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/50",
    dot: "bg-blue-500",
  },
  completed: {
    pill: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50",
    dot: "bg-emerald-500",
  },
  confirmed: {
    pill: "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/50",
    dot: "bg-green-500",
  },
  cancelled: {
    pill: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800/50",
    dot: "bg-red-400",
  },
  noshow: {
    pill: "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800/50",
    dot: "bg-yellow-400",
  },
};

const getStatusCfg = (status: string) =>
  STATUS_CONFIG[status.toLowerCase() as StatusKey] ?? STATUS_CONFIG.upcoming;

function PatientPage() {
  const dispatch: AppDispatch = useDispatch();
  const { data, loading, error }: DashboardState = useSelector(
    patientDashboardState,
  ) as DashboardState;

  useEffect(() => {
    dispatch(fetchPatientDashboard());
  }, [dispatch]);

  if (loading) {
    return <Loading />;
  }
  if (error) {
    return <Error message={error} />;
  }

  return (
    <DashboardLayout pageTitle={"Patient dashboard"}>
      <>
        <div>
          <h1 className="text-3xl text-(--color-text)">Welcome Back, John</h1>
          <p className=" text-(--color-text-light)">
            Here's your health dashboard overview
          </p>
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            Icon={Calendar}
            TrendIcon={TrendingUp}
            label="Upcoming"
            value={data.stats.upcomingAppointments}
            colorClass="text-green-500 bg-green-200"
          />

          <StatCard
            Icon={Pill}
            TrendIcon={TrendingUp}
            label="Prescriptions"
            value={data.stats.prescriptions}
            colorClass="text-green-500 bg-green-200"
          />
          <StatCard
            Icon={FileText}
            TrendIcon={TrendingUp}
            label="Records"
            value={data.stats.medicalRecords}
            colorClass="text-purple-500 bg-purple-200"
          />

          <StatCard
            Icon={Activity}
            TrendIcon={TrendingUp}
            label="Lab Results"
            value={data.stats.labResults}
            colorClass="text-orange-500 bg-orange-200"
          />
        </div>
        <div className="flex gap-8 max-lg:flex-col">
          <div className="flex flex-col gap-6 flex-1 lg:flex-5 ">
            <CardComp>
              <div className="flex items-center justify-between gap-4 w-full">
                <h2 className="text-xl">Upcoming Appointments</h2>
                <Link
                  to={"/doctors-list"}
                  className="text-(--color-primary) hover:text-(--color-primary-light) transition duration-200"
                >
                  Book New
                </Link>
              </div>
              <div className=" flex flex-col gap-3 w-full">
                {data.upcomingAppointments.length <= 0 ? (
                  <NotFound subMessage={"there is not upcoming appointment"} />
                ) : (
                  data.upcomingAppointments.map((appointment) => {
                    const cfg = getStatusCfg(appointment.status);
                    return (
                      <Link
                        key={appointment.id}
                        to={`/appointments/${appointment.id}`}
                        className="flex items-center justify-between gap-4 p-4 bg-(--color-bg-link)  hover:bg-(--color-bg-link-hover) rounded-md transition duration-150"
                      >
                        {/* Avatar + info */}
                        <div className="flex items-start gap-3 min-w-0">
                          {/* Avatar with status dot */}
                          <div className="relative shrink-0">
                            <div className="w-15 h-15 rounded-full overflow-hidden">
                              <DoctorAvatar
                                src={String(appointment.doctorImage)}
                                alt={appointment.doctorName}
                              />
                            </div>
                            <span
                              className={`absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full border-2 border-(--color-surface) ${cfg.dot}`}
                            />
                          </div>

                          {/* Text */}
                          <div className="min-w-0 space-y-1.5">
                            <div>
                              <h3 className="text-sm font-semibold text-(--color-text) truncate">
                                {appointment.doctorName}
                              </h3>
                              <p className="text-xs text-(--color-text-light) flex items-center gap-1 mt-0.5">
                                <Stethoscope className="w-3 h-3 shrink-0" />
                                {appointment.specialization}
                              </p>
                            </div>

                            {/* Meta pills */}
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="inline-flex items-center gap-1 text-[11px] text-(--color-text-light) bg-(--color-bg) border border-(--color-border) rounded-md px-2 py-0.5">
                                <Calendar className="w-3 h-3 shrink-0" />
                                {parseDate(appointment.date).fullLabel}
                              </span>
                              <span className="inline-flex items-center gap-1 text-[11px] text-(--color-text-light) bg-(--color-bg) border border-(--color-border) rounded-md px-2 py-0.5">
                                <Clock className="w-3 h-3 shrink-0" />
                                {formatTime(appointment.startTime)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Status badge + chevron */}
                        {appointment.status && (
                          <div className="flex items-center gap-1.5 shrink-0 self-center">
                            <span
                              className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-lg border ${cfg.pill}`}
                            >
                              <CiClock2 className="w-3 h-3" />
                              <span className="capitalize">
                                {appointment.status}
                              </span>
                            </span>
                            <ChevronRight className="w-3.5 h-3.5 text-(--color-border) opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
                          </div>
                        )}
                      </Link>
                    );
                  })
                )}
              </div>
            </CardComp>
            <CardComp>
              <div className="flex items-center justify-between gap-4 w-full">
                <h2 className="text-xl">Available Doctors</h2>
                <Link
                  to={"/doctors-list"}
                  className="text-(--color-primary) hover:text-(--color-primary-light) transition duration-200"
                >
                  View All
                </Link>
              </div>
              <div className=" flex flex-col gap-3 w-full">
                {data.availableDoctors.length <= 0 ? (
                  <NotFound subMessage={"There is no Available Doctors"} />
                ) : (
                  data.availableDoctors.slice(0, 3).map((doctor) => (
                    <Link
                      key={doctor.id}
                      to={`/doctors-list/${doctor.id}`}
                      className="flex items-center justify-between gap-4 p-4 bg-(--color-bg-link)  hover:bg-(--color-bg-link-hover) rounded-md transition duration-150"
                    >
                      <div className="flex items-center gap-4 w-full">
                        <div className="flex items-center justify-center bg-(--color-bg-blue) text-(--color-text-blue) w-15 h-15 rounded-full max-sm:hidden overflow-hidden">
                          <DoctorAvatar
                            src={String(doctor.imageUrl)}
                            alt={doctor.name}
                          />
                        </div>
                        <div>
                          <h2 className="text-sm font-semibold text-(--color-text) truncate">
                            {doctor.name?.trim().length > 0
                              ? `Dr. ${doctor.name}`
                              : "Unknown"}
                          </h2>

                          {doctor.specialization && (
                            <p className="text-xs text-(--color-text-light) flex items-center gap-1">
                              <Stethoscope className="w-3 h-3 shrink-0" />
                              {doctor.specialization}
                            </p>
                          )}

                          <div className="flex items-center gap-4 mt-1 text-sm">
                            <span className="inline-flex items-center gap-1 text-xs text-(--color-text-light)">
                              <FaStar className="text-amber-400 w-3 h-3" />
                              <span>{doctor.rating ?? 0}</span>
                            </span>
                            <span className="bg-(--color-text-light) w-1 h-1 rounded-full"></span>
                            <span className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-md bg-(--color-bg-blue) text-(--color-primary) border border-primary/20">
                              {doctor.experienceYears} yrs
                            </span>
                          </div>
                        </div>
                      </div>
                      {doctor.status && (
                        <div className="text-green-500 bg-green-500/20 px-3 pb-1 rounded-2xl text-sm flex items-center">
                          {doctor.status}
                        </div>
                      )}
                    </Link>
                  ))
                )}
              </div>
            </CardComp>
          </div>

          <div className="flex flex-1 max-md:flex-wrap lg:flex-2 lg:flex-col gap-4 ">
            {/* Quick Actions */}
            <div className="bg-(--color-surface) rounded-xl border p-6">
              <h3 className="text-lg text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <Link
                  to="/doctors-list"
                  className="block p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                >
                  <p className="text-sm text-blue-900 dark:text-blue-300 font-medium">
                    Find a Doctor
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                    Search and book
                  </p>
                </Link>

                <Link
                  to="/Prescriptions"
                  className="block p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                >
                  <p className="text-sm text-purple-900 dark:text-purple-300 font-medium">
                    My Prescriptions
                  </p>
                  <p className="text-xs text-purple-700 dark:text-purple-400 mt-1">
                    View medications
                  </p>
                </Link>
                <Link
                  to="/payment-methods"
                  className="block p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
                >
                  <p className="text-sm text-orange-900 dark:text-orange-300 font-medium">
                    Payment Methods
                  </p>
                  <p className="text-xs text-orange-700 dark:text-orange-400 mt-1">
                    Manage cards
                  </p>
                </Link>
              </div>
            </div>

            <CardComp>
              <h3 className="text-lg text-gray-900 dark:text-white mb-4">
                Recent Activity
              </h3>
              <div className="space-y-4">
                {data.recentActivities.length <= 0 ? (
                  <NotFound subMessage="No recent activity" />
                ) : (
                  data.recentActivities.map((activity, i) => (
                    <div key={i} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 shrink-0"></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 dark:text-white">
                          {activity.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          {activity.createdAt}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardComp>

            <div className="flex flex-col items-start gap-2 p-6  w-full bg-linear-to-br from-blue-600 to-blue-800 rounded-xl text-white shadow">
              <h3 className="text-lg">Health Tip of the Day</h3>
              <p className="text-sm text-blue-100">
                {data.healthTip?.trim()
                  ? data.healthTip
                  : "Stay hydrated! Aim to drink at least 8 glasses of water daily for optimal health."}
              </p>
            </div>
          </div>
        </div>
      </>
    </DashboardLayout>
  );
}

export default PatientPage;

const DoctorAvatar = ({ src, alt }: { src: string; alt: string }) => {
  const [imageError, setImageError] = useState(false);

  if (src?.trim() && !imageError) {
    return (
      <img
        src={src}
        className="object-cover w-full h-full"
        alt={alt || "doctor image"}
        onError={() => setImageError(true)}
      />
    );
  }

  return (
    <div className="w-full h-full rounded-full bg-(--color-bg-blue) border border-primary/20 flex items-center justify-center">
      <User className="w-8 h-8 text-(--color-primary)" />
    </div>
  );
};
