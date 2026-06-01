import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  Calendar,
  Clock,
  CheckCircle,
  FileText,
  ArrowLeft,
  CreditCard,
} from "lucide-react";
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/store/store";
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
import Error from "@/components/error/Error";
import MiniLoading from "@/components/mini-loading/MiniLoading";
import {
  doctorBookingDetailsState,
  fetchDoctorBookingDetails,
  type DoctorBookingDetailsState,
} from "@/store/slices/patient-slice/doctor-booking-details-slice/doctorBookingDetailsSlice";
import {
  bookAppointmentState,
  fetchBookAppointment,
  type AppointmentBookingState,
} from "@/store/slices/patient-slice/book-appointment-slice/bookAppointmentSlice";
import { toast } from "react-toastify";
import DoctorDetails from "@/components/doctor-details/DoctorDetails";
import { formatTime, parseDate } from "@/lib/utils";

// ─── Helpers ────────────────────────────────────────────────────────────────

function isValidDoctorId(id: string | undefined): id is string {
  if (!id) return false;
  const n = Number(id);
  return Number.isInteger(n) && n > 0;
}

// ─── Section Card wrapper ────────────────────────────────────────────────────

function SectionCard({
  title,
  icon,
  children,
}: {
  title?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-xl border p-6"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      {title && (
        <h2
          className="text-base font-semibold mb-4 flex items-center gap-2"
          style={{ color: "var(--color-text)" }}
        >
          {icon && (
            <span style={{ color: "var(--color-primary)" }}>{icon}</span>
          )}
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}

// ─── Confirmation Screen ─────────────────────────────────────────────────────

function ConfirmationScreen({
  doctorName,
  selectedDate,
  selectedTime,
  paymentMethod,
}: {
  doctorName?: string;
  selectedDate: string;
  selectedTime: string;
  paymentMethod: string;
}) {
  return (
    <div className="flex items-center justify-center py-12 px-4">
      <div
        className="max-w-md w-full rounded-2xl border p-8 text-center"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border)",
        }}
      >
        {/* Icon */}
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: "rgba(22, 163, 74, 0.12)" }}
        >
          <CheckCircle
            className="w-10 h-10"
            style={{ color: "var(--color-success)" }}
          />
        </div>

        <h2
          className="text-2xl font-semibold mb-4"
          style={{ color: "var(--color-text)" }}
        >
          Appointment Confirmed!
        </h2>

        <div className="space-y-1 mb-6">
          <p className="text-sm" style={{ color: "var(--color-text-light)" }}>
            Your appointment with
          </p>
          <p className="text-base font-medium" style={{ color: "var(--color-text)" }}>
            {doctorName || "your doctor"}
          </p>
          <p className="text-sm" style={{ color: "var(--color-text-light)" }}>
            {selectedDate} at {selectedTime}
          </p>
          <p className="text-sm" style={{ color: "var(--color-text-light)" }}>
            Payment:{" "}
            <span className="font-medium" style={{ color: "var(--color-text)" }}>
              {paymentMethod === "Cash" ? "Cash at Clinic" : paymentMethod || "—"}
            </span>
          </p>
        </div>

        {/* Info banner */}
        <div
          className="rounded-lg p-4 border"
          style={{
            backgroundColor: "var(--color-bg-blue)",
            borderColor: "var(--color-primary-lighter)",
          }}
        >
          <p className="text-xs" style={{ color: "var(--color-text-blue)" }}>
            A confirmation email has been sent to your registered email address.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function AppointmentBookingPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const dispatch: AppDispatch = useDispatch();

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [slotId, setSlotId] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [appointmentType, setAppointmentType] = useState("");

  const { role } = useSelector(
    (state: { auth: { role: string } }) => state.auth
  );

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

  const {
    data: doctorDetails,
    loading: loadingDoctorDetails,
    error: errorDoctorDetails,
  } = useSelector(doctorBookingDetailsState) as DoctorBookingDetailsState;

  const {
    loading: loadingBookAppointment,
    error: errorBookAppointment,
  } = useSelector(bookAppointmentState) as AppointmentBookingState;

  // ── Validate id ──
  const validId = isValidDoctorId(id);

  useEffect(() => {
    if (!validId) return;
    dispatch(fetchAvailableDates({ id }));
    dispatch(fetchDoctorBookingDetails({ id }));
  }, [dispatch, id, validId]);

  useEffect(() => {
    if (!validId || !selectedDate) return;
    dispatch(fetchAvailableSlots({ date: selectedDate, id }));
  }, [dispatch, id, selectedDate, validId]);

  const handleBooking = async () => {
    if (!doctorDetails?.doctorId || !slotId) return;
    if (!appointmentType) {
      toast.warn("Please select an appointment type.");
      return;
    }
    if (!paymentMethod) {
      toast.warn("Please select a payment method.");
      return;
    }

    try {
      const resultAction = await dispatch(
        fetchBookAppointment({
          appointmentType,
          paymentMethod,
          doctorId: String(doctorDetails.doctorId),
          scheduleSlotId: String(slotId),
          notes,
        })
      ).unwrap();

      toast.success("Booking successful: " + resultAction.message);
      setShowConfirmation(true);

      setTimeout(() => navigate("/dashboard/patient"), 2000);
    } catch (err) {
      console.error("Booking failed:", err);
      toast.error("Booking failed: " + (err as string));
    }
  };

  // ── Guard: invalid route id ──
  if (!validId) {
    return (
      <DashboardLayout pageTitle="Book Appointment">
        <Error message="Invalid doctor ID. Please check the URL and try again." />
      </DashboardLayout>
    );
  }

  // ── Confirmation screen ──
  if (showConfirmation) {
    const inner = (
      <ConfirmationScreen
        doctorName={doctorDetails?.name}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        paymentMethod={paymentMethod}
      />
    );

    return role === "patient" ? (
      <DashboardLayout pageTitle="Appointment Confirmed">{inner}</DashboardLayout>
    ) : (
      <div className="w-11/12 m-auto">{inner}</div>
    );
  }

  // ── Main form ──
  return (
    <DashboardLayout pageTitle="Book Appointment">
      <div>
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-6 text-sm transition-colors hover:opacity-80"
          style={{ color: "var(--color-text-light)" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Left: Booking Form ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Page header */}
            <SectionCard>
              <h1
                className="text-2xl font-semibold mb-1"
                style={{ color: "var(--color-text)" }}
              >
                Schedule Appointment
              </h1>
              <p className="text-sm" style={{ color: "var(--color-text-light)" }}>
                Book your consultation
                {doctorDetails?.name ? ` with ${doctorDetails.name}` : ""}
              </p>
            </SectionCard>

            {/* Appointment Type */}
            <SectionCard title="Appointment Type">
              <select
                className="w-full p-3 rounded-lg border text-sm outline-none transition-colors"
                style={{
                  backgroundColor: "var(--color-bg)",
                  borderColor: appointmentType
                    ? "var(--color-primary)"
                    : "var(--color-border)",
                  color: appointmentType
                    ? "var(--color-text)"
                    : "var(--color-text-light)",
                }}
                value={appointmentType}
                onChange={(e) => setAppointmentType(e.target.value)}
              >
                <option value="">Select Appointment Type</option>
                <option value="Consultation">Consultation</option>
                <option value="FollowUp">Follow Up</option>
                <option value="Checkup">Checkup</option>
                <option value="Emergency">Emergency</option>
              </select>
            </SectionCard>

            {/* Date Selection */}
            <SectionCard
              title="Select Date"
              icon={<Calendar className="w-4 h-4" />}
            >
              {loadingDates ? (
                <MiniLoading />
              ) : errorDates ? (
                <Error message={errorDates} />
              ) : !availableDates?.length ? (
                <p className="text-sm" style={{ color: "var(--color-text-light)" }}>
                  No available dates.
                </p>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {availableDates.map((slot, index) => {
                    const parsed = parseDate(slot.date);
                    const isSelected = selectedDate === slot.date;
                    return (
                      <button
                        key={index}
                        onClick={() => {
                          setSelectedDate(slot.date);
                          setSelectedTime("");
                          setSlotId("");
                        }}
                        className="p-3 rounded-lg border-2 transition-colors text-center"
                        style={{
                          borderColor: isSelected
                            ? "var(--color-primary)"
                            : "var(--color-border)",
                          backgroundColor: isSelected
                            ? "var(--color-bg-blue)"
                            : "var(--color-bg)",
                        }}
                      >
                        <Calendar
                          className="w-4 h-4 mx-auto mb-1"
                          style={{
                            color: isSelected
                              ? "var(--color-primary)"
                              : "var(--color-text-light)",
                          }}
                        />
                        <p
                          className="text-xs font-medium"
                          style={{
                            color: isSelected
                              ? "var(--color-text-blue)"
                              : "var(--color-text)",
                          }}
                        >
                          {parsed.fullLabel}
                        </p>
                      </button>
                    );
                  })}
                </div>
              )}
            </SectionCard>

            {/* Time Selection — only shown after a date is picked */}
            {selectedDate && (
              <SectionCard
                title="Select Time"
                icon={<Clock className="w-4 h-4" />}
              >
                {loadingSlots ? (
                  <MiniLoading />
                ) : errorSlots ? (
                  <Error message={errorSlots} />
                ) : !availableSlots?.length ? (
                  <p className="text-sm" style={{ color: "var(--color-text-light)" }}>
                    No time slots available for this date.
                  </p>
                ) : (
                  <div className="grid grid-cols-4 gap-3">
                    {availableSlots.map((slot, index) => {
                      const isSelected = selectedTime === slot.startTime;
                      return (
                        <button
                          key={index}
                          onClick={() => {
                            setSelectedTime(slot.startTime);
                            setSlotId(String(slot.id));
                          }}
                          className="p-3 rounded-lg border-2 transition-colors text-center"
                          style={{
                            borderColor: isSelected
                              ? "var(--color-primary)"
                              : "var(--color-border)",
                            backgroundColor: isSelected
                              ? "var(--color-bg-blue)"
                              : "var(--color-bg)",
                          }}
                        >
                          <Clock
                            className="w-4 h-4 mx-auto mb-1"
                            style={{
                              color: isSelected
                                ? "var(--color-primary)"
                                : "var(--color-text-light)",
                            }}
                          />
                          <p
                            className="text-xs font-medium"
                            style={{
                              color: isSelected
                                ? "var(--color-text-blue)"
                                : "var(--color-text)",
                            }}
                          >
                            {formatTime(slot.startTime)}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                )}
              </SectionCard>
            )}

            {/* Notes */}
            <SectionCard
              title="Reason for Visit"
              icon={<FileText className="w-4 h-4" />}
            >
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                maxLength={500}
                className="w-full px-4 py-3 rounded-lg border text-sm resize-none outline-none transition-colors"
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
                placeholder="Describe your symptoms or reason for consultation (optional)..."
              />
              <div className="flex justify-between mt-1">
                <p className="text-xs" style={{ color: "var(--color-text-light)" }}>
                  Helps the doctor prepare for your appointment
                </p>
                <p className="text-xs" style={{ color: "var(--color-text-light)" }}>
                  {notes.length}/500
                </p>
              </div>
            </SectionCard>

            {/* Payment Method */}
            <SectionCard
              title="Payment Method"
              icon={<CreditCard className="w-4 h-4" />}
            >
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full p-3 rounded-lg border text-sm outline-none transition-colors"
                style={{
                  backgroundColor: "var(--color-bg)",
                  borderColor: paymentMethod
                    ? "var(--color-primary)"
                    : "var(--color-border)",
                  color: paymentMethod
                    ? "var(--color-text)"
                    : "var(--color-text-light)",
                }}
              >
                <option value="">Select Payment Method</option>
                <option value="Cash">Cash at Clinic</option>
                <option value="CreditCard">Credit Card</option>
                <option value="VodafoneCash">Vodafone Cash</option>
                <option value="BankTransfer">Bank Transfer</option>
                <option value="Insurance">Insurance</option>
                <option value="OnlinePayment">Online Payment</option>
              </select>
            </SectionCard>
          </div>

          {/* ── Right: Doctor summary + confirm ── */}
          <DoctorDetails
            doctorDetails={doctorDetails}
            loadingDoctorDetails={loadingDoctorDetails}
            errorDoctorDetails={errorDoctorDetails}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            handleBooking={handleBooking}
            paymentMethod={paymentMethod}
            appointmentType={appointmentType}
            loadingBookAppointment={loadingBookAppointment}
            errorBookAppointment={errorBookAppointment}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
