import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import Card from "../../../components/Student Doctor/appointments/Card";
import AppointmentsCard, { type AppointmentData } from "../../../components/Student Doctor/appointments/AppointmentsCard";
import { FaRegClock } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { SlCalender } from "react-icons/sl";
import { FaRegCheckCircle } from "react-icons/fa";
import { LuListFilter } from "react-icons/lu";

const dummyAppointments: AppointmentData[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    desc: "Annual Checkup",
    date: "Feb 5, 2026",
    time: "10:00 AM",
    meetingType: "In-Person",
    address: "Room 302, Medical Center",
    status: "Upcoming",
    imageUrl: "https://randomuser.me/api/portraits/women/11.jpg",
  },
  {
    id: 2,
    name: "James Wilson",
    desc: "Follow-up Consultation",
    date: "Feb 6, 2026",
    time: "2:30 PM",
    meetingType: "Video Call",
    status: "Upcoming",
    imageUrl: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 3,
    name: "Robert Brown",
    desc: "Prescription Renewal",
    date: "Feb 8, 2026",
    time: "11:30 AM",
    meetingType: "Phone Call",
    status: "Upcoming",
    imageUrl: "https://randomuser.me/api/portraits/men/44.jpg",
  },
  {
    id: 4,
    name: "Lisa Anderson",
    desc: "General Consultation",
    date: "Jan 25, 2026",
    time: "3:00 PM",
    meetingType: "Video Call",
    status: "Cancelled",
    imageUrl: "https://randomuser.me/api/portraits/women/65.jpg",
  },
];

const StudentAppointments = () => {
  return (
    <DashboardLayout pageTitle="Appointments">
      <div className="bg-(--color-bg) -mt-6 p-6 rounded-2xl min-h-screen">
        <div className="flex flex-col gap-2 mb-10">
          <h1 className="text-3xl font-bold text-(--color-text)">Appointments</h1>
          <p className="text-sm text-(--color-text-light) font-medium">
            Manage and view all your appointments
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card
            title="Total Appointments"
            color="blue"
            logo={<SlCalender size={20} />}
            num={5}
          />
          <Card 
            title="Upcoming" 
            color="violet" 
            logo={<FaRegClock size={20} />} 
            num={3} 
          />
          <Card
            title="Completed"
            color="green"
            logo={<FaRegCheckCircle size={20} />}
            num={1}
          />
          <Card
            title="Cancelled"
            color="red"
            logo={<IoMdCloseCircleOutline size={22} />}
            num={1}
          />
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4 mb-8">
          <div className="flex-grow relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search appointments..."
              className="w-full pl-12 pr-4 py-3 bg-(--color-surface) border border-(--color-border) rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-(--color-surface) border border-(--color-border) rounded-xl text-sm font-bold text-(--color-text-light) hover:bg-gray-50 transition-colors shadow-sm">
            <LuListFilter size={18} />
            Filters
          </button>
        </div>

        {/* Appointments List */}
        <div className="flex flex-col gap-6">
          {dummyAppointments.map((appointment) => (
            <AppointmentsCard key={appointment.id} appointment={appointment} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentAppointments;
