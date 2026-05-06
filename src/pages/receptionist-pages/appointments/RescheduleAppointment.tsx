import { useState, useMemo } from "react";
import { useParams, NavLink, useNavigate } from "react-router";
import { BsCalendar3, BsClock, BsFillPersonFill } from "react-icons/bs";
import { FaArrowLeft } from "react-icons/fa6";
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import Cookies from "js-cookie";

interface AppointmentSummary {
  patientName: string;
  doctorName: string | null;
  currentDate: string;
  currentTime: string;
}

interface AvailableSlot {
  id: number;
  startTime: string;
  endTime: string;
}

interface ReschedulePayload {
  appointmentId: number;
  newDate: string;
  newSlotId: number;
}

const RescheduleAppointment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const backendUrl = useSelector((state: RootState) => state.config.backendUrl);
  const token = Cookies.get("jwtToken");

  const [newDate, setNewDate] = useState("");
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);

  // 1. Fetch Current Appointment Details
  const { data: summary, isLoading: isLoadingSummary } =
    useQuery<AppointmentSummary>({
      queryKey: ["appointmentSummary", id],
      queryFn: async () => {
        const response = await axios.get(
          `${backendUrl}Receptionist/schedule-appointment/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        return response.data.data;
      },
      enabled: !!id && !!token,
    });

  // 2. Fetch Available Slots for selected date
  const formattedDateForSlots = useMemo(() => {
    if (!newDate) return "";
    const date = new Date(newDate);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  }, [newDate]);

  const { data: availableSlots, isLoading: isLoadingSlots } = useQuery<
    AvailableSlot[]
  >({
    queryKey: ["availableSlots", formattedDateForSlots],
    queryFn: async () => {
      const response = await axios.get(
        `${backendUrl}Receptionist/available-slots?date=${formattedDateForSlots}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.data;
    },
    enabled: !!formattedDateForSlots && !!token,
  });

  // 3. Reschedule Mutation
  const rescheduleMutation = useMutation({
    mutationFn: async (payload: ReschedulePayload) => {
      const response = await axios.put(
        `${backendUrl}Receptionist/reschedule-appointment`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Appointment rescheduled successfully!");
      queryClient.invalidateQueries({ queryKey: ["studentAppointments"] });
      queryClient.invalidateQueries({ queryKey: ["appointmentDetails", id] });
      navigate("/doctor-appointments");
    },
    onError: (err: any) => {
      toast.error(
        err.response?.data?.message || "Failed to reschedule appointment"
      );
    },
  });

  const handleReschedule = () => {
    if (!id || !newDate || selectedSlotId === null) return;

    rescheduleMutation.mutate({
      appointmentId: Number(id),
      newDate: newDate,
      newSlotId: selectedSlotId,
    });
  };

  const formatTime = (time: string) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const h = parseInt(hours);
    const ampm = h >= 12 ? "PM" : "AM";
    const hour12 = h % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  return (
    <DashboardLayout pageTitle="Reschedule Appointment">
      <div className="-mt-6 bg-(--color-bg) min-h-screen p-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-(--color-text-light) mb-8 font-medium">
          <NavLink to="/receptionist" className="hover:text-blue-600">
            Dashboard
          </NavLink>
          <span>/</span>
          <NavLink to="/doctor-appointments" className="hover:text-blue-600">
            Appointments
          </NavLink>
          <span>/</span>
          <span className="text-(--color-text)">Reschedule</span>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-(--color-text-light) hover:text-(--color-text) transition-colors mb-8 font-medium cursor-pointer"
        >
          <FaArrowLeft />
          Back
        </button>

        <div className="max-w-4xl grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-(--color-surface) p-8 rounded-2xl border border-(--color-border) shadow-sm">
              <h2 className="text-xl font-bold text-(--color-text) mb-8 flex items-center gap-3">
                <BsCalendar3 className="text-blue-500" />
                Select New Schedule
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-(--color-text-light) mb-2">
                    New Date
                  </label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => {
                      setNewDate(e.target.value);
                      setSelectedSlotId(null);
                    }}
                    className="w-full p-4 bg-gray-50/50 dark:bg-gray-800/20 border border-(--color-border) rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-(--color-text-light) mb-2">
                    Available Slots
                  </label>
                  {isLoadingSlots ? (
                    <div className="flex items-center gap-2 text-sm text-gray-500 py-4">
                      <div className="w-4 h-4 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
                      Checking availability...
                    </div>
                  ) : !newDate ? (
                    <p className="text-sm text-gray-400 py-4 italic">
                      Please select a date to see available slots
                    </p>
                  ) : availableSlots && availableSlots.length > 0 ? (
                    <div className="grid grid-cols-3 gap-3">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot.id}
                          onClick={() => setSelectedSlotId(slot.id)}
                          className={`py-3 px-2 rounded-xl border text-sm font-bold transition-all ${
                            selectedSlotId === slot.id
                              ? "bg-blue-600 text-white border-blue-600 shadow-md scale-[1.02]"
                              : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-blue-500 hover:text-blue-500"
                          }`}
                        >
                          {formatTime(slot.startTime)}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-red-500 py-4 font-medium">
                      No available slots for this date
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                disabled={
                  !newDate ||
                  selectedSlotId === null ||
                  rescheduleMutation.isPending
                }
                onClick={handleReschedule}
                className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-bold rounded-2xl transition-all shadow-lg hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {rescheduleMutation.isPending ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  "Confirm Reschedule"
                )}
              </button>
              <button
                onClick={() => navigate(-1)}
                className="flex-1 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-bold rounded-2xl transition-all hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>

          {/* Appointment Info Sidebar */}
          <div className="space-y-6">
            <div className="bg-(--color-surface) p-6 rounded-2xl border border-(--color-border) shadow-sm">
              <h3 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-6">
                Current Details
              </h3>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 border border-blue-100">
                    <BsFillPersonFill size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-(--color-text-light) font-medium">
                      Patient
                    </p>
                    <p className="text-sm font-bold text-(--color-text)">
                      {isLoadingSummary ? "..." : summary?.patientName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 border border-emerald-100">
                    <BsClock size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-(--color-text-light) font-medium">
                      Doctor
                    </p>
                    <p className="text-sm font-bold text-(--color-text)">
                      {isLoadingSummary
                        ? "..."
                        : summary?.doctorName || "Not Assigned"}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-(--color-border)">
                  <p className="text-xs text-(--color-text-light) font-medium mb-2">
                    Original Schedule
                  </p>
                  <p className="text-sm font-bold text-(--color-text)">
                    {isLoadingSummary ? "..." : summary?.currentDate}
                  </p>
                  <p className="text-sm font-medium text-(--color-text-light)">
                    {isLoadingSummary ? "..." : summary?.currentTime}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-800/30 p-6 rounded-2xl">
              <p className="text-xs font-bold text-yellow-700 dark:text-yellow-500 uppercase tracking-wider mb-2">
                Note
              </p>
              <p className="text-sm text-yellow-800/80 dark:text-yellow-500/80 font-medium leading-relaxed">
                Rescheduling will notify the patient and doctor automatically
                via email.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RescheduleAppointment;
