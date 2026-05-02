import { NavLink } from "react-router";
import { useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Days from "./Days";
import { useQuery } from "@tanstack/react-query";

interface Day {
  day: string;
  time: string[];
}

const fallbackDays: Day[] = [
  {
    day: "Monday",
    time: [
      "09:00 AM",
      "10:00 AM",
      "11:00 AM",
      "02:00 PM",
      "03:00 PM",
      "04:00 PM",
    ],
  },
  {
    day: "Tuesday",
    time: ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM"],
  },
  {
    day: "Wednesday",
    time: ["09:00 AM", "10:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"],
  },
  { day: "Thursday", time: [] },
  { day: "Friday", time: ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM"] },
  { day: "Saturday", time: ["09:00 AM", "10:00 AM", "11:00 AM"] },
  { day: "Sunday", time: [] },
];

interface Props {
  role: string;
}

const WeeklySchedule = ({ role }: Props) => {
  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/";

  const {
    data: days = fallbackDays,
    isError,
    error,
    isSuccess,
  } = useQuery<Day[]>({
    queryKey: ["DoctorSchedules"],
    queryFn: async () => {
      const response = await axios.get(`${backendUrl}DoctorSchedules`);
      const data = response.data?.value || response.data;
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
      return fallbackDays;
    },
  });

  useEffect(() => {
    if (isSuccess && days !== fallbackDays) {
      toast.success("Weekly schedules loaded");
    }
    if (isError) {
      console.error("Error fetching schedules:", error);
      toast.error(error.message || "Failed to load schedules");
    }
  }, [isSuccess, isError, error, days]);

  return (
    <div className="bg-(--color-surface) rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-(--color-text) text-lg font-medium">
          Weekly Schedule
        </h3>
        {role !== "studentDoctor" && (
          <NavLink
            to={"/add-time-slot"}
            className="bg-blue-600 text-white text-sm font-medium rounded-lg py-2 px-4 cursor-pointer hover:bg-blue-700 transition-colors flex items-center gap-1"
          >
            + Add Time Slot
          </NavLink>
        )}
      </div>
      <div className="flex flex-col gap-4">
        {days.map((day, index) => {
          return (
            <div key={index}>
              <Days day={day.day} time={day.time} role={role} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklySchedule;
