import { NavLink } from "react-router";
import { IoMdPersonAdd } from "react-icons/io";
import { BsCalendar3, BsCheckCircleFill } from "react-icons/bs";

const QuickActions = () => {
  const actions = [
    {
      title: "Register New Patient",
      subTitle: "Add to system",
      icon: <IoMdPersonAdd />,
      color: "blue",
      path: "/register/patient-register",
      bg: "bg-blue-50/50",
      iconBg: "bg-blue-600",
      textColor: "text-blue-800",
      subColor: "text-blue-600",
    },
    {
      title: "Schedule Appointment",
      subTitle: "Book for patient",
      icon: <BsCalendar3 />,
      color: "green",
      path: "/receptionist/schedule-appointment",
      bg: "bg-emerald-50/50",
      iconBg: "bg-emerald-600",
      textColor: "text-emerald-800",
      subColor: "text-emerald-600",
    },
    {
      title: "Check-In Patient",
      subTitle: "Mark as arrived",
      icon: <BsCheckCircleFill />,
      color: "purple",
      path: "/receptionist/check-in",
      bg: "bg-purple-50/50",
      iconBg: "bg-purple-600",
      textColor: "text-purple-800",
      subColor: "text-purple-600",
    },
  ];

  return (
    <div className="bg-(--color-surface) p-8 rounded-2xl border border-(--color-border) shadow-sm w-full">
      <h2 className="text-xl font-bold text-(--color-text) mb-8">
        Quick Actions
      </h2>
      <div className="flex flex-col gap-4">
        {actions.map((action, idx) => (
          <NavLink
            key={idx}
            to={action.path}
            className={`${action.bg} rounded-2xl p-4 flex gap-4 items-center border border-transparent hover:border-current/10 transition-all group`}
          >
            <div
              className={`${action.iconBg} text-white text-xl flex justify-center items-center w-12 h-12 rounded-2xl shadow-sm group-hover:scale-105 transition-transform`}
            >
              {action.icon}
            </div>
            <div>
              <h3 className={`${action.textColor} font-bold text-sm`}>
                {action.title}
              </h3>
              <p className={`${action.subColor} text-xs font-medium`}>
                {action.subTitle}
              </p>
            </div>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
