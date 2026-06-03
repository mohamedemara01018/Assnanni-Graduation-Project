import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/store/store";
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import { Pill, Calendar, Download, User } from "lucide-react";


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

                        <p
                            className="text-sm flex items-center gap-1.5"
                            style={{ color: "var(--color-text-light)" }}
                        >
                            <User className="w-3.5 h-3.5 shrink-0" />
                            {prescription.doctorName}
                        </p>

                        <p
                            className="text-xs flex items-center gap-1.5"
                            style={{ color: "var(--color-text-light)" }}
                        >
                            <Calendar className="w-3.5 h-3.5 shrink-0" />
                            {fullLabel}
                        </p>
                    </div>
                </div>

                {/* Download */}
                <button
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
