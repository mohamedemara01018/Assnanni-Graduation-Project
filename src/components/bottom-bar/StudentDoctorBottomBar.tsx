import { CiSearch } from "react-icons/ci";
import { FaHome } from "react-icons/fa";
import { FaRegBell } from "react-icons/fa6";
import { IoAnalytics } from "react-icons/io5";
import { SlCalender } from "react-icons/sl";
import { NavLink } from "react-router";

function StudentDoctorBottomBar() {
  return (
    <div className=" bg-(--color-surface) fixed bottom-0 left-0 right-0 z-20 shadow-sm p-4">
      <div>
        <ul className="wrapper flex justify-between items-center">
          <li>
            <NavLink
              to={"/"}
              className={({ isActive }) =>
                `flex flex-col justify-center items-center text-(--color-text) px-3 py-1.5 rounded-lg hover:bg-(--color-bg-link-hover) ${
                  isActive
                    ? "bg-(--color-bg-blue) text-(--color-text-blue) "
                    : ""
                }`
              }
            >
              <FaHome className="" />
              <p className="text-sm">Home</p>
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/"}
              className={({ isActive }) =>
                `flex flex-col justify-center items-center text-(--color-text) px-3 py-1.5 rounded-lg hover:bg-(--color-bg-link-hover) ${
                  isActive
                    ? "bg-(--color-bg-blue) text-(--color-text-blue) "
                    : ""
                }`
              }
            >
              <CiSearch className="" />
              <p className="text-sm">Search</p>
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/doctor-schedule"}
              className={({ isActive }) =>
                `flex flex-col justify-center items-center text-(--color-text) px-3 py-1.5 rounded-lg hover:bg-(--color-bg-link-hover) ${
                  isActive
                    ? "bg-(--color-bg-blue) text-(--color-text-blue) "
                    : ""
                }`
              }
            >
              <SlCalender />
              <p className="text-sm">Schedule</p>
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/notification"}
              className={({ isActive }) =>
                `flex flex-col justify-center items-center text-(--color-text) px-3 py-1.5 rounded-lg hover:bg-(--color-bg-link-hover) ${
                  isActive
                    ? "bg-(--color-bg-blue) text-(--color-text-blue) "
                    : ""
                }`
              }
            >
              <FaRegBell className="" />
              <p className="text-sm">Notifications</p>
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/scan"}
              className={({ isActive }) =>
                `flex flex-col justify-center items-center text-(--color-text) px-3 py-1.5 rounded-lg hover:bg-(--color-bg-link-hover) ${
                  isActive
                    ? "bg-(--color-bg-blue) text-(--color-text-blue) "
                    : ""
                }`
              }
            >
              <IoAnalytics className="" />
              <p className="text-sm">Scan</p>
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default StudentDoctorBottomBar;
