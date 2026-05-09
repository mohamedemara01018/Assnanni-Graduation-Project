import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import { FiShield } from "react-icons/fi";
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
}

interface ReceptionistAccessData {
  statistics: {
    totalReceptionists: number;
    activeReceptionists: number;
    inactiveReceptionists: number;
  };
  receptionists: Receptionist[];
}

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
        }
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["my-receptionists"] });
      toast.success(
        `Receptionist ${
          variables.isActive ? "deactivated" : "activated"
        } successfully`
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
                        className={`w-12 h-12 ${
                          colors[index % colors.length]
                        } rounded-full flex items-center justify-center text-white font-semibold shrink-0`}
                      >
                        {getInitials(receptionist.fullName)}
                      </div>
                      <div>
                        <div className="flex gap-2 items-center">
                          <h3 className="text-(--color-text) font-semibold">
                            {receptionist.fullName}
                          </h3>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded ${
                              receptionist.isActive
                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                            }`}
                          >
                            {receptionist.isActive ? "active" : "inactive"}
                          </span>
                        </div>
                        <p className="text-xs text-(--color-text-light) mt-1">
                          {receptionist.email} • {receptionist.phoneNumber}
                        </p>
                        <p className="text-xs text-(--color-text-light) mt-0.5">
                          Added {receptionist.createdAt} • Last active{" "}
                          {receptionist.lastLoginDate}
                        </p>
                      </div>
                    </div>

                    <div>
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
    </DashboardLayout>
  );
};

export default ReceptionistAccess;

