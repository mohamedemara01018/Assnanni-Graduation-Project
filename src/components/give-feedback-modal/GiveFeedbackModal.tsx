import { useEffect, useState } from "react";
import {
  X,
  Star,
  MessageSquare,
  CheckCircle,
  Mail,
  ThumbsUp,
  Loader2,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import type { AppDispatch } from "@/store/store";
import {
  addFeedbackState,
  fetchAddFeedback,
  resetAddFeedbackStatus,
} from "@/store/slices/patient-slice/add-feedback-slice/addFeedbackSlice";

// ─── Types ────────────────────────────────────────────────────────────────────

interface GiveFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: {
    id: string;
    name: string;
    specialty: string;
    image?: string;
  };
}

// ─── Star row ─────────────────────────────────────────────────────────────────

const RATING_LABELS: Record<number, string> = {
  1: "Poor",
  2: "Fair",
  3: "Good",
  4: "Very Good",
  5: "Excellent",
};

function StarRow({
  rating,
  hover,
  onRate,
  onHover,
  onLeave,
  size = 7,
}: {
  rating: number;
  hover: number;
  onRate: (v: number) => void;
  onHover: (v: number) => void;
  onLeave: () => void;
  size?: number;
}) {
  const active = hover || rating;
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onRate(s)}
          onMouseEnter={() => onHover(s)}
          onMouseLeave={onLeave}
          className="transition-transform hover:scale-110 focus:outline-none"
          aria-label={`Rate ${s} star`}
        >
          <Star
            className={`w-${size} h-${size} transition-colors ${
              s <= active
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300 dark:text-gray-600"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function GiveFeedbackModal({
  isOpen,
  onClose,
  doctor,
}: GiveFeedbackModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { loading: submitting, success, error } = useSelector(addFeedbackState);

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  // Mirror Redux success → local success screen
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (success) setShowSuccess(true);
  }, [success]);

  // Show API error via toast
  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const doctorInitials = doctor.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleSubmit = () => {
    if (rating === 0) return;

    // Ensure numeric values are sent instead of strings to match CreateFeedbackDto
    dispatch(
      fetchAddFeedback({
        appointmentId: Number(doctor.id), // Use your appointment state or ID variable here as a number
        rating: Number(rating), // Ensures rating is handled as a number
        comment,
      }),
    );
  };

  const handleClose = () => {
    setRating(0);
    setHover(0);
    setComment("");
    setShowSuccess(false);
    dispatch(resetAddFeedbackStatus());
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(10,14,20,0.72)" }}
    >
      <div
        className="relative w-full max-w-lg flex flex-col rounded-2xl shadow-2xl max-h-[90vh]"
        style={{
          backgroundColor: "var(--color-surface)",
          border: "1px solid var(--color-border)",
        }}
      >
        {showSuccess ? (
          // ── Success ───────────────────────────────────────────────
          <div className="px-8 py-12 text-center">
            <div
              className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full"
              style={{ backgroundColor: "rgba(22,163,74,0.1)" }}
            >
              <CheckCircle
                className="h-8 w-8"
                style={{ color: "var(--color-success)" }}
              />
            </div>
            <h2
              className="mb-2 text-2xl font-semibold"
              style={{ color: "var(--color-text)" }}
            >
              Thank you!
            </h2>
            <p
              className="mb-6 text-sm leading-relaxed"
              style={{ color: "var(--color-text-light)" }}
            >
              Your review for{" "}
              <span
                className="font-medium"
                style={{ color: "var(--color-text)" }}
              >
                {doctor.name}
              </span>{" "}
              has been submitted.
            </p>

            <div
              className="mx-auto mb-5 inline-flex items-center gap-4 rounded-xl border px-6 py-3"
              style={{
                borderColor: "var(--color-border)",
                backgroundColor: "var(--color-bg)",
              }}
            >
              <StarRow
                rating={rating}
                hover={0}
                onRate={() => {}}
                onHover={() => {}}
                onLeave={() => {}}
                size={4}
              />
              <div
                className="h-4 w-px"
                style={{ backgroundColor: "var(--color-border)" }}
              />
              <span
                className="text-sm font-medium"
                style={{ color: "var(--color-text)" }}
              >
                {RATING_LABELS[rating]}
              </span>
            </div>

            <p className="text-xs" style={{ color: "var(--color-text-light)" }}>
              <Mail className="inline h-3 w-3 mr-1 -mt-0.5" />
              Your feedback helps other patients make better decisions
            </p>

            <button
              onClick={handleClose}
              className="mt-6 rounded-lg border px-6 py-2 text-xs transition-colors hover:opacity-80"
              style={{
                borderColor: "var(--color-border)",
                color: "var(--color-text-light)",
              }}
            >
              Close
            </button>
          </div>
        ) : (
          <>
            {/* ── Header ────────────────────────────────────────── */}
            <div
              className="flex items-start justify-between px-7 pt-6 pb-5 shrink-0 border-b"
              style={{ borderColor: "var(--color-border)" }}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl shrink-0"
                  style={{ backgroundColor: "rgba(234,179,8,0.1)" }}
                >
                  <Star className="h-5 w-5" style={{ color: "#ca8a04" }} />
                </div>
                <div>
                  <h2
                    className="text-lg font-medium tracking-tight"
                    style={{ color: "var(--color-text)" }}
                  >
                    Share Your Experience
                  </h2>
                  <p
                    className="text-xs mt-0.5 font-light"
                    style={{ color: "var(--color-text-light)" }}
                  >
                    Help others by rating this doctor
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg border transition-colors hover:opacity-80"
                style={{
                  borderColor: "var(--color-border)",
                  color: "var(--color-text-light)",
                }}
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* ── Body ──────────────────────────────────────────── */}
            <div className="flex flex-col gap-5 px-7 py-5 overflow-y-auto flex-1 min-h-0">
              {/* Doctor info */}
              <div
                className="flex items-center gap-4 rounded-xl px-4 py-3"
                style={{
                  backgroundColor: "var(--color-bg)",
                  border: "1px solid var(--color-border)",
                }}
              >
                {doctor.image?.trim() ? (
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-12 h-12 rounded-xl object-cover shrink-0"
                    style={{ border: "1.5px solid var(--color-border)" }}
                  />
                ) : (
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-sm font-semibold"
                    style={{
                      backgroundColor: "var(--color-bg-blue)",
                      color: "var(--color-text-blue)",
                    }}
                  >
                    {doctorInitials}
                  </div>
                )}
                <div>
                  <p
                    className="text-sm font-medium"
                    style={{ color: "var(--color-text)" }}
                  >
                    {doctor.name}
                  </p>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: "var(--color-text-light)" }}
                  >
                    {doctor.specialty}
                  </p>
                </div>
              </div>

              {/* Rating */}
              <div>
                <p
                  className="mb-3 flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest"
                  style={{ color: "var(--color-text-light)" }}
                >
                  <Star className="h-3.5 w-3.5" />
                  Overall rating
                  <span className="text-red-500 normal-case tracking-normal ml-0.5">
                    *
                  </span>
                </p>
                <div className="flex items-center gap-4">
                  <StarRow
                    rating={rating}
                    hover={hover}
                    onRate={setRating}
                    onHover={setHover}
                    onLeave={() => setHover(0)}
                    size={8}
                  />
                  {(hover || rating) > 0 && (
                    <span
                      className="text-sm font-medium"
                      style={{ color: "var(--color-text-light)" }}
                    >
                      {RATING_LABELS[hover || rating]}
                    </span>
                  )}
                </div>
                {rating === 0 && (
                  <p
                    className="text-xs mt-2"
                    style={{ color: "var(--color-text-light)" }}
                  >
                    Click a star to rate
                  </p>
                )}
              </div>

              {/* Comment */}
              <div>
                <p
                  className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest"
                  style={{ color: "var(--color-text-light)" }}
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  Your review
                  <span
                    className="normal-case tracking-normal font-light ml-1"
                    style={{ color: "var(--color-text-light)" }}
                  >
                    (optional)
                  </span>
                </p>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  maxLength={500}
                  placeholder="Share details about your experience. What did you like? What could be improved?"
                  className="w-full resize-none rounded-xl border px-3.5 py-2.5 text-sm font-light outline-none transition-colors"
                  style={{
                    backgroundColor: "var(--color-bg)",
                    borderColor: "var(--color-border)",
                    color: "var(--color-text)",
                  }}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "var(--color-primary)")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = "var(--color-border)")
                  }
                />
                <div className="flex justify-end mt-1">
                  <span
                    className="text-xs"
                    style={{ color: "var(--color-text-light)" }}
                  >
                    {comment.length}/500
                  </span>
                </div>
              </div>

              {/* Recommend checkbox */}
              <label
                className="flex items-center gap-3 rounded-xl px-4 py-3 cursor-pointer"
                style={{
                  backgroundColor: "var(--color-bg-blue)",
                  border: "1px solid var(--color-primary-lighter)",
                }}
              >
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded accent-blue-600"
                />
                <ThumbsUp
                  className="w-4 h-4 shrink-0"
                  style={{ color: "var(--color-primary)" }}
                />
                <span
                  className="text-sm"
                  style={{ color: "var(--color-text)" }}
                >
                  I would recommend this doctor to others
                </span>
              </label>
            </div>

            {/* ── Footer ────────────────────────────────────────── */}
            <div
              className="flex items-center justify-between px-7 py-4 border-t shrink-0"
              style={{ borderColor: "var(--color-border)" }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium shrink-0"
                  style={{
                    backgroundColor: "var(--color-bg-blue)",
                    color: "var(--color-text-blue)",
                  }}
                >
                  {doctorInitials}
                </div>
                <div>
                  <p
                    className="text-xs font-medium"
                    style={{ color: "var(--color-text)" }}
                  >
                    {doctor.name}
                  </p>
                  <p
                    className="text-xs font-light"
                    style={{ color: "var(--color-text-light)" }}
                  >
                    {doctor.specialty}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleClose}
                  disabled={submitting}
                  className="rounded-lg border px-4 py-2 text-xs transition-colors hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    borderColor: "var(--color-border)",
                    color: "var(--color-text-light)",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={rating === 0 || submitting}
                  className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-medium text-white transition-colors min-w-[110px] justify-center disabled:cursor-not-allowed disabled:opacity-50"
                  style={{
                    backgroundColor:
                      rating === 0
                        ? "var(--color-text-light)"
                        : "var(--color-primary)",
                  }}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />{" "}
                      Submitting…
                    </>
                  ) : (
                    <>
                      <Star className="h-3.5 w-3.5" /> Submit Review
                    </>
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
