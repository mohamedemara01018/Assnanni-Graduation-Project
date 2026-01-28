import { FiLogOut } from "react-icons/fi";
import { Link, NavLink } from "react-router";
import logo from "../../assets/logo.png";

import { IoAnalytics } from "react-icons/io5";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

import { SlCalender } from "react-icons/sl";
import { MdOutlineSettings, MdPeopleAlt } from "react-icons/md";
import { LuFileSpreadsheet } from "react-icons/lu";
import { FaRegBell } from "react-icons/fa6";

interface SideBarProp {
  collapsed: boolean;
  toggled: boolean;
  onToggle: () => void;
}

function DoctorSideBar({ toggled, onToggle }: SideBarProp) {
  return (
    <>
      <div className="relative">
        <button
          onClick={() => onToggle()}
          className="flex items-center justify-center rounded-full w-8 h-8 absolute -right-4 top-20 bg-(--color-surface) shadow-lg border-2 border-(--color-border) cursor-pointer"
        >
          {toggled ? <IoIosArrowForward /> : <IoIosArrowBack />}
        </button>
        <Link
          to={"/"}
          className={`flex items-center ${"justify-center"} gap-1 h-16 px-4  border-b `}
        >
          <img src={logo} alt="" className="w-8 h-8 object-cover" />
          {!toggled && <h1 className="text-xl font-semibold">Assnani</h1>}
        </Link>
        <ul className="p-2 py-5 space-y-1">
          <li>
            <NavLink
              to={"/"}
              className={({ isActive }) =>
                `flex  items-center ${
                  toggled ? "justify-center" : ""
                } gap-3 text-(--color-text) px-3 py-2.5 rounded-lg hover:bg-(--color-bg-link-hover) ${
                  isActive
                    ? "bg-(--color-bg-blue) text-(--color-text-blue) "
                    : ""
                }`
              }
            >
              <FiLogOut className="text-xl" />

              {!toggled && <span>Dashboard</span>}
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/doctor-schedule"}
              className={({ isActive }) =>
                `flex  items-center ${
                  toggled ? "justify-center" : ""
                } gap-3 text-(--color-text) px-3 py-2.5 rounded-lg hover:bg-(--color-bg-link-hover) ${
                  isActive
                    ? "bg-(--color-bg-blue) text-(--color-text-blue) "
                    : ""
                }`
              }
            >
              {/* <AiOutlineSchedule className="text-xl" /> */}
              {/* {!toggled && <span>Appointments</span>} */}
              <SlCalender className="text-xl" />
              {!toggled && <span>Schedule</span>}
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/doctor-patients"}
              className={({ isActive }) =>
                `flex  items-center ${
                  toggled ? "justify-center" : ""
                } gap-3 text-(--color-text) px-3 py-2.5 rounded-lg hover:bg-(--color-bg-link-hover) ${
                  isActive
                    ? "bg-(--color-bg-blue) text-(--color-text-blue) "
                    : ""
                }`
              }
            >
              <MdPeopleAlt />
              {!toggled && <span>Patients</span>}
              {/* <IoPersonAddOutline className="text-xl" /> */}
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/scan"}
              className={({ isActive }) =>
                `flex  items-center ${
                  toggled ? "justify-center" : ""
                } gap-3 text-(--color-text) px-3 py-2.5 rounded-lg hover:bg-(--color-bg-link-hover) ${
                  isActive
                    ? "bg-(--color-bg-blue) text-(--color-text-blue) "
                    : ""
                }`
              }
            >
              <IoAnalytics className="text-xl" />

              {!toggled && <span>Scans</span>}
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/doctor-reports"}
              className={({ isActive }) =>
                `flex  items-center ${
                  toggled ? "justify-center" : ""
                } gap-3 text-(--color-text) px-3 py-2.5 rounded-lg hover:bg-(--color-bg-link-hover) ${
                  isActive
                    ? "bg-(--color-bg-blue) text-(--color-text-blue) "
                    : ""
                }`
              }
            >
              <LuFileSpreadsheet className="text-xl" />
              {!toggled && <span>Reports</span>}
            </NavLink>
          </li>

          <li>
            <NavLink
              to={"/notification"}
              className={({ isActive }) =>
                `flex  items-center ${
                  toggled ? "justify-center" : ""
                } gap-3 text-(--color-text) px-3 py-2.5 rounded-lg hover:bg-(--color-bg-link-hover) ${
                  isActive
                    ? "bg-(--color-bg-blue) text-(--color-text-blue) "
                    : ""
                }`
              }
            >
              <FaRegBell className="text-xl" />
              {!toggled && <span>Notifications</span>}
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/settings"}
              className={({ isActive }) =>
                `flex  items-center ${
                  toggled ? "justify-center" : ""
                } gap-3 text-(--color-text) px-3 py-2.5 rounded-lg hover:bg-(--color-bg-link-hover) ${
                  isActive
                    ? "bg-(--color-bg-blue) text-(--color-text-blue) "
                    : ""
                }`
              }
            >
              <MdOutlineSettings className="text-xl" />
              {!toggled && <span>Settings</span>}
            </NavLink>
          </li>
        </ul>
      </div>
      <div className="p-2  border-t border-(--color-border)">
        <button
          className={`flex items-center ${"justify-center"} gap-2 px-3 py-2.5 w-full text-start text-sm font-medium bg-(--color-bg-link) hover:bg-(--color-bg-link-hover) rounded-lg`}
        >
          <FiLogOut className="w-5 h-5 shrink-0" />
          {!toggled && <span className="text-sm font-medium">logout</span>}
        </button>
      </div>
    </>
  );
}

export default DoctorSideBar;
