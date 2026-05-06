import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import DashboardCard from "@/components/DashboardCard/DashboardCard";
import FirstDiv from "@/components/Receptionist/Dashboard/FirstDiv/FirstDiv";
import SecondDiv from "@/components/Receptionist/Dashboard/SecondDiv/SecondDiv";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";
import { BsCalendar3 } from "react-icons/bs";
import { ImClock } from "react-icons/im";
import { LuUsers } from "react-icons/lu";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

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
        const response = await axios.get(`${backendUrl}dashboard/card`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = response.data?.data || response.data?.value || response.data;

        return {
          appointments: data?.appointments ?? defaultDashboardCards.appointments,
          inQueue: data?.inQueue ?? defaultDashboardCards.inQueue,
          totalPatients:
            data?.totalPatients ?? defaultDashboardCards.totalPatients,
        };
      },
    });

  return (
    <DashboardLayout pageTitle={"Receptionist Dashboard"}>
      <div className="-mt-6 bg-(--color-bg) rounded-2xl min-h-screen">
        <div className="p-8">
          <h1 className="text-3xl text-(--color-text) font-bold mb-1">
            Welcome, John Doe!
          </h1>
          <p className="text-(--color-text-light) font-medium text-sm mb-10">
            Manage patient flow and appointments
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
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
          </div>

          <div className="flex gap-8 max-xl:flex-col items-start">
            <FirstDiv />
            <SecondDiv />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReceptionistDashboard;
