interface LoadingProps {
    className?: string;
}

function Loading({ className = "" }: LoadingProps) {
    return (
        <div
            className={`flex flex-col items-center justify-center min-h-screen w-full ${className}`}
            style={{ backgroundColor: "var(--color-bg)" }}
        >
            <div className="flex flex-col items-center gap-6">

                {/* Spinner + rings */}
                <div className="relative flex items-center justify-center" style={{ width: 200, height: 200 }}>

                    {/* Outer slow track */}
                    <svg
                        className="absolute inset-0"
                        width="200"
                        height="200"
                        viewBox="0 0 200 200"
                        style={{ animation: "loading-spin-slow 3s linear infinite" }}
                    >
                        <circle
                            cx="100" cy="100" r="90"
                            fill="none"
                            stroke="var(--color-border)"
                            strokeWidth="3"
                        />
                        <circle
                            cx="100" cy="100" r="90"
                            fill="none"
                            stroke="var(--color-primary)"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            strokeDasharray="80 484"
                            strokeDashoffset="0"
                            opacity="0.6"
                        />
                    </svg>

                    {/* Inner fast arc */}
                    <svg
                        className="absolute"
                        width="158"
                        height="158"
                        viewBox="0 0 158 158"
                        style={{
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            animation: "loading-spin-fast 1.2s linear infinite",
                        }}
                    >
                        <circle
                            cx="79" cy="79" r="69"
                            fill="none"
                            stroke="var(--color-primary)"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeDasharray="55 378"
                            strokeDashoffset="0"
                        />
                    </svg>

                    {/* Center card */}
                    <div
                        className="absolute flex flex-col items-center justify-center rounded-full"
                        style={{
                            width: 116,
                            height: 116,
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            backgroundColor: "var(--color-surface)",
                            border: "2px solid var(--color-border)",
                            boxShadow: "0 0 0 4px var(--color-bg), var(--shadow)",
                            animation: "loading-pulse 2s ease-in-out infinite",
                        }}
                    >
                        <span
                            style={{
                                color: "var(--color-primary)",
                                fontSize: 11,
                                fontWeight: 700,
                                letterSpacing: "0.2em",
                            }}
                        >
                            ASSNANI
                        </span>
                    </div>
                </div>

                {/* Dots + label */}
                <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-1.5">
                        {[0, 1, 2].map((i) => (
                            <span
                                key={i}
                                className="rounded-full"
                                style={{
                                    width: 6,
                                    height: 6,
                                    backgroundColor: "var(--color-primary)",
                                    animation: `loading-dot 1.2s ease-in-out ${i * 0.2}s infinite`,
                                    display: "inline-block",
                                }}
                            />
                        ))}
                    </div>
                    <p
                        style={{
                            color: "var(--color-text-light)",
                            fontSize: 11,
                            fontWeight: 500,
                            letterSpacing: "0.15em",
                            textTransform: "uppercase",
                            margin: 0,
                        }}
                    >
                        Loading
                    </p>
                </div>
            </div>

            <style>{`
        @keyframes loading-spin-slow {
          to { transform: rotate(360deg); }
        }
        @keyframes loading-spin-fast {
          to { transform: translate(-50%, -50%) rotate(-360deg); }
        }
        @keyframes loading-pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50%       { transform: translate(-50%, -50%) scale(1.05); }
        }
        @keyframes loading-dot {
          0%, 80%, 100% { transform: translateY(0);    opacity: 0.35; }
          40%            { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
        </div>
    );
}

export default Loading;
