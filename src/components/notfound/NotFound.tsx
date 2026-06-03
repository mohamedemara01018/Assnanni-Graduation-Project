import { SearchX } from "lucide-react";

type NotFoundProps = {
    message?: string;
    subMessage?: string;
    onReset?: () => void;
    resetLabel?: string;
};

export function NotFound({
    message = "No results found",
    subMessage,
    onReset,
    resetLabel = "Clear filters",
}: NotFoundProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center w-full">

            {/* Icon */}
            <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
                style={{
                    backgroundColor: "var(--color-bg)",
                    border: "1.5px solid var(--color-border)",
                    boxShadow: "var(--shadow)",
                }}
            >
                <SearchX className="w-7 h-7" style={{ color: "var(--color-text-light)" }} />
            </div>

            {/* Title */}
            <h2
                className="text-lg font-semibold mb-1"
                style={{ color: "var(--color-text)" }}
            >
                {message}
            </h2>

            {/* Sub message */}
            {subMessage && (
                <p
                    className="text-sm leading-relaxed max-w-xs"
                    style={{ color: "var(--color-text-light)" }}
                >
                    {subMessage}
                </p>
            )}

            {/* Optional reset action */}
            {onReset && (
                <button
                    onClick={onReset}
                    className="mt-5 px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-150 hover:opacity-80 active:scale-95"
                    style={{
                        color: "var(--color-primary)",
                        borderColor: "var(--color-primary)",
                        backgroundColor: "var(--color-bg-blue)",
                    }}
                >
                    {resetLabel}
                </button>
            )}
        </div>
    );
}
