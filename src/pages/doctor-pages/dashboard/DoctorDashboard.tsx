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

const defaultDashboardData = {
  todayAppointments: 12,
  totalPatients: 128,
  pendingScans: 1,
  satisfactionRate: 95,
};

const DoctorDashboard = () => {
  const backendUrl = useSelector((state: RootState) => state.config.backendUrl);
  const token = Cookies.get("jwtToken");

  const {
    data: dashboardData = defaultDashboardData,
    isSuccess,
    isError,
    error,
  } = useQuery({
    queryKey: ["DoctorDashboardOverview"],
    queryFn: async () => {
      const response = await axios.get(backendUrl + "Doctors/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data?.value || response.data;
      if (data) {
        return {
          todayAppointments:
            data.todayAppointments ?? defaultDashboardData.todayAppointments,
          totalPatients:
            data.totalPatients ?? defaultDashboardData.totalPatients,
          pendingScans: data.pendingScans ?? defaultDashboardData.pendingScans,
          satisfactionRate:
            data.satisfactionRate ?? defaultDashboardData.satisfactionRate,
        };
      }
      return defaultDashboardData;
    },
  });

  useEffect(() => {
    if (isSuccess && dashboardData !== defaultDashboardData) {
      toast.success("Dashboard overview loaded");
    }
    if (isError) {
      console.error("Failed to fetch dashboard data:", error);
      toast.error(error.message || "Failed to load dashboard overview");
    }
  }, [isSuccess, isError, error, dashboardData]);

  return (
    <DashboardLayout pageTitle={"Doctor Dashboard"}>
      <div className=" -mt-6 -ml-6    bg-(--color-bg)  rounded-2xl">
        <h1 className="text-2xl text-(--color-text) font-medium p-6 font-sans pb-2">
          Welcome, Dr. John Doe!
        </h1>
        <p className="p-6 pt-0 text-(--color-text-light) font-thin text-sm text-shadow-2xs mb-4">
          Here's your practice overview for today
        </p>
        <div className=" dark:bg-(--color-bg) rounded-2xl py-4 pt-0 px-6 flex flex-col gap-6">
          <div className="grid grid-rows-1 grid-cols-4 max-lg:grid-rows-2 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-4">
            <DashboardCard
              title="Appointments"
              subTitle="Today"
              num={dashboardData.todayAppointments.toString()}
              logo={<SlCalender />}
              color="blue"
            />
            <DashboardCard
              title="Total Patients"
              subTitle="+12%"
              num={dashboardData.totalPatients.toString()}
              logo={<MdPeople />}
              color="green"
            />
            <DashboardCard
              title="Pending Scans"
              subTitle="Pending"
              num={dashboardData.pendingScans.toString()}
              logo={<LuFileSpreadsheet />}
              color="yellow"
            />
            <DashboardCard
              title="Satisfaction Rate"
              subTitle={`${dashboardData.satisfactionRate}%`}
              num={`${dashboardData.satisfactionRate}%`}
              logo={<GoPulse />}
              color="violet"
            />
          </div>
          <div className="flex gap-6 max-md:flex-col">
            <FirstDiv />
            <SecondDiv />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DoctorDashboard;
