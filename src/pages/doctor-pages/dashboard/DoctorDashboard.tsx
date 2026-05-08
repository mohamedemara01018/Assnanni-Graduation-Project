import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import FirstDiv from "../../../components/Doctor/Dashboard/FirstDiv/FirstDiv";
import SecondDiv from "../../../components/Doctor/Dashboard/SecondDiv/SecondDiv";
import { SlCalender } from "react-icons/sl";
import { LuFileSpreadsheet } from "react-icons/lu";
import { MdPeople } from "react-icons/md";
import { GoPulse } from "react-icons/go";
import DashboardCard from "@/components/DashboardCard/DashboardCard";
import { useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { MdOutlineVpnKey } from "react-icons/md";

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

const DoctorDashboard = () => {
  const backendUrl = useSelector((state: RootState) => state.config.backendUrl);
  const token = Cookies.get("jwtToken");

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

  useEffect(() => {
    if (isError) {
      console.error("Failed to fetch dashboard data:", error);
      toast.error(error.message || "Failed to load dashboard overview");
    }
  }, [isSuccess, isError, error, dashboardData]);

  return (
    <DashboardLayout pageTitle={"Doctor Dashboard"}>
      <div className=" -mt-6     bg-(--color-bg)  rounded-2xl">
        <h1 className="text-2xl text-(--color-text) font-medium p-6 font-sans pb-2">
          Welcome, Dr. John Doe!
        </h1>
        <p className="p-6 pt-0 text-(--color-text-light) font-thin text-sm text-shadow-2xs mb-4">
          Here's your practice overview for today
        </p>
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
    </DashboardLayout>
  );
};

export default DoctorDashboard;
