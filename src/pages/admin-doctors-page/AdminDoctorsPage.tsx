import { useEffect, useState } from "react";
import {
    Search,
    CheckCircle,
    XCircle,
    Eye,
    Award,
    Briefcase,
    Calendar,
    MapPin,
    Mail,
    Phone,
    AlertCircle,
    DollarSign,
    GraduationCap,
    Languages,
    Building2,
    User,
    Hash,
    X,
    ExternalLink,
    Loader2,
    MessageSquare,
} from "lucide-react";
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/store";
import Error from "@/components/error/Error";
import { ScaleLoader } from "react-spinners";
import { toast } from "react-toastify";

import {
    fetchVerifiedDoctors,
    verifiedDoctorsState,
    type VerifiedDoctor,
} from "@/store/slices/admin-slice/verified-doctors-slice/verifiedDoctorSlice";
import {
    fetchRejectedDoctors,
    rejectedDoctorsState,
    type RejectedDoctor,
} from "@/store/slices/admin-slice/rejected-doctors-slice/rejectedDoctorsSlic";
import {
    fetchApprovePendingDoctor,
    selectApprovePendingDoctor,
} from "@/store/slices/admin-slice/approve-pending-doctor-slice/approvePendingDoctorSlice";
import {
    fetchRejectPendingDoctor,
    selectRejectPendingDoctor,
} from "@/store/slices/admin-slice/reject-pending-doctor-slice/rejectPendingDoctorSlice";

// ─── Shared helpers ───────────────────────────────────────────────────────────

