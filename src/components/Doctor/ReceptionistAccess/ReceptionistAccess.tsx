import { useState } from "react";
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import { FiShield, FiClock, FiX } from "react-icons/fi";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";
import { NavLink } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { ScaleLoader } from "react-spinners";
import { toast } from "react-toastify";

interface Receptionist {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  isActive: boolean;
  createdAt: string;
  lastLoginDate: string;
  shift: string;
  shiftStart: string;
  shiftEnd: string;
}

interface ReceptionistAccessData {
  statistics: {
    totalReceptionists: number;
    activeReceptionists: number;
    inactiveReceptionists: number;
  };
  receptionists: Receptionist[];
}

const formatTime = (time: string) => {
  if (!time) return "";
  const parts = time.split(":");
  if (parts.length >= 2) {
    return `${parts[0]}:${parts[1]}`;
  }
  return time;
};

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const colors = [
  "bg-blue-500",
  "bg-emerald-500",
  "bg-purple-500",
  "bg-orange-500",
  "bg-pink-500",
];

const ReceptionistAccess = () => {
  const queryClient = useQueryClient();
  const backendUrl = useSelector((state: RootState) => state.config.backendUrl);
  const token = Cookies.get("jwtToken");

  const { data, isLoading, isError } = useQuery<ReceptionistAccessData>({
    queryKey: ["my-receptionists"],
    queryFn: async () => {
      const response = await axios.get(`${backendUrl}Doctors/My-Receptionst`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    },
    enabled: !!token && !!backendUrl,
  });

  const updateShiftMutation = useMutation({
    mutationFn: async (payload: {
      receptionistId: string;
      shiftType: string;
      requestedStart: string;
      requestedEnd: string;
    }) => {
      const { shiftType, ...body } = payload;
      await axios.patch(
        `${backendUrl}Doctors/update-receptionist-shift?shiftType=${shiftType}`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-receptionists"] });
      toast.success("Shift updated successfully");
      setIsShiftModalOpen(false);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to update shift");
    },
  });

  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
  const [selectedReceptionist, setSelectedReceptionist] =
    useState<Receptionist | null>(null);
  const [shiftFormData, setShiftFormData] = useState({
    shiftType: "",
    requestedStart: "",
    requestedEnd: "",
  });

  const handleUpdateShiftClick = (receptionist: Receptionist) => {
    setSelectedReceptionist(receptionist);
    setShiftFormData({
      shiftType: receptionist.shift,
      requestedStart: receptionist.shiftStart,
      requestedEnd: receptionist.shiftEnd,
    });
    setIsShiftModalOpen(true);
  };

  const onShiftSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedReceptionist) {
      // Ensure time format is HH:mm:ss
      const formatWithSeconds = (t: string) => {
        if (!t) return "00:00:00";
        return t.split(":").length === 2 ? `${t}:00` : t;
      };

      updateShiftMutation.mutate({
        receptionistId: selectedReceptionist.id,
        shiftType: shiftFormData.shiftType,
        requestedStart: formatWithSeconds(shiftFormData.requestedStart),
        requestedEnd: formatWithSeconds(shiftFormData.requestedEnd),
      });
    }
  };

  const rejectShiftMutation = useMutation({
    mutationFn: async (payload: { receptionistId: string; reason: string }) => {
      await axios.post(`${backendUrl}Doctors/reject-shift-change`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-receptionists"] });
      toast.success("Shift change rejected");
      setIsRejectModalOpen(false);
      setRejectionReason("");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to reject shift change");
    },
  });

  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const handleRejectClick = (receptionist: Receptionist) => {
    setSelectedReceptionist(receptionist);
    setIsRejectModalOpen(true);
  };

  const onRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedReceptionist) {
      rejectShiftMutation.mutate({
        receptionistId: selectedReceptionist.id,
        reason: rejectionReason,
      });
    }
  };

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const endpoint = isActive ? "deactivate" : "activate";
      await axios.patch(
        `${backendUrl}Doctors/${id}/${endpoint}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["my-receptionists"] });
      toast.success(
        `Receptionist ${
          variables.isActive ? "deactivated" : "activated"
        } successfully`,
      );
    },
    onError: () => {
      toast.error("Failed to update receptionist status");
    },
  });

  if (isLoading) {
    return (
      <DashboardLayout pageTitle={"Access Control"}>
        <div className="flex justify-center items-center h-screen">
          <ScaleLoader color="#2563eb" />
        </div>
      </DashboardLayout>
    );
  }

  if (isError) {
    return (
      <DashboardLayout pageTitle={"Access Control"}>
        <div className="flex justify-center items-center h-screen text-red-500 font-bold">
          Failed to load receptionist data. Please try again.
        </div>
      </DashboardLayout>
    );
  }

  const { statistics, receptionists } = data || {
    statistics: {
      totalReceptionists: 0,
      activeReceptionists: 0,
      inactiveReceptionists: 0,
    },
    receptionists: [],
  };

  return (
    <DashboardLayout pageTitle={"Access Control"}>
      <div className="-mt-6 -ml-6 bg-(--color-bg) rounded-2xl min-h-screen">
        <div className="flex justify-between items-center p-6 pb-2">
          <div>
            <h1 className="text-2xl text-(--color-text) font-medium font-sans">
              Receptionist Access Control
            </h1>
            <p className="text-(--color-text-light) font-thin text-sm mt-1">
              Manage receptionist permissions and access levels
            </p>
          </div>
          <NavLink
            to="/receptionist-access/add"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition w-fit"
          >
            <span className="text-lg leading-none">+</span> Add Receptionist
          </NavLink>
        </div>

        <div className="px-6 flex flex-col gap-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4 max-md:grid-cols-1">
            <div className="bg-(--color-surface) rounded-xl p-4 flex gap-4 items-center border border-gray-100 dark:border-gray-800">
              <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-2xl">
                <FiShield />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-(--color-text)">
                  {statistics.totalReceptionists}
                </h2>
                <p className="text-xs text-(--color-text-light)">
                  Total Receptionists
                </p>
              </div>
            </div>
            <div className="bg-(--color-surface) rounded-xl p-4 flex gap-4 items-center border border-gray-100 dark:border-gray-800">
              <div className="w-12 h-12 rounded-lg bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center text-2xl">
                <AiOutlineCheckCircle />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-(--color-text)">
                  {statistics.activeReceptionists}
                </h2>
                <p className="text-xs text-(--color-text-light)">Active</p>
              </div>
            </div>
            <div className="bg-(--color-surface) rounded-xl p-4 flex gap-4 items-center border border-gray-100 dark:border-gray-800">
              <div className="w-12 h-12 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 flex items-center justify-center text-2xl">
                <AiOutlineCloseCircle />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-(--color-text)">
                  {statistics.inactiveReceptionists}
                </h2>
                <p className="text-xs text-(--color-text-light)">Inactive</p>
              </div>
            </div>
          </div>

          {/* List */}
          <div className="bg-(--color-surface) rounded-xl p-6 border border-gray-100 dark:border-gray-800">
            <h2 className="text-lg font-medium text-(--color-text) mb-4">
              Receptionist List
            </h2>
            <div className="flex flex-col gap-4">
              {receptionists.length > 0 ? (
                receptionists.map((receptionist, index) => (
                  <div
                    key={receptionist.id}
                    className={`flex items-center justify-between ${
                      index !== receptionists.length - 1
                        ? "border-b border-gray-100 dark:border-gray-800 pb-4"
                        : "pb-2"
                    } max-lg:flex-col max-lg:items-start max-lg:gap-4`}
                  >
                    <div className="flex gap-4 items-center w-2/3 max-lg:w-full">
                      <div
                        className={`w-14 h-14 ${
                          colors[index % colors.length]
                        } rounded-2xl flex items-center justify-center text-white text-lg font-bold shrink-0 shadow-lg shadow-black/5`}
                      >
                        {getInitials(receptionist.fullName)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex gap-3 items-center">
                          <h3 className="text-(--color-text) font-bold text-base truncate">
                            {receptionist.fullName}
                          </h3>
                          <span
                            className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter ${
                              receptionist.isActive
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            }`}
                          >
                            {receptionist.isActive ? "Online" : "Offline"}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <p className="text-xs text-(--color-text-light) truncate">
                            {receptionist.email}
                          </p>
                          <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
                          <p className="text-xs text-(--color-text-light)">
                            {receptionist.phoneNumber}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="text-red-500 font-semibold">
                            Shift:
                          </span>
                          <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-900/20 w-fit px-2.5 py-1 rounded-lg border border-blue-100/50 dark:border-blue-800/50">
                            {receptionist.shift}
                          </p>
                          <p className="text-[10px] text-gray-600 dark:text-gray-400 font-bold bg-gray-50 dark:bg-gray-800/50 w-fit px-2.5 py-1 rounded-lg border border-gray-100 dark:border-gray-700">
                            Start: {formatTime(receptionist.shiftStart)} End:{" "}
                            {formatTime(receptionist.shiftEnd)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateShiftClick(receptionist)}
                        className="bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40 px-4 py-2 rounded-lg text-sm transition font-medium cursor-pointer"
                      >
                        Update Shift
                      </button>
                      <button
                        onClick={() => handleRejectClick(receptionist)}
                        className="bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 px-4 py-2 rounded-lg text-sm transition font-medium cursor-pointer"
                      >
                        Reject Change
                      </button>
                      <button
                        onClick={() =>
                          toggleStatusMutation.mutate({
                            id: receptionist.id,
                            isActive: receptionist.isActive,
                          })
                        }
                        disabled={toggleStatusMutation.isPending}
                        className={`${
                          receptionist.isActive
                            ? "bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40"
                            : "bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/40"
                        } px-4 py-2 rounded-lg text-sm transition font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {toggleStatusMutation.isPending &&
                        toggleStatusMutation.variables?.id === receptionist.id
                          ? "Updating..."
                          : receptionist.isActive
                            ? "Deactivate"
                            : "Activate"}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center text-(--color-text-light)">
                  No receptionists found. Click "Add Receptionist" to create
                  one.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Update Shift Modal */}
      {isShiftModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-(--color-surface) rounded-3xl w-full max-w-md shadow-2xl border border-(--color-border) animate-in zoom-in duration-200">
            <div className="p-6 border-b border-(--color-border) flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-(--color-text)">
                  Update Shift
                </h2>
                <p className="text-sm text-(--color-text-light)">
                  Modify working hours for {selectedReceptionist?.fullName}
                </p>
              </div>
              <button
                onClick={() => setIsShiftModalOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors cursor-pointer"
              >
                <FiX className="text-xl text-(--color-text-light)" />
              </button>
            </div>

            <form onSubmit={onShiftSubmit} className="p-6 space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-(--color-text-light) uppercase tracking-wider">
                  Shift Type
                </label>
                <select
                  required
                  className="bg-gray-50 dark:bg-gray-800/30 border border-(--color-border) rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer"
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
                    className="bg-gray-50 dark:bg-gray-800/30 border border-(--color-border) rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
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
                    className="bg-gray-50 dark:bg-gray-800/30 border border-(--color-border) rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
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
                  onClick={() => setIsShiftModalOpen(false)}
                  className="flex-1 py-3 text-(--color-text-light) font-bold hover:text-(--color-text) transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateShiftMutation.isPending}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-95 cursor-pointer"
                >
                  {updateShiftMutation.isPending ? "Saving..." : "Save Shift"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reject Change Modal */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-(--color-surface) rounded-3xl w-full max-w-md shadow-2xl border border-(--color-border) animate-in zoom-in duration-200">
            <div className="p-6 border-b border-(--color-border) flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-(--color-text)">
                  Reject Shift Change
                </h2>
                <p className="text-sm text-(--color-text-light)">
                  Provide a reason for rejecting the request
                </p>
              </div>
              <button
                onClick={() => setIsRejectModalOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors cursor-pointer"
              >
                <FiX className="text-xl text-(--color-text-light)" />
              </button>
            </div>

            <form onSubmit={onRejectSubmit} className="p-6 space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-(--color-text-light) uppercase tracking-wider">
                  Rejection Reason
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Explain why this shift change is being rejected..."
                  className="bg-gray-50 dark:bg-gray-800/30 border border-(--color-border) rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsRejectModalOpen(false)}
                  className="flex-1 py-3 text-(--color-text-light) font-bold hover:text-(--color-text) transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={rejectShiftMutation.isPending}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-red-500/20 active:scale-95 cursor-pointer"
                >
                  {rejectShiftMutation.isPending ? "Rejecting..." : "Confirm Rejection"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ReceptionistAccess;
