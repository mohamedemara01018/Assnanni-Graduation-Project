import { BsThreeDotsVertical, BsCalendar3 } from "react-icons/bs";
import { FaRegClock, FaPhone, FaVideo } from "react-icons/fa6";
import { GrLocation } from "react-icons/gr";
import { IoMdCloseCircle } from "react-icons/io";
import { NavLink } from "react-router";

export interface AppointmentData {
  id: number | string;
  name: string;
  desc: string;
  date: string;
  time: string;
  meetingType: "In-Person" | "Video Call" | "Phone Call";
  address?: string;
  status: "Upcoming" | "Completed" | "Cancelled";
  imageUrl?: string;
}

interface Props {
  appointment: AppointmentData;
}

function AppointmentsCard({ appointment }: Props) {
  const { id, name, desc, date, time, meetingType, status, address, imageUrl } =
    appointment;

  const nameParts = name.split(" ");
  const initials = (
    nameParts[0][0] + (nameParts.length > 1 ? nameParts[nameParts.length - 1][0] : "")
  ).toUpperCase();

  const getStatusStyles = () => {
    switch (status) {
      case "Upcoming":
        return "bg-blue-50 text-blue-600 border-blue-100";
      case "Completed":
        return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "Cancelled":
        return "bg-red-50 text-red-600 border-red-100";
      default:
        return "bg-gray-50 text-gray-600 border-gray-100";
    }
  };

  const getMeetingIcon = () => {
    switch (meetingType) {
      case "Video Call":
        return <FaVideo className="text-gray-400" />;
      case "Phone Call":
        return <FaPhone className="text-gray-400" />;
      case "In-Person":
        return <GrLocation className="text-gray-400" />;
    }
  };

  return (
    <div className="bg-(--color-surface) rounded-2xl p-6 flex gap-6 shadow-sm border border-(--color-border) hover:shadow-md transition-shadow">
      <div className="flex-shrink-0 w-12 h-12 bg-linear-to-br from-blue-400 to-emerald-400 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          initials
        )}
      </div>
      
      <div className="flex-grow flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold text-(--color-text)">{name}</h3>
            <p className="text-sm text-(--color-text-light) font-medium">
              {desc}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${getStatusStyles()}`}>
              {status === "Upcoming" ? <FaRegClock size={12} /> : status === "Cancelled" ? <IoMdCloseCircle size={14} /> : null}
              {status}
            </div>
            <button className="text-(--color-text-light) hover:text-(--color-text) transition-colors">
              <BsThreeDotsVertical size={18} />
            </button>
          </div>
        </div>

        {status !== "Cancelled" && (
          <>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <div className="flex items-center gap-2 text-xs text-(--color-text-light) font-medium">
                <BsCalendar3 className="text-gray-400" />
                <span>{date}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-(--color-text-light) font-medium">
                <FaRegClock className="text-gray-400" />
                <span>{time}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-(--color-text-light) font-medium">
                {getMeetingIcon()}
                <span>{meetingType}</span>
              </div>
              {meetingType === "In-Person" && address && (
                <div className="flex items-center gap-2 text-xs text-(--color-text-light) font-medium">
                  <GrLocation className="text-gray-400" />
                  <span>{address}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-6 mt-2">
              <NavLink
                to={`/student-appointments/${id}`}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 underline-offset-4 hover:underline"
              >
                View Details
              </NavLink>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AppointmentsCard;
