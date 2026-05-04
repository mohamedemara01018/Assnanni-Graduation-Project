import { NavLink } from "react-router";
import { BsCalendar3 } from "react-icons/bs";
import PatientQueueCard, { type PatientInQueue } from "./PatientQueueCard";

export interface DashboardAppointment {
  id: string | number;
  doctorName: string;
  specialty: string;
  time: string;
  status: "confirmed" | "pending" | "completed";
}

const AppointmentCard = ({
  appointment,
}: {
  appointment: DashboardAppointment;
}) => {
  const { doctorName, specialty, time, status } = appointment;
  const statusStyles = {
    confirmed: "bg-emerald-50 text-emerald-600 border-emerald-100",
    pending: "bg-yellow-50 text-yellow-600 border-yellow-100",
    completed: "bg-gray-100 text-gray-600 border-gray-200",
  };

  return (
    <div className="flex bg-gray-50/50 dark:bg-gray-800/20 items-center justify-between p-4 rounded-2xl border border-(--color-border) hover:bg-gray-50 transition-colors group">
      <div className="flex gap-4 items-center">
        <div className="w-12 h-12 flex items-center justify-center bg-blue-50 text-blue-500 rounded-xl border border-blue-100 shadow-sm group-hover:bg-blue-500 group-hover:text-white transition-colors">
          <BsCalendar3 size={18} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-(--color-text)">
            Dr. {doctorName}
          </h3>
          <p className="text-xs text-(--color-text-light) font-medium">
            {specialty}
          </p>
          <p className="text-[10px] text-(--color-text-light) font-medium mt-0.5">
            {time}
          </p>
        </div>
      </div>
      <div
        className={`px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${statusStyles[status]}`}
      >
        {status}
      </div>
    </div>
  );
};

const FirstDiv = () => {
  const patientQueue: PatientInQueue[] = [
    {
      id: 1,
      name: "John Smith",
      doctorName: "Dr. Chen",
      arrivalTime: "09:00 AM",
      status: "Waiting",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      doctorName: "Dr. Williams",
      arrivalTime: "09:15 AM",
      status: "In Progress",
    },
    {
      id: 3,
      name: "Mike Brown",
      doctorName: "Dr. Chen",
      arrivalTime: "09:30 AM",
      status: "Waiting",
    },
    {
      id: 4,
      name: "Emma Davis",
      doctorName: "Dr. Smith",
      arrivalTime: "09:45 AM",
      status: "Checked In",
    },
  ];

  const todayAppointments: DashboardAppointment[] = [
    {
      id: 1,
      doctorName: "Sarah Johnson",
      specialty: "Cardiology",
      time: "10:00",
      status: "confirmed",
    },
    {
      id: 2,
      doctorName: "Emily Rodriguez",
      specialty: "Pediatrics",
      time: "14:00",
      status: "pending",
    },
    {
      id: 3,
      doctorName: "Michael Chen",
      specialty: "Neurology",
      time: "09:00",
      status: "completed",
    },
  ];

  return (
    <div className="flex-[2] flex flex-col gap-8 w-full">
      {/* Patient Queue */}
      <div className="bg-(--color-surface) p-8 rounded-2xl border border-(--color-border) shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold text-(--color-text)">
            Patient Queue
          </h2>
          <span className="text-xs font-bold text-(--color-text-light) bg-gray-100 px-3 py-1 rounded-full">
            2 waiting
          </span>
        </div>
        <div className="flex flex-col gap-4">
          {patientQueue.map((patient) => (
            <PatientQueueCard key={patient.id} patient={patient} />
          ))}
        </div>
      </div>

      {/* Today's Appointments */}
      <div className="bg-(--color-surface) p-8 rounded-2xl border border-(--color-border) shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold text-(--color-text)">
            Today's Appointments
          </h2>
          <NavLink
            to="/doctor-appointments"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 underline-offset-4 hover:underline"
          >
            View All
          </NavLink>
        </div>
        <div className="flex flex-col gap-4">
          {todayAppointments.map((app) => (
            <AppointmentCard key={app.id} appointment={app} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FirstDiv;
