import { Star } from "lucide-react";

export default function StarRow({ rating, size = 4 }: { rating: number; size?: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
                <Star
                    key={s}
                    className={`w-${size} h-${size} ${s <= rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300 dark:text-gray-600"
                        }`}
                />
            ))}
        </div>
    );
}