import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import type { RootState } from "@/store/store";
import { Eye, EyeOff, Lock, ShieldCheck, KeyRound } from "lucide-react";

interface ChangePasswordInputs {
  oldPassword: string;
  newPassword: string;
  confirmedPassword: string;
}

const getResponseMessage = (responseData: unknown, fallback: string): string => {
  if (responseData && typeof responseData === "object" && "message" in responseData) {
    return String((responseData as { message: unknown }).message || fallback);
  }
  return fallback;
};

// ─── Password input with toggle ──────────────────────────────────────────────
interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
  inputRef?: React.Ref<HTMLInputElement>;
}

const PasswordInput = ({ hasError, inputRef, ...props }: PasswordInputProps) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        {...props}
        ref={inputRef}
        type={visible ? "text" : "password"}
        className={`w-full bg-(--color-bg) text-(--color-text) text-sm px-3 py-2.5 pr-10 border rounded-lg shadow-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${hasError
          ? "border-red-400 focus:border-red-400 focus:ring-red-400/20"
          : "border-(--color-border) focus:border-blue-500"
          } ${props.className ?? ""}`}
      />
      <button
        type="button"
        tabIndex={-1}
        onClick={() => setVisible((v) => !v)}
        className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
};

// ─── Field row ────────────────────────────────────────────────────────────────
interface FieldRowProps {
  icon: React.ReactNode;
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}

const FieldRow = ({ icon, label, htmlFor, error, children }: FieldRowProps) => (
  <div className="flex flex-col gap-1.5">
    <label
      htmlFor={htmlFor}
      className="flex items-center gap-2 text-sm font-medium text-(--color-text)"
    >
      <span className="text-blue-500 dark:text-blue-400">{icon}</span>
      {label}
    </label>
    {children}
    {error && (
      <p className="flex items-center gap-1 text-xs text-red-500 dark:text-red-400 pl-0.5">
        <span className="inline-block w-1 h-1 rounded-full bg-red-500 shrink-0" />
        {error}
      </p>
    )}
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────
const SecuritySettings = () => {
  const backendUrl = useSelector((state: RootState) => state.config.backendUrl);
  const token = useSelector((state: RootState) => state.auth.token);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<ChangePasswordInputs>();

  const changePasswordMutation = useMutation({
    mutationFn: async (data: ChangePasswordInputs) =>
      axios.post(`${backendUrl}Users/change-password`, data, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    onSuccess: (response) => {
      toast.success(getResponseMessage(response.data, "Password changed successfully."));
      reset();
    },
    onError: (error: unknown) => {
      const message = axios.isAxiosError(error)
        ? getResponseMessage(error.response?.data, error.message)
        : "Failed to change password.";
      toast.error(message);
    },
  });

  const onSubmit: SubmitHandler<ChangePasswordInputs> = (data) => {
    if (data.newPassword !== data.confirmedPassword) {
      setError("confirmedPassword", { type: "validate", message: "Passwords do not match" });
      return;
    }
    changePasswordMutation.mutate(data);
  };

  // Extract register props and pass ref correctly for PasswordInput
  const oldPasswordProps = register("oldPassword", { required: "Current password is required" });
  const newPasswordProps = register("newPassword", {
    required: "New password is required",
    minLength: { value: 8, message: "Must be at least 8 characters" },
  });
  const confirmedPasswordProps = register("confirmedPassword", {
    required: "Please confirm your new password",
  });

  return (
    <div className="m-4 lg:ml-0">
      {/* Card */}
      <div className="bg-(--color-surface) border border-(--color-border) rounded-2xl overflow-hidden shadow-sm">

        {/* Header strip */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-(--color-border) bg-blue-50/50 dark:bg-blue-950/20">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/40">
            <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-(--color-text) leading-tight">
              Change Password
            </h1>
            <p className="text-xs text-(--color-text-light) mt-0.5">
              Keep your account secure with a strong password
            </p>
          </div>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-6 flex flex-col gap-5">

          {/* Security tip */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50/80 dark:bg-amber-900/15 border border-amber-200/60 dark:border-amber-800/30">
            <KeyRound className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
              Use at least 8 characters with a mix of letters, numbers, and symbols.
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-(--color-border)" />

          {/* Current password */}
          <FieldRow
            icon={<Lock className="w-3.5 h-3.5" />}
            label="Current Password"
            htmlFor="oldPassword"
            error={errors.oldPassword?.message}
          >
            <PasswordInput
              id="oldPassword"
              placeholder="Enter your current password"
              hasError={Boolean(errors.oldPassword)}
              inputRef={oldPasswordProps.ref}
              name={oldPasswordProps.name}
              onChange={oldPasswordProps.onChange}
              onBlur={oldPasswordProps.onBlur}
            />
          </FieldRow>

          {/* Divider */}
          <div className="border-t border-(--color-border)" />

          {/* New password */}
          <FieldRow
            icon={<Lock className="w-3.5 h-3.5" />}
            label="New Password"
            htmlFor="newPassword"
            error={errors.newPassword?.message}
          >
            <PasswordInput
              id="newPassword"
              placeholder="Enter a new password"
              hasError={Boolean(errors.newPassword)}
              inputRef={newPasswordProps.ref}
              name={newPasswordProps.name}
              onChange={newPasswordProps.onChange}
              onBlur={newPasswordProps.onBlur}
            />
          </FieldRow>

          {/* Confirm password */}
          <FieldRow
            icon={<Lock className="w-3.5 h-3.5" />}
            label="Confirm New Password"
            htmlFor="confirmedPassword"
            error={errors.confirmedPassword?.message}
          >
            <PasswordInput
              id="confirmedPassword"
              placeholder="Repeat your new password"
              hasError={Boolean(errors.confirmedPassword)}
              inputRef={confirmedPasswordProps.ref}
              name={confirmedPasswordProps.name}
              onChange={confirmedPasswordProps.onChange}
              onBlur={confirmedPasswordProps.onBlur}
            />
          </FieldRow>

          {/* Submit */}
          <div className="pt-1 flex justify-end">
            <button
              type="submit"
              disabled={changePasswordMutation.isPending}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-400 dark:disabled:bg-blue-800 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-all duration-150 shadow-sm hover:shadow-md disabled:cursor-not-allowed cursor-pointer"
            >
              {changePasswordMutation.isPending ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Updating…
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Update Password
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SecuritySettings;
