import { NavLink, useLocation } from "react-router";
import { CgProfile } from "react-icons/cg";
import { IoLockClosedOutline } from "react-icons/io5";
import { BsBell } from "react-icons/bs";

const SideBar = () => {
  const location = useLocation();
  return (
    <div className="bg-gray-100 rounded-2xl m-4 p-4">
      <ul className="settingsSidebar">
        <li>
          <NavLink
            to={"/settings"}
            className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-gray-800 duration-300 ease-in-out hover:bg-gray-400 dark:hover:bg-meta-4 ${
              !location.pathname.includes("security") &&
              !location.pathname.includes("notifications")
                ? "bg-blue-200 !text-blue-600"
                : ""
            }`}
          >
            <CgProfile />
            <p>Profile</p>
          </NavLink>
        </li>
        <li>
          <NavLink
            to={"/settings/security"}
            className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium  duration-300 text-gray-800 ease-in-out hover:bg-gray-300 dark:hover:bg-meta-4 ${
              location.pathname.includes("security") &&
              "bg-blue-200 !text-blue-600"
            }`}
          >
            <IoLockClosedOutline />
            <p>Security</p>
          </NavLink>
        </li>
        <li>
          <NavLink
            to={"/settings/notifications"}
            className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-gray-800 duration-300 ease-in-out  hover:bg-gray-300 dark:hover:bg-meta-4 ${
              location.pathname.includes("/settings/notification") &&
              "bg-blue-200 !text-blue-600"
            }`}
          >
            <BsBell />
            <p>Notification</p>
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default SideBar;
