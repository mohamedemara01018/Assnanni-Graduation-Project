import type { Schedule } from "@/interfaces/doctorInterfaces";
import { BsCalendarEvent } from "react-icons/bs";
import { FaRegClock } from "react-icons/fa";

export interface AppointmentsProps {
  role: string;
  appointments?: Schedule[];
}

const Appointments = ({ role, appointments = [] }: AppointmentsProps) => {
  return (
    <div className="bg-(--color-surface) p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <BsCalendarEvent className="text-xl text-blue-500" />
        <h3 className="text-(--color-text) font-medium text-lg">
          Today's Appointments
        </h3>
      </div>

      <div className="flex flex-col gap-3">
        {appointments.length > 0 ? (
          appointments.map((apt) => {
            const status = apt.status || "Pending";
            const isConfirmed = status.toLowerCase() === "confirmed";

            return (
              <div
                key={apt.appointmentId}
                className="flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-transparent dark:border-gray-800"
              >
                <div className="flex flex-col gap-1">
                  <h4 className="text-(--color-text) font-medium">
                    {apt.patientName}
                  </h4>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {apt.specialty}
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
                        isConfirmed
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                      }`}
                    >
                      {status}
                    </span>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <p className="text-gray-400 dark:text-gray-500 text-sm">
            No appointments today.
          </p>
        )}
      </div>
    </div>
  );
};

export default Appointments;
