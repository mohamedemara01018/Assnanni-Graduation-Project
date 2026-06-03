import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
    Star,
    Calendar,
    ThumbsUp,
    Search,
    Stethoscope,
    User,
    Building2,
} from "lucide-react";
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/store/store";
import {
    fetchMyFeedbacks,
    myFeedbacksState,
    type FeedbackItem,
} from "@/store/slices/patient-slice/my-feedbacks-slice/myFeedbacksSlice";
import MiniLoading from "@/components/mini-loading/MiniLoading";
import { NotFound } from "@/components/notfound/NotFound";
import Pagination from "@/components/pagination/Pagination";
import Error from "@/components/error/Error";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function StarRow({ rating, size = 4 }: { rating: number; size?: number }) {
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

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

// ─── Feedback Card ────────────────────────────────────────────────────────────

function FeedbackCard({ feedback }: { feedback: FeedbackItem }) {
    return (
        <div
            className="rounded-2xl border p-5 space-y-4"
            style={{
                backgroundColor: "var(--color-surface)",
                borderColor: "var(--color-border)",
                boxShadow: "var(--shadow)",
            }}
        >
            {/* Doctor info */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                    {feedback.doctorImage?.trim() ? (
                        <img
                            src={feedback.doctorImage}
                            alt={feedback.doctorName}
                            className="w-14 h-14 rounded-xl object-cover shrink-0"
                            style={{ border: "1.5px solid var(--color-border)" }}
                            onError={(e) => {
                                (e.currentTarget as HTMLImageElement).style.display = "none";
                            }}
                        />
                    ) : (
                        <div
                            className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
                            style={{
                                backgroundColor: "var(--color-bg-blue)",
                                border: "1.5px solid var(--color-border)",
                            }}
                        >
                            <User className="w-6 h-6" style={{ color: "var(--color-primary)" }} />
                        </div>
                    )}

                    <div className="space-y-1">
                        <Link
                            to={`/doctors-list/${feedback.doctorId}`}
                            className="text-sm font-semibold hover:underline"
                            style={{ color: "var(--color-text)" }}
                        >
                            {feedback.doctorName}
                        </Link>

                        <p
                            className="text-xs flex items-center gap-1"
                            style={{ color: "var(--color-text-light)" }}
                        >
                            <Stethoscope className="w-3 h-3 shrink-0" />
                            {feedback.specialization}
                            {feedback.experienceYears > 0 && (
                                <span className="ml-1">· {feedback.experienceYears} yrs</span>
                            )}
                        </p>

                        {feedback.clinicName && (
                            <p
                                className="text-xs flex items-center gap-1"
                                style={{ color: "var(--color-text-light)" }}
                            >
                                <Building2 className="w-3 h-3 shrink-0" />
                                {feedback.clinicName}
                                {feedback.clinicLocation && ` · ${feedback.clinicLocation}`}
                            </p>
                        )}

                        <div className="flex items-center gap-2 pt-0.5">
                            <StarRow rating={feedback.rating} />
                            <span
                                className="text-xs font-medium"
                                style={{ color: "var(--color-text-light)" }}
                            >
                                {feedback.rating}.0 / 5
                            </span>
                        </div>
                    </div>
                </div>

                {/* Date */}
                <div
                    className="shrink-0 flex items-center gap-1.5 text-xs"
                    style={{ color: "var(--color-text-light)" }}
                >
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(feedback.createdAt)}
                </div>
            </div>

            {/* Divider */}
            <div style={{ height: 1, backgroundColor: "var(--color-border)" }} />

            {/* Comment */}
            {feedback.comment?.trim() && (
                <p className="text-sm leading-relaxed" style={{ color: "var(--color-text)" }}>
                    {feedback.comment}
                </p>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-1">
                <div
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs"
                    style={{
                        backgroundColor: "rgba(22,163,74,0.08)",
                        color: "var(--color-success)",
                        border: "1px solid rgba(22,163,74,0.15)",
                    }}
                >
                    <ThumbsUp className="w-3 h-3" />
                    Would recommend
                </div>

                <Link
                    to={`/appointments/booking/${feedback.doctorId}`}
                    className="text-xs font-medium hover:underline"
                    style={{ color: "var(--color-primary)" }}
                >
                    Book Again
                </Link>
            </div>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MyFeedbackPage() {
    const dispatch = useDispatch<AppDispatch>();
    const { data, loading, error } = useSelector(myFeedbacksState);

    const [search, setSearch] = useState("");
    const [ratingFilter, setRatingFilter] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Re-fetch whenever any filter/page changes
    useEffect(() => {
        dispatch(
            fetchMyFeedbacks({
                search,
                pageNumber,
                pageSize,
                rating: ratingFilter ?? undefined,
            })
        );
    }, [dispatch, search, pageNumber, pageSize, ratingFilter]);

    // Reset to page 1 when filters change
    const handleSearch = (value: string) => {
        setSearch(value);
        setPageNumber(1);
    };

    const handleRating = (value: number | null) => {
        setRatingFilter(value);
        setPageNumber(1);
    };

    const items = data?.items ?? [];

    const averageRating =
        data.totalCount > 0 && items.length > 0
            ? (items.reduce((sum, f) => sum + f.rating, 0) / items.length).toFixed(1)
            : "0.0";

    return (
        <DashboardLayout pageTitle="My Feedback">
            <div className="space-y-5">

                {/* ── Header stats ── */}
                <div
                    className="rounded-2xl border p-6"
                    style={{
                        backgroundColor: "var(--color-surface)",
                        borderColor: "var(--color-border)",
                        boxShadow: "var(--shadow)",
                    }}
                >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1
                                className="text-2xl font-semibold mb-0.5"
                                style={{ color: "var(--color-text)" }}
                            >
                                My Feedback & Reviews
                            </h1>
                            <p className="text-sm" style={{ color: "var(--color-text-light)" }}>
                                Reviews you've submitted for healthcare providers
                            </p>
                        </div>

                        <div className="flex items-center gap-8">
                            <div className="text-center">
                                <p className="text-3xl font-bold" style={{ color: "var(--color-primary)" }}>
                                    {data.totalCount}
                                </p>
                                <p className="text-xs mt-0.5" style={{ color: "var(--color-text-light)" }}>
                                    Total Reviews
                                </p>
                            </div>
                            <div className="w-px h-10" style={{ backgroundColor: "var(--color-border)" }} />
                            <div className="text-center">
                                <p className="text-3xl font-bold" style={{ color: "#ca8a04" }}>
                                    {averageRating}
                                </p>
                                <p className="text-xs mt-0.5" style={{ color: "var(--color-text-light)" }}>
                                    Avg. Rating
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Search + Rating filter ── */}
                <div
                    className="rounded-2xl border p-4 space-y-3"
                    style={{
                        backgroundColor: "var(--color-surface)",
                        borderColor: "var(--color-border)",
                        boxShadow: "var(--shadow)",
                    }}
                >
                    {/* Search */}
                    <div className="relative">
                        <Search
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                            style={{ color: "var(--color-text-light)" }}
                        />
                        <input
                            type="text"
                            placeholder="Search by doctor, specialty or review..."
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-colors"
                            style={{
                                backgroundColor: "var(--color-bg)",
                                border: "1.5px solid var(--color-border)",
                                color: "var(--color-text)",
                            }}
                            onFocus={(e) =>
                                (e.currentTarget.style.borderColor = "var(--color-primary)")
                            }
                            onBlur={(e) =>
                                (e.currentTarget.style.borderColor = "var(--color-border)")
                            }
                        />
                    </div>

                    {/* Rating filter pills */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                        <button
                            onClick={() => handleRating(null)}
                            className="px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150 cursor-pointer"
                            style={{
                                backgroundColor: ratingFilter === null ? "var(--color-primary)" : "var(--color-bg)",
                                borderColor: ratingFilter === null ? "var(--color-primary)" : "var(--color-border)",
                                color: ratingFilter === null ? "#fff" : "var(--color-text-light)",
                            }}
                        >
                            All
                        </button>
                        {[5, 4, 3, 2, 1].map((r) => (
                            <button
                                key={r}
                                onClick={() => handleRating(r)}
                                className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150 cursor-pointer"
                                style={{
                                    backgroundColor: ratingFilter === r ? "var(--color-primary)" : "var(--color-bg)",
                                    borderColor: ratingFilter === r ? "var(--color-primary)" : "var(--color-border)",
                                    color: ratingFilter === r ? "#fff" : "var(--color-text-light)",
                                }}
                            >
                                <Star className="w-3 h-3 fill-current" />
                                {r}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Content ── */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <MiniLoading />
                    </div>
                ) : error ? (
                    <Error
                        message={error}
                        onRetry={() =>
                            dispatch(fetchMyFeedbacks({ search, pageNumber, pageSize, rating: ratingFilter ?? undefined }))
                        }
                    />
                ) : items.length === 0 ? (
                    <NotFound
                        message={search || ratingFilter ? "No reviews match your filters" : "No feedback yet"}
                        subMessage={
                            search || ratingFilter
                                ? "Try different keywords or clear filters"
                                : "Your reviews will appear here after completing appointments"
                        }
                        onReset={
                            search || ratingFilter
                                ? () => { handleSearch(""); handleRating(null); }
                                : undefined
                        }
                        resetLabel="Clear filters"
                    />
                ) : (
                    <>
                        <div className="space-y-4">
                            {items.map((feedback) => (
                                <FeedbackCard key={feedback.feedbackId} feedback={feedback} />
                            ))}
                        </div>

                        <Pagination
                            pageNumber={pageNumber}
                            pageSize={pageSize}
                            totalItems={data.totalCount}
                            onPageChange={setPageNumber}
                            onPageSizeChange={(size) => { setPageSize(size); setPageNumber(1); }}
                        />
                    </>
                )}
            </div>
        </DashboardLayout>
    );
}
