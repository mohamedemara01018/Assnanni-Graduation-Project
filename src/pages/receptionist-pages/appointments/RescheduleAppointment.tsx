import { useState } from "react";
import { useParams, NavLink, useNavigate } from "react-router";
import { BsCalendar3, BsClock, BsFillPersonFill } from "react-icons/bs";
import { FaArrowLeft } from "react-icons/fa6";
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";

interface AppointmentSummary {
  patientName: string;
  doctorName: string;
  currentDate: string;
  currentTime: string;
}

const RescheduleAppointment = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock current data
  const [summary] = useState<AppointmentSummary>({
    patientName: "Sarah Johnson",
    doctorName: "Dr. Michael Chen",
    currentDate: "Feb 5, 2026",
    currentTime: "10:00 AM",
  });

  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  const handleReschedule = () => {
    // Logic to save reschedule
    alert(`Appointment ${id} rescheduled to ${newDate} at ${newTime}`);
    navigate("/doctor-appointments");
  };

  return (
    <DashboardLayout pageTitle="Reschedule Appointment">
      <div className="-mt-6 bg-(--color-bg) min-h-screen p-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-(--color-text-light) mb-8 font-medium">
          <NavLink to="/receptionist" className="hover:text-blue-600">Dashboard</NavLink>
          <span>/</span>
          <NavLink to="/doctor-appointments" className="hover:text-blue-600">Appointments</NavLink>
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
                  <label className="block text-sm font-bold text-(--color-text-light) mb-2">New Date</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full p-4 bg-gray-50/50 dark:bg-gray-800/20 border border-(--color-border) rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-(--color-text-light) mb-2">New Time</label>
                  <div className="grid grid-cols-3 gap-3">
                    {["09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM"].map((t) => (
                      <button
                        key={t}
                        onClick={() => setNewTime(t)}
                        className={`py-3 px-2 rounded-xl border text-sm font-bold transition-all ${
                          newTime === t
                            ? "bg-blue-600 text-white border-blue-600 shadow-md scale-[1.02]"
                            : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-blue-500 hover:text-blue-500"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                disabled={!newDate || !newTime}
                onClick={handleReschedule}
                className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-bold rounded-2xl transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
              >
                Confirm Reschedule
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
              <h3 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-6">Current Details</h3>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 border border-blue-100">
                    <BsFillPersonFill size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-(--color-text-light) font-medium">Patient</p>
                    <p className="text-sm font-bold text-(--color-text)">{summary.patientName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 border border-emerald-100">
                    <BsClock size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-(--color-text-light) font-medium">Doctor</p>
                    <p className="text-sm font-bold text-(--color-text)">{summary.doctorName}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-(--color-border)">
                  <p className="text-xs text-(--color-text-light) font-medium mb-2">Original Schedule</p>
                  <p className="text-sm font-bold text-(--color-text)">{summary.currentDate}</p>
                  <p className="text-sm font-medium text-(--color-text-light)">{summary.currentTime}</p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-800/30 p-6 rounded-2xl">
              <p className="text-xs font-bold text-yellow-700 dark:text-yellow-500 uppercase tracking-wider mb-2">Note</p>
              <p className="text-sm text-yellow-800/80 dark:text-yellow-500/80 font-medium leading-relaxed">
                Rescheduling will notify the patient and doctor automatically via email.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RescheduleAppointment;
