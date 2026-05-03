import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import { useParams, useNavigate, NavLink } from "react-router";
import { useSelector } from "react-redux";
import { FaArrowLeft, FaRegClock, FaEnvelope, FaPhone } from "react-icons/fa6";
import { BsCalendar3, BsFillPersonFill } from "react-icons/bs";
import { GrLocation } from "react-icons/gr";
import { MdOutlineMedicalServices } from "react-icons/md";

const StudentAppointmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const role = useSelector((state: any) => state.auth.role);

  // Dummy data based on the ID or general example
  const appointment = {
    id: id || "4",
    status: "Confirmed",
    patient: {
      name: "Sarah Johnson",
      id: "P-88234",
      gender: "Female",
      age: "28 years",
      phone: "+1 (555) 123-4567",
      email: "sarah.j@example.com",
      imageUrl: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    date: "January 25, 2026",
    time: "2:30 PM",
    duration: "30 minutes",
    location: "Assnani Medical Center, Room 302",
    type: "General Consultation",
    meetingType: "In-Person",
  };

  return (
    <DashboardLayout pageTitle="Appointment Details">
      <div className="-mt-6 -ml-6 bg-(--color-bg) min-h-screen p-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-(--color-text-light) hover:text-(--color-text) transition-colors mb-8 font-medium cursor-pointer"
        >
          <FaArrowLeft />
          Back
        </button>

        <div className="max-w-4xl bg-(--color-surface) rounded-2xl shadow-sm border border-(--color-border) p-10">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h1 className="text-2xl font-bold text-(--color-text) mb-1">
                Appointment Details
              </h1>
              <p className="text-sm text-(--color-text-light) font-medium">
                Appointment ID: {appointment.id}
              </p>
            </div>
            <div className="bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-xl border border-emerald-100 text-sm font-bold">
              {appointment.status}
            </div>
          </div>

          {/* Patient Information Section */}
          <div className="bg-gray-50/50 dark:bg-gray-800/20 rounded-2xl p-8 mb-10 border border-(--color-border)">
            <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-6">
              Patient Information
            </h2>
            <div className="flex items-center gap-6">
              <div className="relative">
                <img
                  src={appointment.patient.imageUrl}
                  alt={appointment.patient.name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-sm"
                />
                <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-1.5 rounded-full border-2 border-white">
                  <BsFillPersonFill size={12} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 flex-grow">
                <div>
                  <h3 className="text-xl font-bold text-(--color-text)">
                    {appointment.patient.name}
                  </h3>
                  <p className="text-sm text-(--color-text-light) font-medium">
                    Patient ID: {appointment.patient.id} •{" "}
                    {appointment.patient.gender} • {appointment.patient.age}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 text-sm text-(--color-text-light) font-medium">
                    <FaPhone className="text-blue-500" />
                    {appointment.patient.phone}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-(--color-text-light) font-medium">
                    <FaEnvelope className="text-blue-500" />
                    {appointment.patient.email}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Appointment Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="flex items-start gap-4">
              <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                <BsCalendar3 size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-(--color-text-light) uppercase tracking-wider mb-1">
                  Date
                </p>
                <p className="text-base font-bold text-(--color-text)">
                  {appointment.date}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                <GrLocation size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-(--color-text-light) uppercase tracking-wider mb-1">
                  Location
                </p>
                <p className="text-base font-bold text-(--color-text)">
                  {appointment.location}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                <FaRegClock size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-(--color-text-light) uppercase tracking-wider mb-1">
                  Time
                </p>
                <p className="text-base font-bold text-(--color-text)">
                  {appointment.time}
                </p>
                <p className="text-xs text-(--color-text-light) font-medium">
                  Duration: {appointment.duration}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                <MdOutlineMedicalServices size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-(--color-text-light) uppercase tracking-wider mb-1">
                  Type
                </p>
                <p className="text-base font-bold text-(--color-text)">
                  {appointment.type}
                </p>
              </div>
            </div>
          </div>

          {/* Receptionist Actions */}
          {role === "receptionist" && (
            <div className="flex gap-4 mt-12 pt-10 border-t border-(--color-border)">
              <NavLink
                to={`/receptionist/reschedule/${appointment.id}`}
                className="flex-1 py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-sm hover:shadow-md active:scale-[0.98] text-center"
              >
                Reschedule
              </NavLink>
              <button className="flex-1 py-3 px-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-bold rounded-xl transition-all hover:bg-gray-50 dark:hover:bg-gray-700 active:scale-[0.98]">
                Cancel Appointment
              </button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentAppointmentDetails;
