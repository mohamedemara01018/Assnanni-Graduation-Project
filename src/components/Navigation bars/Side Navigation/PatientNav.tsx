import { TbLayoutDashboardFilled } from "react-icons/tb";
import { MdPeopleAlt } from "react-icons/md";
import { SlCalender } from "react-icons/sl";
import { LuFileSpreadsheet } from "react-icons/lu";
import { LuMessageSquareText } from "react-icons/lu";
import { MdOutlineSettings } from "react-icons/md";
import { NavLink } from "react-router";
import logo from "./../../../assets/logo.png";

const PatientNav = () => {
  return (
    <div className="nav">
      <div className="flex mt-4 mb-4 max-[1270px]:flex-col gap-2 max-[1270px]:items-center ">
        <img
          src={logo}
          alt="Logo"
          className="w-25 max-[1270px]:w-20 max-[1200px]:w-15 max-[1200px]:mb-4"
        />
        <h1 className="text-3xl max-[1200px]:hidden max-[1270px]:text-2xl translate-y-10  max-[1270px]:translate-y-0  max-sm:text-xl font-semibold bg-linear-120 from-[#059d79] to-[#00ABEA] bg-clip-text text-transparent translate-2 max-sm:translate-1">
          Assnanii
        </h1>
      </div>
      <ul>
        <li>
          <NavLink to={"/"}>
            <TbLayoutDashboardFilled />
            <span>Dashboard</span>
          </NavLink>
        </li>
        <li>
          <NavLink to={"/browse-doctors"}>
            <MdPeopleAlt />
            <span>Browse Doctors</span>
          </NavLink>
        </li>
        <li>
          <NavLink to={"#"}>
            <SlCalender />
            <span>Appointments</span>
          </NavLink>
        </li>
        <li>
          <NavLink to={"#"}>
            <LuFileSpreadsheet />
            <span>Medical History</span>
          </NavLink>
        </li>
        <li>
          <NavLink to={"#"}>
            <LuMessageSquareText />
            <span>Feedback</span>
          </NavLink>
        </li>
        <li>
          <NavLink to={"#"}>
            <MdOutlineSettings />
            <span>Settings</span>
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default PatientNav;
