import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/store/store";
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import { Pill, Calendar, Download, User } from "lucide-react";
import { Link } from "react-router";

import {
    fetchPresciptions,
    prescriptiondState,
    type Prescription,
    type Medication,
} from "@/store/slices/patient-slice/prescriptions-slice/prescriptionsSlice";
import { parseDate } from "@/lib/utils";
import Loading from "@/components/loading/Loading";
import Error from "@/components/error/Error";
import { NotFound } from "@/components/notfound/NotFound";

// ─── Medication Row ───────────────────────────────────────────────────────────

function MedicationRow({ med }: { med: Medication }) {
    return (
        <div
            className="flex items-start justify-between gap-4 px-4 py-3 rounded-xl"
            style={{
                backgroundColor: "var(--color-bg)",
                border: "1px solid var(--color-border)",
            }}
        >
            <div className="space-y-0.5">
                <p className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>
                    {med.name}
                </p>
                <p className="text-xs" style={{ color: "var(--color-text-light)" }}>
                    {med.dosage} · {med.frequency}
                </p>
            </div>

            <span
                className="shrink-0 text-xs font-medium px-2.5 py-1 rounded-lg"
                style={{
                    backgroundColor: "var(--color-bg-blue)",
                    color: "var(--color-text-blue)",
                }}
            >
                {med.durationInDays}d
            </span>
        </div>
    );
}

// ─── Canvas download helper ───────────────────────────────────────────────────

