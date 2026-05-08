import {
  Mail,
  Phone,
  User,
  Shield,
  IdCard,
  Loader2,
  Trash2,
  Camera,
  UserX,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { useNavigate } from "react-router";
import { logout } from "@/store/slices/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import type { RootState } from "@/store/store";
import Cookies from "js-cookie";
import axios from "axios";
import { toast } from "react-toastify";
interface ProfileData {
  id: string;
  userName: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  roles: string[];
  profileImageUrl?: string;
}

interface ProfileResponse {
  succeeded: boolean;
  message: string;
  data: ProfileData;
}

const ProfilePage = () => {
  const backendUrl = useSelector((state: RootState) => state.config.backendUrl);
  const token = Cookies.get("jwtToken");
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data, isLoading } = useQuery<ProfileResponse>({
    queryKey: ["my-profile"],
    queryFn: async () => {
      const response = await axios.get(`${backendUrl}Users/my-profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    enabled: !!token && !!backendUrl,
  });

  const profile = data?.data;

  const uploadImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("ProfileImage", file);

      const method = profile?.profileImageUrl ? "patch" : "post";
      await axios({
        method,
        url: `${backendUrl}Users/upload-image-profile`,
        data: formData,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: () => {
      toast.success("Profile image updated successfully");
      queryClient.invalidateQueries({ queryKey: ["my-profile"] });
    },
    onError: () => {
      toast.error("Failed to update profile image");
    },
  });

  const deleteImageMutation = useMutation({
    mutationFn: async () => {
      await axios.delete(`${backendUrl}Users/image-profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: () => {
      toast.success("Profile image deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["my-profile"] });
    },
    onError: () => {
      toast.error("Failed to delete profile image");
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      await axios.delete(`${backendUrl}Users/my-account`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: () => {
      toast.success("Account deleted successfully");
      dispatch(logout());
      navigate("/login");
    },
    onError: () => {
      toast.error("Failed to delete account");
    },
  });

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadImageMutation.mutate(file);
    }
  };

  return (
    <DashboardLayout pageTitle="My Profile">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center gap-6 bg-(--color-surface) p-8 rounded-2xl border border-(--color-border) shadow-sm">
          <div className="flex flex-col items-center gap-3">
            <div
              onClick={handleImageClick}
              className="relative w-32 h-32 bg-linear-to-br from-(--color-primary) to-(--color-primary-light) rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg shadow-(--color-primary)/20 shrink-0 cursor-pointer overflow-hidden group transition-all hover:ring-4 hover:ring-(--color-primary-lighter)"
            >
              {profile?.profileImageUrl ? (
                <img
                  src={
                    profile.profileImageUrl.startsWith("http")
                      ? profile.profileImageUrl
                      : `${backendUrl}${profile.profileImageUrl}`
                  }
                  alt="Profile"
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                />
              ) : (
                profile?.fullName?.charAt(0) || <User className="w-16 h-16" />
              )}

              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-8 h-8 text-white" />
              </div>

              {uploadImageMutation.isPending && (
                <div className="absolute inset-0 bg-(--color-surface)/80 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-(--color-primary) animate-spin" />
                </div>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />

            {profile?.profileImageUrl && (
              <button
                onClick={() => {
                  if (window.confirm("Delete profile image?")) {
                    deleteImageMutation.mutate();
                  }
                }}
                disabled={deleteImageMutation.isPending}
                className="flex items-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-600 transition-colors cursor-pointer py-1 px-3 bg-red-50 dark:bg-red-900/20 rounded-full"
              >
                {deleteImageMutation.isPending ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Trash2 className="w-3 h-3" />
                )}
                Delete Image
              </button>
            )}
          </div>
          <div className="text-center md:text-left space-y-2">
            <h1 className="text-3xl font-bold text-(--color-text)">
              {isLoading ? (
                <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-md" />
              ) : (
                profile?.fullName
              )}
            </h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-2">
              {profile?.roles.map((role) => (
                <span
                  key={role}
                  className="px-3 py-1 bg-(--color-primary-lighter) text-(--color-primary) dark:bg-(--color-primary-dark)/30 dark:text-(--color-primary-light) rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1"
                >
                  <Shield className="w-3 h-3" />
                  {role}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contact Information */}
          <div className="bg-(--color-surface) p-6 rounded-2xl border border-(--color-border) shadow-sm space-y-6">
            <h2 className="text-xl font-semibold text-(--color-text) flex items-center gap-2 border-b border-(--color-border) pb-4">
              <IdCard className="w-5 h-5 text-(--color-primary)" />
              Personal Information
            </h2>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-(--color-text-light) font-medium uppercase tracking-wider">
                    Email Address
                  </p>
                  <p className="text-(--color-text) font-medium">
                    {isLoading ? "Loading..." : profile?.email}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-600 dark:text-green-400">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-(--color-text-light) font-medium uppercase tracking-wider">
                    Phone Number
                  </p>
                  <p className="text-(--color-text) font-medium">
                    {isLoading ? "Loading..." : profile?.phoneNumber}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600 dark:text-purple-400">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-(--color-text-light) font-medium uppercase tracking-wider">
                    Full Name
                  </p>
                  <p className="text-(--color-text) font-medium">
                    {isLoading ? "Loading..." : profile?.fullName}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Account Status / Security Summary */}
          <div className="bg-(--color-surface) p-6 rounded-2xl border border-(--color-border) shadow-sm space-y-6">
            <h2 className="text-xl font-semibold text-(--color-text) flex items-center gap-2 border-b border-(--color-border) pb-4">
              <Shield className="w-5 h-5 text-(--color-primary)" />
              Account Security
            </h2>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-orange-600 dark:text-orange-400">
                  <IdCard className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-(--color-text-light) font-medium uppercase tracking-wider">
                    User ID
                  </p>
                  <p className="text-(--color-text) font-medium text-xs break-all">
                    {isLoading ? "Loading..." : profile?.id}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-(--color-primary-lighter)/30 dark:bg-(--color-primary-dark)/10 border border-(--color-primary-lighter) dark:border-(--color-primary-dark)/30 rounded-xl">
                <p className="text-sm text-(--color-text-light) italic">
                  Note: Your profile information is visible to hospital
                  administrators and relevant medical staff to ensure quality of
                  service.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-(--color-border) flex justify-center">
          <button
            onClick={() => {
              if (
                window.confirm(
                  "CRITICAL: This will permanently delete your account and all associated data. This action cannot be undone. Are you sure?",
                )
              ) {
                deleteAccountMutation.mutate();
              }
            }}
            disabled={deleteAccountMutation.isPending}
            className="flex items-center gap-3 bg-red-50 hover:bg-red-100 text-red-600 px-8 py-4 rounded-2xl font-bold transition-all active:scale-95 cursor-pointer shadow-sm border border-red-200 disabled:opacity-50"
          >
            {deleteAccountMutation.isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <UserX className="w-5 h-5" />
            )}
            Permanently Delete Account
          </button>
        </div>

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 className="w-12 h-12 text-(--color-primary) animate-spin" />
            <p className="text-(--color-text-light) font-medium">
              Fetching your profile data...
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