function getInitials(name: string) {
    return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

// ─── Info Row ─────────────────────────────────────────────────────────────────

function InfoRow({
    icon,
    label,
    value,
    href,
}: {
    icon: React.ReactNode;
    label: string;
    value: string | number | null | undefined;
    href?: string;
}) {
    if (!value && value !== 0) return null;
    return (
        <div
            className="flex flex-col gap-1 p-3.5 rounded-xl"
            style={{
                background: "var(--color-bg)",
                border: "1px solid var(--color-border)",
            }}
        >
            <p
                className="text-[10px] uppercase tracking-widest font-semibold"
                style={{ color: "var(--color-text-light)" }}
            >
                {label}
            </p>
            {href ? (
                <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium flex items-center gap-1 hover:underline"
                    style={{ color: "var(--color-primary)" }}
                >
                    {String(value)}
                    <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
            ) : (
                <p className="text-xs font-medium flex items-center gap-1.5" style={{ color: "var(--color-text)" }}>
                    <span style={{ color: "var(--color-text-light)" }}>{icon}</span>
                    {String(value)}
                </p>
            )}
        </div>
    );
}

// ─── Info Pill ────────────────────────────────────────────────────────────────

function InfoPill({ icon, label }: { icon: React.ReactNode; label: string }) {
    return (
        <span
            className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md"
            style={{
                background: "var(--color-bg)",
                border: "1px solid var(--color-border)",
                color: "var(--color-text-light)",
            }}
        >
            {icon}
            {label}
        </span>
    );
}

// ─── Modal shell ─────────────────────────────────────────────────────────────

function ModalShell({
    children,
    onBackdropClick,
    maxWidth = "max-w-lg",
}: {
    children: React.ReactNode;
    onBackdropClick?: () => void;
    maxWidth?: string;
}) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
            onClick={onBackdropClick}
        >
            <div
                className={`relative w-full ${maxWidth} flex flex-col rounded-2xl shadow-2xl max-h-[90vh]`}
                style={{
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
}

// ─── Modal Header ─────────────────────────────────────────────────────────────

function ModalHeader({
    icon,
    iconBg,
    title,
    subtitle,
    onClose,
}: {
    icon: React.ReactNode;
    iconBg: string;
    title: string;
    subtitle?: string;
    onClose: () => void;
}) {
    return (
        <div
            className="flex items-start justify-between px-6 pt-5 pb-4 shrink-0"
            style={{ borderBottom: "1px solid var(--color-border)" }}
        >
            <div className="flex items-center gap-3">
                <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl shrink-0"
                    style={{ background: iconBg }}
                >
                    {icon}
                </div>
                <div>
                    <h2 className="text-base font-semibold" style={{ color: "var(--color-text)" }}>
                        {title}
                    </h2>
                    {subtitle && (
                        <p className="text-xs mt-0.5" style={{ color: "var(--color-text-light)" }}>
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>
            <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors shrink-0"
                style={{
                    border: "1px solid var(--color-border)",
                    color: "var(--color-text-light)",
                    background: "transparent",
                }}
                aria-label="Close"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    );
}

// ─── Modal Footer ─────────────────────────────────────────────────────────────

function ModalFooter({
    doctorInitials,
    doctorName,
    doctorMeta,
    onCancel,
    cancelLabel,
    onConfirm,
    confirmLabel,
    confirmBg,
    confirmIcon,
    submitting,
    confirmDisabled,
}: {
    doctorInitials: string;
    doctorName: string;
    doctorMeta: string;
    onCancel: () => void;
    cancelLabel?: string;
    onConfirm: () => void;
    confirmLabel: string;
    confirmBg: string;
    confirmIcon: React.ReactNode;
    submitting: boolean;
    confirmDisabled?: boolean;
}) {
    return (
        <div
            className="flex items-center justify-between px-6 py-4 shrink-0 rounded-b-2xl"
            style={{
                borderTop: "1px solid var(--color-border)",
                background: "var(--color-bg)",
            }}
        >
            <div className="flex items-center gap-2.5">
                <div
                    className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold shrink-0"
                    style={{ background: "var(--color-bg-blue)", color: "var(--color-primary)" }}
                >
                    {doctorInitials}
                </div>
                <div>
                    <p className="text-xs font-medium" style={{ color: "var(--color-text)" }}>{doctorName}</p>
                    <p className="text-xs" style={{ color: "var(--color-text-light)" }}>{doctorMeta}</p>
                </div>
            </div>
            <div className="flex gap-2">
                <button
                    onClick={onCancel}
                    disabled={submitting}
                    className="rounded-lg px-4 py-2 text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                        border: "1px solid var(--color-border)",
                        color: "var(--color-text-light)",
                        background: "transparent",
                    }}
                >
                    {cancelLabel ?? "Cancel"}
                </button>
                <button
                    onClick={onConfirm}
                    disabled={!!confirmDisabled || submitting}
                    className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold text-white transition-colors min-w-[130px] justify-center disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ background: confirmBg }}
                >
                    {submitting ? (
                        <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Processing…</>
                    ) : (
                        <>{confirmIcon} {confirmLabel}</>
                    )}
                </button>
            </div>
        </div>
    );
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────

function DetailModal({
    doctor,
    onClose,
    onApprove,
    onReject,
    isVerified,
}: {
    doctor: VerifiedDoctor | RejectedDoctor;
    onClose: () => void;
    onApprove: () => void;
    onReject: () => void;
    isVerified: boolean;
}) {
    const accentGreen = "rgba(22,163,74,0.10)";
    const accentRed = "rgba(220,38,38,0.08)";

    return (
        <ModalShell onBackdropClick={onClose} maxWidth="max-w-3xl">
            {/* Header */}
            <div
                className="flex items-center justify-between px-6 py-5 shrink-0"
                style={{ borderBottom: "1px solid var(--color-border)" }}
            >
                <div className="flex items-center gap-3.5">
                    <div
                        className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center text-white font-bold text-lg shrink-0"
                        style={{
                            background: isVerified
                                ? "linear-gradient(135deg,#16a34a,#22c55e)"
                                : "linear-gradient(135deg,#dc2626,#f87171)",
                        }}
                    >
                        {doctor.fullProfileImageUrl ? (
                            <img
                                src={doctor.fullProfileImageUrl}
                                alt={doctor.fullName}
                                className="w-full h-full object-cover"
                                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                            />
                        ) : <div className="w-full h-full rounded-full bg-(--color-bg-blue) border border-primary/20 flex items-center justify-center">
                            <User className="w-8 h-8 text-(--color-primary)" />
                        </div>}
                    </div>
                    <div>
                        <h3 className="text-base font-semibold" style={{ color: "var(--color-text)" }}>
                            {doctor.fullName}
                        </h3>
                        <p className="text-xs mt-0.5 flex items-center gap-1.5 flex-wrap" style={{ color: "var(--color-text-light)" }}>
                            <span>{doctor.clinicName || "No Clinic"}</span>
                            {doctor.clinicLocation && <><span>·</span><span>{doctor.clinicLocation}</span></>}
                            <span>·</span>
                            <span
                                className="px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider"
                                style={{
                                    background: isVerified ? accentGreen : accentRed,
                                    color: isVerified ? "var(--color-success)" : "#dc2626",
                                }}
                            >
                                {isVerified ? "Verified" : "Rejected"}
                            </span>
                        </p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors shrink-0"
                    style={{ border: "1px solid var(--color-border)", color: "var(--color-text-light)" }}
                    aria-label="Close"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1 min-h-0">
                {/* Rejection reason */}
                {!isVerified && (doctor as RejectedDoctor).rejectionReason && (
                    <div
                        className="flex items-start gap-3 rounded-xl px-4 py-3"
                        style={{ background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.2)" }}
                    >
                        <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "#dc2626" }} />
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#dc2626" }}>
                                Rejection Reason
                            </p>
                            <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-light)" }}>
                                {(doctor as RejectedDoctor).rejectionReason}
                            </p>
                        </div>
                    </div>
                )}

                {/* Section helper */}
                {[
                    {
                        title: "Personal Information",
                        rows: [
                            { icon: <Mail className="w-3.5 h-3.5" />, label: "Email", value: doctor.email },
                            { icon: <Phone className="w-3.5 h-3.5" />, label: "Phone", value: doctor.phoneNumber },
                            { icon: <Phone className="w-3.5 h-3.5" />, label: "Clinic Phone", value: doctor.clinicPhoneNumber },
                            { icon: <User className="w-3.5 h-3.5" />, label: "Gender", value: doctor.gender },
                            { icon: <Calendar className="w-3.5 h-3.5" />, label: "Birth Date", value: doctor.birthDate },
                            { icon: <MapPin className="w-3.5 h-3.5" />, label: "Country", value: doctor.country },
                            { icon: <MapPin className="w-3.5 h-3.5" />, label: "City", value: doctor.city },
                            { icon: <MapPin className="w-3.5 h-3.5" />, label: "Street", value: doctor.street },
                        ],
                    },
                    {
                        title: "Professional Details",
                        rows: [
                            { icon: <Hash className="w-3.5 h-3.5" />, label: "License Number", value: doctor.medicalLicenseNumber },
                            { icon: <Briefcase className="w-3.5 h-3.5" />, label: "Experience", value: doctor.yearsOfExperience ? `${doctor.yearsOfExperience} years` : null },
                            { icon: <DollarSign className="w-3.5 h-3.5" />, label: "Consultation Fee", value: doctor.price ? `$${doctor.price}` : null },
                            { icon: <GraduationCap className="w-3.5 h-3.5" />, label: "Education", value: doctor.education },
                            { icon: <Languages className="w-3.5 h-3.5" />, label: "Languages", value: doctor.languages?.join(", ") },
                        ],
                    },

                    {
                        title: "Clinic Information",
                        rows: [
                            { icon: <Building2 className="w-3.5 h-3.5" />, label: "Clinic Name", value: doctor.clinicName },
                            { icon: <MapPin className="w-3.5 h-3.5" />, label: "Clinic Location", value: doctor.clinicLocation },
                        ],
                    },
                ].map((section) => (
                    <section key={section.title}>
                        <h4
                            className="text-xs font-semibold uppercase tracking-widest mb-3"
                            style={{ color: "var(--color-text-light)" }}
                        >
                            {section.title}
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {section.rows.map((r) => (
                                <InfoRow key={r.label} icon={r.icon} label={r.label} value={r.value} />
                            ))}
                        </div>
                    </section>
                ))}

                {/* About / Details */}
                {[
                    { title: "About", content: doctor.about },
                    { title: "Additional Details", content: doctor.details },
                ].map(({ title, content }) =>
                    content ? (
                        <section key={title}>
                            <h4 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--color-text-light)" }}>
                                {title}
                            </h4>
                            <div
                                className="p-4 rounded-xl text-sm leading-relaxed"
                                style={{
                                    background: "var(--color-bg)",
                                    border: "1px solid var(--color-border)",
                                    color: "var(--color-text)",
                                }}
                            >
                                {content}
                            </div>
                        </section>
                    ) : null
                )}

                {/* Certificate */}
                {doctor.fullCertificateUrl && (
                    <section>
                        <h4 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--color-text-light)" }}>
                            Certificate
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <InfoRow
                                icon={<GraduationCap className="w-3.5 h-3.5" />}
                                label="Medical Certificate"
                                value="View Certificate"
                                href={doctor.fullCertificateUrl}
                            />
                        </div>
                    </section>
                )}
            </div>

            {/* Footer */}
            <div
                className="px-6 py-4 shrink-0 flex justify-end gap-2.5 rounded-b-2xl"
                style={{ borderTop: "1px solid var(--color-border)", background: "var(--color-bg)" }}
            >
                <button
                    onClick={onClose}
                    className="rounded-lg px-4 py-2 text-xs transition-colors"
                    style={{ border: "1px solid var(--color-border)", color: "var(--color-text-light)", background: "transparent" }}
                >
                    Close
                </button>
                {isVerified ? (
                    <button
                        onClick={onReject}
                        className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold text-white transition-colors"
                        style={{ background: "#dc2626" }}
                    >
                        <XCircle className="w-3.5 h-3.5" /> Reject Doctor
                    </button>
                ) : (
                    <button
                        onClick={onApprove}
                        className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold text-white transition-colors"
                        style={{ background: "var(--color-success)" }}
                    >
                        <CheckCircle className="w-3.5 h-3.5" /> Approve Doctor
                    </button>
                )}
            </div>
        </ModalShell>
    );
}

