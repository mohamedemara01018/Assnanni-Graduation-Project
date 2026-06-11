import { NavLink, useNavigate } from "react-router";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import { setToken, fetchUserProfile } from "@/store/slices/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store/store";
import axios from "axios";
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";

interface Inputs {
  email: string;
  password: string;
}

function LoginForm() {
  const loginApiBase = `${useSelector(
    (state: RootState) => state.config.backendUrl,
  )}Authentications/`;

  console.log('login page')
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const response = await axios.post(loginApiBase + "Login", data);
      dispatch(setToken(response.data.data.token));
      await dispatch(fetchUserProfile());
      toast.success("Welcome back!");
      const redirect = sessionStorage.getItem("redirectAfterAuth");
      if (
        redirect &&
        response.data.data?.roles.toLowerCase() == "Patient".toLowerCase()
      ) {
        sessionStorage.removeItem("redirectAfterAuth");
        navigate(redirect);
      } else if (response.data.data?.roles.toLowerCase() == "Doctor_PendingApproval".toLowerCase()) {
        navigate("/waiting");
      } else {
        navigate('/')
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
        error.message ||
        "Something went wrong",
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {/* ── Email ──────────────────────────────────────────────────────── */}
      <div className="space-y-1.5">
        <label
          htmlFor="email"
          className="text-xs font-medium text-(--color-text)"
        >
          Email address
        </label>
        <div className="relative">
          <Mail
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
            style={{
              color: errors.email ? "#dc2626" : "var(--color-text-light)",
            }}
          />
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="john.doe@example.com"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all duration-200"
            style={{
              backgroundColor: "var(--color-bg)",
              border: `1.5px solid ${errors.email ? "#dc2626" : emailFocused ? "var(--color-primary)" : "var(--color-border)"}`,
              color: "var(--color-text)",
              boxShadow: errors.email
                ? "0 0 0 3px rgba(220,38,38,0.08)"
                : emailFocused
                  ? "0 0 0 3px rgba(37,99,235,0.1)"
                  : "none",
            }}
            onFocus={() => setEmailFocused(true)}
            {...register("email", {
              required: "Email address is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Please enter a valid email",
              },
              onBlur: () => setEmailFocused(false),
            })}
          />
        </div>
        {errors.email && (
          <p className="text-xs text-red-600 flex items-center gap-1 ml-0.5">
            <span className="w-1 h-1 rounded-full bg-red-600 shrink-0" />
            {errors.email.message}
          </p>
        )}
      </div>

      {/* ── Password ───────────────────────────────────────────────────── */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label
            htmlFor="password"
            className="text-xs font-medium text-(--color-text)"
          >
            Password
          </label>
          <NavLink
            to="/password-reset"
            className="text-xs font-medium text-(--color-primary) hover:opacity-75 transition-opacity"
          >
            Forgot password?
          </NavLink>
        </div>
        <div className="relative">
          <Lock
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
            style={{
              color: errors.password ? "#dc2626" : "var(--color-text-light)",
            }}
          />
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
            className="w-full pl-10 pr-11 py-2.5 rounded-xl text-sm outline-none transition-all duration-200"
            style={{
              backgroundColor: "var(--color-bg)",
              border: `1.5px solid ${errors.password ? "#dc2626" : passwordFocused ? "var(--color-primary)" : "var(--color-border)"}`,
              color: "var(--color-text)",
              boxShadow: errors.password
                ? "0 0 0 3px rgba(220,38,38,0.08)"
                : passwordFocused
                  ? "0 0 0 3px rgba(37,99,235,0.1)"
                  : "none",
            }}
            onFocus={() => setPasswordFocused(true)}
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
              onBlur: () => setPasswordFocused(false),
            })}
          />
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-60 cursor-pointer"
            style={{ color: "var(--color-text-light)" }}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-red-600 flex items-center gap-1 ml-0.5">
            <span className="w-1 h-1 rounded-full bg-red-600 shrink-0" />
            {errors.password.message}
          </p>
        )}
      </div>

      {/* ── Submit ─────────────────────────────────────────────────────── */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="relative w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-sm font-semibold text-white transition-all duration-200 mt-1 overflow-hidden group"
        style={{
          backgroundColor: isSubmitting
            ? "var(--color-text-light)"
            : "var(--color-primary)",
          cursor: isSubmitting ? "not-allowed" : "pointer",
          opacity: isSubmitting ? 0.75 : 1,
          boxShadow: isSubmitting ? "none" : "0 4px 14px rgba(37,99,235,0.3)",
        }}
        onMouseEnter={(e) => {
          if (!isSubmitting)
            e.currentTarget.style.backgroundColor = "var(--color-primary-dark)";
        }}
        onMouseLeave={(e) => {
          if (!isSubmitting)
            e.currentTarget.style.backgroundColor = "var(--color-primary)";
        }}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Signing in…
          </>
        ) : (
          <>
            Sign In{" "}
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </>
        )}
      </button>
    </form>
  );
}

export default LoginForm;
