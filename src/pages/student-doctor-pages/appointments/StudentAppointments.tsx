import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import Card from "../../../components/Student Doctor/appointments/Card";
import AppointmentsCard from "../../../components/Student Doctor/appointments/AppointmentsCard";
import { FaRegClock } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { SlCalender } from "react-icons/sl";
import { FaRegCheckCircle } from "react-icons/fa";
import { LuListFilter } from "react-icons/lu";
import { dummyAppointments } from "@/constants/studentConstants";

const StudentAppointments = () => {
  return (
    <DashboardLayout pageTitle="Appointments">
      <div className="bg-(--color-bg) -mt-6 p-6 rounded-2xl min-h-screen">
        <div className="flex flex-col gap-2 mb-10">
          <h1 className="text-3xl font-bold text-(--color-text)">
            Appointments
          </h1>
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
          <div className="grow relative">
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