// ─── Approve Modal ────────────────────────────────────────────────────────────

function ApproveDoctorModal({
    isOpen,
    onClose,
    onConfirm,
    doctor,
    submitting,
}: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (text: string) => void;
    doctor: VerifiedDoctor | RejectedDoctor;
    submitting: boolean;
}) {
    const [note, setNote] = useState("");
    if (!isOpen) return null;
    const initials = getInitials(doctor.fullName || "");

    return (
        <ModalShell onBackdropClick={onClose}>
            <ModalHeader
                icon={<CheckCircle className="h-5 w-5" style={{ color: "var(--color-success)" }} />}
                iconBg="rgba(22,163,74,0.10)"
                title="Verify & Approve Doctor"
                subtitle="Re-verify credentials and activate account"
                onClose={onClose}
            />

            <div className="flex flex-col gap-5 px-6 py-5 overflow-y-auto flex-1 min-h-0">
                {/* Banner */}
                <div
                    className="flex items-start gap-3 rounded-xl px-4 py-3"
                    style={{ background: "rgba(22,163,74,0.07)", border: "1px solid rgba(22,163,74,0.22)" }}
                >
                    <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "var(--color-success)" }} />
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "var(--color-success)" }}>
                            Confirm Approval
                        </p>
                        <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-light)" }}>
                            You are about to approve this doctor. Their profile will be activated immediately and they will be allowed to log in and set up schedules.
                        </p>
                    </div>
                </div>

                {/* Doctor card */}
                <div
                    className="flex items-start gap-3 rounded-xl px-4 py-3.5"
                    style={{ background: "var(--color-bg)", border: "1px solid var(--color-border)" }}
                >
                    <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0"
                        style={{ background: "linear-gradient(135deg,#16a34a,#22c55e)" }}
                    >
                        {initials}
                    </div>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: "var(--color-text-light)" }}>
                            Rejected Doctor to Verify
                        </p>
                        <h4 className="text-sm font-medium" style={{ color: "var(--color-text)" }}>{doctor.fullName}</h4>
                        <p className="text-xs mt-0.5" style={{ color: "var(--color-text-light)" }}>
                            {doctor.email}{doctor.clinicName && ` · ${doctor.clinicName}`}
                        </p>
                    </div>
                </div>

                {/* Note */}
                <div>
                    <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--color-text-light)" }}>
                        <MessageSquare className="h-3.5 w-3.5" />
                        Approval Note
                        <span className="normal-case tracking-normal font-normal ml-1" style={{ color: "var(--color-border)" }}>(optional)</span>
                    </p>
                    <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        rows={3}
                        placeholder="e.g. Welcome! Your credentials have been successfully verified..."
                        className="w-full resize-none rounded-xl text-sm outline-none transition-colors px-3.5 py-2.5"
                        style={{ background: "var(--color-bg)", border: "1px solid var(--color-border)", color: "var(--color-text)" }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-success)")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-border)")}
                    />
                </div>
            </div>

            <ModalFooter
                doctorInitials={initials}
                doctorName={doctor.fullName}
                doctorMeta={`Experience: ${doctor.yearsOfExperience ?? "—"} years`}
                onCancel={onClose}
                onConfirm={() => onConfirm(note)}
                confirmLabel="Verify Doctor"
                confirmBg="var(--color-success)"
                confirmIcon={<CheckCircle className="h-3.5 w-3.5" />}
                submitting={submitting}
            />
        </ModalShell>
    );
}

