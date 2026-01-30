import { FaHome } from "react-icons/fa";
import { FaRegBell } from "react-icons/fa6";
import { IoAnalytics } from "react-icons/io5";
import { LuFileSpreadsheet } from "react-icons/lu";
import { MdPeopleAlt } from "react-icons/md";
import { SlCalender } from "react-icons/sl";
import { NavLink } from "react-router";

function DoctorBottomBar() {
  return (
    <div className=" bg-(--color-surface) fixed bottom-0 left-0 right-0 z-20 shadow-sm p-4">
      <div>
        <ul className="wrapper  flex justify-between items-center gap-2">
          <li>
            <NavLink
              to={"/"}
              className={({ isActive }) =>
                `flex flex-col justify-center items-center text-(--color-text)  rounded-lg hover:bg-(--color-bg-link-hover) ${
                  isActive ? " text-(--color-text-blue) " : ""
                }`
              }
            >
              <FaHome className="" />
              <p className="text-sm max-sm:hidden">Home</p>
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/doctor-patients"}
              className={({ isActive }) =>
                `flex flex-col justify-center items-center text-(--color-text)  rounded-lg hover:bg-(--color-bg-link-hover) ${
                  isActive ? " text-(--color-text-blue) " : ""
                }`
              }
            >
              <MdPeopleAlt className="" />
              <p className="text-sm max-sm:hidden">Patients</p>
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/doctor-schedule"}
              className={({ isActive }) =>
                `flex flex-col justify-center items-center text-(--color-text)  rounded-lg hover:bg-(--color-bg-link-hover) ${
                  isActive ? " text-(--color-text-blue) " : ""
                }`
              }
            >
              <SlCalender />
              <p className="text-sm max-sm:hidden">Schedule</p>
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/notification"}
              className={({ isActive }) =>
                `flex flex-col justify-center items-center text-(--color-text)  rounded-lg hover:bg-(--color-bg-link-hover) ${
                  isActive ? " text-(--color-text-blue) " : ""
                }`
              }
            >
              <FaRegBell className="" />
              <p className="text-sm max-sm:hidden">Notifications</p>
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/scan"}
              className={({ isActive }) =>
                `flex flex-col justify-center items-center text-(--color-text)  rounded-lg hover:bg-(--color-bg-link-hover) ${
                  isActive ? " text-(--color-text-blue) " : ""
                }`
              }
            >
              <IoAnalytics className="" />
              <p className="text-sm max-sm:hidden">Scan</p>
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/doctor-reports"}
              className={({ isActive }) =>
                `flex flex-col justify-center items-center text-(--color-text)  rounded-lg hover:bg-(--color-bg-link-hover) ${
                  isActive ? " text-(--color-text-blue) " : ""
                }`
              }
            >
              <LuFileSpreadsheet className="" />
              <p className="text-sm max-sm:hidden">Reports</p>
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default DoctorBottomBar;
