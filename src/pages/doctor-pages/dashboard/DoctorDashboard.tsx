import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import FirstDiv from "../../../components/Doctor/Dashboard/FirstDiv/FirstDiv";
import SecondDiv from "../../../components/Doctor/Dashboard/SecondDiv/SecondDiv";
import { SlCalender } from "react-icons/sl";
import { LuFileSpreadsheet } from "react-icons/lu";
import { MdPeople } from "react-icons/md";
import { GoPulse } from "react-icons/go";
import DashboardCard from "@/components/DashboardCard/DashboardCard";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { MdOutlineVpnKey } from "react-icons/md";
import { Plus, X, Banknote } from "lucide-react";
import { useForm } from "react-hook-form";

type DashboardOverview = {
  todayAppointments: number;
  totalPatients: number;
  pendingScans: number;
  superVisingNumber: string;
  satisfactionRate: number;
  raw?: any;
};

const defaultDashboardOverview: DashboardOverview = {
  todayAppointments: 0,
  totalPatients: 0,
  pendingScans: 0,
  superVisingNumber: "N/A",
  satisfactionRate: 0,
  raw: null,
};

interface AllergyForm {
  name: string;
}

const DoctorDashboard = () => {
  const backendUrl = useSelector((state: RootState) => state.config.backendUrl);
  const token = Cookies.get("jwtToken");
  const [isAllergyModalOpen, setIsAllergyModalOpen] = useState(false);
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [newPrice, setNewPrice] = useState<number>(0);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AllergyForm>();

  const {
    data: dashboardData = defaultDashboardOverview,
    isSuccess,
    isError,
    error,
  } = useQuery<DashboardOverview>({
    queryKey: ["DoctorDashboardOverview"],
    queryFn: async () => {
      const response = await axios.get(backendUrl + "Doctors/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data?.data || response.data;

      if (data) {
        return {
          todayAppointments: data.todayAppointments ?? 0,
          totalPatients: data.totalPatients ?? 0,
          pendingScans: data.pendingScans ?? 0,
          superVisingNumber: data.superVisingNumber ?? "N/A",
          satisfactionRate: data.satisfactionRate ?? 0,
          raw: data,
        };
      }
      return defaultDashboardOverview;
    },
  });

  const allergyMutation = useMutation({
    mutationFn: async (data: AllergyForm) => {
      await axios.post(`${backendUrl}Allergies`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: () => {
      toast.success("Allergy record added successfully");
      setIsAllergyModalOpen(false);
      reset();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to add allergy record");
    },
  });

  const onAllergySubmit = (data: AllergyForm) => {
    allergyMutation.mutate(data);
  };

  const {
    data: priceData,
    isLoading: isPriceLoading,
    refetch: refetchPrice,
  } = useQuery({
    queryKey: ["ConsultationPrice"],
    queryFn: async () => {
      const response = await axios.get(
        backendUrl + "Doctors/consultation-price",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data.data;
    },
    enabled: !!token && !!backendUrl,
  });

  const updatePriceMutation = useMutation({
    mutationFn: async (price: number) => {
      await axios.patch(
        `${backendUrl}Doctors/consultation-price`,
        { price },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    },
    onSuccess: () => {
      toast.success("Consultation price updated successfully");
      setIsPriceModalOpen(false);
      refetchPrice();
    },
    onError: (err: any) => {
      toast.error(
        err.response?.data?.message || "Failed to update consultation price",
      );
    },
  });

  const onPriceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePriceMutation.mutate(newPrice);
  };

  const { fullName } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isError) {
      console.error("Failed to fetch dashboard data:", error);
      toast.error(error.message || "Failed to load dashboard overview");
    }
  }, [isSuccess, isError, error, dashboardData]);

  const { name: authName } = useSelector((state: RootState) => state.auth);

  return (
    <DashboardLayout pageTitle={"Doctor Dashboard"}>
      <div className=" -mt-6     bg-(--color-bg)  rounded-2xl">
        <div className="flex justify-between items-center p-6 pb-2">
          <div>
            <h1 className="text-2xl text-(--color-text) font-medium font-sans">
              Welcome, Dr. {fullName || authName || "Doctor"}!
            </h1>
            <p className="text-(--color-text-light) font-thin text-sm text-shadow-2xs">
              Here's your practice overview for today
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end mr-4">
              <span className="text-[10px] text-(--color-text-light) font-bold uppercase tracking-widest">
                Consultation Fee
              </span>
              <span className="text-xl font-black text-blue-600">
                {isPriceLoading ? "..." : `$${priceData}`}
              </span>
            </div>
            <button
              onClick={() => {
                setNewPrice(priceData || 0);
                setIsPriceModalOpen(true);
              }}
              className="bg-blue-50 text-blue-600 hover:bg-blue-100 p-2 rounded-xl transition-all active:scale-95 cursor-pointer border border-blue-100"
              title="Update Price"
            >
              <Banknote size={20} />
            </button>
            <button
              onClick={() => setIsAllergyModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20 active:scale-95 cursor-pointer font-medium text-sm"
            >
              <Plus size={18} /> Add Allergy Record
            </button>
          </div>
        </div>

        <div className=" dark:bg-(--color-bg) rounded-2xl py-4 pt-0 px-6 flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
            <DashboardCard
              title="Appointments"
              subTitle="Today"
              num={dashboardData.todayAppointments.toString()}
              logo={<SlCalender />}
              color="blue"
            />
            <DashboardCard
              title="Total Patients"
              subTitle="Growth"
              num={dashboardData.totalPatients.toString()}
              logo={<MdPeople />}
              color="green"
            />
            <DashboardCard
              title="Pending Scans"
              subTitle="Action Required"
              num={dashboardData.pendingScans.toString()}
              logo={<LuFileSpreadsheet />}
              color="yellow"
            />
            <DashboardCard
              title="Satisfaction"
              subTitle="Rate"
              num={`${dashboardData.satisfactionRate}%`}
              logo={<GoPulse />}
              color="violet"
            />
            <DashboardCard
              title="Supervising ID"
              subTitle="Identity"
              num={dashboardData.superVisingNumber}
              logo={<MdOutlineVpnKey />}
              color="orange"
            />
          </div>
          <div className="flex gap-6 max-md:flex-col">
            <FirstDiv />
            <SecondDiv dashboardData={dashboardData.raw} />
          </div>
        </div>
      </div>

      {/* Allergy Modal */}
      {isAllergyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-(--color-surface) w-full max-w-md rounded-2xl shadow-2xl border border-(--color-border) overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-(--color-border)">
              <h2 className="text-xl font-bold text-(--color-text)">
                Add New Allergy
              </h2>
              <button
                onClick={() => setIsAllergyModalOpen(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
              >
                <X size={20} className="text-(--color-text-light)" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit(onAllergySubmit)}
              className="p-6 space-y-5"
            >
              <div className="space-y-2">
                <label className="text-sm font-medium text-(--color-text-light)">
                  Allergy Name
                </label>
                <input
                  type="text"
                  {...register("name", { required: "Allergy name is required" })}
                  placeholder="e.g. Penicillin, Peanuts"
                  className="w-full bg-gray-50/50 dark:bg-gray-800/20 border border-(--color-border) rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-(--color-text)"
                />
                {errors.name && (
                  <p className="text-xs text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAllergyModalOpen(false)}
                  className="flex-1 px-4 py-3 border border-(--color-border) rounded-xl text-sm font-medium text-(--color-text) hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={allergyMutation.isPending}
                  className="flex-[2] bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-3 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
                >
                  {allergyMutation.isPending ? "Adding..." : "Add Allergy"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Consultation Price Modal */}
      {isPriceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-(--color-surface) w-full max-w-md rounded-2xl shadow-2xl border border-(--color-border) overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-(--color-border)">
              <h2 className="text-xl font-bold text-(--color-text)">
                Set Consultation Price
              </h2>
              <button
                onClick={() => setIsPriceModalOpen(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
              >
                <X size={20} className="text-(--color-text-light)" />
              </button>
            </div>

            <form onSubmit={onPriceSubmit} className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-(--color-text-light)">
                  New Price ($)
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                    $
                  </div>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(parseFloat(e.target.value))}
                    placeholder="0.00"
                    className="w-full bg-gray-50/50 dark:bg-gray-800/20 border border-(--color-border) rounded-xl pl-8 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-(--color-text) font-bold"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPriceModalOpen(false)}
                  className="flex-1 px-4 py-3 border border-(--color-border) rounded-xl text-sm font-medium text-(--color-text) hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatePriceMutation.isPending}
                  className="flex-[2] bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-3 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
                >
                  {updatePriceMutation.isPending
                    ? "Updating..."
                    : "Update Price"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default DoctorDashboard;

