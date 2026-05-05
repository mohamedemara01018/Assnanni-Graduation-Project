type ErrorProps = {
    message: string;
};

export default function Error({ message }: ErrorProps) {
    return (
        <div className="w-full flex items-center justify-center py-6">
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl shadow-sm max-w-md w-full">

                {/* icon */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 mt-1 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M12 3l9 16H3L12 3z" />
                </svg>

                {/* message */}
                <div className="flex-1">
                    <p className="font-medium">Something went wrong</p>
                    <p className="text-sm opacity-90">{message}</p>
                </div>
            </div>
        </div>
    );
}