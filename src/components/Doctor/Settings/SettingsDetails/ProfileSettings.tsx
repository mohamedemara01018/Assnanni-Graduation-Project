import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  myProfileQueryKey,
  normalizeMyProfile,
  useMyProfile,
  type MyProfile,
} from "@/hooks/useMyProfile";
import type { RootState } from "@/store/store";

interface ProfileFormInputs {
  fullName: string;
  email: string;
  phoneNumber: string;
}

const phoneRegex = /^\+?[\d\s().-]{7,20}$/;

const getResponseData = (responseData: unknown) => {
  if (
    responseData &&
    typeof responseData === "object" &&
    "data" in responseData
  ) {
    return (responseData as { data: unknown }).data;
  }

  if (
    responseData &&
    typeof responseData === "object" &&
    "value" in responseData
  ) {
    return (responseData as { value: unknown }).value;
  }

  return responseData;
};

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

const ProfileSettings = () => {
  const queryClient = useQueryClient();
  const backendUrl = useSelector((state: RootState) => state.config.backendUrl);
  const token = useSelector((state: RootState) => state.auth.token);
  const { data: profile, isLoading } = useMyProfile();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormInputs>({
    values: {
      fullName: profile?.fullName || "",
      email: profile?.email || "",
      phoneNumber: profile?.phoneNumber || "",
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormInputs) => {
      return axios.put(
        `${backendUrl}Users/my-profile`,
        { phoneNumber: data.phoneNumber },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    },
    onSuccess: (response, variables) => {
      const updatedProfile = normalizeMyProfile(getResponseData(response.data));

      queryClient.setQueryData<MyProfile>(
        myProfileQueryKey(token),
        (current) => ({
          fullName: updatedProfile.fullName || current?.fullName || "",
          email: updatedProfile.email || current?.email || "",
          phoneNumber: updatedProfile.phoneNumber || variables.phoneNumber,
        }),
      );
    },
    onError: (error: unknown) => {
      const message = axios.isAxiosError(error)
        ? getResponseMessage(error.response?.data, error.message)
        : "Failed to update profile.";

      toast.error(message);
    },
  });

  const onSubmit: SubmitHandler<ProfileFormInputs> = (data) => {
    updateProfileMutation.mutate(data);
  };

  return (
    <div className="m-4 lg:ml-0 p-4 bg-(--color-surface) rounded-2xl">
      <h1 className="text-2xl font-thin text-(--color-text) mb-8 max-sm:text-base">
        Profile Settings
      </h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-1">
          <label
            htmlFor="fullName"
            className="text-lg text-(--color-text) max-sm:text-sm"
          >
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            readOnly
            className="w-full bg-(--color-border) px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none text-(--color-text-light) cursor-not-allowed max-sm:text-xs"
            placeholder={isLoading ? "Loading..." : "John Doe"}
            {...register("fullName")}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label
            htmlFor="email"
            className="text-lg text-(--color-text) max-sm:text-sm"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            readOnly
            placeholder={isLoading ? "Loading..." : "doe@gmail.com"}
            className="w-full bg-(--color-border) px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none text-(--color-text-light) cursor-not-allowed max-sm:text-xs"
            {...register("email")}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label
            htmlFor="phone"
            className="text-lg text-(--color-text) max-sm:text-sm"
          >
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            placeholder="+1 2323232"
            className={`w-full bg-(--color-border) px-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 text-(--color-text-light) max-sm:text:xs ${
              errors.phoneNumber
                ? "border-red-500 focus:border-red-500"
                : "border-gray-300 focus:border-blue-500"
            }`}
            {...register("phoneNumber", {
              required: "Phone number is required",
              pattern: {
                value: phoneRegex,
                message: "Please enter a valid phone number",
              },
            })}
          />
          {errors.phoneNumber && (
            <p className="text-xs text-red-600 ml-1 font-light">
              {errors.phoneNumber.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={updateProfileMutation.isPending}
          className="mt-6 mb-4 bg-blue-500 font-semibold text-white w-fit m-auto py-2 px-4 rounded-md hover:bg-blue-500/90 cursor-pointer disabled:cursor-not-allowed disabled:bg-blue-300 max-sm:text-sm"
        >
          {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default ProfileSettings;
