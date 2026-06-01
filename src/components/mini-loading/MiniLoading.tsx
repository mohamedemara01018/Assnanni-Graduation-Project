function MiniLoading({ message }: { message?: string }) {
    return (
        <div className="flex flex-col items-center justify-center gap-3 py-6 w-full">
            {/* Animated bars */}
            <div className="flex items-end gap-[3px] h-6">
                {[0, 1, 2, 3, 4].map((i) => (
                    <span
                        key={i}
                        className="w-[3px] rounded-full bg-(--color-primary) animate-scale-bar"
                        style={{
                            animationDelay: `${i * 0.12}s`,
                            height: "100%",
                        }}
                    />
                ))}
            </div>

            {message && (
                <p className="text-xs text-(--color-text-light) animate-pulse">{message}</p>
            )}

            <style>{`
        @keyframes scale-bar {
          0%, 100% { transform: scaleY(0.25); opacity: 0.4; }
          50%       { transform: scaleY(1);    opacity: 1;   }
        }
        .animate-scale-bar {
          animation: scale-bar 0.9s ease-in-out infinite;
          transform-origin: bottom;
        }
      `}</style>
        </div>
    );
}

export default MiniLoading;
