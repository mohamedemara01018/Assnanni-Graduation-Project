import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import FirstDiv from "../../../components/Doctor/Schedule/FirstDiv/FirstDiv";
import SecondDiv from "../../../components/Doctor/Schedule/SecondDiv/SecondDiv";
import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { dummySchedules, fallbackDays } from "@/constants/doctorConstants";
import type {
  Schedule as DoctorAppointment,
  WeeklyScheduleDay,
  WeeklyScheduleStats,
} from "@/interfaces/doctorInterfaces";

interface WeeklyScheduleData extends WeeklyScheduleStats {
  days: WeeklyScheduleDay[];
}

const defaultWeeklyScheduleData: WeeklyScheduleData = {
  totalSlots: 0,
  availableSlots: 0,
  unavailableSlots: 0,
  days: fallbackDays.map((day) => ({
    day: day.day,
    slots: day.time.map((t, index) => ({
      id: index,
      time: t,
      status: "Available",
    })),
  })),
};

const Schedule = () => {
  const queryClient = useQueryClient();
  const role = useSelector((state: RootState) => state.auth.role);
  const backendUrl = useSelector((state: RootState) => state.config.backendUrl);
  const token = Cookies.get("jwtToken");

  const deleteMutation = useMutation({
    mutationFn: async (slotId: number) => {
      return await axios.delete(
        `${backendUrl}DoctorSchedules/schedule-slot/${slotId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    },
    onSuccess: (_, slotId) => {
      queryClient.setQueryData(
        ["DoctorWeeklySchedule"],
        (oldData: WeeklyScheduleData | undefined) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            days: oldData.days.map((day) => ({
              ...day,
              slots: day.slots.map((slot) =>
                slot.id === slotId ? { ...slot, status: "Unavailable" } : slot,
              ),
            })),
          };
        },
      );
      queryClient.invalidateQueries({ queryKey: ["DoctorWeeklySchedule"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete slot");
    },
  });

  const handleDeleteSlot = (slotId: number) => {
    deleteMutation.mutate(slotId);
  };

  const {
    data: weeklySchedule = defaultWeeklyScheduleData,
    isSuccess: isWeeklyScheduleSuccess,
    isError: isWeeklyScheduleError,
    error: weeklyScheduleError,
  } = useQuery<WeeklyScheduleData>({
    queryKey: ["DoctorWeeklySchedule"],
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

      const mappedDays = data.map((dayObj: any) => {
        const slotsCount = Array.isArray(dayObj.slots)
          ? dayObj.slots.length
          : 0;
        totalSlotsCount += slotsCount;

        if (Array.isArray(dayObj.slots)) {
          dayObj.slots.forEach((slot: any) => {
            if (slot.status === "Available") {
              availableSlotsCount++;
            } else {
              unavailableSlotsCount++;
            }
          });
        }

        return {
          day: dayObj.day,
          slots: Array.isArray(dayObj.slots)
            ? dayObj.slots.map((s: any) => ({
                id: s.id,
                time: s.start || "N/A",
                status: s.status || "Available",
              }))
            : [],
        };
      });

      return {
        totalSlots: totalSlotsCount,
        availableSlots: availableSlotsCount,
        unavailableSlots: unavailableSlotsCount,
        days: mappedDays,
      };
    },
  });

  const {
    data: appointments = dummySchedules,
    isSuccess: isAppointmentsSuccess,
    isError: isAppointmentsError,
    error: appointmentsError,
  } = useQuery<DoctorAppointment[]>({
    queryKey: ["DoctorTodayAppointments"],
    queryFn: async () => {
      const response = await axios.get(`${backendUrl}Doctors/today`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data?.value || response.data?.data || response.data;

      if (Array.isArray(data)) {
        return data;
      }
      return dummySchedules;
    },
  });

  useEffect(() => {
    if (isWeeklyScheduleSuccess) {
      toast.success("Weekly schedule loaded");
    }

    if (isWeeklyScheduleError) {
      console.error("Failed to fetch weekly schedule:", weeklyScheduleError);
      toast.error(
        weeklyScheduleError.message || "Failed to load weekly schedule",
      );
    }
  }, [isWeeklyScheduleSuccess, isWeeklyScheduleError, weeklyScheduleError]);

  useEffect(() => {
    if (isAppointmentsError) {
      console.error("Error fetching appointments:", appointmentsError);
      toast.error(appointmentsError.message || "Failed to load appointments");
    }
  }, [
    isAppointmentsSuccess,
    isAppointmentsError,
    appointmentsError,
    appointments,
  ]);

  const scheduleStats: WeeklyScheduleStats = {
    totalSlots: weeklySchedule.totalSlots,
    availableSlots: weeklySchedule.availableSlots,
    unavailableSlots: weeklySchedule.unavailableSlots,
  };

  return (
    <DashboardLayout pageTitle={"Doctor Weekly Schedule"}>
      <div className="flex flex-col gap-6 px-1">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold text-(--color-text)">
            {role === "studentDoctor" ? "Supervisor's Schedule" : "My Schedule"}
          </h1>
          <p className="text-gray-500 text-sm">
            {role === "studentDoctor"
              ? "View availability and upcoming appointments"
              : "Manage your availability and appointments"}
          </p>
        </div>
        {role === "studentDoctor" ? (
          <div className="w-full">
            <FirstDiv
              role={role}
              days={weeklySchedule.days}
              appointments={appointments}
              onDeleteSlot={handleDeleteSlot}
            />
          </div>
        ) : (
          <div className="flex max-md:flex-col gap-6">
            <div className="flex-2">
              <FirstDiv
                role={role}
                days={weeklySchedule.days}
                appointments={appointments}
                onDeleteSlot={handleDeleteSlot}
              />
            </div>
            <div className="flex-1">
              <SecondDiv role={role} stats={scheduleStats} />
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Schedule;
