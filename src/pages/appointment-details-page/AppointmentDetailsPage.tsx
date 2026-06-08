import { useParams, useNavigate, Link } from "react-router";
import {
    ArrowLeft,
    Calendar,
    Clock,
    MapPin,
    User,
    FileText,
    Phone,
    Building2,
    Star,
    Briefcase,
    AlertCircle,
    Loader2,
    Mail,
    Globe,
} from "lucide-react";
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/store";
import {
    appointmentDetailsState,
    fetchAppointmentDetails,
    type AppointmentDetailsState,
} from "@/store/slices/patient-slice/appintment-details-slice/appointmentDetailsSlice";
import { useEffect, useCallback, useState } from "react";
import { RescheduleAppointmentModal } from "@/components/reschedule-appointment-modal/RescheduleAppointmentModal";
import { CancelAppointmentModal } from "@/components/cancel-appointment-modal/CancelAppointmentModal";
import { formatTime, parseDate } from "@/lib/utils";

// ─── Status badge styles using CSS variables ─────────────────────────────────

const statusConfig: Record<
    string,
    { bg: string; color: string; label: string }
> = {
    Confirmed: {
        bg: "rgba(22, 163, 74, 0.1)",
        color: "var(--color-success)",
        label: "Confirmed",
    },
    Pending: {
        bg: "rgba(234, 179, 8, 0.1)",
        color: "#ca8a04",
        label: "Pending",
    },
    Cancelled: {
        bg: "rgba(220, 38, 38, 0.1)",
        color: "#dc2626",
        label: "Cancelled",
    },
    Completed: {
        bg: "var(--color-bg-blue)",
        color: "var(--color-text-blue)",
        label: "Completed",
    },
};

// ─── Info Row ─────────────────────────────────────────────────────────────────

function InfoRow({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: React.ReactNode;
}) {
    return (
        <div className="flex gap-3">
            <span className="mt-0.5 shrink-0" style={{ color: "var(--color-text-light)" }}>
                {icon}
            </span>
            <div>
                <p className="text-xs mb-0.5" style={{ color: "var(--color-text-light)" }}>
                    {label}
                </p>
                <p className="font-medium text-sm" style={{ color: "var(--color-text)" }}>
                    {value || "—"}
                </p>
            </div>
        </div>
    );
}

// ─── Section Card ─────────────────────────────────────────────────────────────

