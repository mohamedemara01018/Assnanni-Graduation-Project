import { useParams, useNavigate, NavLink } from "react-router";
import { BsCalendar3, BsCash, BsCheckCircleFill } from "react-icons/bs";
import { LuUser, LuFileText } from "react-icons/lu";
import { HiOutlineClock } from "react-icons/hi2";
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useState } from "react";

interface AppointmentInfo {
  id: number;
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

const CheckIn = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const backendUrl = useSelector((state: RootState) => state.config.backendUrl);
  const token = Cookies.get("jwtToken");

  const [cashReceived, setCashReceived] = useState(false);
  const [notes, setNotes] = useState("");

  const { data: appointmentData, isLoading } = useQuery({
    queryKey: ["AppointmentDetails", id],
    queryFn: async () => {
      const response = await axios.get(
        `${backendUrl}Receptionist/dashboard/appointments/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return response.data;
    },
    enabled: !!id,
  });

  const checkInMutation = useMutation({
    mutationFn: async () => {
      await axios.post(
        `${backendUrl}Receptionist/checkin/${id}`,
        {
          paymentStatus: cashReceived ? "Paid" : "Pending",
          notes: notes,
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

  const appointment = appointmentData?.data as AppointmentInfo;

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
                  <span className="px-3 py-1 rounded-full bg-yellow-50 text-yellow-600 border border-yellow-100 text-[10px] font-bold uppercase tracking-wider">
                    {appointment.status}
                  </span>
                </div>
                <p className="text-sm text-(--color-text-light) font-medium">
                  Appointment ID: {appointment.id}
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

              <div className="flex gap-4 md:col-span-2">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center border border-blue-100">
                  <BsCash size={20} />
                </div>
                <div>
                  <p className="text-xs text-(--color-text-light) font-medium mb-1">
                    Status
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
            <h2 className="text-lg font-bold text-(--color-text) mb-6">
              Payment Status
            </h2>
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
