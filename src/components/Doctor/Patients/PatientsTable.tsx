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

const PatientsTable = ({
  id,
  title,
  phone,
  age,
  gender,
  status,
  lastVisit,
  doctor,
}: Props) => {
  return (
    <tr className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors">
      <td className="px-8 py-5">
        <div className="flex flex-col">
          <span className="text-sm font-bold text-(--color-text)">{title}</span>
          <span className="text-xs text-(--color-text-light) mt-0.5">
            {phone}
          </span>
        </div>
      </td>

      <td className="px-4 py-5">
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-(--color-text)">
            {age} yrs
          </span>
          <span className="text-xs text-(--color-text-light) mt-0.5">
            {gender}
          </span>
        </div>
      </td>

      <td className="px-4 py-5">
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
            status === "Active"
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : status === "Pending"
                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                : "bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-400"
          }`}
        >
          {status}
        </span>
      </td>

      <td className="px-4 py-5">
        <span className="text-sm font-medium text-(--color-text)">
          {lastVisit}
        </span>
      </td>

      <td className="px-4 py-5">
        <span className="text-sm font-medium text-(--color-text)">
          {doctor}
        </span>
      </td>

      <td className="px-8 py-5">
        <div className="flex justify-end gap-4 items-center">
          <NavLink
            to={`/doctor-patients/${id}`}
            className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors cursor-pointer"
            title="View Profile"
          >
            <IoEyeOutline className="text-xl" />
          </NavLink>
          <NavLink
            to={`/doctor-patients/${id}/medical-history`}
            className="p-1.5 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors cursor-pointer"
            title="Medical History"
          >
            <BsFileMedical className="text-xl" />
          </NavLink>
        </div>
      </td>
    </tr>
  );
};

export default PatientsTable;