function SectionCard({
    title,
    icon,
    children,
}: {
    title?: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <div
            className="rounded-xl border p-6"
            style={{
                backgroundColor: "var(--color-surface)",
                borderColor: "var(--color-border)",
            }}
        >
            {title && (
                <h2
                    className="flex items-center gap-2 text-lg font-semibold mb-5"
                    style={{ color: "var(--color-text)" }}
                >
                    {icon && (
                        <span style={{ color: "var(--color-primary)" }}>{icon}</span>
                    )}
                    {title}
                </h2>
            )}
            {children}
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AppointmentDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch: AppDispatch = useDispatch();

    const [showRescheduleModal, setShowRescheduleModal] = useState(false);
    const [isCancelOpen, setIsCancelOpen] = useState(false);

    const { data, loading, error } = useSelector(
        appointmentDetailsState
    ) as AppointmentDetailsState;

    // ── Central fetch — call this any time we need fresh data ──
    const refetch = useCallback(() => {
        if (id) dispatch(fetchAppointmentDetails({ id }));
    }, [dispatch, id]);

    useEffect(() => {
        refetch();
    }, [refetch]);

    // ── Role (replace with your real auth selector when ready) ──
    const role = useSelector(
        (state: { auth: { role: string } }) => state.auth.role
    );
    const isPatient = role === "patient";
    const isDoctor = role === "doctor" || role === "student_doctor";

    // ── Loading ──
    if (loading) {
        return (
            <DashboardLayout pageTitle="Appointment Details">
                <div className="flex justify-center items-center min-h-[60vh]">
                    <div className="flex flex-col items-center gap-3">
                        <Loader2
                            className="w-8 h-8 animate-spin"
                            style={{ color: "var(--color-primary)" }}
                        />
                        <p style={{ color: "var(--color-text-light)" }}>
                            Loading appointment details…
                        </p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    // ── Error ──
    if (error) {
        return (
            <DashboardLayout pageTitle="Appointment Details">
                <div className="flex justify-center items-center min-h-[60vh]">
                    <div className="flex flex-col items-center gap-4 text-center">
                        <AlertCircle className="w-8 h-8" style={{ color: "#dc2626" }} />
                        <p style={{ color: "var(--color-text)" }}>{error}</p>
                        <button
                            onClick={() => navigate(-1)}
                            className="text-sm hover:underline"
                            style={{ color: "var(--color-primary)" }}
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    // ── Guard: no data yet ──
    if (!data) return null;

    const { status, date, time, location, type, doctor, clinic, notes, instructions } = data;

    const badge = statusConfig[status] ?? {
        bg: "var(--color-bg)",
        color: "var(--color-text-light)",
        label: status,
    };

    const canAct = status === "Pending" || status === "Confirmed";

    return (
        <DashboardLayout pageTitle="Appointment Details">
            <div>
                {/* Back */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 mb-6 text-sm transition-colors hover:opacity-80"
                    style={{ color: "var(--color-text-light)" }}
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Appointments
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* ── Main ── */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Header */}
                        <SectionCard>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h1
                                        className="text-2xl font-semibold"
                                        style={{ color: "var(--color-text)" }}
                                    >
                                        Appointment Details
                                    </h1>
                                    <p className="text-sm mt-0.5" style={{ color: "var(--color-text-light)" }}>
                                        ID #{data.id}
                                    </p>
                                </div>

                                <span
                                    className="px-3 py-1 rounded-lg text-sm font-medium"
                                    style={{ backgroundColor: badge.bg, color: badge.color }}
                                >
                                    {badge.label}
                                </span>
                            </div>

                            <div
                                className="grid md:grid-cols-2 gap-5 pt-4 border-t"
                                style={{ borderColor: "var(--color-border)" }}
                            >
                                <InfoRow
                                    icon={<Calendar className="w-4 h-4" />}
                                    label="Date"
                                    value={parseDate(date).fullLabel}
                                />
                                <InfoRow
                                    icon={<Clock className="w-4 h-4" />}
                                    label="Time"
                                    value={formatTime(time)}
                                />
                                <InfoRow
                                    icon={<MapPin className="w-4 h-4" />}
                                    label="Location"
                                    value={location}
                                />
                                <InfoRow
                                    icon={<FileText className="w-4 h-4" />}
                                    label="Type"
                                    value={type}
                                />
                            </div>
                        </SectionCard>

                        {/* Doctor Information */}
                        {isPatient && (
                            <SectionCard
                                title="Doctor Information"
                                icon={<User className="w-5 h-5" />}
                            >
                                <div className="flex gap-4">
                                    {doctor.imageUrl ? (
                                        <img
                                            src={doctor.imageUrl}
                                            alt={doctor.name}
                                            className="w-20 h-20 rounded-full object-cover border"
                                            style={{ borderColor: "var(--color-border)" }}
                                            onError={(e) => {
                                                (e.currentTarget as HTMLImageElement).style.display = "none";
                                            }}
                                        />
                                    ) : (
                                        <div className="w-20 h-20 rounded-full bg-(--color-bg-blue) border border-primary/20 flex items-center justify-center">
                                            <User className="w-8 h-8 text-(--color-primary)" />
                                        </div>
                                    )}

                                    <div>
                                        <Link
                                            to={`/doctors-list/${doctor.id}`}
                                            className="font-semibold text-lg text:(--color-text) hover:underline hover:text-(--color-text-blue)">
                                            {doctor.name}
                                        </Link>
                                        <p className="text-sm" style={{ color: "var(--color-text-light)" }}>
                                            {doctor.specialization}
                                        </p>

                                        <div className="flex gap-4 mt-2">
                                            <div className="flex items-center gap-1">
                                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                <span className="text-sm" style={{ color: "var(--color-text)" }}>
                                                    {doctor.rating}
                                                </span>
                                            </div>
                                            <div
                                                className="flex items-center gap-1 text-sm"
                                                style={{ color: "var(--color-text-light)" }}
                                            >
                                                <Briefcase className="w-4 h-4" />
                                                <span>{doctor.experienceYears} yrs</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </SectionCard>
                        )}

                        {/* Clinic Information */}
                        {isPatient && (
                            <SectionCard
                                title="Clinic Information"
                                icon={<Building2 className="w-5 h-5" />}
                            >
                                <div>
                                    <h3 className="font-semibold" style={{ color: "var(--color-text)" }}>
                                        {clinic.clinicName || "—"}
                                    </h3>
                                    <p className="text-sm mt-0.5" style={{ color: "var(--color-text-light)" }}>
                                        {clinic.clinicLocation || "—"}
                                    </p>
                                </div>

                                <div
                                    className="space-y-3 border-t pt-4 mt-4"
                                    style={{ borderColor: "var(--color-border)" }}
                                >
                                    {clinic.clinicPhoneNumber && (
                                        <div className="flex items-center gap-2 text-sm" style={{ color: "var(--color-text)" }}>
                                            <Phone className="w-4 h-4 shrink-0" style={{ color: "var(--color-text-light)" }} />
                                            <a href={`tel:${clinic.clinicPhoneNumber}`} className="hover:underline">
                                                {clinic.clinicPhoneNumber}
                                            </a>
                                        </div>
                                    )}

                                    {clinic.clinicEmail && (
                                        <div className="flex items-center gap-2 text-sm" style={{ color: "var(--color-text)" }}>
                                            <Mail className="w-4 h-4 shrink-0" style={{ color: "var(--color-text-light)" }} />
                                            <a href={`mailto:${clinic.clinicEmail}`} className="hover:underline">
                                                {clinic.clinicEmail}
                                            </a>
                                        </div>
                                    )}

                                    {clinic.clinicWebsite && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <Globe className="w-4 h-4 shrink-0" style={{ color: "var(--color-text-light)" }} />
                                            <a
                                                href={clinic.clinicWebsite}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="hover:underline"
                                                style={{ color: "var(--color-primary)" }}
                                            >
                                                {clinic.clinicWebsite}
                                            </a>
                                        </div>
                                    )}

                                    {clinic.clinicHours && (
                                        <div className="flex items-center gap-2 text-sm" style={{ color: "var(--color-text)" }}>
                                            <Clock className="w-4 h-4 shrink-0" style={{ color: "var(--color-text-light)" }} />
                                            <span>{clinic.clinicHours}</span>
                                        </div>
                                    )}
                                </div>
                            </SectionCard>
                        )}

                        {/* Notes */}
                        {notes && (
                            <div
                                className="rounded-xl border p-4"
                                style={{
                                    backgroundColor: "var(--color-bg-blue)",
                                    borderColor: "var(--color-primary-lighter)",
                                }}
                            >
                                <h3
                                    className="font-medium flex items-center gap-2 mb-2 text-sm"
                                    style={{ color: "var(--color-text-blue)" }}
                                >
                                    <FileText className="w-4 h-4" />
                                    Notes
                                </h3>
                                <p className="text-sm" style={{ color: "var(--color-text)" }}>
                                    {notes}
                                </p>
                            </div>
                        )}

                        {/* Instructions */}
                        {instructions && (
                            <div
                                className="rounded-xl border p-4"
                                style={{
                                    backgroundColor: "rgba(234, 179, 8, 0.08)",
                                    borderColor: "rgba(234, 179, 8, 0.3)",
                                }}
                            >
                                <h3
                                    className="font-medium flex items-center gap-2 mb-2 text-sm"
                                    style={{ color: "#ca8a04" }}
                                >
                                    <AlertCircle className="w-4 h-4" />
                                    Instructions
                                </h3>
                                <p className="text-sm" style={{ color: "var(--color-text)" }}>
                                    {instructions}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* ── Actions sidebar ── */}
                    {canAct && (
                        <div>
                            <div
                                className="rounded-xl border p-6 sticky top-6"
                                style={{
                                    backgroundColor: "var(--color-surface)",
                                    borderColor: "var(--color-border)",
                                }}
                            >
                                <h3
                                    className="font-semibold mb-4"
                                    style={{ color: "var(--color-text)" }}
                                >
                                    Actions
                                </h3>

                                <div className="space-y-3">
                                    <button
                                        onClick={() => setShowRescheduleModal(true)}
                                        className="w-full py-2.5 rounded-lg text-sm font-medium text-white transition-colors hover:opacity-90"
                                        style={{ backgroundColor: "var(--color-primary)" }}
                                    >
                                        Reschedule Appointment
                                    </button>

                                    <button
                                        onClick={() => setIsCancelOpen(true)}
                                        className="w-full py-2.5 rounded-lg border text-sm font-medium transition-colors hover:opacity-80"
                                        style={{
                                            borderColor: "var(--color-border)",
                                            color: "var(--color-text)",
                                        }}
                                    >
                                        Cancel Appointment
                                    </button>

                                    {isDoctor && (
                                        <button
                                            className="w-full py-2.5 rounded-lg border text-sm font-medium transition-colors hover:opacity-80"
                                            style={{
                                                borderColor: "var(--color-primary)",
                                                color: "var(--color-primary)",
                                            }}
                                        >
                                            View Medical History
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Modals ── */}
            <RescheduleAppointmentModal
                isOpen={showRescheduleModal}
                onClose={() => {
                    setShowRescheduleModal(false);
                }}

                appointment={{
                    id: String(data.id),
                    doctorId: String(data.doctor.id),
                    date: data.date,
                    time: data.time,
                    doctorName: data.doctor.name,
                    doctorImage: String(data.doctor.imageUrl),
                }}
                id={String(data.doctor.id)}
                onSuccess={() => refetch()}
            />

            <CancelAppointmentModal
                isOpen={isCancelOpen}
                onClose={() => {
                    setIsCancelOpen(false);
                }}
                // Re-fetch after successful cancel so status updates without a page refresh
                appointment={{
                    id: String(data.id),
                    date: parseDate(data.date).fullLabel,
                    time: formatTime(data.time),
                    doctorName: data.doctor.name,
                    doctorSpecialty: data.doctor.specialization,
                }}
                onSuccess={() => refetch()}
            />
        </DashboardLayout>
    );
}
