import { NavLink } from "react-router";
import { LuUser } from "react-icons/lu";

interface RoleCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  iconColor: string;
  iconBg: string;
  path: string;
  borderColor?: string;
}

const RoleCard = ({ title, description, icon, iconBg, iconColor, path }: RoleCardProps) => {
  return (
    <NavLink
      to={path}
      className={`bg-(--color-surface) p-8 rounded-3xl border-2 border-(--color-border) hover:border-blue-500 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex flex-col gap-6 group relative overflow-hidden`}
    >
      <div className={`${iconBg} ${iconColor} w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <div>
        <h3 className="text-2xl font-bold text-(--color-text) mb-2">{title}</h3>
        <p className="text-sm text-(--color-text-light) leading-relaxed font-medium">
          {description}
        </p>
      </div>
    </NavLink>
  );
};

const RoleSelection = () => {
  const roles = [
    {
      title: "Patient",
      description: "Book appointments, access medical records, and manage your healthcare",
      icon: <LuUser />,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-500",
      path: "/register/patient-register",
    },
    {
      title: "Doctor",
      description: "Manage patients, appointments, and provide quality healthcare",
      icon: <LuUser />,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-500",
      path: "/register/doctor-register",
    },
    {
      title: "Student Doctor",
      description: "Learn and assist under supervision while gaining experience",
      icon: <LuUser />,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-500",
      path: "/register/student-register",
    },
    {
      title: "Receptionist",
      description: "Handle patient registration, scheduling, and administrative tasks",
      icon: <LuUser />,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-500",
      path: "/register/receptionist-register",
    },
  ];

  return (
    <div className="min-h-screen bg-(--color-bg) flex flex-col items-center justify-center p-6 sm:p-12">
      <div className="max-w-5xl w-full text-center mb-16">
        <h1 className="text-5xl font-bold text-(--color-text) mb-4 tracking-tight">Join Assnani</h1>
        <p className="text-lg text-(--color-text-light) font-medium">Select your role to get started</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full">
        {roles.map((role, idx) => (
          <RoleCard key={idx} {...role} />
        ))}
      </div>

      <div className="mt-16 text-center">
        <p className="text-(--color-text-light) font-medium">
          Already have an account?{" "}
          <NavLink to="/login" className="text-blue-600 hover:text-blue-700 font-bold hover:underline underline-offset-4">
            Sign in
          </NavLink>
        </p>
      </div>
    </div>
  );
};

export default RoleSelection;
