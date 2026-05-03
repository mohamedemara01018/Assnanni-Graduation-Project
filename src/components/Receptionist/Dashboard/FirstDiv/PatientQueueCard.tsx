import { NavLink } from "react-router";

export interface PatientInQueue {
  id: string | number;
  name: string;
  doctorName: string;
  arrivalTime: string;
  status: "Waiting" | "In Progress" | "Checked In";
}

interface Props {
  patient: PatientInQueue;
}

const PatientQueueCard = ({ patient }: Props) => {
  const { id, name, doctorName, arrivalTime, status } = patient;
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const statusStyles = {
    Waiting: "bg-yellow-50 text-yellow-600 border-yellow-100",
    "In Progress": "bg-blue-50 text-blue-600 border-blue-100",
    "Checked In": "bg-emerald-50 text-emerald-600 border-emerald-100",
  };

  return (
    <div className="flex bg-gray-50/50 dark:bg-gray-800/20 items-center justify-between p-4 rounded-2xl border border-(--color-border) hover:bg-gray-50 transition-colors group">
      <div className="flex gap-4 items-center">
        <div className="w-12 h-12 flex items-center justify-center bg-linear-to-br from-blue-500 to-emerald-500 rounded-full text-white font-bold shadow-sm">
          {initials}
        </div>
        <div>
          <h3 className="text-sm font-bold text-(--color-text)">{name}</h3>
          <p className="text-xs text-(--color-text-light) font-medium">
            {doctorName}
          </p>
          <p className="text-[10px] text-(--color-text-light) font-medium mt-0.5">
            Arrived: {arrivalTime}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div
          className={`px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${statusStyles[status]}`}
        >
          {status}
        </div>
        <NavLink 
          to={`/doctor-patients/${id}`}
          className="text-blue-600 hover:text-blue-700 font-bold text-xs underline-offset-4 hover:underline"
        >
          View
        </NavLink>
      </div>
    </div>
  );
};

export default PatientQueueCard;
