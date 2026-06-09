import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Calendar, Clock, FileText, ArrowLeft, CreditCard } from "lucide-react";
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import axios from "axios";
import Cookies from "js-cookie";
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
import ErrorDisplay from "@/components/error/Error";
import MiniLoading from "@/components/mini-loading/MiniLoading";
import {
  doctorBookingDetailsState,
  fetchDoctorBookingDetails,
  type DoctorBookingDetailsState,
} from "@/store/slices/patient-slice/doctor-booking-details-slice/doctorBookingDetailsSlice";
import {
  bookAppointmentState,
  fetchBookAppointment,
  type AppointmentBookingResponse,
  type AppointmentBookingState,
} from "@/store/slices/patient-slice/book-appointment-slice/bookAppointmentSlice";
import { toast } from "react-toastify";
import DoctorDetails from "@/components/doctor-details/DoctorDetails";
import { formatTime, parseDate } from "@/lib/utils";
import ConfirmationModal from "@/components/confirmation-modal/ConfirmationModal";

// ─── Helpers ────────────────────────────────────────────────────────────────

function isValidDoctorId(id: string | undefined): id is string {
  if (!id) return false;
  const n = Number(id);
  return Number.isInteger(n) && n > 0;
}

interface CreatePaymentPayload {
  appointmentId: number;
  patientId: number;
  amount: number;
  currency: string;
  idempotencyKey: string;
  createdBy: string;
}

interface PaymentCreateResponse {
  clientSecret: string;
  paymentId: string;
  message?: string;
  success?: boolean;
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

// ─── Confirmation Modal ──────────────────────────────────────────────────────

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
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const backendUrl = useSelector((state: RootState) => state.config.backendUrl);
  const {
    role,
    id: userId,
    name,
    email,
  } = useSelector((state: RootState) => state.auth);

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

  const { loading: loadingBookAppointment, error: errorBookAppointment } =
    useSelector(bookAppointmentState) as AppointmentBookingState;

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

  const startStripePayment = async (
    booking: AppointmentBookingResponse,
  ): Promise<void> => {
    const token = Cookies.get("jwtToken");
    if (!token) {
      throw new Error("Unauthorized: missing token");
    }

    const amount = doctorDetails?.consultationFee;
    if (!amount || amount <= 0) {
      throw new Error("Invalid consultation fee for this doctor");
    }

    const paymentPayload: CreatePaymentPayload = {
      appointmentId: booking.appointmentId,
      patientId: booking.patientId,
      amount,
      currency: "USD",
      idempotencyKey: crypto.randomUUID(),
      createdBy: userId || name || email || role || "patient",
    };

    const response = await axios.post<PaymentCreateResponse>(
      `${backendUrl}payments/create`,
      paymentPayload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    const { clientSecret, paymentId } = response.data;
    if (!clientSecret) {
      throw new Error("No clientSecret received from payment API");
    }

    // Navigate to the Stripe payment page with the clientSecret
    const params = new URLSearchParams({
      clientSecret,
      paymentId,
      amount: String(amount),
      appointmentId: String(booking.appointmentId),
    });
    navigate(`/online-payment?${params.toString()}`);
  };

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
      const booking = await dispatch(
        fetchBookAppointment({
          appointmentType,
          paymentMethod,
          doctorId: String(doctorDetails.doctorId),
          scheduleSlotId: String(slotId),
          notes,
        }),
      ).unwrap();

      if (paymentMethod === "OnlinePayment") {
        setIsProcessingPayment(true);
        toast.info("Redirecting to secure payment page...");
        await startStripePayment(booking);
        return;
      }

      toast.success("Booking successful: " + booking.message);
      setShowConfirmation(true);
    } catch (err) {
      console.error("Booking failed:", err);
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : (err as Error)?.message || String(err);
      toast.error("Booking failed: " + message);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
    setTimeout(() => navigate("/dashboard/patient"), 100);
  };

  if (!validId) {
    return (
      <DashboardLayout pageTitle="Book Appointment">
        <ErrorDisplay message="Invalid doctor ID. Please check the URL and try again." />
      </DashboardLayout>
    );
  }

  const pageContent = (
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
              <ErrorDisplay message={errorDates} />
            ) : !availableDates?.length ? (
              <p
                className="text-sm"
                style={{ color: "var(--color-text-light)" }}
              >
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

          {/* Time Selection */}
          {selectedDate && (
            <SectionCard
              title="Select Time"
              icon={<Clock className="w-4 h-4" />}
            >
              {loadingSlots ? (
                <MiniLoading />
              ) : errorSlots ? (
                <ErrorDisplay message={errorSlots} />
              ) : !availableSlots?.length ? (
                <p
                  className="text-sm"
                  style={{ color: "var(--color-text-light)" }}
                >
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
              <p
                className="text-xs"
                style={{ color: "var(--color-text-light)" }}
              >
                Helps the doctor prepare for your appointment
              </p>
              <p
                className="text-xs"
                style={{ color: "var(--color-text-light)" }}
              >
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
          loadingBookAppointment={loadingBookAppointment || isProcessingPayment}
          errorBookAppointment={errorBookAppointment}
        />
      </div>

      {/* ── Confirmation Modal ── */}
      {showConfirmation && (
        <ConfirmationModal
          doctorName={doctorDetails?.name}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          paymentMethod={paymentMethod}
          appointmentType={appointmentType}
          onClose={handleConfirmationClose}
        />
      )}
    </div>
  );

  return role === "patient" ? (
    <DashboardLayout pageTitle="Book Appointment">
      {pageContent}
    </DashboardLayout>
  ) : (
    <div className="w-11/12 m-auto">{pageContent}</div>
  );
}
