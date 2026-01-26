import { TbLayoutDashboardFilled } from "react-icons/tb";
import { MdPeopleAlt } from "react-icons/md";
import { SlCalender } from "react-icons/sl";
import { LuFileSpreadsheet } from "react-icons/lu";
import { LuMessageSquareText } from "react-icons/lu";
import { MdOutlineSettings } from "react-icons/md";
import { NavLink } from "react-router";
import logo from "./../../../assets/logo.png";
import { GoPulse } from "react-icons/go";
import { FaRegBell } from "react-icons/fa";

const DoctorNav = () => {
  return (
    <div className="nav doctor">
      <div className="flex mt-2 mb-2 max-[1270px]:flex-col gap-1 max-[1270px]:items-center ">
        <img
          src={logo}
          alt="Logo"
          className="w-20 max-[1270px]:w-20 max-[1200px]:w-15 max-[1200px]:mb-2"
        />
        <h1 className="text-3xl max-[1200px]:hidden max-[1270px]:text-2xl translate-y-6  max-[1270px]:translate-y-0  max-sm:text-xl font-semibold bg-linear-120 from-[#059d79] to-[#00ABEA] bg-clip-text text-transparent translate-1 max-sm:translate-1">
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
          <NavLink to={"doctor-schedule"}>
            <SlCalender />
            <span>Schedule</span>
          </NavLink>
        </li>
        <li>
          <NavLink to={"#"}>
            <MdPeopleAlt />
            <span>Patients</span>
          </NavLink>
        </li>
        <li>
          <NavLink to={"/scan"}>
            <GoPulse />
            <span>Scan</span>
          </NavLink>
        </li>
        <li>
          <NavLink to={"doctor-reports"}>
            <LuFileSpreadsheet />
            <span>Reports</span>
          </NavLink>
        </li>
        <li>
          <NavLink to={"#"}>
            <LuMessageSquareText />
            <span>Messages</span>
          </NavLink>
        </li>{" "}
        <li>
          <NavLink to={"#"}>
            <FaRegBell />
            <span>Notifications</span>
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

export default DoctorNav;
