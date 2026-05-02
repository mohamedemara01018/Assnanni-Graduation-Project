import QuickActions from "./QuickActions";
import LearningProgress from "./LearningProgress";
import Patient from "../FirstDiv/Patient";
import { FaGraduationCap } from "react-icons/fa6";
import { NavLink } from "react-router";

interface Supervisor {
  name: string;
  specialty: string;
  imageUrl: string;
}

const dummySupervisor: Supervisor = {
  name: "Dr. Sarah Miller",
  specialty: "Senior Cardiologist",
  imageUrl: "https://randomuser.me/api/portraits/women/65.jpg",
};

const SecondDiv = () => {
  return (
    <div className="flex-1 flex flex-col gap-8">
      <LearningProgress />

      <div className="bg-(--color-surface) p-6 rounded-2xl shadow-sm border border-(--color-border) flex flex-col gap-6">
        <h1 className="text-xl font-medium text-(--color-text) pb-3 border-b border-(--color-border)">
          Assigned Supervisor
        </h1>
        <Patient name={dummySupervisor.name} imageUrl={dummySupervisor.imageUrl}>
          <p className="text-xs">{dummySupervisor.specialty}</p>
        </Patient>
        <NavLink
          to="/contact-supervisor"
          className="bg-blue-600 text-white text-center font-bold text-sm py-3 rounded-xl w-full cursor-pointer hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
        >
          Contact Supervisor
        </NavLink>
      </div>

      <div className="flex bg-violet-50 px-6 py-4 items-center gap-4 text-violet-500 border border-violet-100 rounded-2xl shadow-sm">
        <div className="bg-violet-100 p-2 rounded-lg">
          <FaGraduationCap size={24} className="text-violet-600" />
        </div>
        <div>
          <h3 className="font-bold text-sm text-violet-700">
            Student Mode Active
          </h3>
          <p className="text-[10px] text-violet-500 font-medium">
            Complete your training program to unlock full doctor permissions
          </p>
        </div>
      </div>
      <QuickActions />
    </div>
  );
};

export default SecondDiv;
