import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import FirstDiv from "../../../components/Student Doctor/Dashboard/FirstDiv/FirstDiv";
import SecondDiv from "../../../components/Student Doctor/Dashboard/SecondDiv/SecondDiv";
import { CiCircleAlert } from "react-icons/ci";
import { FaGraduationCap } from "react-icons/fa6";
import DashboardCard from "@/components/DashboardCard/DashboardCard";
import { SlCalender } from "react-icons/sl";
import { MdPeople } from "react-icons/md";
import { LuFileSpreadsheet } from "react-icons/lu";

const StudentDoctorDashboard = () => {
  return (
    <DashboardLayout pageTitle={"Student Doctor Dashboard"}>
      <div className="-mt-6 -ml-6 bg-(--color-bg) rounded-2xl min-h-screen">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl text-(--color-text) font-bold font-sans">
              Welcome, John Doe!
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
                num="3"
                subTitle="Today"
                color="blue"
                logo={<SlCalender />}
              />
              <DashboardCard
                title="Patients (View Only)"
                num="42"
                subTitle="+8%"
                color="green"
                logo={<MdPeople />}
              />
              <DashboardCard
                title="Scans to Study"
                num="1"
                subTitle="Review"
                color="yellow"
                logo={<LuFileSpreadsheet />}
              />
              <DashboardCard
                title="Completion Rate"
                num="85%"
                subTitle="85%"
                color="violet"
                logo={<FaGraduationCap />}
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
