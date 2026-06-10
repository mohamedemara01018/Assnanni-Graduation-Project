import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import type { RootState } from "@/store/store";

interface ChangePasswordInputs {
  oldPassword: string;
  newPassword: string;
  confirmedPassword: string;
}

const getResponseMessage = (
  responseData: unknown,
  fallback: string,
): string => {
  if (
    responseData &&
    typeof responseData === "object" &&
    "message" in responseData
  ) {
    return String((responseData as { message: unknown }).message || fallback);
  }

  return fallback;
};

const inputClassName = (hasError: boolean) =>
  `w-full bg-(--color-border) text-(--color-text-light) px-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 ${
    hasError
      ? "border-red-500 focus:border-red-500"
      : "border-gray-300 focus:border-blue-500"
  }`;

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
    mutationFn: async (data: ChangePasswordInputs) => {
      return axios.post(`${backendUrl}Users/change-password`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: (response) => {
      toast.success(
        getResponseMessage(response, "Password changed successfully."),
      );
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
      setError("confirmedPassword", {
        type: "validate",
        message: "Passwords do not match",
      });
      return;
    }

    changePasswordMutation.mutate(data);
  };

  return (
    <div className="m-4 lg:ml-0 p-4 bg-(--color-surface) rounded-2xl">
      <h1 className="text-2xl font-thin text-(--color-text) mb-8 max-sm:text-base">
        Security Settings
      </h1>
      <div>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="oldPassword"
              className="text-lg text-(--color-text) max-sm:text-sm"
            >
              Current Password
            </label>
            <input
              type="password"
              id="oldPassword"
              className={`${inputClassName(Boolean(errors.oldPassword))} max-sm:text-xs`}
              placeholder="Current Password"
              {...register("oldPassword", {
                required: "Current password is required",
              })}
            />
            {errors.oldPassword && (
              <p className="text-xs text-red-600 ml-1 font-light">
                {errors.oldPassword.message}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="newPassword"
              className="text-lg text-(--color-text) max-sm:text-sm"
            >
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              placeholder="New Password"
              className={`${inputClassName(Boolean(errors.newPassword))} max-sm:text-xs`}
              {...register("newPassword", {
                required: "New password is required",
                minLength: {
                  value: 8,
                  message: "New password must be at least 8 characters",
                },
              })}
            />
            {errors.newPassword && (
              <p className="text-xs text-red-600 ml-1 font-light">
                {errors.newPassword.message}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="confirmedPassword"
              className="text-lg text-(--color-text) max-sm:text-sm"
            >
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmedPassword"
              placeholder="Confirm New Password"
              className={`${inputClassName(Boolean(errors.confirmedPassword))} max-sm:text-xs`}
              {...register("confirmedPassword", {
                required: "Please confirm your new password",
              })}
            />
            {errors.confirmedPassword && (
              <p className="text-xs text-red-600 ml-1 font-light">
                {errors.confirmedPassword.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={changePasswordMutation.isPending}
            className="mt-6 mb-4 bg-blue-500 font-semibold text-white w-fit m-auto py-2 px-4 rounded-md hover:bg-blue-500/90 cursor-pointer disabled:cursor-not-allowed disabled:bg-blue-300 max-sm:text-sm"
          >
            {changePasswordMutation.isPending
              ? "Updating..."
              : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SecuritySettings;
