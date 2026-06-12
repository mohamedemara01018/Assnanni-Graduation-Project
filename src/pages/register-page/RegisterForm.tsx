import RegistrationForm from "@/components/Registration/RegistrationForm";
import RoleCard from "@/components/role-card/RoleCard";
import { roles } from "@/constants/rolesConstant";

const RegisterForm = () => {
  return (
    <div className="flex flex-col gap-6">

      {/* ── Role switcher tabs ── */}
      <div
        className="flex items-center gap-1 p-1 rounded-xl"
        style={{
          background: "var(--color-bg)",
          border: "1px solid var(--color-border)",
        }}
      >
        {roles.map((role, idx) => (
          <RoleCard
            key={idx}
            path={role.path}
            label={role.label}
            icon={role.icon}
          />
        ))}
      </div>

      {/* ── Form ── */}
      <RegistrationForm />
    </div>
  );
};

export default RegisterForm;
