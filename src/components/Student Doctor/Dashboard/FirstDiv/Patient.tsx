import type { ReactNode } from "react";
import LazyImage from "@/components/ui/LazyImage";
import { FaUserMd, FaRegClock } from "react-icons/fa";
import { BsFileMedical } from "react-icons/bs";
import { NavLink } from "react-router";

interface Props {
  id?: number | string;
  name: string;
  doctorName?: string;
  imageUrl?: string;
  lastInteractionDate?: string;
  children?: ReactNode;
  showCreateMedicalRecord?: boolean;
}

const Patient = ({
  id,
  name = "",
  doctorName,
  imageUrl,
  lastInteractionDate,
  children,
  showCreateMedicalRecord = true,
}: Props) => {
  let firstCharacter: string = " ";
  if (name && typeof name === "string" && name.startsWith("Dr.")) {
    firstCharacter = name.charAt(0) + name.charAt(4);
  } else if (name) {
    firstCharacter = name.charAt(0);
  }

  const formattedDate = lastInteractionDate
    ? new Date(lastInteractionDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "No recent activity";

  return (
    <div className="flex justify-between items-center bg-(--color-bg) border border-(--color-border) p-4 rounded-xl shadow-sm hover:border-blue-200 transition-colors group">
      <div className="flex gap-4 items-center">
        <div className="relative">
          {imageUrl ? (
            <LazyImage
              src={imageUrl}
              alt={name}
              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
            />
          ) : (
            <div className="flex items-center justify-center w-12 h-12 bg-linear-to-br from-blue-500 to-emerald-500 rounded-full shadow-sm">
              <span className="text-white font-bold text-base">
                {firstCharacter}
              </span>
            </div>
          )}
          <div className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-800 rounded-full p-1 shadow-sm border border-gray-100">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          </div>
        </div>
        <div className="flex flex-col gap-0.5">
          <h3 className="text-sm font-bold text-(--color-text) group-hover:text-blue-600 transition-colors">
            {name}
          </h3>
          <div className="flex flex-col gap-1">
            {doctorName && (
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-violet-500 uppercase tracking-tight">
                <FaUserMd size={10} />
                <span>Supervisor: {doctorName}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 text-[10px] text-(--color-text-light) font-medium">
              <FaRegClock size={10} />
              <span>{formattedDate}</span>
            </div>
          </div>
          {children && (
            <div className="text-xs text-(--color-text-light) font-normal mt-1">
              {children}
            </div>
          )}
        </div>
      </div>
      {showCreateMedicalRecord && (
        <div className="flex flex-col items-end gap-2">
          <NavLink
            to={`/student-doctor/create-medical-record/${id}`}
            className="p-2.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition-all duration-300 shadow-sm cursor-pointer"
            title="Create Medical Record"
          >
            <BsFileMedical className="text-xl" />
          </NavLink>
        </div>
      )}
    </div>
  );
};

export default Patient;
