import { Clock, CheckCircle, Loader, GraduationCap } from "lucide-react";
import { Link } from "react-router";

function WaitingStudentDoctorPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-8 bg-(--color-bg)">
            <div className="max-w-md w-full text-center">

                {/* Icon */}
                <div className="w-20 h-20 rounded-full bg-(--color-surface) border border-(--color-border) flex items-center justify-center mx-auto mb-6">
                    <Clock className="w-9 h-9 text-(--color-text-light)" />
                </div>

                {/* Title & Description */}
                <h1 className="text-xl font-semibold text-(--color-text) mb-2">
                    Account Pending Verification
                </h1>

                <p className="text-sm text-(--color-text-light) leading-relaxed mb-8">
                    Your account is pending verification. Please wait for a{" "}
                    <span className="font-semibold text-(--color-text)">
                        doctor
                    </span>{" "}
                    to verify your account before you can access all features.
                </p>

                {/* Steps */}
                <div className="flex flex-col gap-3 mb-8">

                    {/* Step 1 — Done */}
                    <div className="flex items-center gap-4 bg-(--color-surface) border border-(--color-border) rounded-xl px-5 py-4">
                        <div className="w-9 h-9 rounded-full bg-(--color-bg) border border-(--color-border) flex items-center justify-center shrink-0">
                            <CheckCircle className="w-[18px] h-[18px]" style={{ color: "var(--color-success)" }} />
                        </div>
                        <div className="flex-1 text-left">
                            <p className="text-sm font-medium text-(--color-text)">
                                Registration Complete
                            </p>
                            <p className="text-xs text-(--color-text-light) mt-0.5">
                                Your student doctor profile has been submitted successfully.
                            </p>
                        </div>
                    </div>

                    {/* Step 2 — In Progress */}
                    <div className="flex items-center gap-4 bg-(--color-surface) border border-(--color-border) rounded-xl px-5 py-4">
                        <div className="w-9 h-9 rounded-full bg-(--color-bg) border border-(--color-border) flex items-center justify-center shrink-0">
                            <Loader className="w-[18px] h-[18px] animate-spin" style={{ color: "var(--color-primary)" }} />
                        </div>
                        <div className="flex-1 text-left">
                            <p className="text-sm font-medium text-(--color-text)">
                                Awaiting Doctor Verification
                            </p>
                            <p className="text-xs text-(--color-text-light) mt-0.5">
                                A licensed doctor will review and verify your credentials.
                            </p>
                        </div>
                    </div>

                    {/* Step 3 — Pending */}
                    <div className="flex items-center gap-4 bg-(--color-surface) border border-(--color-border) rounded-xl px-5 py-4 opacity-45">
                        <div className="w-9 h-9 rounded-full bg-(--color-bg) border border-(--color-border) flex items-center justify-center shrink-0">
                            <GraduationCap className="w-[18px] h-[18px] text-(--color-text-light)" />
                        </div>
                        <div className="flex-1 text-left">
                            <p className="text-sm font-medium text-(--color-text)">
                                Full Access Granted
                            </p>
                            <p className="text-xs text-(--color-text-light) mt-0.5">
                                You will be notified once your account is verified.
                            </p>
                        </div>
                    </div>

                </div>

                {/* Support Link */}
                <p className="text-xs text-(--color-text-light)">
                    Need help?{" "}
                    <Link
                        to="/support"
                        className="text-(--color-primary) hover:underline"
                    >
                        Contact Support
                    </Link>
                </p>

            </div>
        </div>
    );
}

export default WaitingStudentDoctorPage;
