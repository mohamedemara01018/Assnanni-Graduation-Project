import { FiLogOut } from "react-icons/fi";
import Logo from "../../assets/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Link, NavLink, useNavigate } from "react-router";
import {
  Bell,
  Brain,
  BriefcaseMedical,
  Calendar,
  FileText,
  LayoutDashboard,
  Pill,
  Scan,
  Settings,
  Star,
  Stethoscope,
  Users,
  X,
} from "lucide-react";
import { logout } from "@/store/slices/auth/authSlice";
import { clearEmail } from "@/store/slices/email/emailSlice";

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

    navigate("/");
  };

  const linkStyle = ({ isActive }: { isActive: boolean }) =>
    [
      "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
      "hover:bg-(--color-bg-link-hover)",
      isActive
        ? "bg-(--color-bg-blue) text-(--color-text-blue)"
        : "text-(--color-text-light) hover:text-(--color-text)",
      toggled ? "justify-center" : "",
    ]
      .filter(Boolean)
      .join(" ");

  const navItems = sidebarDataRole[role as keyof typeof sidebarDataRole] ?? [];

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "var(--color-surface)" }}
    >
      {/* ── Logo / header ─────────────────────────────────── */}
      <div
        className="relative flex items-center justify-between h-16 px-4 shrink-0"
        style={{ borderBottom: "1px solid var(--color-border)" }}
      >
        <Link
          to="/"
          className="flex justify-center items-center w-full gap-2 min-w-0"
        >
          {!toggled && (
            <img
              src={Logo}
              alt="logo"
              className="w-28 object-contain transition-all duration-200"
            />
          )}
          {toggled && (
            <img
              src={Logo}
              alt="logo"
              className="w-8 h-8 object-contain rounded-lg"
            />
          )}
        </Link>

        {/* mobile close */}
        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className="p-1.5 rounded-lg hover:bg-(--color-bg-link-hover) transition-colors"
            style={{ color: "var(--color-text-light)" }}
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* ── Collapse toggle ───────────────────────────────── */}
      {!collapsed && (
        <button
          onClick={onToggle}
          className="absolute -right-3.5 top-[72px] z-10 flex items-center justify-center w-7 h-7 rounded-full shadow-md border transition-colors duration-150"
          style={{
            background: "var(--color-surface)",
            borderColor: "var(--color-border)",
            color: "var(--color-text-light)",
          }}
        >
          {toggled ? (
            <IoIosArrowForward className="w-3.5 h-3.5" />
          ) : (
            <IoIosArrowBack className="w-3.5 h-3.5" />
          )}
        </button>
      )}

      {/* ── Nav items ─────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-0.5">
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={idx}
              to={item.path}
              className={linkStyle}
              title={toggled ? item.label : undefined}
            >
              {({ isActive }) => (
                <>
                  {/* active left bar */}
                  {isActive && (
                    <span
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full"
                      style={{ background: "var(--color-primary)" }}
                    />
                  )}
                  <Icon
                    className="w-[18px] h-[18px] shrink-0 transition-colors duration-150"
                    style={{
                      color: isActive ? "var(--color-primary)" : undefined,
                    }}
                  />
                  {!toggled && <span className="truncate">{item.label}</span>}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* ── Logout ────────────────────────────────────────── */}
      <div
        className="px-2 py-3 shrink-0"
        style={{ borderTop: "1px solid var(--color-border)" }}
      >
        <button
          onClick={handleLogout}
          className={[
            "flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
            "hover:bg-(--color-bg-link-hover)",
            toggled ? "justify-center" : "",
          ].join(" ")}
          style={{ color: "var(--color-text-light)" }}
          title={toggled ? "Logout" : undefined}
        >
          <FiLogOut className="w-[18px] h-[18px] shrink-0" />
          {!toggled && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}

export default SideBar;

// ─── Sidebar data ─────────────────────────────────────────────────────────────

const sidebarDataRole = {
  admin: [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
    { icon: Users, label: "Users", path: "/users" },
    { icon: Stethoscope, label: "Doctors", path: "/admin-doctors" },
    { icon: FileText, label: "Analytics", path: "/analytics" },
    { icon: Brain, label: "AI Models", path: "/ai-models" },
    { icon: Bell, label: "Notifications", path: "/notification" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ],

  patient: [
    { icon: LayoutDashboard, label: "Dashboard", path: "/patient" },
    { icon: Calendar, label: "Appointments", path: "/appointments" },
    { icon: Stethoscope, label: "Doctors", path: "/doctors-list" },
    { icon: Pill, label: "Prescriptions", path: "/prescriptions" },
    { icon: FileText, label: "Medical History", path: "/medical-history" },
    { icon: Star, label: "My Feedback", path: "/my-feedbacks" },
    { icon: BriefcaseMedical, label: "My Doctors", path: "/my-doctors" },
    { icon: Bell, label: "Notifications", path: "/notification" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ],

  doctor: [
    { icon: LayoutDashboard, label: "Dashboard", path: "/doctor" },
    { icon: Calendar, label: "Schedule", path: "/doctor-schedule" },
    { icon: Calendar, label: "Appointments", path: "/doctor-appointments-dashboard" },
    { icon: Users, label: "Patients", path: "/doctor-patients" },
    { icon: Scan, label: "Scans", path: "/scan/upload" },
    { icon: FileText, label: "Reports", path: "/doctor-reports" },
    { icon: Bell, label: "Notifications", path: "/notification" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ],

  studentDoctor: [
    { icon: LayoutDashboard, label: "Dashboard", path: "/student-doctor" },
    { icon: Calendar, label: "Appointments", path: "/doctor-appointments" },
    { icon: Bell, label: "Notifications", path: "/notification" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ],

  receptionist: [
    { icon: LayoutDashboard, label: "Dashboard", path: "/receptionist" },
    { icon: Users, label: "Patients", path: "/doctor-patients" },
    { icon: Calendar, label: "Appointments", path: "/doctor-appointments" },
    { icon: Bell, label: "Notifications", path: "/notification" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ],
};
