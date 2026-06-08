import { useMemo, useState } from "react";
import Cookies from "js-cookie";
import {
  X,
  Calendar,
  Clock,
  AlertTriangle,
  MessageSquare,
  Info,
  Mail,
  Loader2,
  AlertCircle,
  XCircle,
  Ban,
} from "lucide-react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import { useForm } from "react-hook-form";
import type { RootState } from "@/store/store";

interface CancelAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;

  appointment: {
    id: string;
    date: string;
    time: string;
    doctorName: string;
    doctorInitials?: string;
    doctorSpecialty?: string;
    doctorImage?: string;
  };
}

export function CancelAppointmentModal({
  isOpen,
  onClose,
  onSuccess,
  appointment,
}: CancelAppointmentModalProps) {
  const backendUrl = useSelector((state: RootState) => state.config.backendUrl);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<{ reason: string }>({
    defaultValues: { reason: "" },
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const role = useSelector((state: any) => state.auth.role);
  const appointmentIdNumber = useMemo(() => {
    const parsed = Number(appointment.id);
    return Number.isFinite(parsed) ? parsed : 0;
  }, [appointment.id]);

  const doctorInitials =
    appointment.doctorInitials ??
    appointment.doctorName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  const token = Cookies.get("jwtToken");
  const handleConfirm = async (values: { reason: string }) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      role === "doctor"
        ? await axios.post(
            `${backendUrl}Doctors/cancel-appointment`,
            {
              appointmentId: appointmentIdNumber,
              reason: values.reason,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          )
        : await axios.put(
            `${backendUrl}Patient/cancel-my-appointment`,
            {
              appointmentId: appointmentIdNumber,
              reason: values.reason,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

      toast.success("Appointment cancelled successfully.");
      setShowSuccess(true);
      onSuccess();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to cancel appointment. Please try again.",
      );
    }
  };

  const handleClose = () => {
    reset({ reason: "" });
    setShowSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(10,14,20,0.72)" }}
    >
      <div className="relative w-full max-w-lg flex flex-col rounded-2xl bg-white dark:bg-gray-900 shadow-2xl border border-gray-100 dark:border-gray-800 max-h-[90vh]">
        {showSuccess ? (
          // ── Success state ──────────────────────────────────────────
          <div className="px-8 py-12 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/30">
              <XCircle className="h-8 w-8 text-red-500 dark:text-red-400" />
            </div>
            <h2 className="mb-2 text-2xl font-serif text-gray-900 dark:text-white">
              Appointment Cancelled
            </h2>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 font-light leading-relaxed">
              Your appointment has been successfully cancelled.
              <br />
              We hope to see you again soon.
            </p>
            <div className="mx-auto mb-5 inline-flex items-center gap-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 px-6 py-3">
              <span className="text-sm text-gray-900 dark:text-white">
                {appointment.date}
              </span>
              <div className="h-4 w-px bg-gray-200 dark:bg-gray-700" />
              <span className="text-sm text-gray-900 dark:text-white">
                {appointment.time}
              </span>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 font-light">
              <Mail className="inline h-3 w-3 mr-1 -mt-0.5" />
              Cancellation confirmation sent to your email
            </p>
            <button
              onClick={handleClose}
              className="mt-6 rounded-lg border border-gray-200 dark:border-gray-700 px-6 py-2 text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            {/* ── Header ─────────────────────────────────────────── */}
            <div className="flex items-start justify-between px-7 pt-6 pb-5 border-b border-gray-100 dark:border-gray-800 shrink-0">
              <div className="flex items-center gap-3.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 dark:bg-red-900/30 shrink-0">
                  <Ban className="h-5 w-5 text-red-500 dark:text-red-400" />
                </div>
                <div>
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white tracking-tight">
                    Cancel Appointment
                  </h2>
                  <p className="text-xs text-gray-400 dark:text-gray-500 font-light mt-0.5">
                    This action cannot be undone
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* ── Body (scrollable) ───────────────────────────────── */}
            <div className="flex flex-col gap-5 px-7 py-5 overflow-y-auto flex-1 min-h-0">
              {/* Warning banner */}
              <div className="flex items-start gap-2.5 rounded-xl bg-red-50 dark:bg-red-900/20 px-4 py-3">
                <AlertTriangle className="h-4 w-4 text-red-500 dark:text-red-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-medium tracking-widest uppercase text-red-700 dark:text-red-400 mb-1">
                    Are you sure?
                  </p>
                  <p className="text-xs text-red-600 dark:text-red-400 font-light leading-relaxed">
                    You are about to cancel the following appointment. This
                    action is permanent and cannot be undone.
                  </p>
                </div>
              </div>

              {/* Appointment details */}
              <div className="flex items-start gap-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 px-4 py-3.5 border border-gray-100 dark:border-gray-800">
                <AlertCircle className="h-4 w-4 text-gray-400 dark:text-gray-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-medium tracking-widest uppercase text-gray-400 dark:text-gray-500 mb-1.5">
                    Appointment to cancel
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <span className="flex items-center gap-1 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2.5 py-1 text-xs text-gray-700 dark:text-gray-300">
                      <Calendar className="h-3 w-3 text-gray-400" />
                      {appointment.date}
                    </span>
                    <span className="flex items-center gap-1 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2.5 py-1 text-xs text-gray-700 dark:text-gray-300">
                      <Clock className="h-3 w-3 text-gray-400" />
                      {appointment.time}
                    </span>
                  </div>
                </div>
              </div>

              {/* Reason */}
              <div>
                <p className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-gray-400 dark:text-gray-500">
                  <MessageSquare className="h-3.5 w-3.5" />
                  Reason
                  <span className="normal-case tracking-normal font-light text-gray-300 dark:text-gray-600 ml-1">
                    (optional)
                  </span>
                </p>
                <textarea
                  rows={3}
                  placeholder="e.g. Feeling better, schedule conflict, personal reasons…"
                  className="w-full resize-none rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-600 outline-none focus:border-red-400 transition-colors font-light"
                  {...register("reason")}
                />
              </div>

              {/* Policy note */}
              <div className="flex items-start gap-2 px-0.5">
                <Info className="h-3.5 w-3.5 text-gray-300 dark:text-gray-600 mt-0.5 shrink-0" />
                <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed font-light">
                  Cancellations must be made at least 24 hours before your
                  appointment. A confirmation will be sent to your email once
                  cancelled.
                </p>
              </div>
            </div>

            {/* ── Footer (pinned) ─────────────────────────────────── */}
            <div className="flex items-center justify-between px-7 py-4 border-t border-gray-100 dark:border-gray-800 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/30 text-xs font-medium text-blue-600 dark:text-blue-400">
                  {doctorInitials}
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-900 dark:text-white">
                    {appointment.doctorName}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 font-light">
                    {appointment.doctorSpecialty ?? "General Practice"}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-2 text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Keep Appointment
                </button>
                <button
                  onClick={handleSubmit(handleConfirm)}
                  disabled={isSubmitting}
                  className="flex items-center gap-1.5 rounded-lg bg-red-500 px-4 py-2 text-xs font-medium text-white hover:bg-red-600 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-300 dark:disabled:text-gray-600 disabled:cursor-not-allowed transition-colors min-w-[130px] justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />{" "}
                      Cancelling…
                    </>
                  ) : (
                    <>
                      <XCircle className="h-3.5 w-3.5" /> Cancel Appointment
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
