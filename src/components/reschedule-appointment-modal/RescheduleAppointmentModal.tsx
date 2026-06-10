import { useState, useEffect } from "react";
import {
  X,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  MessageSquare,
  Info,
  CalendarCheck,
  Mail,
  RefreshCw,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import {
  availableDatesState,
  fetchAvailableDates,
  type ScheduleDatesState,
} from "@/store/slices/patient-slice/available-dates-slice/availableDatesSlice";
import {
  availableSlotsState,
  fetchAvailableSlots,
  type ScheduleSlotsState,
} from "@/store/slices/patient-slice/available-slots-slice/availableSlotsSlice";
import {
  fetchRescheduleAppointment,
  clearRescheduleState,
  rescheduleAppointmentState,
} from "@/store/slices/patient-slice/reschedule-appointment-slice/rescheduleAppointmentSlice";
import type { AppDispatch } from "@/store/store";

interface RescheduleAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  appointment: {
    id: string;
    doctorId: string;
    date: string;
    time: string;
    doctorName: string;
    doctorInitials?: string;
    doctorSpecialty?: string;
    doctorImage?: string;
  };
  id: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function parseDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return {
    day: d.toLocaleDateString("en-US", { weekday: "short" }),
    dateNum: d.getDate(),
    monthLabel: d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    fullLabel: d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    iso,
  };
}

