import { useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

const QuickStats = () => {
  const backendUrl = useSelector((state: RootState) => state.config.backendUrl);

  const {
    data: apptsData,
    isSuccess: isApptsSuccess,
    isError: isApptsError,
    error: apptsError,
  } = useQuery({
    queryKey: ["TodayAppointments"],
    queryFn: async () => {
      const response = await axios.get(`${backendUrl}TodayAppointments`);
      return response.data?.value || response.data || [];
    },
  });

  const {
    data: schedulesData,
    isSuccess: isSchedulesSuccess,
    isError: isSchedulesError,
    error: schedulesError,
  } = useQuery({
    queryKey: ["DoctorSchedules"],
    queryFn: async () => {
      const response = await axios.get(`${backendUrl}DoctorSchedules`);
      return response.data?.value || response.data || [];
    },
  });

  useEffect(() => {
    if (isApptsSuccess && isSchedulesSuccess) {
      toast.success("Quick stats loaded");
    }
    if (isApptsError || isSchedulesError) {
      const err = apptsError || schedulesError;
      console.error("Error fetching stats:", err);
      toast.error(err?.message || "Failed to load quick stats");
    }
  }, [
    isApptsSuccess,
    isSchedulesSuccess,
    isApptsError,
    isSchedulesError,
    apptsError,
    schedulesError,
  ]);

  const appointmentsToday = Array.isArray(apptsData) ? apptsData.length : 3;
  const thisWeek = 15; // Static for now
  const availableSlots = Array.isArray(schedulesData)
    ? schedulesData.reduce(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (acc: number, day: any) => acc + (day.time ? day.time.length : 0),
        0,
      )
    : 24;

  return (
    <div className="flex flex-col gap-4 bg-(--color-surface) p-6 rounded-2xl border border-gray-100 dark:border-gray-800/0 shadow-sm">
      <h3 className="text-lg font-semibold text-(--color-text) mb-1">
        Quick Stats
      </h3>

      <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-4 flex flex-col gap-1 border border-transparent dark:border-blue-900/20">
        <h4 className="text-xs font-medium text-blue-500 dark:text-blue-400">
          Appointments Today
        </h4>
        <p className="text-lg font-semibold text-blue-700 dark:text-blue-200">
          {appointmentsToday}
        </p>
      </div>

      <div className="bg-emerald-50 dark:bg-emerald-900/30 rounded-xl p-4 flex flex-col gap-1 border border-transparent dark:border-emerald-900/20">
        <h4 className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
          This Week
        </h4>
        <p className="text-lg font-semibold text-emerald-800 dark:text-emerald-200">
          {thisWeek}
        </p>
      </div>

      <div className="bg-purple-50 dark:bg-purple-900/30 rounded-xl p-4 flex flex-col gap-1 border border-transparent dark:border-purple-900/20">
        <h4 className="text-xs font-medium text-purple-600 dark:text-purple-400">
          Available Slots
        </h4>
        <p className="text-lg font-semibold text-purple-800 dark:text-purple-200">
          {availableSlots}
        </p>
      </div>
    </div>
  );
};

export default QuickStats;
