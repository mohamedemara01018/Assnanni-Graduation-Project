import { useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaRegClock } from "react-icons/fa6";
import { BsCalendarEvent } from "react-icons/bs";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

interface Appointment {
  id: number;
  name: string;
  type: string;
  time: string;
  status: "Confirmed" | "Pending";
}

const fallbackAppointments: Appointment[] = [
  {
    id: 1,
    name: "John Smith",
    type: "Consultation",
    time: "09:00 AM",
    status: "Confirmed",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    type: "Follow-up",
    time: "10:00 AM",
    status: "Confirmed",
  },
  {
    id: 3,
    name: "Michael Brown",
    type: "Checkup",
    time: "02:00 PM",
    status: "Pending",
  },
];

interface Props {
  role: string;
}

const Appointments = ({ role }: Props) => {
  const backendUrl = useSelector((state: RootState) => state.config.backendUrl);

  const {
    data: appointments = fallbackAppointments,
    isError,
    error,
    isSuccess,
  } = useQuery<Appointment[]>({
    queryKey: ["TodayAppointments"],
    queryFn: async () => {
      const response = await axios.get(`${backendUrl}TodayAppointments`);
      const data = response.data?.value || response.data;
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
      return fallbackAppointments;
    },
  });

  useEffect(() => {
    if (isSuccess && appointments !== fallbackAppointments) {
      toast.success("Today's appointments loaded");
    }
    if (isError) {
      console.error("Error fetching appointments:", error);
      toast.error(error.message || "Failed to load appointments");
    }
  }, [isSuccess, isError, error, appointments]);

  return (
    <div className="bg-(--color-surface) p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <BsCalendarEvent className="text-xl text-blue-500" />
        <h3 className="text-(--color-text) font-medium text-lg">
          Today's Appointments
        </h3>
      </div>

      <div className="flex flex-col gap-3">
        {appointments.map((apt) => (
          <div
            key={apt.id}
            className="flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-transparent dark:border-gray-800"
          >
            <div className="flex flex-col gap-1">
              <h4 className="text-(--color-text) font-medium">{apt.name}</h4>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {apt.type}
              </p>
              <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-sm mt-0.5">
                <FaRegClock className="text-xs" />
                <span>{apt.time}</span>
              </div>
            </div>

            {role !== "studentDoctor" && (
              <div>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    apt.status === "Confirmed"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                  }`}
                >
                  {apt.status}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Appointments;