function formatTime(t: string) {
  const [h, m] = t.split(":").map(Number);
  const ampm = h < 12 ? "AM" : "PM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${ampm}`;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function RescheduleAppointmentModal({
  isOpen,
  onClose,
  onSuccess,
  appointment,
}: RescheduleAppointmentModalProps) {
  const dispatch = useDispatch<AppDispatch>();

  const {
    data: availableDates,
    loading: loadingDates,
    error: errorDates,
  } = useSelector(availableDatesState) as ScheduleDatesState;
  const {
    data: availableSlots,
    loading: loadingSlots,
    error: errorSlots,
  } = useSelector(availableSlotsState) as ScheduleSlotsState;
  const { loading: submitting } = useSelector(rescheduleAppointmentState);

  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
  const [reason, setReason] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  // Fetch available dates when the modal opens
  useEffect(() => {
    if (isOpen) {
      dispatch(fetchAvailableDates({ id: String(appointment.doctorId) }));
    }
  }, [appointment.doctorId, dispatch, isOpen]);

  // Fetch time slots whenever a date is selected
  useEffect(() => {
    if (selectedDate) {
      dispatch(
        fetchAvailableSlots({
          date: selectedDate,
          id: String(appointment.doctorId),
        }),
      );
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedSlotId(null);
    }
  }, [appointment.doctorId, dispatch, selectedDate]);

  // Clean up reschedule state on unmount
  useEffect(() => {
    return () => {
      dispatch(clearRescheduleState());
    };
  }, [dispatch]);

  const doctorInitials =
    appointment.doctorInitials ??
    appointment.doctorName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  const selectedSlot =
    availableSlots.find((s) => s.id === selectedSlotId) ?? null;
  const selectedDateParsed = selectedDate ? parseDate(selectedDate) : null;

  const handleConfirm = async () => {
    if (!selectedSlotId) return;
    const result = await dispatch(
      fetchRescheduleAppointment({
        appointmentId: appointment.id,
        newSlotId: String(selectedSlotId),
        reason,
      }),
    );

    if (fetchRescheduleAppointment.fulfilled.match(result)) {
      setShowSuccess(true);
      onSuccess();
    } else {
      const errMsg =
        typeof result.payload === "string"
          ? result.payload
          : "Failed to reschedule. Please try again.";
      toast.error(errMsg);
    }
  };

  const handleClose = () => {
    setSelectedDate("");
    setSelectedSlotId(null);
    setReason("");
    setShowSuccess(false);
    dispatch(clearRescheduleState());
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
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-50 dark:bg-green-900/30">
              <CalendarCheck className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="mb-2 text-2xl font-serif text-gray-900 dark:text-white">
              All set!
            </h2>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 font-light leading-relaxed">
              Your appointment has been rescheduled.
              <br />
              We'll see you soon.
            </p>
            <div className="mx-auto mb-5 inline-flex items-center gap-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 px-6 py-3">
              <span className="text-sm text-gray-900 dark:text-white">
                {selectedDateParsed?.fullLabel}
              </span>
              <div className="h-4 w-px bg-gray-200 dark:bg-gray-700" />
              <span className="text-sm text-gray-900 dark:text-white">
                {selectedSlot ? formatTime(selectedSlot.startTime) : ""}
              </span>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 font-light">
              <Mail className="inline h-3 w-3 mr-1 -mt-0.5" />
              Confirmation sent to your email
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
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/30 shrink-0">
                  <RefreshCw className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white tracking-tight">
                    Reschedule
                  </h2>
                  <p className="text-xs text-gray-400 dark:text-gray-500 font-light mt-0.5">
                    Select a new date and time for your visit
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
              {/* Current appointment */}
              <div className="flex items-start gap-2.5 rounded-xl bg-amber-50 dark:bg-amber-900/20 px-4 py-3">
                <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-medium tracking-widest uppercase text-amber-700 dark:text-amber-400 mb-1.5">
                    Current appointment
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <span className="flex items-center gap-1 rounded-md border border-amber-200 dark:border-amber-800 bg-amber-100/60 dark:bg-amber-900/30 px-2.5 py-1 text-xs text-amber-800 dark:text-amber-300">
                      <Calendar className="h-3 w-3" />
                      {appointment.date}
                    </span>
                    <span className="flex items-center gap-1 rounded-md border border-amber-200 dark:border-amber-800 bg-amber-100/60 dark:bg-amber-900/30 px-2.5 py-1 text-xs text-amber-800 dark:text-amber-300">
                      <Clock className="h-3 w-3" />
                      {appointment.time}
                    </span>
                  </div>
                </div>
              </div>

              {/* Date selection */}
              <div>
                <p className="mb-2.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-gray-400 dark:text-gray-500">
                  <Calendar className="h-3.5 w-3.5" />
                  New date
                </p>

                {loadingDates ? (
                  <div className="flex items-center justify-center gap-2 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 py-5">
                    <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                    <span className="text-xs text-gray-400">
                      Loading available dates…
                    </span>
                  </div>
                ) : errorDates ? (
                  <div className="flex items-center gap-2 rounded-xl border border-red-100 dark:border-red-900/40 bg-red-50 dark:bg-red-900/20 px-4 py-3">
                    <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
                    <p className="text-xs text-red-600 dark:text-red-400">
                      {errorDates}
                    </p>
                  </div>
                ) : (
                  <div
                    className={`grid ${availableDates.length <= 0 ? "grid-cols-1" : "grid-cols-6"} gap-2`}
                  >
                    {availableDates.length === 0 ? (
                      <div className="flex items-center gap-2 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 px-4 py-3">
                        <Info className="h-4 w-4 text-gray-400 shrink-0" />
                        <p className="text-xs text-gray-400">
                          No dates available for this doctor.
                        </p>
                      </div>
                    ) : (
                      availableDates.map((d) => {
                        const parsed = parseDate(d.date);
                        const isSelected = selectedDate === d.date;
                        return (
                          <button
                            key={d.date}
                            onClick={() => setSelectedDate(d.date)}
                            className={`rounded-xl border px-1.5 py-2.5 text-center transition-all ${
                              isSelected
                                ? "border-blue-600 bg-blue-600"
                                : "border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600"
                            }`}
                          >
                            <p
                              className={`text-[9px] font-medium uppercase tracking-wider mb-1 ${isSelected ? "text-blue-200" : "text-gray-400 dark:text-gray-500"}`}
                            >
                              {parsed.day}
                            </p>
                            <p
                              className={`text-lg font-serif leading-none mb-1 ${isSelected ? "text-white" : "text-gray-900 dark:text-white"}`}
                            >
                              {parsed.dateNum}
                            </p>
                            <p
                              className={`text-[9px] ${isSelected ? "text-blue-200" : "text-gray-400 dark:text-gray-500"}`}
                            >
                              {parsed.monthLabel.split(" ")[0]}
                            </p>
                          </button>
                        );
                      })
                    )}
                  </div>
                )}
              </div>

              {/* Time slot selection */}
              {selectedDate && (
                <div className="animate-in fade-in slide-in-from-bottom-1 duration-200">
                  <p className="mb-2.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-gray-400 dark:text-gray-500">
                    <Clock className="h-3.5 w-3.5" />
                    Available times
                  </p>

                  {loadingSlots ? (
                    <div className="flex items-center justify-center gap-2 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 py-5">
                      <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                      <span className="text-xs text-gray-400">
                        Loading time slots…
                      </span>
                    </div>
                  ) : errorSlots ? (
                    <div className="flex items-center gap-2 rounded-xl border border-red-100 dark:border-red-900/40 bg-red-50 dark:bg-red-900/20 px-4 py-3">
                      <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
                      <p className="text-xs text-red-600 dark:text-red-400">
                        {errorSlots}
                      </p>
                    </div>
                  ) : availableSlots.length === 0 ? (
                    <div className="flex items-center gap-2 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 px-4 py-3">
                      <Info className="h-4 w-4 text-gray-400 shrink-0" />
                      <p className="text-xs text-gray-400">
                        No slots available for this date.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 gap-1.5">
                      {availableSlots.map((slot) => {
                        const isSelected = selectedSlotId === slot.id;
                        return (
                          <button
                            key={slot.id}
                            onClick={() => setSelectedSlotId(slot.id)}
                            className={`rounded-lg border py-2 text-xs transition-all ${
                              isSelected
                                ? "border-blue-600 bg-blue-600 text-white font-medium"
                                : "border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                            }`}
                          >
                            <span className="block">
                              {formatTime(slot.startTime)}
                            </span>
                            <span
                              className={`block text-[9px] mt-0.5 ${isSelected ? "text-blue-200" : "text-gray-400 dark:text-gray-500"}`}
                            >
                              – {formatTime(slot.endTime)}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Summary */}
              {selectedDate && selectedSlot && (
                <div className="flex items-center gap-3 rounded-xl border border-green-200 dark:border-green-900/50 bg-green-50 dark:bg-green-900/20 px-4 py-3 animate-in fade-in slide-in-from-bottom-1 duration-200">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0" />
                  <div>
                    <p className="text-xs font-medium uppercase tracking-widest text-green-700 dark:text-green-400 mb-0.5">
                      New appointment
                    </p>
                    <p className="text-sm text-green-900 dark:text-green-300">
                      {selectedDateParsed?.fullLabel} ·{" "}
                      {formatTime(selectedSlot.startTime)}
                    </p>
                  </div>
                </div>
              )}

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
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={2}
                  placeholder="e.g. Travel conflict, work commitment…"
                  className="w-full resize-none rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-600 outline-none focus:border-blue-500 transition-colors font-light"
                />
              </div>

              {/* Policy */}
              <div className="flex items-start gap-2 px-0.5">
                <Info className="h-3.5 w-3.5 text-gray-300 dark:text-gray-600 mt-0.5 shrink-0" />
                <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed font-light">
                  Rescheduling is available up to 24 hours before your
                  appointment. A confirmation will be sent to your email once
                  confirmed.
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
                  disabled={submitting}
                  className="rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-2 text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={!selectedDate || !selectedSlot || submitting}
                  className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-700 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-300 dark:disabled:text-gray-600 disabled:cursor-not-allowed transition-colors min-w-[90px] justify-center"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving…
                    </>
                  ) : (
                    <>
                      <CalendarCheck className="h-3.5 w-3.5" /> Confirm
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
