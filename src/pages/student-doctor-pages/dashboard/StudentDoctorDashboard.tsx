import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import FirstDiv from "../../../components/Student Doctor/Dashboard/FirstDiv/FirstDiv";
import SecondDiv from "../../../components/Student Doctor/Dashboard/SecondDiv/SecondDiv";
import { CiCircleAlert } from "react-icons/ci";
import { FaGraduationCap } from "react-icons/fa6";
import DashboardCard from "@/components/DashboardCard/DashboardCard";
import { SlCalender } from "react-icons/sl";
import { LuCircleCheck } from "react-icons/lu";
import { LuFileSpreadsheet, LuClock, LuUserCheck } from "react-icons/lu";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";

const StudentDoctorDashboard = () => {
  const { fullName, name: authName } = useSelector(
    (state: RootState) => state.auth,
  );
  const backendUrl = useSelector((state: RootState) => state.config.backendUrl);
  const token = Cookies.get("jwtToken");

  const { data: stats } = useQuery({
    queryKey: ["StudentDoctorDashboardStats"],
    queryFn: async () => {
      const response = await axios.get(
        `${backendUrl}StudentDoctor/dashboard-card`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return response.data.data;
    },
    enabled: !!token && !!backendUrl,
  });

  return (
    <DashboardLayout pageTitle={"Student Doctor Dashboard"}>
      <div className="-mt-6 -ml-6 bg-(--color-bg) rounded-2xl min-h-screen">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl text-(--color-text) font-bold font-sans">
              Welcome, Dr.{fullName || authName || "Student"}!
            </h1>
            <span className="flex text-[10px] py-1 px-3 items-center gap-2 bg-violet-100 rounded-full text-violet-600 font-bold uppercase tracking-wider">
              <FaGraduationCap size={14} />
              Student
            </span>
          </div>
          <p className="text-(--color-text-light) font-normal text-sm mb-6">
            Here's your learning dashboard for today
          </p>

          <div className="flex gap-4 items-center p-5 mb-8 bg-blue-50 border border-blue-100 rounded-2xl shadow-sm">
            <div className="bg-blue-500 p-2 rounded-full text-white">
              <CiCircleAlert size={20} />
            </div>
            <div>
              <h4 className="font-bold text-blue-900 text-sm">
                Student Access Mode
              </h4>
              <p className="text-xs text-blue-700 mt-0.5">
                Some features require supervisor approval. Locked actions are
                marked with 🔒
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <div className="grid grid-cols-4 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-6">
              <DashboardCard
                title="Observations"
                num={stats?.observations.toString() || "0"}
                subTitle="Clinical"
                color="blue"
                logo={<SlCalender />}
              />
              <DashboardCard
                title="Total Patients"
                num={stats?.patients.toString() || "0"}
                subTitle="Assigned"
                color="green"
                logo={<LuUserCheck />}
              />
              <DashboardCard
                title="Radiology Scans"
                num={stats?.scans.toString() || "0"}
                subTitle="To Review"
                color="yellow"
                logo={<LuFileSpreadsheet />}
              />
              <DashboardCard
                title="Completion"
                num={`${stats?.completionRate || 0}%`}
                subTitle="Progress"
                color="violet"
                logo={<LuCircleCheck />}
              />
            </div>

            <div className="grid grid-cols-4 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-6">
              <DashboardCard
                title="Avg. Score"
                num={stats?.averageScore.toString() || "0"}
                subTitle="Academic"
                color="orange"
                logo={<FaGraduationCap />}
              />
              <DashboardCard
                title="Attendance"
                num={`${stats?.attendanceRate || 0}%`}
                subTitle="Rate"
                color="blue"
                logo={<LuClock />}
              />
              <DashboardCard
                title="Pending Records"
                num={stats?.pendingMedicalRecords.toString() || "0"}
                subTitle="Action Needed"
                color="yellow"
                logo={<CiCircleAlert />}
              />
              <DashboardCard
                title="Approved"
                num={stats?.approvedMedicalRecords.toString() || "0"}
                subTitle="Validated"
                color="green"
                logo={<LuCircleCheck />}
              />
            </div>

            <div className="flex gap-8 max-md:flex-col items-start">
              <div className="flex-[1.5] w-full">
                <FirstDiv />
              </div>
              <div className="flex-1 w-full">
                <SecondDiv />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDoctorDashboard;
