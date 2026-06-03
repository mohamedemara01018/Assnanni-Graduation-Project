import { FiLogOut } from "react-icons/fi";
import Logo from "../../assets/Logo.png";
import { useDispatch, useSelector } from "react-redux";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

import { Link, NavLink, useNavigate } from "react-router";
import {
  Brain,
  Calendar,
  FileText,
  LayoutDashboard,
  Pill,
  Scan,
  Settings,
  Stethoscope,
  Users,
  X,
} from "lucide-react";
import { logout } from "@/store/slices/auth/authSlice";
import { clearEmail } from "@/store/slices/email/emailSlice";
import Cookies from "js-cookie";

interface SideBarProp {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
  toggled: boolean;
  onToggle: () => void;
}

function SideBar({ collapsed, setCollapsed, toggled, onToggle }: SideBarProp) {
  const role = useSelector(
    (state: { auth: { role: string } }) => state.auth.role,
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearEmail());

    Cookies.remove("patientsView");


    navigate("/");
  };

  const linkStyle = ({ isActive }: { isActive: boolean }) =>
    `flex items-center ${toggled ? "justify-center" : ""
    } gap-3 text-(--color-text) px-3 py-2.5 rounded-lg hover:bg-(--color-bg-link-hover) ${isActive ? "bg-(--color-bg-blue) text-(--color-text-blue)" : ""
    }`;

  return (
    <>
      <div className={`relative`}>
        {!collapsed && (
          <button
            onClick={onToggle}
            className="flex items-center justify-center rounded-full w-8 h-8 absolute -right-4 top-20 bg-(--color-surface) shadow-lg border-2 border-(--color-border) cursor-pointer text-(--color-text)"
          >
            {toggled ? <IoIosArrowForward /> : <IoIosArrowBack />}
          </button>
        )}

        <div className="flex items-center gap-2 border-b">
          <Link
            to={"/"}
            className="flex items-center justify-center gap-1 h-16 px-4"
          >
            <img className="w-36 mx-auto" src={Logo} alt="logo" />
          </Link>
          {collapsed && (
            <button
              onClick={() => setCollapsed(false)}
              className="p-2 h-fit cursor-pointer hover:bg-(--color-bg-link-hover) rounded-xl transition-all duration-150"
            >
              <X />
            </button>
          )}
        </div>

        <ul className="p-2 py-5 space-y-1">
          {sidebarDataRole &&
            sidebarDataRole[role as keyof typeof sidebarDataRole]?.map(
              (item, idx) => {
                const Icon = item.icon;
                return (
                  <li key={idx}>
                    <NavLink to={item.path} className={linkStyle}>
                      <Icon className="text-xl w-5 h-5" />
                      {!toggled && (
                        <span className="text-sm font-medium">
                          {item.label}
                        </span>
                      )}
                    </NavLink>
                  </li>
                );
              },
            )}
        </ul>
      </div>

      <div className="p-2 border-t border-border">
        <button
          onClick={handleLogout}
          className={`flex items-center ${toggled ? "justify-center" : ""
            } gap-2 px-3 py-2.5 w-full text-start text-sm font-medium bg-(--color-bg-link) hover:bg-(--color-bg-link-hover) rounded-lg`}
        >
          <FiLogOut className="w-5 h-5 shrink-0 text-(--color-text)" />
          {!toggled && (
            <span className="text-sm font-medium text-(--color-text)">
              Logout
            </span>
          )}
        </button>
      </div>
    </>
  );
}

export default SideBar;

const sidebarDataRole = {
  admin: [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
    { icon: Users, label: "Users", path: "/users" },
    { icon: FileText, label: "Analytics", path: "/analytics" },
    { icon: Brain, label: "AI Models", path: "/ai-models" },
    { icon: Users, label: "Notifications", path: "/notification" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ],

  patient: [
    { icon: LayoutDashboard, label: "Dashboard", path: "/patient" },
    { icon: Calendar, label: "Appointments", path: "/appointments" },
    { icon: Stethoscope, label: "Doctors", path: "/doctors-list" },
    { icon: Pill, label: "Prescriptions", path: "/prescriptions" },
    { icon: FileText, label: "Medical History", path: "/medical-history" },
    { icon: Scan, label: "Scans", path: "/scan/upload" },
    { icon: Users, label: "Notifications", path: "/notification" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ],

  doctor: [
    { icon: LayoutDashboard, label: "Dashboard", path: "/doctor" },
    { icon: Calendar, label: "Schedule", path: "/doctor-schedule" },
    { icon: Users, label: "Patients", path: "/doctor-patients" },
    { icon: Scan, label: "Scans", path: "/scan/upload" },
    { icon: FileText, label: "Reports", path: "/doctor-reports" },
    { icon: Users, label: "Notifications", path: "/notification" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ],

  studentDoctor: [
    { icon: LayoutDashboard, label: "Dashboard", path: "/student-doctor" },
    { icon: Calendar, label: "Appointments", path: "/doctor-appointments" },
    { icon: Users, label: "Notifications", path: "/notification" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ],

  receptionist: [
    { icon: LayoutDashboard, label: "Dashboard", path: "/receptionist" },
    { icon: Users, label: "Patients", path: "/doctor-patients" },
    { icon: Calendar, label: "Appointments", path: "/doctor-appointments" },
    { icon: Users, label: "Notifications", path: "/notification" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ],
};
