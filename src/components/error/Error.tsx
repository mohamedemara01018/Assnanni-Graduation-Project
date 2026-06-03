import { AlertTriangle } from "lucide-react";

type ErrorProps = {
    message: string;
    onRetry?: () => void;
};

export default function Error({ message, onRetry }: ErrorProps) {
    return (
        <div className="w-full flex items-center justify-center py-6">
            <div
                className="flex items-start gap-4 px-5 py-4 rounded-2xl max-w-md w-full"
                style={{
                    backgroundColor: "rgba(220, 38, 38, 0.06)",
                    border: "1.5px solid rgba(220, 38, 38, 0.2)",
                    boxShadow: "0 2px 12px rgba(220, 38, 38, 0.08)",
                }}
            >
                {/* Icon */}
                <div
                    className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center mt-0.5"
                    style={{ backgroundColor: "rgba(220, 38, 38, 0.1)" }}
                >
                    <AlertTriangle className="w-4 h-4" style={{ color: "#dc2626" }} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <p
                        className="text-sm font-semibold mb-0.5"
                        style={{ color: "#dc2626" }}
                    >
                        Something went wrong
                    </p>
                    <p
                        className="text-sm leading-relaxed"
                        style={{ color: "var(--color-text-light)" }}
                    >
                        {message}
                    </p>

                    {onRetry && (
                        <button
                            onClick={onRetry}
                            className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium transition-opacity hover:opacity-70"
                            style={{ color: "#dc2626" }}
                        >
                            <svg
                                className="w-3 h-3"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2.5}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                />
                            </svg>
                            Try again
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
