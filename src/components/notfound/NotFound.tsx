export function NotFound({ message = "No results found", subMessage }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">

            {/* Icon */}
            <div className="text-5xl mb-4">🔍</div>

            {/* Main text */}
            <h2 className="text-2xl font-semibold text-gray-700">
                {message}
            </h2>

            {/* Optional sub text */}
            {subMessage && (
                <p className="text-gray-500 mt-2 max-w-md">
                    {subMessage}
                </p>
            )}
        </div>
    );
}