import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

export interface MyProfile {
  fullName: string;
  email: string;
  phoneNumber: string;
}

export const myProfileQueryKey = (token: string | null) => [
  "my-profile",
  token,
];

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

export const normalizeMyProfile = (profile: unknown): MyProfile => {
  const data =
    profile && typeof profile === "object"
      ? (profile as Record<string, unknown>)
      : {};

  return {
    fullName: String(
      data.fullName ||
        data.name ||
        [data.firstName, data.lastName].filter(Boolean).join(" ") ||
        "",
    ),
    email: String(data.email || ""),
    phoneNumber: String(data.phoneNumber || data.phone || ""),
  };
};

export const useMyProfile = () => {
  const backendUrl = useSelector((state: RootState) => state.config.backendUrl);
  const token = useSelector((state: RootState) => state.auth.token);

  return useQuery<MyProfile>({
    queryKey: myProfileQueryKey(token),
    enabled: Boolean(token),
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const response = await axios.get(`${backendUrl}Users/my-profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return normalizeMyProfile(getResponseData(response.data));
    },
  });
};
