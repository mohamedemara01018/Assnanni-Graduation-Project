import { useParams, useNavigate, NavLink } from "react-router";
import { BsCalendar3, BsCash, BsCheckCircleFill } from "react-icons/bs";
import { LuUser, LuFileText } from "react-icons/lu";
import { HiOutlineClock } from "react-icons/hi2";
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

interface AppointmentInfo {
  id: number;
  patientId: number;
  status: string;
  date: string;
  time: string;
  location: string | null;
  duration: number;
  type: string;
  notes: string;
  patientName: string;
  doctorName: string | null;
  mode: string;
  paymentStatus: string;
}

interface AppointmentDetailsResponse {
  succeeded: boolean;
  message: string;
  data: AppointmentInfo;
  meta: null;
}

const getIdempotencyCookieKey = (appointmentId: string | number) =>
  `receptionist-pay-idempotency-${appointmentId}`;

const CheckIn = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const backendUrl = useSelector((state: RootState) => state.config.backendUrl);
  const token = Cookies.get("jwtToken");

  const [cashReceived, setCashReceived] = useState(false);
  const [notes, setNotes] = useState("");
  const [idempotencyKey, setIdempotencyKey] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const cookieKey = getIdempotencyCookieKey(id);
    const existing = Cookies.get(cookieKey);
    if (existing) {
      setIdempotencyKey(existing);
      return;
    }
    const key = crypto.randomUUID();
    Cookies.set(cookieKey, key, { expires: 1 });
    setIdempotencyKey(key);
  }, [id]);

  const { data: appointmentData, isLoading } = useQuery({
    queryKey: ["AppointmentDetails", id],
    queryFn: async () => {
      const response = await axios.get<AppointmentDetailsResponse>(
        `${backendUrl}Receptionist/dashboard/appointments/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return response.data;
    },
    enabled: !!id && !!token,
  });

  useEffect(() => {
    if (appointmentData?.data?.paymentStatus === "Paid") {
      setCashReceived(true);
    }
  }, [appointmentData?.data?.paymentStatus]);

  const payCashMutation = useMutation({
    mutationFn: async () => {
      const appt = appointmentData?.data;
      if (!appt) throw new Error("Appointment data not loaded");
      if (!idempotencyKey) throw new Error("Idempotency key not available");

      await axios.post(
        `${backendUrl}payments/cash`,
        {
          appointmentId: appt.id,
          patientId: appt.patientId,
          amount: Number(consultationPrice),
          idempotencyKey,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
    },
    onSuccess: () => {
      toast.success("Payment completed successfully");
      setCashReceived(true);
      queryClient.invalidateQueries({ queryKey: ["AppointmentDetails", id] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Payment failed");
    },
  });

  const checkInMutation = useMutation({
    mutationFn: async () => {
      const isPaid =
        appointmentData?.data?.paymentStatus === "Paid" || cashReceived;

      await axios.post(
        `${backendUrl}Receptionist/checkin/${id}`,
        {
          paymentStatus: isPaid ? "Paid" : "Pending",
          notes,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
    },
    onSuccess: () => {
      toast.success("Check-in successful");
      navigate("/");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Check-in failed");
    },
  });

  const { data: consultationPriceData } = useQuery({
    queryKey: ["ConsultationPrice"],
    queryFn: async () => {
      const response = await axios.get(
        `${backendUrl}Doctors/consultation-price`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return response.data as {
        succeeded: boolean;
        message: string;
        data: number;
        meta: any;
      };
    },
    enabled: !!backendUrl,
  });

  const consultationPrice = consultationPriceData?.data ?? 100;
  const appointment = appointmentData?.data;

  if (isLoading) {
    return (
      <DashboardLayout pageTitle="Check-In">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="w-10 h-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (!appointment) return null;

  const initials = appointment.patientName

    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <DashboardLayout pageTitle="Check-In & Payment">
      <div className="-mt-6 bg-(--color-bg) rounded-2xl min-h-screen p-8">
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
          <span className="text-(--color-text)">Check-In & Payment</span>
        </div>

        {/* Title Section */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-(--color-text) mb-2">
            Check-In & Payment Confirmation
          </h1>
          <p className="text-(--color-text-light) font-medium">
            Confirm patient arrival and payment status
          </p>
        </div>

        <div className="flex flex-col gap-8 max-w-5xl">
          {/* Patient & Appointment Details Section */}
          <div className="bg-(--color-surface) p-8 rounded-2xl border border-(--color-border) shadow-sm">
            <h2 className="text-lg font-bold text-(--color-text) mb-8">
              Patient & Appointment Details
            </h2>

            <div className="bg-gray-50/50 dark:bg-gray-800/20 p-6 rounded-2xl border border-(--color-border) mb-8 flex flex-col sm:flex-row items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-linear-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                {initials}
              </div>
              <div className="text-center sm:text-left">
                <div className="flex flex-wrap items-center gap-3 justify-center sm:justify-start mb-1">
                  <h3 className="text-xl font-bold text-(--color-text)">
                    {appointment.patientName}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      appointment.status === "Confirmed"
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                        : "bg-yellow-50 text-yellow-600 border-yellow-100"
                    }`}
                  >
                    {appointment.status}
                  </span>
                </div>
                <p className="text-sm text-(--color-text-light) font-medium">
                  Patient ID: {appointment.patientId} · Appointment ID:{" "}
                  {appointment.id}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center border border-blue-100">
                  <LuUser size={20} />
                </div>
                <div>
                  <p className="text-xs text-(--color-text-light) font-medium mb-0.5">
                    Doctor
                  </p>
                  <p className="text-sm font-bold text-(--color-text)">
                    {appointment.doctorName || "Pending Assignment"}
                  </p>
                  <p className="text-xs text-(--color-text-light) font-medium">
                    {appointment.mode} Mode
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center border border-emerald-100">
                  <HiOutlineClock size={20} />
                </div>
                <div>
                  <p className="text-xs text-(--color-text-light) font-medium mb-0.5">
                    Time
                  </p>
                  <p className="text-sm font-bold text-(--color-text)">
                    {appointment.time}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center border border-purple-100">
                  <BsCalendar3 size={18} />
                </div>
                <div>
                  <p className="text-xs text-(--color-text-light) font-medium mb-0.5">
                    Date
                  </p>
                  <p className="text-sm font-bold text-(--color-text)">
                    {appointment.date}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center border border-orange-100">
                  <LuFileText size={20} />
                </div>
                <div>
                  <p className="text-xs text-(--color-text-light) font-medium mb-0.5">
                    Type
                  </p>
                  <p className="text-sm font-bold text-(--color-text)">
                    {appointment.type}
                  </p>
                </div>
              </div>

              {appointment.location && (
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-500 flex items-center justify-center border border-sky-100">
                    <LuFileText size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-(--color-text-light) font-medium mb-0.5">
                      Location
                    </p>
                    <p className="text-sm font-bold text-(--color-text)">
                      {appointment.location}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
                  <BsCash size={20} />
                </div>
                <div>
                  <p className="text-xs text-(--color-text-light) font-medium mb-0.5">
                    Consultation Price
                  </p>
                  <p className="text-sm font-bold text-(--color-text)">
                    {consultationPrice !== undefined
                      ? `$${consultationPrice}`
                      : "Loading..."}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 ">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center border border-blue-100">
                  <BsCash size={20} />
                </div>
                <div>
                  <p className="text-xs text-(--color-text-light) font-medium mb-1">
                    Payment Status
                  </p>
                  <span
                    className={`px-3 py-1 rounded-full border text-[10px] font-bold ${
                      appointment.paymentStatus === "Paid"
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                        : "bg-red-50 text-red-600 border-red-100"
                    }`}
                  >
                    {appointment.paymentStatus}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Status Section */}
          <div className="bg-(--color-surface) p-8 rounded-2xl border border-(--color-border) shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <h2 className="text-lg font-bold text-(--color-text)">
                Payment Status
              </h2>
              {appointment.paymentStatus === "Pending" && (
                <button
                  onClick={() => payCashMutation.mutate()}
                  disabled={payCashMutation.isPending || !idempotencyKey}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  {payCashMutation.isPending
                    ? "Processing..."
                    : `Pay $${consultationPrice}`}
                </button>
              )}
            </div>
            <div
              className={`p-6 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-4 ${
                cashReceived
                  ? "border-blue-500 bg-blue-50/30"
                  : "border-(--color-border) bg-gray-50/30"
              }`}
              onClick={() => setCashReceived(!cashReceived)}
            >
              <div
                className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${
                  cashReceived
                    ? "bg-blue-600 text-white"
                    : "bg-white border-2 border-gray-300"
                }`}
              >
                {cashReceived && <BsCheckCircleFill size={14} />}
              </div>
              <div>
                <p className="font-bold text-(--color-text)">Confirm Arrival</p>
                <p className="text-xs text-(--color-text-light) font-medium mt-0.5">
                  Mark patient as arrived and ready for queue
                </p>
              </div>
            </div>
          </div>

          {/* Receptionist Notes Section */}
          <div className="bg-(--color-surface) p-8 rounded-2xl border border-(--color-border) shadow-sm">
            <h2 className="text-lg font-bold text-(--color-text) mb-6">
              Receptionist Notes (Optional)
            </h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about the check-in or patient..."
              rows={4}
              className="w-full p-4 bg-gray-50/50 dark:bg-gray-800/20 border border-(--color-border) rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-medium resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mb-20">
            <button
              onClick={() => checkInMutation.mutate()}
              disabled={!cashReceived || checkInMutation.isPending}
              className={`flex-1 py-4 rounded-xl font-bold transition-all shadow-lg ${
                cashReceived
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20 hover:-translate-y-0.5"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {checkInMutation.isPending ? "Processing..." : "Confirm Check-In"}
            </button>
            <NavLink
              to="/receptionist"
              className="flex-1 py-4 bg-white dark:bg-gray-800 border border-(--color-border) text-(--color-text) rounded-xl font-bold text-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
            >
              Cancel
            </NavLink>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CheckIn;
