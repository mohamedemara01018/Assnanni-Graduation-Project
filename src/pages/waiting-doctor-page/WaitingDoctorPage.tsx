import { Clock, CheckCircle, Loader, Stethoscope } from "lucide-react";
import { Link } from "react-router";
import { useSelector } from 'react-redux'
import type { RootState } from "@/store/store";
function WaitingDoctorPage() {
    const role = useSelector((state: RootState) => state?.auth.role)
    console.log(role)
    return (
        <div className="min-h-screen flex items-center justify-center p-8 bg-(--color-bg)">
            <div className="max-w-md w-full text-center">

                {/* Icon */}
                <div className="w-20 h-20 rounded-full bg-(--color-surface) border border-(--color-border) flex items-center justify-center mx-auto mb-6">
                    <Clock className="w-9 h-9 text-(--color-text-light)" />
                </div>

                {/* Title & Description */}
                <h1 className="text-xl font-semibold text-(--color-text) mb-2">
                    Your Request Is Under Review
                </h1>

                <p className="text-sm text-(--color-text-light) leading-relaxed mb-8">
                    We have successfully received your information. An administrator
                    will review your profile within{" "}
                    <span className="font-semibold text-(--color-text)">
                        24 hours
                    </span>{" "}
                    and your account will be activated once approved.
                </p>

                {/* Steps */}
                <div className="flex flex-col gap-3 mb-8">

                    {/* Step 1 — Done */}
                    <div className="flex items-center gap-4 bg-(--color-surface) border border-(--color-border) rounded-xl px-5 py-4">
                        <div className="w-9 h-9 rounded-full bg-(--color-bg) border border-(--color-border) flex items-center justify-center shrink-0">
                            <CheckCircle className="w-[18px] h-[18px] text-green-500" />
                        </div>

                        <div className="flex-1 text-left">
                            <p className="text-sm font-medium text-(--color-text)">
                                Information Received
                            </p>
                            <p className="text-xs text-(--color-text-light) mt-0.5">
                                Your profile has been submitted and added to the review queue.
                            </p>
                        </div>
                    </div>

                    {/* Step 2 — In Progress */}
                    <div className="flex items-center gap-4 bg-(--color-surface) border border-(--color-border) rounded-xl px-5 py-4">
                        <div className="w-9 h-9 rounded-full bg-(--color-bg) border border-(--color-border) flex items-center justify-center shrink-0">
                            <Loader className="w-[18px] h-[18px] text-amber-500 animate-spin" />
                        </div>

                        <div className="flex-1 text-left">
                            <p className="text-sm font-medium text-(--color-text)">
                                Profile Under Review
                            </p>
                            <p className="text-xs text-(--color-text-light) mt-0.5">
                                The review process may take up to 24 hours.
                            </p>
                        </div>
                    </div>

                    {/* Step 3 — Pending */}
                    <div className="flex items-center gap-4 bg-(--color-surface) border border-(--color-border) rounded-xl px-5 py-4 opacity-45">
                        <div className="w-9 h-9 rounded-full bg-(--color-bg) border border-(--color-border) flex items-center justify-center shrink-0">
                            <Stethoscope className="w-[18px] h-[18px] text-(--color-text-light)" />
                        </div>

                        <div className="flex-1 text-left">
                            <p className="text-sm font-medium text-(--color-text)">
                                Account Activation
                            </p>
                            <p className="text-xs text-(--color-text-light) mt-0.5">
                                You will receive a notification once your account is approved.
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

export default WaitingDoctorPage;