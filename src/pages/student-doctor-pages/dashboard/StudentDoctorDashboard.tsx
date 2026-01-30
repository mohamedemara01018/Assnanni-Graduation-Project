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
      <div className="-mt-6 bg-(--color-bg) p-4 rounded-2xl">
        <h1 className="text-2xl text-(--color-text) font-normal p-6 pb-2 font-sans flex items-center gap-3">
          Welcome, St. John Doe!
          <span className="flex text-xs py-1 px-2 items-center gap-2 bg-violet-200 rounded-xl text-violet-700 font-thin">
            <FaGraduationCap />
            Student
          </span>
        </h1>
        <p className="p-6 pt-0 text-(--color-text-light) font-medium text-sm text-shadow-2xs mb-3">
          Here's your practice overview for today
        </p>
        <div className="flex gap-4 items-center p-4 mb-6 bg-blue-100 border border-blue-400 rounded-2xl">
          <CiCircleAlert className="text-blue-500 text-3xl " />
          <div>
            <h4 className="font-semibold text-blue-900">Student Access Mode</h4>
            <p className="text-xs  text-blue-700">
              Some features require supervisor approval. Locked actions are
              marked with 🔒
            </p>
          </div>
        </div>
        <div className="bg-(--color-bg) pb-6 rounded-2xl py-2 px-6 flex flex-col gap-6">
          <div className="grid  grid-cols-4 max-lg:grid-cols-2 max-md:grid-cols-2 max-sm:grid-cols-1 gap-4">
            <DashboardCard
              title="Observation"
              num="3"
              subTitle="Today"
              color="blue"
              logo={<SlCalender />}
            />
            <DashboardCard
              title="Patients (View Only)"
              num="128"
              subTitle="+12%"
              color="green"
              logo={<MdPeople />}
            />
            <DashboardCard
              title="Scans to Study"
              num="1"
              subTitle="Pending"
              color="yellow"
              logo={<LuFileSpreadsheet />}
            />
            <DashboardCard
              title="Completion Rate"
              num="95%"
              subTitle="95%"
              color="violet"
              logo={<FaGraduationCap />}
            />
          </div>
          <div className="flex gap-6 max-md:flex-col ">
            <FirstDiv />
            <SecondDiv />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDoctorDashboard;