// ─── Reject Modal ─────────────────────────────────────────────────────────────

function RejectDoctorModal({
    isOpen,
    onClose,
    onConfirm,
    doctor,
    submitting,
}: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (text: string) => void;
    doctor: VerifiedDoctor | RejectedDoctor;
    submitting: boolean;
}) {
    const [reason, setReason] = useState("");
    if (!isOpen) return null;
    const initials = getInitials(doctor.fullName || "");

    return (
        <ModalShell onBackdropClick={onClose}>
            <ModalHeader
                icon={<XCircle className="h-5 w-5" style={{ color: "#dc2626" }} />}
                iconBg="rgba(220,38,38,0.08)"
                title="Reject & Decline Doctor"
                subtitle="Decline verified status and suspend access"
                onClose={onClose}
            />

            <div className="flex flex-col gap-5 px-6 py-5 overflow-y-auto flex-1 min-h-0">
                {/* Banner */}
                <div
                    className="flex items-start gap-3 rounded-xl px-4 py-3"
                    style={{ background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.2)" }}
                >
                    <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "#dc2626" }} />
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#dc2626" }}>
                            Are you sure?
                        </p>
                        <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-light)" }}>
                            You are about to reject this doctor. This action will deactivate their profile and restrict login. A rejection reason is required.
                        </p>
                    </div>
                </div>

                {/* Doctor card */}
                <div
                    className="flex items-start gap-3 rounded-xl px-4 py-3.5"
                    style={{ background: "var(--color-bg)", border: "1px solid var(--color-border)" }}
                >
                    <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0"
                        style={{ background: "linear-gradient(135deg,#dc2626,#f87171)" }}
                    >
                        {initials}
                    </div>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: "var(--color-text-light)" }}>
                            Verified Doctor to Reject
                        </p>
                        <h4 className="text-sm font-medium" style={{ color: "var(--color-text)" }}>{doctor.fullName}</h4>
                        <p className="text-xs mt-0.5" style={{ color: "var(--color-text-light)" }}>
                            {doctor.email}{doctor.clinicName && ` · ${doctor.clinicName}`}
                        </p>
                    </div>
                </div>

                {/* Reason */}
                <div>
                    <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--color-text-light)" }}>
                        <MessageSquare className="h-3.5 w-3.5" />
                        Rejection Reason
                        <span style={{ color: "#dc2626" }} className="ml-0.5">*</span>
                    </p>
                    <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        rows={3}
                        placeholder="e.g. Practitioner license has expired or clinic validation check failed..."
                        className="w-full resize-none rounded-xl text-sm outline-none transition-colors px-3.5 py-2.5"
                        style={{ background: "var(--color-bg)", border: "1px solid var(--color-border)", color: "var(--color-text)" }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "#dc2626")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-border)")}
                        required
                    />
                </div>
            </div>

            <ModalFooter
                doctorInitials={initials}
                doctorName={doctor.fullName}
                doctorMeta={`Experience: ${doctor.yearsOfExperience ?? "—"} years`}
                onCancel={onClose}
                onConfirm={() => onConfirm(reason)}
                confirmLabel="Reject Doctor"
                confirmBg="#dc2626"
                confirmIcon={<XCircle className="h-3.5 w-3.5" />}
                submitting={submitting}
                confirmDisabled={!reason.trim()}
            />
        </ModalShell>
    );
}

