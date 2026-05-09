import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    pageNumber: number;
    pageSize: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    onPageSizeChange?: (size: number) => void;
    pageSizeOptions?: number[];
}

export default function Pagination({
    pageNumber,
    pageSize,
    totalItems,
    onPageChange,
    onPageSizeChange,
    pageSizeOptions = [5, 10, 20, 50],
}: PaginationProps) {
    const totalPages = Math.ceil(totalItems / pageSize);

    const handlePrevious = () => {
        if (pageNumber > 1) {
            onPageChange(pageNumber - 1);
        }
    };

    const handleNext = () => {
        if (pageNumber < totalPages) {
            onPageChange(pageNumber + 1);
        }
    };

    const generatePages = () => {
        const pages: number[] = [];

        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }

        return pages;
    };

    if (totalPages <= 1) return null;

    return (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-6 p-6">
            {/* Page Size */}
            {onPageSizeChange && (
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                        Rows per page:
                    </span>

                    <select
                        value={pageSize}
                        onChange={(e) =>
                            onPageSizeChange(Number(e.target.value))
                        }
                        className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
                    >
                        {pageSizeOptions.map((size) => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Pagination */}
            <div className="flex items-center gap-2">
                <button
                    onClick={handlePrevious}
                    disabled={pageNumber === 1}
                    className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>

                {generatePages().map((page) => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`min-w-[40px] h-[40px] rounded-lg border transition
                            ${page === pageNumber
                                ? "bg-blue-600 text-white border-blue-600"
                                : "border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                            }`}
                    >
                        {page}
                    </button>
                ))}

                <button
                    onClick={handleNext}
                    disabled={pageNumber === totalPages}
                    className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}