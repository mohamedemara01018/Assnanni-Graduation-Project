import CardComp from "@/components/card-comp/CardComp";
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import StatCard from "@/components/statical-card/StaticalCard";
import {
  Calendars,
  CheckCircle,
  FileText,
  ShieldCheck,
  Users,
  XCircle,
  Clock,
  User,
  CreditCard,
  DollarSign,
} from "lucide-react";
import { Link } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import type { AppDispatch, RootState } from "@/store/store";
import { ScaleLoader } from "react-spinners";
import Error from "@/components/error/Error";
import {
  fetchPendingDoctor,
  selectPendingDoctor,
  type PendingDoctorState,
} from "@/store/slices/admin-slice/pending-doctor-slice/pendingDoctorSlice";
import { toast } from "react-toastify";
import { getTimeAgo } from "@/lib/utils";
import { fetchAdminDashboard, selectAdminDashboardState, type AdminDashboardState } from "@/store/slices/admin-slice/admin-dashboard-slice/adminDashboardSlice";
import { NotFound } from "@/components/notfound/NotFound";

function AdminPage() {
  const dispatch: AppDispatch = useDispatch();
  const currentUserName = useSelector((state: RootState) => state.auth.fullName)?.split(' ')[0];

  const { data: adminDashboardData, loading: adminDashboardLoading, error: adminDashboardError } = useSelector(selectAdminDashboardState) as AdminDashboardState
  const { pendingDoctors, loading: pendingDoctorLoaing, error: pendingDoctorError } = useSelector(selectPendingDoctor) as PendingDoctorState;

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          dispatch(fetchAdminDashboard()),
          dispatch(fetchPendingDoctor()),
        ]);
      } catch (error: any) {
        const errorMessage =
          (typeof error === "string" ? error : error.message) ||
          "Failed to fetch summary & pending doctors";
        toast.error(errorMessage);
      }
    };
    fetchData();
  }, [dispatch]);


  return (
    <DashboardLayout pageTitle="Admin page">
      <>
        {/* ── Header ── */}
        <div>
          <div className="flex gap-3 items-end">
            <h1 className="text-3xl text-(--color-text)">Welcome Back, {currentUserName}</h1>
            <div className="flex gap-1 bg-red-100 px-3 py-0.5 text-red-400 rounded-full">
              <ShieldCheck className="w-5" />
              <span className="text-sm">Admin</span>
            </div>
          </div>
          <p className="text-(--color-text-light)">Here's your health dashboard overview</p>
        </div>

        {/* ── Stat cards ── */}
        {adminDashboardLoading ? (
          <div className="w-full flex items-center justify-center">
            <ScaleLoader color="#6d61ff" />
          </div>
        ) : adminDashboardError ? (
          <Error message={adminDashboardError} />
        ) : (
          <div className="grid max-sm:grid-cols-1 grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {/* Total Patients */}
            <StatCard
              Icon={Users}
              label="Total Patients"
              value={String(adminDashboardData?.totalPatients ?? 0)}
              colorClass="text-blue-500 bg-blue-200"
            />

            {/* Total Doctors */}
            <StatCard
              Icon={ShieldCheck}
              label="Total Doctors"
              value={String(adminDashboardData?.totalDoctors ?? 0)}
              colorClass="text-green-500 bg-green-200"
            />

            {/* Total Appointments */}
            <StatCard
              Icon={Calendars}
              label="Total Appointments"
              value={String(adminDashboardData?.totalAppointments ?? 0)}
              colorClass="text-purple-500 bg-purple-200"
            />

            {/* Total Revenue */}
            <StatCard
              Icon={DollarSign}
              label="Total Revenue"
              value={`$${Number(adminDashboardData?.totalRevenue ?? 0)}`}
              colorClass="text-orange-500 bg-orange-200"
            />

            {/* Today's Revenue */}
            <StatCard
              Icon={CreditCard}
              label="Revenue Today"
              value={`$${Number(adminDashboardData?.todayRevenue ?? 0)}`}
              colorClass="text-red-500 bg-red-200"
            />

            {/* Month's Revenue */}
            <StatCard
              Icon={FileText}
              label="Monthly Revenue"
              value={`$${Number(adminDashboardData?.monthRevenue ?? 0)}`}
              colorClass="text-indigo-500 bg-indigo-200"
            />
          </div>
        )}

        {/* ── Body ── */}
        <div className="flex max-md:flex-col gap-6">

          {/* ── Pending doctors ── */}
          <CardComp classProbs="flex-2">
            <div className="flex justify-between w-full">
              <h2 className="text-lg">Pending Doctor Verifications</h2>
              <Link
                to="/verify-doctors"
                className="text-(--color-text-blue) hover:scale-110 transition duration-150"
              >
                View all
              </Link>
            </div>
            <hr className="w-full" />

            {pendingDoctorLoaing ? (
              <div className="w-full flex items-center justify-center py-6">
                <ScaleLoader color="#6d61ff" />
              </div>
            ) : pendingDoctorError ? (
              <Error message={pendingDoctorError} />
            ) : !pendingDoctors?.length ? (
              <NotFound message="No verifications found" />
            ) : (
              <div className="w-full space-y-3">
                {pendingDoctors.map((doctor) => (
                  <div
                    key={doctor.doctorId}
                    className="rounded-2xl border p-4 space-y-3"
                    style={{
                      backgroundColor: "var(--color-surface)",
                      borderColor: "var(--color-border)",
                    }}
                  >
                    {/* Top row: avatar + name + actions */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        {/* Avatar */}
                        <div
                          className="w-12 h-12 rounded-full overflow-hidden shrink-0 flex items-center justify-center text-white font-bold text-lg"
                          style={{ backgroundColor: "var(--color-primary)" }}
                        >
                          {doctor.fullProfileImageUrl ? (
                            <img
                              src={doctor.fullProfileImageUrl}
                              alt={doctor.fullName}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="w-full h-full rounded-full bg-(--color-bg-blue) border border-primary/20 flex items-center justify-center">
                              <User className="w-8 h-8 text-(--color-primary)" />
                            </div>
                          )}
                        </div>

                        {/* Name + meta */}
                        <div>
                          <h3 className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>
                            {doctor.fullName}
                          </h3>
                          <p className="text-xs mt-0.5" style={{ color: "var(--color-text-light)" }}>
                            {doctor.clinicName} · {doctor.clinicLocation}
                          </p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <Clock className="w-3 h-3" style={{ color: "var(--color-text-light)" }} />
                            <span className="text-xs" style={{ color: "var(--color-text-light)" }}>
                              Submitted {getTimeAgo(doctor.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        <Link
                          to="/verify-doctors"
                          className="p-2 rounded-lg transition-colors"
                          style={{ backgroundColor: "rgba(22,163,74,0.1)", color: "#16a34a" }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(22,163,74,0.2)")}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(22,163,74,0.1)")}
                          title="Approve"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Link>
                        <Link
                          to="/verify-doctors"
                          className="p-2 rounded-lg transition-colors"
                          style={{ backgroundColor: "rgba(220,38,38,0.08)", color: "#dc2626" }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(220,38,38,0.15)")}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(220,38,38,0.08)")}
                          title="Reject"
                        >
                          <XCircle className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>

                    {/* Certificate link */}
                    {doctor.fullCertificateUrl && (
                      <a
                        href={doctor.fullCertificateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-medium transition-opacity hover:opacity-70"
                        style={{ color: "var(--color-primary)" }}
                      >
                        <FileText className="w-3.5 h-3.5" />
                        View Certificate
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardComp>

          {/* ── Right sidebar ── */}
          <div className="space-y-4 flex-1">
            <CardComp>
              <h2>Quick Actions</h2>
              <div className="w-full space-y-4">
                <QuickActionComps
                  title="Verify Doctors"
                  subTitle={`${pendingDoctors?.length ?? 0} pending`}
                  classProbs="blue"
                  path="/verify-doctors"
                />
                <QuickActionComps
                  title="System Analytics"
                  subTitle="Analytics & insights"
                  classProbs="green"
                  path="/analytics"
                />
                <QuickActionComps
                  title="AI Models"
                  subTitle="Manage models"
                  classProbs="orange"
                  path="/ai-models"
                />
              </div>
            </CardComp>
          </div>
        </div>
      </>
    </DashboardLayout>
  );
}

export default AdminPage;



// ─── Quick Action ─────────────────────────────────────────────────────────────

interface QuickActionCompsProbs {
  title: string;
  subTitle: string;
  classProbs: "blue" | "green" | "red" | "orange";
  path?: string;
}

const colorVariants = {
  blue: { bg: "bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30", title: "text-blue-900 dark:text-blue-300", sub: "text-blue-700 dark:text-blue-400" },
  green: { bg: "bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30", title: "text-green-900 dark:text-green-300", sub: "text-green-700 dark:text-green-400" },
  red: { bg: "bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30", title: "text-red-900 dark:text-red-300", sub: "text-red-700 dark:text-red-400" },
  orange: { bg: "bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30", title: "text-orange-900 dark:text-orange-300", sub: "text-orange-700 dark:text-orange-400" },
};

const QuickActionComps = ({ title, subTitle, classProbs, path = "/" }: QuickActionCompsProbs) => {
  const colors = colorVariants[classProbs];
  return (
    <Link to={path} className={`block p-3 rounded-lg transition-colors ${colors.bg}`}>
      <p className={`text-sm font-medium ${colors.title}`}>{title}</p>
      <p className={`text-xs mt-1 ${colors.sub}`}>{subTitle}</p>
    </Link>
  );
};
