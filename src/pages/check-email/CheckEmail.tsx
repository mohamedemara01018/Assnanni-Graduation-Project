import { Mail } from "lucide-react";
import { useSearchParams } from "react-router";

function CheckEmailPage() {
    const [searchParams] = useSearchParams();
    const email = searchParams.get("email") || "your email";

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-(--color-bg)">
            <div className="max-w-md w-full text-center">

                {/* Animated envelope icon */}
                <div className="relative w-24 h-24 mx-auto mb-8">
                    {/* Outer glow ring */}
                    <div
                        className="absolute inset-0 rounded-full animate-ping opacity-20"
                        style={{ backgroundColor: "var(--color-primary)" }}
                    />
                    {/* Icon container */}
                    <div
                        className="relative w-24 h-24 rounded-full flex items-center justify-center border-2"
                        style={{
                            backgroundColor: "var(--color-bg-blue)",
                            borderColor: "var(--color-primary-lighter)",
                        }}
                    >
                        <Mail className="w-10 h-10" style={{ color: "var(--color-primary)" }} />
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-2xl font-semibold mb-2 text-(--color-text)">
                    Check your email
                </h1>

                {/* Description */}
                <p className="text-sm text-(--color-text-light) leading-relaxed mb-2">
                    We've sent a password reset link to
                </p>
                <p
                    className="text-sm font-semibold mb-6 px-4 py-2 rounded-xl inline-block"
                    style={{
                        backgroundColor: "var(--color-bg-blue)",
                        color: "var(--color-text-blue)",
                    }}
                >
                    {email}
                </p>

                {/* Instructions card */}
                <div
                    className="rounded-2xl border p-5 mb-6 text-left space-y-3"
                    style={{
                        backgroundColor: "var(--color-surface)",
                        borderColor: "var(--color-border)",
                        boxShadow: "var(--shadow)",
                    }}
                >
                    {[
                        { num: "1", text: "Open your email inbox" },
                        { num: "2", text: 'Find the email from Assnani and click "Reset Password"' },
                        { num: "3", text: "The link is valid for 15 minutes" },
                    ].map((step) => (
                        <div key={step.num} className="flex items-start gap-3">
                            <span
                                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
                                style={{
                                    backgroundColor: "var(--color-primary)",
                                    color: "#fff",
                                }}
                            >
                                {step.num}
                            </span>
                            <p className="text-sm text-(--color-text)">{step.text}</p>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}

export default CheckEmailPage;