function downloadPrescriptionAsImage(prescription: Prescription, fullLabel: string) {
    const isDark = document.documentElement.classList.contains("dark");

    // Colors
    const bg = isDark ? "#1e2939" : "#ffffff";
    const surface = isDark ? "#101828" : "#f9fafb";
    const border = isDark ? "#374151" : "#eaebef";
    const text = isDark ? "#f9fafb" : "#111827";
    const textLight = isDark ? "#9ca3af" : "#4b5563";
    const primary = isDark ? "#155dfc" : "#2563eb";
    const pillBg = isDark ? "rgba(55,81,147,0.4)" : "#eff6ff";
    const pillText = isDark ? "#93c5fd" : "#155dfc";
    const noteBg = isDark ? "rgba(55,81,147,0.25)" : "#eff6ff";
    const accent = isDark ? "#4ade80" : "#16a34a";

    const W = 800;
    const PADDING = 40;
    const MED_H = 64;
    const meds = prescription.medications;

    // Calculate total height
    const medsHeight = meds.length * (MED_H + 10) + 10;
    const notesHeight = prescription.notes?.trim() ? 72 : 0;
    const H = 260 + medsHeight + notesHeight + 40;

    const canvas = document.createElement("canvas");
    canvas.width = W * 2;   // retina
    canvas.height = H * 2;
    const ctx = canvas.getContext("2d")!;
    ctx.scale(2, 2);

    // ── Background ──
    ctx.fillStyle = bg;
    roundRect(ctx, 0, 0, W, H, 20);
    ctx.fill();

    // ── Top accent bar ──
    ctx.fillStyle = primary;
    roundRect(ctx, 0, 0, W, 6, { tl: 20, tr: 20, bl: 0, br: 0 });
    ctx.fill();

    // ── Header: doctor avatar placeholder ──
    const avatarX = PADDING;
    const avatarY = 30;
    ctx.fillStyle = "rgba(22,163,74,0.12)";
    roundRect(ctx, avatarX, avatarY, 52, 52, 12);
    ctx.fill();
    ctx.strokeStyle = "rgba(22,163,74,0.25)";
    ctx.lineWidth = 1.5;
    roundRect(ctx, avatarX, avatarY, 52, 52, 12);
    ctx.stroke();
    // pill icon (simplified circle + line)
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.arc(avatarX + 26, avatarY + 26, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = bg;
    ctx.fillRect(avatarX + 20, avatarY + 23, 12, 6);

    // ── Diagnosis ──
    ctx.fillStyle = text;
    ctx.font = "bold 18px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
    ctx.fillText(prescription.diagnosis, avatarX + 64, avatarY + 20);

    // ── Doctor name ──
    ctx.fillStyle = primary;
    ctx.font = "500 13px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
    ctx.fillText(`Dr. ${prescription.doctorName}`, avatarX + 64, avatarY + 38);

    // ── Date ──
    ctx.fillStyle = textLight;
    ctx.font = "12px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
    ctx.fillText(fullLabel, avatarX + 64, avatarY + 56);

    // ── Divider ──
    const divY = 100;
    ctx.strokeStyle = border;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(PADDING, divY);
    ctx.lineTo(W - PADDING, divY);
    ctx.stroke();

    // ── "Medications" label ──
    ctx.fillStyle = text;
    ctx.font = "bold 14px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
    ctx.fillText("Medications", PADDING, 126);
    ctx.fillStyle = textLight;
    ctx.font = "12px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
    ctx.fillText(`(${meds.length})`, PADDING + ctx.measureText("Medications").width + 38, 126);

    // ── Medication rows ──
    let medY = 140;
    for (const med of meds) {
        // Row background
        ctx.fillStyle = surface;
        roundRect(ctx, PADDING, medY, W - PADDING * 2, MED_H, 12);
        ctx.fill();
        ctx.strokeStyle = border;
        ctx.lineWidth = 1;
        roundRect(ctx, PADDING, medY, W - PADDING * 2, MED_H, 12);
        ctx.stroke();

        // Med name
        ctx.fillStyle = text;
        ctx.font = "bold 13px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
        ctx.fillText(med.name, PADDING + 16, medY + 24);

        // Dosage · frequency
        ctx.fillStyle = textLight;
        ctx.font = "11px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
        ctx.fillText(`${med.dosage} · ${med.frequency}`, PADDING + 16, medY + 43);

        // Duration pill
        const durText = `${med.durationInDays}d`;
        const durW = ctx.measureText(durText).width + 20;
        const durX = W - PADDING - durW - 12;
        ctx.fillStyle = pillBg;
        roundRect(ctx, durX, medY + 18, durW, 24, 8);
        ctx.fill();
        ctx.fillStyle = pillText;
        ctx.font = "bold 11px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
        ctx.fillText(durText, durX + 10, medY + 34);

        medY += MED_H + 10;
    }

    // ── Notes ──
    if (prescription.notes?.trim()) {
        const noteY = medY + 10;
        ctx.fillStyle = noteBg;
        roundRect(ctx, PADDING, noteY, W - PADDING * 2, 56, 12);
        ctx.fill();
        ctx.strokeStyle = pillBg;
        ctx.lineWidth = 1;
        roundRect(ctx, PADDING, noteY, W - PADDING * 2, 56, 12);
        ctx.stroke();

        ctx.fillStyle = primary;
        ctx.font = "bold 12px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
        ctx.fillText("Note:", PADDING + 16, noteY + 22);

        ctx.fillStyle = textLight;
        ctx.font = "12px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
        const noteText = prescription.notes.length > 90
            ? prescription.notes.slice(0, 90) + "…"
            : prescription.notes;
        ctx.fillText(noteText, PADDING + 52, noteY + 22);
    }

    // ── Download ──
    const link = document.createElement("a");
    link.download = `prescription-${prescription.id}-${prescription.diagnosis.replace(/\s+/g, "-")}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
}

// rounded rect helper
function roundRect(
    ctx: CanvasRenderingContext2D,
    x: number, y: number, w: number, h: number,
    r: number | { tl: number; tr: number; bl: number; br: number }
) {
    const radius = typeof r === "number"
        ? { tl: r, tr: r, bl: r, br: r }
        : r;
    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + w - radius.tr, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius.tr);
    ctx.lineTo(x + w, y + h - radius.br);
    ctx.quadraticCurveTo(x + w, y + h, x + w - radius.br, y + h);
    ctx.lineTo(x + radius.bl, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();
}

// ─── Prescription Card ────────────────────────────────────────────────────────

function PrescriptionCard({ prescription }: { prescription: Prescription }) {
    const { fullLabel } = parseDate(prescription.date);

    return (
        <div
            className="rounded-2xl border p-6 space-y-5"
            style={{
                backgroundColor: "var(--color-surface)",
                borderColor: "var(--color-border)",
                boxShadow: "var(--shadow)",
            }}
        >
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                    {/* Doctor avatar */}
                    {prescription.doctorImage?.trim() ? (
                        <img
                            src={prescription.doctorImage}
                            alt={prescription.doctorName}
                            className="w-12 h-12 rounded-xl object-cover shrink-0"
                            style={{ border: "1.5px solid var(--color-border)" }}
                            onError={(e) => {
                                (e.currentTarget as HTMLImageElement).style.display = "none";
                            }}
                        />
                    ) : (
                        <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                            style={{
                                backgroundColor: "rgba(22,163,74,0.1)",
                                border: "1.5px solid rgba(22,163,74,0.2)",
                            }}
                        >
                            <Pill className="w-5 h-5" style={{ color: "var(--color-success)" }} />
                        </div>
                    )}

                    <div className="space-y-1">
                        <h3
                            className="text-base font-semibold"
                            style={{ color: "var(--color-text)" }}
                        >
                            {prescription.diagnosis}
                        </h3>

                        {/* Doctor name — clickable link */}
                        <Link
                            to={`/doctors-list/${prescription.doctorId}`}
                            className="text-sm flex items-center gap-1.5 w-fit hover:underline underline-offset-2 transition-colors"
                            style={{ color: "var(--color-primary)" }}
                        >
                            <User className="w-3.5 h-3.5 shrink-0" />
                            {prescription.doctorName}
                        </Link>

                        <p
                            className="text-xs flex items-center gap-1.5"
                            style={{ color: "var(--color-text-light)" }}
                        >
                            <Calendar className="w-3.5 h-3.5 shrink-0" />
                            {fullLabel}
                        </p>
                    </div>
                </div>

                {/* Download button */}
                <button
                    data-download-btn
                    onClick={() => downloadPrescriptionAsImage(prescription, fullLabel)}
                    className="shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium text-white transition-opacity hover:opacity-85"
                    style={{ backgroundColor: "var(--color-primary)" }}
                >
                    <Download className="w-4 h-4" />
                    <span className="max-sm:hidden">Download</span>
                </button>
            </div>

            {/* Divider */}
            <div style={{ height: 1, backgroundColor: "var(--color-border)" }} />

            {/* Medications */}
            <div>
                <h4
                    className="text-sm font-semibold mb-3"
                    style={{ color: "var(--color-text)" }}
                >
                    Medications
                    <span
                        className="ml-2 text-xs font-normal"
                        style={{ color: "var(--color-text-light)" }}
                    >
                        ({prescription.medications.length})
                    </span>
                </h4>

                <div className="space-y-2">
                    {prescription.medications.map((med, i) => (
                        <MedicationRow key={i} med={med} />
                    ))}
                </div>
            </div>

            {/* Notes */}
            {prescription.notes?.trim() && (
                <div
                    className="px-4 py-3 rounded-xl text-sm leading-relaxed"
                    style={{
                        backgroundColor: "var(--color-bg-blue)",
                        border: "1px solid var(--color-primary-lighter)",
                        color: "var(--color-text-light)",
                    }}
                >
                    <span
                        className="font-semibold mr-1"
                        style={{ color: "var(--color-text-blue)" }}
                    >
                        Note:
                    </span>
                    {prescription.notes}
                </div>
            )}
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PrescriptionsPage() {
    const dispatch = useDispatch<AppDispatch>();
    const { data, loading, error } = useSelector(prescriptiondState);

    useEffect(() => {
        dispatch(fetchPresciptions());
    }, [dispatch]);

    return (
        <DashboardLayout pageTitle="Prescriptions">
            <div className="space-y-6">

                {/* Header */}
                <div>
                    <h1 className="text-2xl font-semibold" style={{ color: "var(--color-text)" }}>
                        Prescriptions
                    </h1>
                    <p className="text-sm mt-0.5" style={{ color: "var(--color-text-light)" }}>
                        View and download your medical prescriptions
                    </p>
                </div>

                {/* Content */}
                {loading ? (
                    <Loading />
                ) : error ? (
                    <Error
                        message={error}
                        onRetry={() => dispatch(fetchPresciptions())}
                    />
                ) : !data?.length ? (
                    <NotFound
                        message="No prescriptions yet"
                        subMessage="Your doctor's prescriptions will appear here after your appointment."
                    />
                ) : (
                    <div className="space-y-4">
                        {data.map((prescription) => (
                            <PrescriptionCard key={prescription.id} prescription={prescription} />
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
