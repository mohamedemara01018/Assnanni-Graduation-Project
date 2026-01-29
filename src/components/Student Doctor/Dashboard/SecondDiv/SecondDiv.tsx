import QuickActions from "./QuickActions";
import LearningProgress from "./LearningProgress";
import Patient from "../FirstDiv/Patient";
import { FaGraduationCap } from "react-icons/fa6";

const SecondDiv = () => {
  return (
    <div className="flex-1 flex flex-col gap-6">
      <LearningProgress />
      <QuickActions />
      <div className="mt-6 bg-gray-50 p-6 rounded-2xl flex flex-col gap-6 ">
        <h1 className="text-xl  font-normal text-gray-800 mb-2">
          Assigned Supervisor
        </h1>
        <Patient name="Dr. Sarah Miller">
          <p>Senior Cardiologist</p>
        </Patient>
        <button className="bg-blue-600 text-white font-normal text-sm  py-2 rounded-md w-full mb-3 mt-2 cursor-pointer hover:bg-blue-600/90">
          Contact Supervisor
        </button>
      </div>
      <div className="flex mb-6 bg-violet-100 px-4 py-2 items-center gap-3 text-violet-500 border border-violet-200 rounded-2xl">
        <FaGraduationCap className="text-2xl" />
        <div>
          <h3 className=" font-normal text-violet-700">Student Mode Active</h3>
          <p className="text-xs font-normal">
            Complete your training program to unlock full doctor permissions
          </p>
        </div>
      </div>
    </div>
  );
};

export default SecondDiv;
