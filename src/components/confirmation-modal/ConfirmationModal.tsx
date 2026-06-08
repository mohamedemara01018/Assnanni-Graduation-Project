import { Banknote, Calendar, CheckCircle, Clock, FileText, MapPin, X } from "lucide-react";

export default function ConfirmationModal({
    doctorName,
    selectedDate,
    selectedTime,
    paymentMethod,
    appointmentType,
    onClose,
}: {
    doctorName?: string;
    selectedDate: string;
    selectedTime: string;
    paymentMethod: string;
    appointmentType: string;
    onClose: () => void;
}) {
    const paymentLabel: Record<string, string> = {
        Cash: "Cash at Clinic",
        CreditCard: "Credit Card",
        VodafoneCash: "Vodafone Cash",
        BankTransfer: "Bank Transfer",
        Insurance: "Insurance",
        OnlinePayment: "Online Payment",
    };

    return (
        /* Backdrop */
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
        >
            {/* Modal card */}
            <div
                className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
                style={{
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                }}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1.5 rounded-lg transition-colors z-10"
                    style={{ color: "var(--color-text-light)" }}
                >
                    <X className="w-4 h-4" />
                </button>

                {/* Green top band */}
                <div
                    className="h-2 w-full"
                    style={{
                        background: "linear-gradient(90deg, var(--color-success) 0%, var(--color-success-light) 100%)",
                    }}
                />

                {/* Body */}
                <div className="px-8 pt-8 pb-6 text-center">
                    {/* Animated check circle */}
                    <div
                        className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
                        style={{ background: "rgba(22,163,74,0.10)", border: "2px solid rgba(22,163,74,0.2)" }}
                    >
                        <CheckCircle
                            className="w-10 h-10"
                            style={{ color: "var(--color-success)" }}
                        />
                    </div>

                    <h2
                        className="text-xl font-bold mb-1"
                        style={{ color: "var(--color-text)" }}
                    >
                        Appointment Confirmed!
                    </h2>
                    <p className="text-sm mb-6" style={{ color: "var(--color-text-light)" }}>
                        Your booking has been successfully scheduled.
                    </p>

                    {/* Details list */}
                    <div
                        className="rounded-xl p-4 space-y-3 text-left mb-5"
                        style={{
                            background: "var(--color-bg)",
                            border: "1px solid var(--color-border)",
                        }}
                    >
                        {/* Doctor */}
                        <div className="flex items-center gap-3">
                            <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                style={{ background: "var(--color-bg-blue)" }}
                            >
                                <MapPin className="w-4 h-4" style={{ color: "var(--color-primary)" }} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs" style={{ color: "var(--color-text-light)" }}>Doctor</p>
                                <p className="text-sm font-medium truncate" style={{ color: "var(--color-text)" }}>
                                    {doctorName || "—"}
                                </p>
                            </div>
                        </div>

                        {/* Date */}
                        <div className="flex items-center gap-3">
                            <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                style={{ background: "var(--color-bg-blue)" }}
                            >
                                <Calendar className="w-4 h-4" style={{ color: "var(--color-primary)" }} />
                            </div>
                            <div>
                                <p className="text-xs" style={{ color: "var(--color-text-light)" }}>Date</p>
                                <p className="text-sm font-medium" style={{ color: "var(--color-text)" }}>
                                    {selectedDate || "—"}
                                </p>
                            </div>
                        </div>

                        {/* Time */}
                        <div className="flex items-center gap-3">
                            <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                style={{ background: "var(--color-bg-blue)" }}
                            >
                                <Clock className="w-4 h-4" style={{ color: "var(--color-primary)" }} />
                            </div>
                            <div>
                                <p className="text-xs" style={{ color: "var(--color-text-light)" }}>Time</p>
                                <p className="text-sm font-medium" style={{ color: "var(--color-text)" }}>
                                    {selectedTime || "—"}
                                </p>
                            </div>
                        </div>

                        {/* Type */}
                        {appointmentType && (
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                    style={{ background: "var(--color-bg-blue)" }}
                                >
                                    <FileText className="w-4 h-4" style={{ color: "var(--color-primary)" }} />
                                </div>
                                <div>
                                    <p className="text-xs" style={{ color: "var(--color-text-light)" }}>Type</p>
                                    <p className="text-sm font-medium" style={{ color: "var(--color-text)" }}>
                                        {appointmentType}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Payment */}
                        <div className="flex items-center gap-3">
                            <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                style={{ background: "var(--color-bg-blue)" }}
                            >
                                <Banknote className="w-4 h-4" style={{ color: "var(--color-primary)" }} />
                            </div>
                            <div>
                                <p className="text-xs" style={{ color: "var(--color-text-light)" }}>Payment</p>
                                <p className="text-sm font-medium" style={{ color: "var(--color-text)" }}>
                                    {paymentLabel[paymentMethod] || paymentMethod || "—"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Email notice */}
                    <div
                        className="rounded-lg px-4 py-3 mb-6"
                        style={{
                            background: "var(--color-bg-blue)",
                            border: "1px solid var(--color-primary-lighter)",
                        }}
                    >
                        <p className="text-xs" style={{ color: "var(--color-text-blue)" }}>
                            A confirmation email has been sent to your registered email address.
                        </p>
                    </div>

                    {/* CTA */}
                    <button
                        onClick={onClose}
                        className="w-full py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90"
                        style={{
                            background: "var(--color-primary)",
                            color: "#fff",
                        }}
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
}
