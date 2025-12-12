import logo from "./../../assets/logo.png";
import { GoArrowLeft } from "react-icons/go";
import { NavLink, Outlet } from "react-router";
import { AiOutlineUser } from "react-icons/ai";
import { CiHospital1 } from "react-icons/ci";
import { LuGraduationCap } from "react-icons/lu";

const Registration = () => {
  return (
    <div className="mt-8 max-md:w-11/12 md:w-3/4  m-auto flex-col flex   justify-center">
      <div className="md:ml-24 max-md:ml-20 translate-y-12">
        <NavLink
          to={"/"}
          className="flex gap-2 w-fit text-gray-700  text-md font-semibold cursor-pointer hover:text-gray-900 "
        >
          <GoArrowLeft className="translate-y-1 text-xl font-extrabold font-sans text-gray-600" />
          Back to Home
        </NavLink>
      </div>

      <div className="m-16 bg-gray-50 p-6 rounded-2xl shadow-sm">
        <div className="flex gap-2 justify-center">
          <img src={logo} className="w-15 h-15" alt="Logo" />
          <h1 className="text-4xl translate-y-2 font-semibold max-sm:text-3xl">
            Assnani
          </h1>
        </div>
        <div className="mt-4 flex flex-col items-center">
          <h3 className="text-2xl tracking-tighter font-semibold text-gray-700 max-sm:text-xl">
            Create Your Account
          </h3>
          <p className="text-xs mt-3 font-semibold text-gray-500">
            Choose your role and fill in your information
          </p>
        </div>
        <div className="flex justify-between bg-gray-200 rounded-full h-10 items-center my-4 gap-4 registerNavigation max-lg:gap-2 ">
          <NavLink
            to="/registration/patient-registration"
            className={"flex gap-2 text-gray-500 flex-1  h-full items-center"}
          >
            <AiOutlineUser />
            <span className="max-sm:hidden">Patient</span>
          </NavLink>
          <NavLink
            to="/registration/doctor-registration"
            className={"flex gap-2 text-gray-500 flex-1  h-full items-center"}
          >
            <CiHospital1 />
            <span className="max-sm:hidden">Doctor</span>
          </NavLink>
          <NavLink
            to="/registration/student-registration"
            className={"flex gap-2 text-gray-500 flex-1  h-full items-center"}
          >
            <LuGraduationCap />
            <span className="max-sm:hidden">Student</span>
          </NavLink>
          <NavLink
            to="/registration/receptionist-registration"
            className={"flex gap-2 text-gray-500 flex-1  h-full items-center"}
          >
            <AiOutlineUser />
            <span className="max-sm:hidden">Receptionist</span>
          </NavLink>
        </div>
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Registration;
