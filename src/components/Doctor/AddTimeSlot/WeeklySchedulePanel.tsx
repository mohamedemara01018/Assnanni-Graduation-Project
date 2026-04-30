import { useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface TimeSlot {
  id: number;
  start: string;
  end: string;
  duration: string;
  available: boolean;
}

interface DaySchedule {
  name: string;
  slots: TimeSlot[];
}

let nextId = 100;

const initialSchedule: DaySchedule[] = [
  {
    name: "Monday",
    slots: [
      {
        id: nextId++,
        start: "09:00 AM",
        end: "09:30 AM",
        duration: "30 minutes",
        available: true,
      },
      {
        id: nextId++,
        start: "10:00 AM",
        end: "10:30 AM",
        duration: "30 minutes",
        available: true,
      },
      {
        id: nextId++,
        start: "02:00 PM",
        end: "02:45 PM",
        duration: "45 minutes",
        available: false,
      },
    ],
  },
  {
    name: "Tuesday",
    slots: [
      {
        id: nextId++,
        start: "09:00 AM",
        end: "09:30 AM",
        duration: "30 minutes",
        available: true,
      },
    ],
  },
  { name: "Wednesday", slots: [] },
  {
    name: "Thursday",
    slots: [
      {
        id: nextId++,
        start: "11:00 AM",
        end: "12:00 PM",
        duration: "60 minutes",
        available: true,
      },
    ],
  },
  { name: "Friday", slots: [] },
  { name: "Saturday", slots: [] },
  { name: "Sunday", slots: [] },
];

// Trash icon
const TrashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-4 h-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

// Clock icon
const ClockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-3.5 h-3.5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

// Lightbulb icon
const LightbulbIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-4 h-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
    />
  </svg>
);

const SCHEDULING_TIPS = [
  "Set slots 15–30 minutes apart for a smooth workflow.",
  "Mark unavailable slots to block time-off in advance.",
  "Thursday & Friday afternoons see the highest booking rate.",
];

const WeeklySchedulePanel = () => {
  const queryClient = useQueryClient();
  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/";

  const { data: schedule = initialSchedule, isSuccess, isError, error } = useQuery<DaySchedule[]>({
    queryKey: ["DoctorSchedules"],
    queryFn: async () => {
      const response = await axios.get(`${backendUrl}DoctorSchedules`);
      const data = response.data?.value || response.data;
      if (data && Array.isArray(data) && data.length > 0) {
        let tempId = 1000;
        return data.map((d: any) => ({
          name: d.day,
          slots: d.time
            ? d.time.map((t: string) => ({
                id: tempId++,
                start: t,
                end: "TBD",
                duration: "30 minutes",
                available: true,
              }))
            : [],
        }));
      }
      return initialSchedule;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (slotId: number) => axios.delete(`${backendUrl}DoctorScheduled/${slotId}`),
    onSuccess: () => {
      toast.success("Slot deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["DoctorSchedules"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete slot");
    },
  });

  useEffect(() => {
    if (isSuccess && schedule !== initialSchedule) {
      toast.success("Schedules loaded successfully");
    }
    if (isError) {
      console.error("Error fetching schedules:", error);
      toast.error(error.message || "Failed to fetch schedules");
    }
  }, [isSuccess, isError, error, schedule]);

  const deleteSlot = (slotId: number) => {
    deleteMutation.mutate(slotId);
  };

  const totalSlots = schedule.reduce((acc, day) => acc + day.slots.length, 0);
  const availableSlots = schedule.reduce(
    (acc, day) => acc + day.slots.filter((s) => s.available).length,
    0,
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Summary bar */}
      <div className="bg-(--color-surface) rounded-2xl border border-(--color-border) p-4 shadow-sm flex items-center gap-6">
        <div className="flex flex-col">
          <span className="text-2xl font-bold text-(--color-primary)">
            {totalSlots}
          </span>
          <span className="text-xs text-(--color-text-light) mt-0.5">
            Total Slots
          </span>
        </div>
        <div className="w-px h-8 bg-(--color-border)" />
        <div className="flex flex-col">
          <span className="text-2xl font-bold text-(--color-success)">
            {availableSlots}
          </span>
          <span className="text-xs text-(--color-text-light) mt-0.5">
            Available
          </span>
        </div>
        <div className="w-px h-8 bg-(--color-border)" />
        <div className="flex flex-col">
          <span className="text-2xl font-bold text-red-500">
            {totalSlots - availableSlots}
          </span>
          <span className="text-xs text-(--color-text-light) mt-0.5">
            Unavailable
          </span>
        </div>
      </div>

      {/* Weekly schedule card */}
      <div className="bg-(--color-surface) rounded-2xl border border-(--color-border) shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-(--color-border) flex items-center gap-2">
          <ClockIcon />
          <h2 className="text-base font-semibold text-(--color-text)">
            Weekly Schedule
          </h2>
        </div>

        <div className="divide-y divide-(--color-border)">
          {schedule.map((day) => (
            <div key={day.name} className="px-5 py-4">
              {/* Day header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-(--color-text)">
                    {day.name}
                  </span>
                  <span className="text-xs bg-(--color-primary-lighter) text-(--color-primary) font-medium px-2 py-0.5 rounded-full">
                    {day.slots.length} slot{day.slots.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              {/* Slots */}
              {day.slots.length === 0 ? (
                <p className="text-xs text-(--color-text-light) italic pl-1">
                  No slots added yet — use the form to add one.
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  {day.slots.map((slot) => (
                    <div
                      key={slot.id}
                      className="flex items-center justify-between rounded-lg border border-(--color-border) px-3 py-2.5 bg-(--color-bg) group hover:border-(--color-primary)/40 transition-colors duration-150"
                    >
                      {/* Time range */}
                      <div className="flex items-center gap-2">
                        <ClockIcon />
                        <span className="text-sm font-medium text-(--color-text)">
                          {slot.start} – {slot.end}
                        </span>
                        <span className="text-xs text-(--color-text-light)">
                          ({slot.duration})
                        </span>
                      </div>

                      {/* Status badge + delete */}
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                            slot.available
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                          }`}
                        >
                          {slot.available ? "Available" : "Unavailable"}
                        </span>
                        <button
                          onClick={() => deleteSlot(slot.id)}
                          className="text-(--color-text-light) hover:text-red-500 transition-colors duration-150 cursor-pointer p-1 rounded opacity-0 group-hover:opacity-100"
                          aria-label="Delete slot"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Scheduling tips */}
      <div className="bg-(--color-primary-lighter) border border-(--color-primary)/20 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-(--color-primary)">
            <LightbulbIcon />
          </span>
          <h3 className="text-sm font-semibold text-(--color-primary)">
            Scheduling Tips
          </h3>
        </div>
        <ul className="flex flex-col gap-1.5">
          {SCHEDULING_TIPS.map((tip, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-xs text-(--color-text-light)"
            >
              <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-(--color-primary) shrink-0" />
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WeeklySchedulePanel;
