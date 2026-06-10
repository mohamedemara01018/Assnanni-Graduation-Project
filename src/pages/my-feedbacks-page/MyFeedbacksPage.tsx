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
  Pencil,
  Trash2,
  X,
  Loader2,
} from "lucide-react";
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/store/store";
import {
  fetchMyFeedbacks,
  myFeedbacksState,
  type FeedbackItem,
} from "@/store/slices/patient-slice/my-feedbacks-slice/myFeedbacksSlice";
import {
  deleteFeedbackState,
  fetchDeleteFeedback,
} from "@/store/slices/patient-slice/delete-feedback-slice/deleteFeedbackSlice";
import MiniLoading from "@/components/mini-loading/MiniLoading";
import { NotFound } from "@/components/notfound/NotFound";
import Pagination from "@/components/pagination/Pagination";
import Error from "@/components/error/Error";
import { toast } from "react-toastify";
import { FeedbackModal } from "@/components/feedback-modal/FeedbackModal";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ─── Inline star display (read-only) ─────────────────────────────────────────

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-3.5 h-3.5 ${s <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300 dark:text-gray-600"}`}
        />
      ))}
    </div>
  );
}

// ─── Delete confirm modal ─────────────────────────────────────────────────────

function DeleteConfirmModal({
  feedback,
  onClose,
  onDeleted,
}: {
  feedback: FeedbackItem;
  onClose: () => void;
  onDeleted: () => void;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector(deleteFeedbackState);

  const handleDelete = async () => {
    try {
      await dispatch(
        fetchDeleteFeedback({ appointmentId: feedback.appointmentId }),
      ).unwrap();
      toast.success("Feedback deleted");
      onDeleted();
    } catch (err: any) {
      toast.error(err || "Failed to delete feedback");
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="w-full max-w-sm rounded-2xl overflow-hidden"
          style={{
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            boxShadow: "0 25px 50px rgba(0,0,0,0.2)",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-5 py-4 border-b"
            style={{ borderColor: "var(--color-border)" }}
          >
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: "rgba(220,38,38,0.08)" }}
              >
                <Trash2 className="w-4 h-4" style={{ color: "#dc2626" }} />
              </div>
              <p
                className="text-sm font-semibold"
                style={{ color: "var(--color-text)" }}
              >
                Delete Review
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg flex items-center justify-center hover:opacity-70 transition-opacity"
              style={{
                backgroundColor: "var(--color-bg)",
                border: "1px solid var(--color-border)",
              }}
            >
              <X
                className="w-3.5 h-3.5"
                style={{ color: "var(--color-text-light)" }}
              />
            </button>
          </div>

          {/* Body */}
          <div className="px-5 py-5">
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--color-text-light)" }}
            >
              Your review for{" "}
              <span
                className="font-semibold"
                style={{ color: "var(--color-text)" }}
              >
                {feedback.doctorName}
              </span>{" "}
              will be permanently removed. This cannot be undone.
            </p>
          </div>

          {/* Footer */}
          <div className="flex gap-2.5 px-5 pb-5">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 rounded-xl border py-2.5 text-sm transition-opacity hover:opacity-80 disabled:opacity-50"
              style={{
                borderColor: "var(--color-border)",
                color: "var(--color-text-light)",
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-85 disabled:opacity-50"
              style={{ backgroundColor: "#dc2626" }}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Feedback card ────────────────────────────────────────────────────────────

function FeedbackCard({
  feedback,
  onEdit,
  onDelete,
}: {
  feedback: FeedbackItem;
  onEdit: (f: FeedbackItem) => void;
  onDelete: (f: FeedbackItem) => void;
}) {
  return (
    <div
      className="rounded-2xl border p-5 space-y-4 transition-all duration-150 hover:border-primary/30"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
        boxShadow: "var(--shadow)",
      }}
    >
      {/* Doctor info row */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3.5 min-w-0">
          {feedback.doctorImage?.trim() ? (
            <img
              src={feedback.doctorImage}
              alt={feedback.doctorName}
              className="w-12 h-12 rounded-full object-cover shrink-0"
              style={{ border: "1.5px solid var(--color-border)" }}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{
                backgroundColor: "var(--color-bg-blue)",
                border: "1.5px solid var(--color-border)",
              }}
            >
              <User
                className="w-5 h-5"
                style={{ color: "var(--color-primary)" }}
              />
            </div>
          )}

          <div className="min-w-0 space-y-1">
            <Link
              to={`/doctors-list/${feedback.doctorId}`}
              className="text-sm font-semibold hover:underline truncate block"
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
              {feedback.experienceYears > 0 &&
                ` · ${feedback.experienceYears} yrs`}
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
              <Stars rating={feedback.rating} />
              <span
                className="text-xs font-medium"
                style={{ color: "var(--color-text-light)" }}
              >
                {feedback.rating}.0 / 5
              </span>
            </div>
          </div>
        </div>

        {/* Date + actions */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          <div
            className="flex items-center gap-1 text-[11px]"
            style={{ color: "var(--color-text-light)" }}
          >
            <Calendar className="w-3 h-3" />
            {formatDate(feedback.createdAt)}
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onEdit(feedback)}
              title="Edit review"
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-opacity hover:opacity-70 cursor-pointer"
              style={{
                backgroundColor: "var(--color-bg-blue)",
                color: "var(--color-primary)",
              }}
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(feedback)}
              title="Delete review"
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-opacity hover:opacity-70 cursor-pointer"
              style={{
                backgroundColor: "rgba(220,38,38,0.08)",
                color: "#dc2626",
              }}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, backgroundColor: "var(--color-border)" }} />

      {/* Comment */}
      {feedback.comment?.trim() && (
        <p
          className="text-sm leading-relaxed"
          style={{ color: "var(--color-text)" }}
        >
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

  const [editingFeedback, setEditingFeedback] = useState<FeedbackItem | null>(
    null,
  );
  const [deletingFeedback, setDeletingFeedback] = useState<FeedbackItem | null>(
    null,
  );

  const refetch = () =>
    dispatch(
      fetchMyFeedbacks({
        search,
        pageNumber,
        pageSize,
        rating: ratingFilter ?? undefined,
      }),
    );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    refetch();
  }, [dispatch, search, pageNumber, pageSize, ratingFilter]);

  const handleSearch = (v: string) => {
    setSearch(v);
    setPageNumber(1);
  };
  const handleRating = (v: number | null) => {
    setRatingFilter(v);
    setPageNumber(1);
  };

  const items = data?.items ?? [];
  const averageRating =
    data.totalCount > 0 && items.length > 0
      ? (items.reduce((sum, f) => sum + f.rating, 0) / items.length).toFixed(1)
      : "0.0";

  return (
    <DashboardLayout pageTitle="Feedbacks">
      <div className="space-y-5">
        {/* ── Header stats ─────────────────────────────────────────── */}
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
              <p
                className="text-sm"
                style={{ color: "var(--color-text-light)" }}
              >
                Reviews you've submitted for healthcare providers
              </p>
            </div>
            <div className="flex items-center gap-8">
              <div className="text-center">
                <p
                  className="text-3xl font-bold"
                  style={{ color: "var(--color-primary)" }}
                >
                  {data.totalCount}
                </p>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: "var(--color-text-light)" }}
                >
                  Total Reviews
                </p>
              </div>
              <div
                className="w-px h-10"
                style={{ backgroundColor: "var(--color-border)" }}
              />
              <div className="text-center">
                <p className="text-3xl font-bold" style={{ color: "#ca8a04" }}>
                  {averageRating}
                </p>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: "var(--color-text-light)" }}
                >
                  Avg. Rating
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Search + rating filters ───────────────────────────────── */}
        <div
          className="rounded-2xl border p-4 space-y-3"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border)",
            boxShadow: "var(--shadow)",
          }}
        >
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

          <div className="flex items-center gap-1.5 flex-wrap">
            {[null, 5, 4, 3, 2, 1].map((r) => (
              <button
                key={r ?? "all"}
                onClick={() => handleRating(r)}
                className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150 cursor-pointer"
                style={{
                  backgroundColor:
                    ratingFilter === r
                      ? "var(--color-primary)"
                      : "var(--color-bg)",
                  borderColor:
                    ratingFilter === r
                      ? "var(--color-primary)"
                      : "var(--color-border)",
                  color:
                    ratingFilter === r ? "#fff" : "var(--color-text-light)",
                }}
              >
                {r === null ? (
                  "All"
                ) : (
                  <>
                    <Star className="w-3 h-3 fill-current" />
                    {r}
                  </>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── Content ──────────────────────────────────────────────── */}
        {loading ? (
          <div className="flex justify-center py-12">
            <MiniLoading />
          </div>
        ) : error ? (
          <Error message={error} />
        ) : items.length === 0 ? (
          <NotFound
            message={
              search || ratingFilter
                ? "No reviews match your filters"
                : "No feedback yet"
            }
            subMessage={
              search || ratingFilter
                ? "Try different keywords or clear filters"
                : "Your reviews will appear here after completing appointments"
            }
            onReset={
              search || ratingFilter
                ? () => {
                    handleSearch("");
                    handleRating(null);
                  }
                : undefined
            }
            resetLabel="Clear filters"
          />
        ) : (
          <>
            <div className="space-y-4">
              {items.map((feedback) => (
                <FeedbackCard
                  key={feedback.feedbackId}
                  feedback={feedback}
                  onEdit={setEditingFeedback}
                  onDelete={setDeletingFeedback}
                />
              ))}
            </div>
            <Pagination
              pageNumber={pageNumber}
              pageSize={pageSize}
              totalItems={data.totalCount}
              onPageChange={setPageNumber}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setPageNumber(1);
              }}
            />
          </>
        )}
      </div>

      {/* ── Edit modal (unified FeedbackModal) ───────────────────────── */}
      {editingFeedback && (
        <FeedbackModal
          isOpen={!!editingFeedback}
          onClose={() => setEditingFeedback(null)}
          onSaved={() => {
            setEditingFeedback(null);
            refetch();
          }}
          mode="edit"
          appointmentId={editingFeedback.appointmentId}
          feedbackId={editingFeedback.feedbackId}
          initialRating={editingFeedback.rating}
          initialComment={editingFeedback.comment ?? ""}
          doctor={{
            id: String(editingFeedback.doctorId),
            name: editingFeedback.doctorName,
            specialty: editingFeedback.specialization ?? "",
            image: editingFeedback.doctorImage ?? "",
          }}
        />
      )}

      {/* ── Delete modal ─────────────────────────────────────────────── */}
      {deletingFeedback && (
        <DeleteConfirmModal
          feedback={deletingFeedback}
          onClose={() => setDeletingFeedback(null)}
          onDeleted={() => {
            setDeletingFeedback(null);
            refetch();
          }}
        />
      )}
    </DashboardLayout>
  );
}
