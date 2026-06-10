import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import DashboardCard from "@/components/DashboardCard/DashboardCard";
import FirstDiv from "@/components/Receptionist/Dashboard/FirstDiv/FirstDiv";
import SecondDiv from "@/components/Receptionist/Dashboard/SecondDiv/SecondDiv";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";
import { BsCalendar3 } from "react-icons/bs";
import { ImClock } from "react-icons/im";
import { LuUsers } from "react-icons/lu";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { FiClock, FiX, FiArrowRight } from "react-icons/fi";
import { useState } from "react";
import { toast } from "react-toastify";

type ReceptionistDashboardCards = {
  appointments: number;
  inQueue: number;
  totalPatients: number;
};

const defaultDashboardCards: ReceptionistDashboardCards = {
  appointments: 0,
  inQueue: 0,
  totalPatients: 0,
};

const ReceptionistDashboard = () => {
  const backendUrl = useSelector((state: RootState) => state.config.backendUrl);
  const token = Cookies.get("jwtToken");

  const { data: dashboardCards = defaultDashboardCards } =
    useQuery<ReceptionistDashboardCards>({
      queryKey: ["ReceptionistDashboardCards"],
      queryFn: async () => {
        const response = await axios.get(
          `${backendUrl}Receptionist/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data =
          response.data?.data || response.data?.value || response.data;

        return {
          appointments:
            data?.appointments ?? defaultDashboardCards.appointments,
          inQueue: data?.inQueue ?? defaultDashboardCards.inQueue,
          totalPatients:
            data?.totalPatients ?? defaultDashboardCards.totalPatients,
        };
      },
    });

  const { fullName, name: authName } = useSelector(
    (state: RootState) => state.auth,
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shiftFormData, setShiftFormData] = useState({
    shiftType: "Morning",
    requestedStart: "",
    requestedEnd: "",
  });

  const { data: shiftData, isLoading: isShiftLoading } = useQuery({
    queryKey: ["receptionist-shift"],
    queryFn: async () => {
      const response = await axios.get(`${backendUrl}Receptionist/my-shift`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    },
    enabled: !!token && !!backendUrl,
  });

  const requestShiftMutation = useMutation({
    mutationFn: async (payload: {
      shiftType: string;
      requestedStart: string;
      requestedEnd: string;
    }) => {
      const { shiftType, ...body } = payload;
      // Ensure HH:mm:ss format
      const formatWithSeconds = (t: string) =>
        t.split(":").length === 2 ? `${t}:00` : t;

      await axios.post(
        `${backendUrl}Receptionist/request-shift-change?shiftType=${shiftType}`,
        {
          requestedStart: formatWithSeconds(body.requestedStart),
          requestedEnd: formatWithSeconds(body.requestedEnd),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
    },
    onSuccess: () => {
      setIsModalOpen(false);
    },
    onError: (err: any) => {
      toast.error(
        err.response?.data?.message || "Failed to submit shift change request",
      );
    },
  });

  const handleShiftSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    requestShiftMutation.mutate(shiftFormData);
  };

  const formatTime = (time: string) => {
    if (!time) return "";
    const parts = time.split(":");
    return parts.length >= 2 ? `${parts[0]}:${parts[1]}` : time;
  };

  return (
    <DashboardLayout pageTitle={"Receptionist Dashboard"}>
      <div className="-mt-6 bg-(--color-bg) rounded-2xl min-h-screen">
        <div className="p-8">
          <h1 className="text-3xl text-(--color-text) font-bold mb-1">
            Welcome, {fullName || authName || "Receptionist"}!
          </h1>
          <p className="text-(--color-text-light) font-medium text-sm mb-10">
            Manage patient flow and appointments
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <DashboardCard
              title="Appointments"
              subTitle="Today"
              num={dashboardCards.appointments.toString()}
              logo={<BsCalendar3 />}
              color="blue"
            />
            <DashboardCard
              title="In Queue"
              subTitle="Active"
              num={dashboardCards.inQueue.toString()}
              logo={<ImClock />}
              color="orange"
            />
            <DashboardCard
              title="Total Patients"
              subTitle="+5"
              num={dashboardCards.totalPatients.toString()}
              logo={<LuUsers />}
              color="green"
            />

            {/* Shift Card */}
            <div className="flex flex-col bg-(--color-surface) border border-(--color-border) shadow-sm w-full p-6 rounded-2xl gap-3 hover:shadow-md transition-all group relative overflow-hidden">
              <div className="flex justify-between items-start relative z-10">
                <div className="bg-violet-50 text-violet-500 border-violet-100 w-12 h-12 flex items-center justify-center rounded-2xl border shadow-xs transition-transform group-hover:scale-110">
                  <div className="text-xl">
                    <FiClock />
                  </div>
                </div>
                <div className="h-fit py-1 px-3 rounded-full text-[10px] font-bold uppercase tracking-wider bg-violet-100 text-violet-600">
                  Current Shift
                </div>
              </div>
              <div className="relative z-10">
                <p className="text-2xl text-(--color-text) font-black tracking-tight flex items-center gap-2">
                  {isShiftLoading ? (
                    "..."
                  ) : (
                    <>
                      {shiftData?.shift || "N/A"}
                      <span className="text-[10px] font-medium text-(--color-text-light) bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-md">
                        {formatTime(shiftData?.shiftStart)} -{" "}
                        {formatTime(shiftData?.shiftEnd)}
                      </span>
                    </>
                  )}
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="mt-3 text-[11px] font-bold text-violet-600 dark:text-violet-400 flex items-center gap-1 hover:gap-2 transition-all cursor-pointer group/btn uppercase tracking-widest"
                >
                  Request Change <FiArrowRight className="transition-all" />
                </button>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-[0.03] dark:opacity-[0.05] group-hover:scale-110 transition-transform">
                <FiClock size={100} />
              </div>
            </div>
          </div>

          <div className="flex gap-8 max-xl:flex-col items-start">
            <FirstDiv />
            <SecondDiv />
          </div>
        </div>
      </div>

      {/* Shift Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-(--color-surface) rounded-3xl w-full max-w-md shadow-2xl border border-(--color-border) animate-in zoom-in duration-200">
            <div className="p-6 border-b border-(--color-border) flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-(--color-text)">
                  Request Shift Change
                </h2>
                <p className="text-sm text-(--color-text-light)">
                  Proposed hours will be sent for review
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors cursor-pointer"
              >
                <FiX className="text-xl text-(--color-text-light)" />
              </button>
            </div>

            <form onSubmit={handleShiftSubmit} className="p-6 space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-(--color-text-light) uppercase tracking-wider">
                  Target Shift
                </label>
                <select
                  required
                  className="bg-gray-50 dark:bg-gray-800/30 border border-(--color-border) rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all appearance-none cursor-pointer"
                  value={shiftFormData.shiftType}
                  onChange={(e) =>
                    setShiftFormData({
                      ...shiftFormData,
                      shiftType: e.target.value,
                    })
                  }
                >
                  <option value="Morning">Morning</option>
                  <option value="Evening">Evening</option>
                  <option value="Night">Night</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-(--color-text-light) uppercase tracking-wider">
                    Start Time
                  </label>
                  <input
                    type="time"
                    required
                    className="bg-gray-50 dark:bg-gray-800/30 border border-(--color-border) rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all"
                    value={shiftFormData.requestedStart}
                    onChange={(e) =>
                      setShiftFormData({
                        ...shiftFormData,
                        requestedStart: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-(--color-text-light) uppercase tracking-wider">
                    End Time
                  </label>
                  <input
                    type="time"
                    required
                    className="bg-gray-50 dark:bg-gray-800/30 border border-(--color-border) rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all"
                    value={shiftFormData.requestedEnd}
                    onChange={(e) =>
                      setShiftFormData({
                        ...shiftFormData,
                        requestedEnd: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 text-(--color-text-light) font-bold hover:text-(--color-text) transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={requestShiftMutation.isPending}
                  className="flex-1 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-violet-500/20 active:scale-95 cursor-pointer"
                >
                  {requestShiftMutation.isPending
                    ? "Submitting..."
                    : "Send Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ReceptionistDashboard;