// ─── Doctor Card ──────────────────────────────────────────────────────────────

function DoctorCard({
    doctor,
    isVerified,
    onView,
    onAction,
}: {
    doctor: VerifiedDoctor | RejectedDoctor;
    isVerified: boolean;
    onView: () => void;
    onAction: () => void;
}) {

    return (
        <div
            className="rounded-2xl p-5 space-y-4 transition-all duration-200"
            style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            }}
        >
            {/* Header row */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3.5 min-w-0">
                    <div
                        className="w-11 h-11 rounded-full overflow-hidden flex items-center justify-center text-white font-bold text-sm shrink-0"
                        style={{
                            background: isVerified
                                ? "linear-gradient(135deg,#16a34a,#22c55e)"
                                : "linear-gradient(135deg,#dc2626,#f87171)",
                        }}
                    >
                        {doctor.fullProfileImageUrl ? (
                            <img
                                src={doctor.fullProfileImageUrl}
                                alt={doctor.fullName}
                                className="w-full h-full object-cover"
                                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                            />
                        ) :
                            <div className="w-full h-full rounded-full bg-(--color-bg-blue) border border-primary/20 flex items-center justify-center">
                                <User className="w-8 h-8 text-(--color-primary)" />
                            </div>}
                    </div>
                    <div className="min-w-0">
                        <h3 className="text-sm font-semibold truncate" style={{ color: "var(--color-text)" }}>
                            {doctor.fullName}
                        </h3>
                        <p className="text-xs mt-0.5 truncate" style={{ color: "var(--color-text-light)" }}>
                            {doctor.email}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                    <button
                        onClick={onView}
                        className="p-2 rounded-lg transition-colors"
                        style={{
                            border: "1px solid var(--color-border)",
                            color: "var(--color-text-light)",
                            background: "transparent",
                        }}
                        title="View Details"
                    >
                        <Eye className="w-4 h-4" />
                    </button>
                    <button
                        onClick={onAction}
                        className="p-2 rounded-lg transition-colors"
                        style={{
                            background: isVerified ? "rgba(220,38,38,0.08)" : "rgba(22,163,74,0.08)",
                            border: `1px solid ${isVerified ? "rgba(220,38,38,0.18)" : "rgba(22,163,74,0.18)"}`,
                            color: isVerified ? "#dc2626" : "var(--color-success)",
                        }}
                        title={isVerified ? "Reject Doctor" : "Verify & Approve Doctor"}
                    >
                        {isVerified
                            ? <XCircle className="w-4 h-4" />
                            : <CheckCircle className="w-4 h-4" />
                        }
                    </button>
                </div>
            </div>

            {/* Rejection reason snippet */}
            {!isVerified && (doctor as RejectedDoctor).rejectionReason && (
                <div
                    className="text-[11px] rounded-lg px-3 py-2 flex items-start gap-1.5 truncate"
                    style={{
                        background: "rgba(220,38,38,0.06)",
                        border: "1px solid rgba(220,38,38,0.15)",
                        color: "#dc2626",
                    }}
                >
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span className="truncate">Reason: {(doctor as RejectedDoctor).rejectionReason}</span>
                </div>
            )}

            {/* Divider */}
            <div style={{ height: 1, background: "var(--color-border)" }} />

            {/* Pills */}
            <div className="flex flex-wrap gap-1.5">
                {doctor.clinicName && <InfoPill icon={<Building2 className="w-3 h-3" />} label={doctor.clinicName} />}
                {doctor.yearsOfExperience > 0 && <InfoPill icon={<Award className="w-3 h-3" />} label={`${doctor.yearsOfExperience} yrs exp`} />}
                {doctor.price > 0 && <InfoPill icon={<DollarSign className="w-3 h-3" />} label={`$${doctor.price}`} />}
                {doctor.clinicLocation && <InfoPill icon={<MapPin className="w-3 h-3" />} label={doctor.clinicLocation} />}
            </div>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminDoctorsPage() {
    const dispatch = useDispatch<AppDispatch>();

    const verifiedData = useSelector(verifiedDoctorsState);
    const rejectedData = useSelector(rejectedDoctorsState);
    const approveActionState = useSelector(selectApprovePendingDoctor);
    const rejectActionState = useSelector(selectRejectPendingDoctor);

    const [activeTab, setActiveTab] = useState<"verified" | "rejected">("verified");
    const [searchTerm, setSearchTerm] = useState("");

    const [selectedDoctor, setSelectedDoctor] = useState<VerifiedDoctor | RejectedDoctor | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [targetDoctor, setTargetDoctor] = useState<VerifiedDoctor | RejectedDoctor | null>(null);
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [actionDoctorId, setActionDoctorId] = useState<number | null>(null);

    useEffect(() => {
        dispatch(fetchVerifiedDoctors());
        dispatch(fetchRejectedDoctors());
    }, [dispatch]);

    const refetchBoth = () => {
        dispatch(fetchVerifiedDoctors());
        dispatch(fetchRejectedDoctors());
    };

    const handleConfirmApprove = async (doctorId: number, note: string) => {
        setActionDoctorId(doctorId);
        try {
            await dispatch(fetchApprovePendingDoctor({ id: String(doctorId), note })).unwrap();
            toast.success("Doctor verified successfully");
            setShowApproveModal(false);
            setShowDetailModal(false);
            setSelectedDoctor(null);
            setTargetDoctor(null);
            refetchBoth();
        } catch (err: any) {
            toast.error(err || "Failed to verify doctor");
        } finally {
            setActionDoctorId(null);
        }
    };

    const handleConfirmReject = async (doctorId: number, reason: string) => {
        setActionDoctorId(doctorId);
        try {
            await dispatch(fetchRejectPendingDoctor({ id: String(doctorId), reason })).unwrap();
            toast.success("Doctor rejected successfully");
            setShowRejectModal(false);
            setShowDetailModal(false);
            setSelectedDoctor(null);
            setTargetDoctor(null);
            refetchBoth();
        } catch (err: any) {
            toast.error(err || "Failed to reject doctor");
        } finally {
            setActionDoctorId(null);
        }
    };

    const filter = (list: (VerifiedDoctor | RejectedDoctor)[]) =>
        list.filter((d) =>
            [d.fullName, d.email, d.clinicLocation].some((v) =>
                v?.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );

    const filteredVerified = filter(verifiedData.data);
    const filteredRejected = filter(rejectedData.data);
    const loading = verifiedData.loading || rejectedData.loading;
    const error = verifiedData.error || rejectedData.error;
    const activeList = activeTab === "verified" ? filteredVerified : filteredRejected;

    return (
        <DashboardLayout pageTitle="Doctors Management">
            <div className="space-y-6">

                {/* ── Stats header ── */}
                <div
                    className="rounded-2xl p-6"
                    style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
                >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-xl font-bold mb-0.5" style={{ color: "var(--color-text)" }}>
                                Doctors Management
                            </h1>
                            <p className="text-xs" style={{ color: "var(--color-text-light)" }}>
                                View and manage verified and rejected medical practitioners
                            </p>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="text-center">
                                <p className="text-2xl font-bold" style={{ color: "var(--color-success)" }}>
                                    {verifiedData.data.length}
                                </p>
                                <p className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: "var(--color-text-light)" }}>
                                    Verified
                                </p>
                            </div>
                            <div className="w-px h-8" style={{ background: "var(--color-border)" }} />
                            <div className="text-center">
                                <p className="text-2xl font-bold" style={{ color: "#dc2626" }}>
                                    {rejectedData.data.length}
                                </p>
                                <p className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: "var(--color-text-light)" }}>
                                    Rejected
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Tabs + Search ── */}
                <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
                    {/* Tabs */}
                    <div
                        className="flex rounded-xl p-1 w-full sm:w-auto shrink-0"
                        style={{ background: "var(--color-bg)", border: "1px solid var(--color-border)" }}
                    >
                        {(["verified", "rejected"] as const).map((tab) => {
                            const isActive = activeTab === tab;
                            const activeColor = tab === "verified" ? "var(--color-success)" : "#dc2626";
                            return (
                                <button
                                    key={tab}
                                    onClick={() => { setActiveTab(tab); setSearchTerm(""); }}
                                    className="flex-1 sm:flex-initial px-6 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all duration-200 cursor-pointer"
                                    style={{
                                        background: isActive ? "var(--color-surface)" : "transparent",
                                        color: isActive ? activeColor : "var(--color-text-light)",
                                        boxShadow: isActive ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                                    }}
                                >
                                    {tab === "verified" ? "Verified Doctors" : "Rejected Doctors"}
                                </button>
                            );
                        })}
                    </div>

                    {/* Search */}
                    <div className="relative w-full sm:max-w-xs">
                        <Search
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                            style={{ color: "var(--color-text-light)" }}
                        />
                        <input
                            type="text"
                            placeholder="Search by name, email, location..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs outline-none transition-colors"
                            style={{
                                background: "var(--color-surface)",
                                color: "var(--color-text)",
                                border: "1px solid var(--color-border)",
                            }}
                            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-primary)")}
                            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-border)")}
                        />
                    </div>
                </div>

                {/* ── List ── */}
                {loading && verifiedData.data.length === 0 && rejectedData.data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <ScaleLoader color="var(--color-primary)" radius={4} width={3.5} height={20} margin={2} />
                        <p className="text-xs mt-3 animate-pulse" style={{ color: "var(--color-text-light)" }}>
                            Fetching doctors database…
                        </p>
                    </div>
                ) : error ? (
                    <Error message={error} onRetry={refetchBoth} />
                ) : activeList.length === 0 ? (
                    <div
                        className="rounded-2xl p-16 text-center"
                        style={{ border: "1px dashed var(--color-border)" }}
                    >
                        <User className="w-10 h-10 mx-auto mb-3.5" style={{ color: "var(--color-border)" }} />
                        <h4 className="text-sm font-semibold mb-1" style={{ color: "var(--color-text)" }}>
                            No {activeTab === "verified" ? "Verified" : "Rejected"} Doctors
                        </h4>
                        <p className="text-xs" style={{ color: "var(--color-text-light)" }}>
                            {searchTerm ? "No results match your search term" : "No accounts found in database"}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {activeList.map((doctor) => (
                            <DoctorCard
                                key={doctor.doctorId}
                                doctor={doctor}
                                isVerified={activeTab === "verified"}
                                onView={() => { setSelectedDoctor(doctor); setShowDetailModal(true); }}
                                onAction={() => {
                                    setTargetDoctor(doctor);
                                    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                                    activeTab === "verified" ? setShowRejectModal(true) : setShowApproveModal(true);
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* ── Modals ── */}
            {showDetailModal && selectedDoctor && (
                <DetailModal
                    doctor={selectedDoctor}
                    isVerified={activeTab === "verified"}
                    onClose={() => { setShowDetailModal(false); setSelectedDoctor(null); }}
                    onApprove={() => { setTargetDoctor(selectedDoctor); setShowApproveModal(true); }}
                    onReject={() => { setTargetDoctor(selectedDoctor); setShowRejectModal(true); }}
                />
            )}

            {showApproveModal && targetDoctor && (
                <ApproveDoctorModal
                    isOpen={showApproveModal}
                    onClose={() => { setShowApproveModal(false); setTargetDoctor(null); }}
                    onConfirm={(note) => handleConfirmApprove(targetDoctor.doctorId, note)}
                    doctor={targetDoctor}
                    submitting={actionDoctorId === targetDoctor.doctorId && approveActionState.loading}
                />
            )}

            {showRejectModal && targetDoctor && (
                <RejectDoctorModal
                    isOpen={showRejectModal}
                    onClose={() => { setShowRejectModal(false); setTargetDoctor(null); }}
                    onConfirm={(reason) => handleConfirmReject(targetDoctor.doctorId, reason)}
                    doctor={targetDoctor}
                    submitting={actionDoctorId === targetDoctor.doctorId && rejectActionState.loading}
                />
            )}
        </DashboardLayout>
    );
}
