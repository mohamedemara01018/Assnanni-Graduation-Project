import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  Calendar,
  Clock,
  CheckCircle,
  FileText,
  ArrowLeft,
} from "lucide-react";
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/store/store";
import { availableDatesState, fetchAvailableDates, type ScheduleDatesState } from "@/store/slices/patient-slice/available-dates-slice/availableDatesSlice";
import { availableSlotsState, fetchAvailableSlots, type ScheduleSlotsState } from "@/store/slices/patient-slice/available-slots-slice/availableSlotsSlice";
import Error from "@/components/error/Error";
import MiniLoading from "@/components/mini-loading/MiniLoading";
import { doctorBookingDetailsState, fetchDoctorBookingDetails, type DoctorBookingDetailsState } from "@/store/slices/patient-slice/doctor-booking-details-slice/doctorBookingDetailsSlice";
import { bookAppointmentState, fetchBookAppointment, type AppointmentBookingState } from "@/store/slices/patient-slice/book-appointment-slice/bookAppointmentSlice";
import { toast } from "react-toastify";
import DoctorDetails from "@/components/doctor-details/DoctorDetails";





export default function AppointmentBookingPage() {



  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [slotId, setSlotId] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [appointmentType, setAppointmentType] = useState<string>("")
  const { role } = useSelector(
    (state: {
      auth: {
        role: string;
      };
    }) => state.auth,
  );

  const { id } = useParams();
  const dispatch: AppDispatch = useDispatch();

  const { data: availableDates, loading: loadingDates, error: errorDates } = useSelector(availableDatesState) as ScheduleDatesState
  const { data: availableSlots, loading: loadingSlots, error: errorSlots } = useSelector(availableSlotsState) as ScheduleSlotsState
  const { data: doctorDetails, loading: loadingDoctorDetails, error: errorDoctorDetails } = useSelector(doctorBookingDetailsState) as DoctorBookingDetailsState
  const { loading: loadingBookAppointment, error: errorBookAppointment } = useSelector(bookAppointmentState) as AppointmentBookingState

  useEffect(() => {
    dispatch(fetchAvailableDates({ id: String(id) }))
  }, [dispatch, id])

  useEffect(() => {
    if (selectedDate) {
      dispatch(fetchAvailableSlots({ date: selectedDate, id: String(id) }));
    }
  }, [dispatch, id, selectedDate]);

  useEffect(() => {
    dispatch(fetchDoctorBookingDetails({ id: String(id) }))
  }, [dispatch, id])


  const handleBooking = async () => {
    if (!doctorDetails?.doctorId || !slotId) return;

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
      toast.error("Booking Successd:" + resultAction.message)
      setShowConfirmation(true);

      setTimeout(() => {
        navigate("/dashboard/patient");
      }, 2000);
    } catch (err) {
      console.error("Booking failed:", err);
      toast.error("Booking failed:" + err)
    }
  };

  if (showConfirmation) {
    if (role === "patient") {
      return (
        <DashboardLayout pageTitle="Appointment Confirmed">
          <div className="flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 text-center">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl text-gray-900 dark:text-white mb-4">
                Appointment Confirmed!
              </h2>
              <div className="space-y-2 mb-6">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your appointment with
                </p>
                <p className="text-base text-gray-900 dark:text-white font-medium">
                  {doctorDetails?.name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedDate} at {selectedTime}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Payment:{" "}
                  <span className="font-medium">
                    {paymentMethod === "cash"
                      ? "Cash at Clinic"
                      : "Online Payment"}
                  </span>
                </p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-xs text-blue-700 dark:text-blue-400">
                  A confirmation email has been sent to your registered email
                  address.
                </p>
              </div>
            </div>
          </div>
        </DashboardLayout>
      );
    } else {
      return (
        <div className="w-11/12 m-auto">
          <div className="flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 text-center">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl text-gray-900 dark:text-white mb-4">
                Appointment Confirmed!
              </h2>
              <div className="space-y-2 mb-6">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your appointment with
                </p>
                <p className="text-base text-gray-900 dark:text-white font-medium">
                  {doctorDetails?.name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedDate} at {selectedTime}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Payment:{" "}
                  <span className="font-medium">
                    {paymentMethod === "cash"
                      ? "Cash at Clinic"
                      : "Online Payment"}
                  </span>
                </p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-xs text-blue-700 dark:text-blue-400">
                  A confirmation email has been sent to your registered email
                  address.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }


  return (
    <DashboardLayout pageTitle="Book Appointment">
      <div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Back</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Booking Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h1 className="text-2xl text-gray-900 dark:text-white mb-2">
                Schedule Appointment
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Book your consultation with {doctorDetails?.name}
              </p>
            </div>

            {/* Appointment Type */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-base text-gray-900 dark:text-white font-medium mb-4">
                Appointment Type
              </h2>

              <div className="grid grid-cols-1 gap-4">
                <select
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  value={appointmentType}
                  onChange={(e) => setAppointmentType(e.target.value)}
                >
                  <option value="">Select Appointment Type</option>
                  <option value="Consultation">Consultation</option>
                  <option value="FollowUp">Follow Up</option>
                  <option value="Checkup">Checkup</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </div>
            </div>

            {/* Date Selection */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-base text-gray-900 dark:text-white font-medium mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                Select Date
              </h2>
              <div className={`grid  gap-3 ${loadingDates || errorDates ? 'grid-cols-1' : 'grid-cols-3'}`}>
                {loadingDates ? <MiniLoading />
                  : errorDates ? <Error message={errorDates} /> :

                    availableDates && availableDates?.map((slot, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSelectedDate(slot.date);
                          setSelectedTime("");
                        }}
                        className={`p-3 rounded-lg border-2 transition-colors ${selectedDate === slot.date
                          ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                          : "border-gray-200 dark:border-gray-600 hover:border-blue-400"
                          }`}
                      >
                        <Calendar className="w-5 h-5 mx-auto mb-2 text-gray-600 dark:text-gray-400" />
                        <p className="text-xs text-gray-900 dark:text-white font-medium">
                          {slot.date}
                        </p>
                      </button>
                    ))}
              </div>
            </div>

            {/* Time Selection */}
            {selectedDate && (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-base text-gray-900 dark:text-white font-medium mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                  Select Time
                </h2>
                <div className={`grid  gap-3 ${loadingSlots || errorSlots ? 'grid-cols-1' : 'grid-cols-4'}`}>
                  {loadingSlots ? <MiniLoading />
                    : errorSlots ? <Error message={errorSlots} /> :
                      availableSlots && availableSlots.map((slot, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setSelectedTime(slot.startTime);
                            setSlotId(String(slot.id));
                          }}
                          className={`p-3 rounded-lg border-2 transition-colors ${selectedTime === slot.startTime
                            ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                            : "border-gray-200 dark:border-gray-600 hover:border-blue-400"
                            }`}
                        >
                          <Clock className="w-4 h-4 mx-auto mb-1 text-gray-600 dark:text-gray-400" />
                          <p className="text-xs text-gray-900 dark:text-white font-medium">
                            {slot.startTime}
                          </p>
                        </button>
                      ))}
                </div>
              </div>
            )}

            {/* Reason for Visit */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-base text-gray-900 dark:text-white font-medium mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                Reason for Visit
              </h2>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400"
                placeholder="Describe your symptoms or reason for consultation (optional)..."
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                This information helps the doctor prepare for your appointment
              </p>
            </div>

            {/* Payment Method */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Select Payment Method</option>
                <option value="Cash">Cash</option>
                <option value="CreditCard">CreditCard</option>
                <option value="VodafoneCash">VodafoneCash</option>
                <option value="BankTransfer">BankTransfer</option>
                <option value="Insurance">Insurance</option>
                <option value="OnlinePayment">OnlinePayment</option>
              </select>
            </div>
          </div>

          {/* Sidebar - Doctor & Clinic Info */}
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

