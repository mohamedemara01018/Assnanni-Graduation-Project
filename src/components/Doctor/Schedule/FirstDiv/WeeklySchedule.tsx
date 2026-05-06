import { NavLink } from "react-router";
import Days from "./Days";
import type { WeeklyScheduleDay } from "@/interfaces/doctorInterfaces";

interface Props {
  role: string;
  days: WeeklyScheduleDay[];
  onDeleteSlot: (slotId: number) => void;
}

const WeeklySchedule = ({ role, days, onDeleteSlot }: Props) => {
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
          const availableSlots = day.slots.filter(
            (slot) => slot.status === "Available",
          );
          return (
            <div key={index}>
              <Days
                day={day.day}
                time={availableSlots}
                role={role}
                onDeleteSlot={onDeleteSlot}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklySchedule;
