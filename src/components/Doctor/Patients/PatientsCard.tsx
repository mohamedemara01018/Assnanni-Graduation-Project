import { IoEyeOutline } from "react-icons/io5";
import { BsFileMedical } from "react-icons/bs";
import { NavLink } from "react-router";

interface Props {
  id: number | string;
  title: string;
  phone: string;
  age: number;
  gender: "Male" | "Female";
  status: "Active" | "Inactive" | "Pending";
  lastVisit: string;
  doctor: string;
}

const PatientsCard = ({
  id,
  title,
  phone,
  age,
  gender,
  status,
  lastVisit,
  doctor,
}: Props) => {
  const firstChar = title.charAt(0);

  const statusColors = {
    Active:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    Pending:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    Inactive:
      "bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-400",
  };

  return (
    <div className="bg-(--color-surface) rounded-2xl p-5 border border-(--color-border) shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-5">
        <div className="flex gap-3 items-center">
          <div className="w-12 h-12 flex items-center justify-center bg-linear-to-br from-blue-500 to-emerald-500 text-white rounded-full text-lg font-bold">
            {firstChar}
          </div>
          <div className="flex flex-col">
            <h3 className="text-sm font-bold text-(--color-text)">{title}</h3>
            <span className="text-xs text-(--color-text-light)">{phone}</span>
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusColors[status] || statusColors.Inactive}`}
        >
          {status}
        </span>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-xs text-(--color-text-light)">Age:</span>
          <span className="text-xs font-semibold text-(--color-text)">
            {age} years
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-(--color-text-light)">Gender:</span>
          <span className="text-xs font-semibold text-(--color-text)">
            {gender}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-(--color-text-light)">Last Visit:</span>
          <span className="text-xs font-semibold text-(--color-text)">
            {lastVisit}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-(--color-text-light)">Doctor:</span>
          <span className="text-xs font-semibold text-(--color-text)">
            {doctor}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <NavLink
          to={`/doctor-patients/${id}`}
          className="flex flex-col items-center justify-center gap-1 py-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors cursor-pointer group"
        >
          <IoEyeOutline className="text-lg group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-bold">View</span>
        </NavLink>
        <NavLink
          to={`/doctor-patients/${id}/medical-history`}
          className="flex flex-col items-center justify-center gap-1 py-2 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors cursor-pointer group"
        >
          <BsFileMedical className="text-lg group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-bold">History</span>
        </NavLink>
      </div>
    </div>
  );
};

export default PatientsCard;
