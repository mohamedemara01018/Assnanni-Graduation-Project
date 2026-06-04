import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

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
        if (pageNumber > 1) onPageChange(pageNumber - 1);
    };

    const handleNext = () => {
        if (pageNumber < totalPages) onPageChange(pageNumber + 1);
    };

    // Smart page generation with ellipsis
    const generatePages = (): (number | "...")[] => {
        if (totalPages <= 7) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        const pages: (number | "...")[] = [1];

        if (pageNumber > 3) pages.push("...");

        const start = Math.max(2, pageNumber - 1);
        const end = Math.min(totalPages - 1, pageNumber + 1);

        for (let i = start; i <= end; i++) pages.push(i);

        if (pageNumber < totalPages - 2) pages.push("...");

        pages.push(totalPages);
        return pages;
    };

    const startItem = (pageNumber - 1) * pageSize + 1;
    const endItem = Math.min(pageNumber * pageSize, totalItems);

    if (totalItems < 10) return null;

    return (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-(--color-border) bg-(--color-surface) px-5 py-3.5"
            style={{ boxShadow: "var(--shadow)" }}
        >
            {/* Left: item range info */}
            <div className="flex items-center gap-4">
                <p className="text-xs text-(--color-text-light) tabular-nums">
                    <span className="font-medium text-(--color-text)">{startItem}–{endItem}</span>
                    {" "}of{" "}
                    <span className="font-medium text-(--color-text)">{totalItems}</span>
                    {" "}results
                </p>

                {onPageSizeChange && (
                    <>
                        <span className="w-px h-4 bg-(--color-border)" />
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-(--color-text-light)">Per page</span>
                            <select
                                value={pageSize}
                                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                                className="rounded-lg border border-(--color-border) bg-(--color-bg) text-(--color-text) text-xs px-2.5 py-1.5 outline-none focus:border-(--color-primary) transition-colors cursor-pointer"
                            >
                                {pageSizeOptions.map((size) => (
                                    <option key={size} value={size}>{size}</option>
                                ))}
                            </select>
                        </div>
                    </>
                )}
            </div>

            {/* Right: page controls */}
            <div className="flex items-center gap-1">
                {/* Prev */}
                <button
                    onClick={handlePrevious}
                    disabled={pageNumber === 1}
                    aria-label="Previous page"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-(--color-border) bg-(--color-surface) text-(--color-text-light) transition-all duration-150 hover:border-(--color-primary) hover:text-(--color-primary) hover:bg-(--color-bg-blue) disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-(--color-border) disabled:hover:text-(--color-text-light) disabled:hover:bg-(--color-surface) cursor-pointer"
                >
                    <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                {/* Page numbers */}
                <div className="flex items-center gap-1 mx-1">
                    {generatePages().map((page, idx) =>
                        page === "..." ? (
                            <span
                                key={`ellipsis-${idx}`}
                                className="flex h-8 w-8 items-center justify-center text-xs text-(--color-text-light)"
                            >
                                <MoreHorizontal className="w-3.5 h-3.5" />
                            </span>
                        ) : (
                            <button
                                key={page}
                                onClick={() => onPageChange(page)}
                                className={`flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-medium transition-all duration-150 cursor-pointer ${page === pageNumber
                                    ? "bg-(--color-primary) text-white border-(--color-primary) shadow-sm"
                                    : "border-(--color-border) bg-(--color-surface) text-(--color-text-light) hover:border-(--color-primary) hover:text-(--color-primary) hover:bg-(--color-bg-blue)"
                                    }`}
                            >
                                {page}
                            </button>
                        )
                    )}
                </div>

                {/* Next */}
                <button
                    onClick={handleNext}
                    disabled={pageNumber === totalPages}
                    aria-label="Next page"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-(--color-border) bg-(--color-surface) text-(--color-text-light) transition-all duration-150 hover:border-(--color-primary) hover:text-(--color-primary) hover:bg-(--color-bg-blue) disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-(--color-border) disabled:hover:text-(--color-text-light) disabled:hover:bg-(--color-surface) cursor-pointer"
                >
                    <ChevronRight className="w-3.5 h-3.5" />
                </button>
            </div>
        </div>
    );
}
