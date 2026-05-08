import { useEffect, useState } from "react";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import Cookies from "js-cookie";
interface TimeSlot {
  id: number;
  start: string;
  end: string;
  duration: string;
  available: boolean;
}

interface DaySchedule {
  id: number;
  name: string;
  slots: TimeSlot[];
}

interface WeeklySchedulePanelData {
  schedule: DaySchedule[];
  totalSlots: number;
  availableSlots: number;
  unavailableSlots: number;
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

// Restore icon
const RestoreIcon = () => (
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
      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
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

const initialPanelData: WeeklySchedulePanelData = {
  schedule: initialSchedule,
  totalSlots: initialSchedule.reduce((acc, day) => acc + day.slots.length, 0),
  availableSlots: initialSchedule.reduce(
    (acc, day) => acc + day.slots.filter((slot) => slot.available).length,
    0,
  ),
  unavailableSlots: initialSchedule.reduce(
    (acc, day) => acc + day.slots.filter((slot) => !slot.available).length,
    0,
  ),
};

const formatTimeTo12Hour = (time: string) => {
  if (!time || time === "N/A") return "N/A";
  try {
    const [hours, minutes] = time.split(":").map(Number);
    if (isNaN(hours) || isNaN(minutes)) return time;
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
  } catch {
    return time;
  }
};

const WeeklySchedulePanel = () => {
  const queryClient = useQueryClient();
  const backendUrl = useSelector((state: RootState) => state.config.backendUrl);
  const token = Cookies.get("jwtToken");

  // Range blocking/unblocking state
  const [activeRangeDay, setActiveRangeDay] = useState<number | null>(null);
  const [rangeMode, setRangeMode] = useState<"block" | "unblock">("block");
  const [rangeStart, setRangeStart] = useState("09:00:00");
  const [rangeEnd, setRangeEnd] = useState("17:00:00");

  const blockRangeMutation = useMutation({
    mutationFn: async (payload: { id: number; start: string; end: string }) => {
      return await axios.patch(
        `${backendUrl}DoctorSchedules/schedule/block-range`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    },
    onSuccess: () => {
      toast.success("Time range blocked successfully");
      queryClient.invalidateQueries({ queryKey: ["DoctorSchedules"] });
      setActiveRangeDay(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to block range");
    },
  });

  const unblockRangeMutation = useMutation({
    mutationFn: async (payload: { id: number; start: string; end: string }) => {
      return await axios.patch(
        `${backendUrl}DoctorSchedules/schedule/unblock-range`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    },
    onSuccess: () => {
      toast.success("Time range restored successfully");
      queryClient.invalidateQueries({ queryKey: ["DoctorSchedules"] });
      setActiveRangeDay(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to restore range");
    },
  });
  const {
    data: weeklySchedule = initialPanelData,
    isError: isFetchError,
    isSuccess: isFetchSuccess,
    error: fetchError,
    isLoading: isFetching,
  } = useQuery<WeeklySchedulePanelData>({
    queryKey: ["DoctorSchedules"],
    queryFn: async () => {
      const response = await axios.get(`${backendUrl}DoctorSchedules`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data?.data || [];

      let totalSlotsCount = 0;
      let availableSlotsCount = 0;
      let unavailableSlotsCount = 0;

      const mappedSchedule = data.map((dayObj: any, index: number) => {
        const slotsCount = Array.isArray(dayObj.slots)
          ? dayObj.slots.length
          : 0;
        totalSlotsCount += slotsCount;

        const mappedSlots = Array.isArray(dayObj.slots)
          ? dayObj.slots.map((s: any) => {
              const isAvailable = s.status === "Available";
              if (isAvailable) {
                availableSlotsCount++;
              } else {
                unavailableSlotsCount++;
              }

              // Try to calculate duration from start and end times
              let durationStr = "30 minutes";
              if (s.start && s.end) {
                const [h1, m1] = s.start.split(":").map(Number);
                const [h2, m2] = s.end.split(":").map(Number);
                const diffMinutes = h2 * 60 + m2 - (h1 * 60 + m1);
                if (diffMinutes > 0) {
                  durationStr = `${diffMinutes} minutes`;
                }
              }

              return {
                id: s.id,
                start: s.start || "N/A",
                end: s.end || "N/A",
                duration: durationStr,
                available: isAvailable,
              };
            })
          : [];

        return {
          id: index,
          name: dayObj.day,
          slots: mappedSlots,
        };
      });

      return {
        totalSlots: totalSlotsCount,
        availableSlots: availableSlotsCount,
        unavailableSlots: unavailableSlotsCount,
        schedule: mappedSchedule,
      };
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async ({ slotId }: { dayName: string; slotId: number }) => {
      return await axios.delete(
        `${backendUrl}DoctorSchedules/schedule-slot/${slotId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    },
    onSuccess: (_, variables) => {
      // Update locally to show as unavailable immediately
      queryClient.setQueryData(
        ["DoctorSchedules"],
        (oldData: WeeklySchedulePanelData | undefined) => {
          if (!oldData) return oldData;
          const schedule = oldData.schedule.map((day) =>
            day.name !== variables.dayName
              ? day
              : {
                  ...day,
                  slots: day.slots.map((slot) =>
                    slot.id === variables.slotId
                      ? { ...slot, available: false }
                      : slot,
                  ),
                },
          );

          return {
            ...oldData,
            schedule,
            availableSlots: schedule.reduce(
              (acc, day) =>
                acc + day.slots.filter((slot) => slot.available).length,
              0,
            ),
            unavailableSlots: schedule.reduce(
              (acc, day) =>
                acc + day.slots.filter((slot) => !slot.available).length,
              0,
            ),
          };
        },
      );
      toast.success("Time slot deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["DoctorSchedules"] });
    },
    onError: (error: any) => {
      console.error("Error deleting slot:", error);
      toast.error(error.response?.data?.message || "Failed to delete slot");
    },
  });

  const restoreMutation = useMutation({
    mutationFn: async ({ slotId }: { dayName: string; slotId: number }) => {
      return await axios.patch(
        `${backendUrl}DoctorSchedules/schedule-slot/${slotId}/restore`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    },
    onSuccess: (_, variables) => {
      // Update locally to show as available immediately
      queryClient.setQueryData(
        ["DoctorSchedules"],
        (oldData: WeeklySchedulePanelData | undefined) => {
          if (!oldData) return oldData;
          const schedule = oldData.schedule.map((day) =>
            day.name !== variables.dayName
              ? day
              : {
                  ...day,
                  slots: day.slots.map((slot) =>
                    slot.id === variables.slotId
                      ? { ...slot, available: true }
                      : slot,
                  ),
                },
          );

          return {
            ...oldData,
            schedule,
            availableSlots: schedule.reduce(
              (acc, day) =>
                acc + day.slots.filter((slot) => slot.available).length,
              0,
            ),
            unavailableSlots: schedule.reduce(
              (acc, day) =>
                acc + day.slots.filter((slot) => !slot.available).length,
              0,
            ),
          };
        },
      );
      toast.success("Time slot restored successfully");
      queryClient.invalidateQueries({ queryKey: ["DoctorSchedules"] });
    },
    onError: (error: any) => {
      console.error("Error restoring slot:", error);
      toast.error(error.response?.data?.message || "Failed to restore slot");
    },
  });

  useEffect(() => {
    if (isFetchSuccess) {
      toast.success("Weekly schedule loaded");
    }

    if (isFetchError) {
      console.error("Failed to load schedules:", fetchError);
      toast.error("Failed to load schedules. Showing local data.");
    }
  }, [isFetchSuccess, isFetchError, fetchError]);

  const deleteSlot = (dayName: string, slotId: number) => {
    deleteMutation.mutate({ dayName, slotId });
  };

  const { schedule, totalSlots, availableSlots, unavailableSlots } =
    weeklySchedule;

  if (isFetching) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 bg-(--color-surface) rounded-2xl border border-(--color-border) shadow-sm">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-(--color-primary)/10 rounded-full" />
          <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-(--color-primary) rounded-full animate-spin" />
        </div>
        <div className="flex flex-col items-center gap-1">
          <p className="text-sm font-semibold text-(--color-text) animate-pulse">
            Fetching Schedule
          </p>
          <p className="text-xs text-(--color-text-light)">
            Please wait a moment...
          </p>
        </div>
      </div>
    );
  }

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
            {unavailableSlots}
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

                <div className="flex items-center gap-4">
                  {day.slots.length > 0 && (
                    <div className="flex gap-4">
                      <button
                        onClick={() => {
                          setActiveRangeDay(day.id);
                          setRangeMode("block");
                        }}
                        disabled={!day.slots.some((s) => s.available)}
                        className={`text-xs font-medium transition-colors ${
                          !day.slots.some((s) => s.available)
                            ? "text-gray-300 dark:text-gray-700 cursor-not-allowed"
                            : "text-red-500 hover:text-red-600 hover:underline cursor-pointer"
                        }`}
                      >
                        Delete Range of time
                      </button>
                      <button
                        onClick={() => {
                          setActiveRangeDay(day.id);
                          setRangeMode("unblock");
                        }}
                        disabled={!day.slots.some((s) => !s.available)}
                        className={`text-xs font-medium transition-colors ${
                          !day.slots.some((s) => !s.available)
                            ? "text-gray-300 dark:text-gray-700 cursor-not-allowed"
                            : "text-green-500 hover:text-green-600 hover:underline cursor-pointer"
                        }`}
                      >
                        Restore Range of time
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Range form */}
              {activeRangeDay === day.id && (
                <div className="mb-4 p-3 bg-(--color-bg) rounded-xl border border-(--color-border) flex flex-wrap items-end gap-3 shadow-sm animate-in fade-in slide-in-from-top-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-bold text-(--color-text-light)">
                      Start Time
                    </label>
                    <input
                      type="time"
                      step="1"
                      value={rangeStart}
                      onChange={(e) => setRangeStart(e.target.value)}
                      className="text-xs border border-(--color-border) rounded-lg px-2 py-1.5 bg-(--color-bg) text-(--color-text) focus:ring-2 focus:ring-(--color-primary)/20 outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-bold text-(--color-text-light)">
                      End Time
                    </label>
                    <input
                      type="time"
                      step="1"
                      value={rangeEnd}
                      onChange={(e) => setRangeEnd(e.target.value)}
                      className="text-xs border border-(--color-border) rounded-lg px-2 py-1.5 bg-(--color-bg) text-(--color-text) focus:ring-2 focus:ring-(--color-primary)/20 outline-none"
                    />
                  </div>
                  <button
                    onClick={() => {
                      const formatTime = (time: string) => {
                        return time.split(":").length === 2
                          ? `${time}:00`
                          : time;
                      };
                      const payload = {
                        id: schedule.indexOf(day) + 1,
                        start: formatTime(rangeStart),
                        end: formatTime(rangeEnd),
                      };
                      if (rangeMode === "block")
                        blockRangeMutation.mutate(payload);
                      else unblockRangeMutation.mutate(payload);
                    }}
                    disabled={
                      blockRangeMutation.isPending ||
                      unblockRangeMutation.isPending
                    }
                    className={`text-xs font-semibold px-4 py-1.5 rounded-lg text-white shadow-sm transition-all active:scale-[0.98] ${
                      rangeMode === "block"
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-green-500 hover:bg-green-600"
                    }`}
                  >
                    {blockRangeMutation.isPending ||
                    unblockRangeMutation.isPending
                      ? "Processing..."
                      : rangeMode === "block"
                        ? "Delete Range"
                        : "Restore Range"}
                  </button>
                  <button
                    onClick={() => setActiveRangeDay(null)}
                    className="text-xs font-medium text-(--color-text-light) hover:text-(--color-text) px-2 py-1.5 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {/* Slots */}
              {day.slots.length === 0 ? (
                <p className="text-xs text-(--color-text-light) italic pl-1">
                  No slots added yet — use the form to add one.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {day.slots.map((slot) => (
                    <div
                      key={slot.id}
                      className="flex flex-col gap-3 rounded-xl border border-(--color-border) p-4 bg-(--color-bg) group hover:border-(--color-primary)/40 transition-all duration-200 hover:shadow-md"
                    >
                      {/* Time range */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-2 rounded-lg bg-(--color-primary-lighter) text-(--color-primary)">
                            <ClockIcon />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-(--color-text)">
                              {formatTimeTo12Hour(slot.start)} –{" "}
                              {formatTimeTo12Hour(slot.end)}
                            </span>
                            <span className="text-[10px] text-(--color-text-light) font-medium">
                              {slot.duration} session
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            slot.available
                              ? deleteSlot(day.name, slot.id)
                              : restoreMutation.mutate({
                                  dayName: day.name,
                                  slotId: slot.id,
                                })
                          }
                          className={`text-(--color-text-light) transition-all duration-150 cursor-pointer p-2 rounded-lg ${
                            slot.available
                              ? "hover:bg-red-50 hover:text-red-500"
                              : "hover:bg-green-50 hover:text-green-500"
                          }`}
                          aria-label={
                            slot.available ? "Delete slot" : "Restore slot"
                          }
                        >
                          {slot.available ? <TrashIcon /> : <RestoreIcon />}
                        </button>
                      </div>

                      {/* Status badge */}
                      <div
                        className={`text-center py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${
                          slot.available
                            ? "bg-green-50 text-green-600 border-green-100 dark:bg-green-900/10"
                            : "bg-red-50 text-red-600 border-red-100 dark:bg-red-900/10"
                        }`}
                      >
                        {slot.available ? "Available" : "Unavailable"}
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
