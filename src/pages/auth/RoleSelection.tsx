import { NavLink } from "react-router";
import {
  User,
  Stethoscope,
  GraduationCap,
  ChevronRight,
} from "lucide-react";

// ─── Role Card ────────────────────────────────────────────────────────────────

interface RoleCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  path: string;
  badge?: string;
}

function RoleCard({
  title,
  description,
  icon,
  iconBg,
  iconColor,
  path,
  badge,
}: RoleCardProps) {
  return (
    <NavLink
      to={path}
      className="group relative flex flex-col gap-5 p-6 rounded-2xl transition-all duration-200 outline-none focus-visible:ring-2"
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor =
          "var(--color-primary)";
        (e.currentTarget as HTMLElement).style.boxShadow =
          "0 4px 20px rgba(37,99,235,0.12)";
        (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor =
          "var(--color-border)";
        (e.currentTarget as HTMLElement).style.boxShadow =
          "0 1px 4px rgba(0,0,0,0.05)";
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
      }}
    >
      {/* Optional badge */}
      {badge && (
        <span
          className="absolute top-4 right-4 text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full"
          style={{
            background: "var(--color-bg-blue)",
            color: "var(--color-text-blue)",
          }}
        >
          {badge}
        </span>
      )}

      {/* Icon */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110"
        style={{ background: iconBg, color: iconColor }}
      >
        {icon}
      </div>

      {/* Text */}
      <div className="flex-1">
        <h3
          className="text-base font-semibold mb-1"
          style={{ color: "var(--color-text)" }}
        >
          {title}
        </h3>
        <p
          className="text-sm leading-relaxed"
          style={{ color: "var(--color-text-light)" }}
        >
          {description}
        </p>
      </div>

      {/* Arrow */}
      <div className="flex items-center justify-end">
        <ChevronRight
          className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
          style={{ color: "var(--color-text-light)" }}
        />
      </div>
    </NavLink>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const RoleSelection = () => {
  const roles: RoleCardProps[] = [
    {
      title: "Patient",
      description:
        "Book appointments, access medical records, and manage your healthcare journey.",
      icon: <User className="w-6 h-6" />,
      iconBg: "var(--color-bg-blue)",
      iconColor: "var(--color-primary)",
      path: "/register/patient-register",
    },
    {
      title: "Doctor",
      description:
        "Manage patients and appointments, review scans, and deliver quality care.",
      icon: <Stethoscope className="w-6 h-6" />,
      iconBg: "rgba(22,163,74,0.10)",
      iconColor: "var(--color-success)",
      path: "/register/doctor-register",
    },
    {
      title: "Student Doctor",
      description:
        "Learn and assist under supervision while gaining real clinical experience.",
      icon: <GraduationCap className="w-6 h-6" />,
      iconBg: "rgba(139,92,246,0.10)",
      iconColor: "#7c3aed",
      path: "/register/student-register",
    },
  ];

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-16"
      style={{ background: "var(--color-bg)" }}
    >
      {/* Header */}
      <div className="text-center mb-12 max-w-lg">
        {/* Logo mark */}
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
          style={{ background: "var(--color-bg-blue)" }}
        >
          <span
            className="text-2xl font-bold"
            style={{ color: "var(--color-primary)" }}
          >
            A
          </span>
        </div>

        <h1
          className="text-4xl font-bold tracking-tight mb-3"
          style={{ color: "var(--color-text)" }}
        >
          Join Assnani
        </h1>
        <p className="text-base" style={{ color: "var(--color-text-light)" }}>
          Select your role to create your account and get started.
        </p>
      </div>

      {/* Role cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl">
        {roles.map((role, idx) => (
          <RoleCard key={idx} {...role} />
        ))}
      </div>

      {/* Divider */}
      <div
        className="w-full max-w-4xl flex items-center gap-4 my-8"
      >
        <div className="flex-1 h-px" style={{ background: "var(--color-border)" }} />
        <span className="text-xs font-medium" style={{ color: "var(--color-text-light)" }}>
          or
        </span>
        <div className="flex-1 h-px" style={{ background: "var(--color-border)" }} />
      </div>

      {/* Sign-in link */}
      <p className="text-sm" style={{ color: "var(--color-text-light)" }}>
        Already have an account?{" "}
        <NavLink
          to="/login"
          className="font-semibold underline underline-offset-4 transition-opacity hover:opacity-75"
          style={{ color: "var(--color-primary)" }}
        >
          Sign in
        </NavLink>
      </p>
    </div>
  );
};

export default RoleSelection;
