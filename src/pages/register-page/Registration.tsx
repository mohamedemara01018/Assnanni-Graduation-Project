import BackHome from "@/components/back-home/BackHome";
import { Outlet } from "react-router";

const Registration = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10"
      style={{ background: "var(--color-bg)" }}
    >
      <div className="w-full max-w-lg flex flex-col gap-4">
        <BackHome />

        <div
          className="rounded-2xl p-8 flex flex-col gap-8 w-full"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
          }}
        >
          {/* Brand */}
          <div className="flex flex-col items-center gap-2 text-center">

            <h1
              className="text-2xl font-bold tracking-tight"
              style={{ color: "var(--color-text)" }}
            >
              Create Your Account
            </h1>
            <p
              className="text-sm"
              style={{ color: "var(--color-text-light)" }}
            >
              Choose your role and fill in your information
            </p>
          </div>

          {/* Outlet (form content) */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Registration;
