import LoginForm from "@/components/login-form/LoginForm";
import { Link } from "react-router";
import { Shield, Briefcase, Users2 } from "lucide-react";

function Login() {
  return (
    <div className="flex -mb-10">
      {/* ── Left panel — branding ──────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 bg-(--color-surface) border-r border-(--color-border) p-12 flex-col justify-between">
        {/* Hero text */}
        <div className="space-y-6 ">
          <div>
            <h1 className="text-5xl font-bold text-(--color-text) leading-tight">
              Experience the
            </h1>
            <h1 className="text-5xl font-bold text-(--color-primary) leading-tight">
              Clinical
            </h1>
            <h1 className="text-5xl font-bold text-(--color-primary) leading-tight">
              Sanctuary.
            </h1>
          </div>

          <p className="text-(--color-text-light) text-base max-w-sm leading-relaxed">
            Precision dental management designed with a wellness-first approach.
            Bridging the gap between clinical data and patient care.
          </p>

          {/* Feature cards */}
          <div className="grid grid-cols-2 gap-3 max-w-sm">
            <div className="rounded-2xl border border-(--color-border) bg-(--color-bg) p-5">
              <Shield className="w-7 h-7 text-(--color-primary) mb-3" />
              <p className="text-sm font-medium text-(--color-text)">
                Secure Records
              </p>
            </div>
            <div className="rounded-2xl border border-(--color-border) bg-(--color-bg) p-5">
              <Briefcase className="w-7 h-7 text-emerald-600 dark:text-emerald-400 mb-3" />
              <p className="text-sm font-medium text-(--color-text)">
                24/7 Available
              </p>
            </div>
          </div>

          {/* Trust badge */}
          <div className="flex items-center justify-between bg-(--color-primary) rounded-2xl px-6 py-5 max-w-sm">
            <div className="text-white">
              <p className="text-[10px] uppercase tracking-widest opacity-75 mb-0.5">
                Trusted by
              </p>
              <p className="text-2xl font-bold">5+ Specialists</p>
            </div>
            <Users2 className="w-10 h-10 text-white opacity-75" />
          </div>
        </div>
      </div>

      {/* ── Right panel — form ─────────────────────────────────────────────── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md space-y-6">
          {/* Card */}
          <div
            className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-7 mt-10"
            style={{ boxShadow: "var(--shadow)" }}
          >
            {/* Register / Login tabs */}
            <div className="flex items-center gap-1 mb-7 p-1 rounded-xl bg-(--color-bg) border border-(--color-border)">
              <Link
                to="/register"
                className="flex-1 text-center py-2 rounded-lg text-sm font-medium text-(--color-text-light) hover:text-(--color-text) transition-colors"
              >
                Registration
              </Link>
              <div
                className="flex-1 text-center py-2 rounded-lg text-sm font-semibold text-(--color-text) bg-(--color-surface) border border-(--color-border)"
                style={{ boxShadow: "var(--shadow)" }}
              >
                Login
              </div>
            </div>

            {/* Heading */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-(--color-text) mb-1">
                Welcome back
              </h2>
              <p className="text-sm text-(--color-text-light)">
                Enter your credentials to access your account
              </p>
            </div>

            {/* Form — real Redux + react-hook-form logic */}
            <LoginForm />

            {/* Register link */}
            <p className="mt-6 text-center text-xs text-(--color-text-light)">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-(--color-primary) hover:text-(--color-primary-light) transition-colors"
              >
                Create Sanctuary Account
              </Link>
            </p>
          </div>

          {/* Back home */}
          <div className="text-center">
            <Link
              to="/"
              className="text-xs text-(--color-text-light) hover:text-(--color-text) transition-colors"
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
