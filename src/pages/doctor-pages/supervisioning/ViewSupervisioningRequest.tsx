import { useEffect } from "react";
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import { FiFileText } from "react-icons/fi";
import { LuUpload } from "react-icons/lu";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import Cookies from "js-cookie";
import { ScaleLoader } from "react-spinners";
import { useMutation } from "@tanstack/react-query";

interface StudentDoctorRequest {
  id: number;
  fullName: string;
  status: string;
  university: string;
  academicYear: string;
  nationalId: string;
  proofImageUrl: string | null;
}

interface RequestResponse {
  succeeded: boolean;
  message: string;
  data: StudentDoctorRequest;
}

const ViewSupervisioningRequest = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const backendUrl = useSelector((state: RootState) => state.config.backendUrl);
  const token = Cookies.get("jwtToken");

  const {
    data: responseData,
    isLoading,
    error,
  } = useQuery<RequestResponse>({
    queryKey: ["supervising-request", id],
    queryFn: async () => {
      const response = await axios.get(
        `${backendUrl}Doctors/supervising-requests/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data;
    },
    enabled: !!id && !!token && !!backendUrl,
  });

  useEffect(() => {
    if (error) {
      toast.error("Failed to load request details");
    }
  }, [error]);

  const student = responseData?.data;

  const approveMutation = useMutation({
    mutationFn: async (studentDoctorId: number) => {
      await axios.post(
        `${backendUrl}Doctors/approve-student-doctor`,
        { studentDoctorId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    },
    onSuccess: () => {
      toast.success(
        "Supervisioning request approved, Please assign the student",
      );
      navigate(`/doctor-supervisioning`);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to approve request");
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (studentDoctorId: number) => {
      await axios.post(
        `${backendUrl}Doctors/reject-student-doctor`,
        { studentDoctorId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    },
    onSuccess: () => {
      toast.info("Supervisioning request declined");
      navigate("/doctor-supervisioning");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to reject request");
    },
  });

  const isActionPending = approveMutation.isPending || rejectMutation.isPending;
  const isActionSuccess = approveMutation.isSuccess || rejectMutation.isSuccess;

  return (
    <DashboardLayout pageTitle="View Supervisioning Request">
      <div className="flex items-center justify-center px-4 py-6 sm:px-6">
        <div className="w-full max-w-4xl rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 shadow-xl sm:p-8">
          <div className="mb-8 flex flex-col items-center gap-3 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#00AFE5]/15">
              <FiFileText className="text-3xl text-[#00AFE5]" />
            </div>
            <h1 className="text-2xl font-semibold text-(--color-text) sm:text-3xl">
              View Supervisioning Request
            </h1>
            <p className="max-w-2xl text-sm text-(--color-text-light) sm:text-base">
              Review student doctor details and dental university proof.
            </p>
          </div>

          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4">
              <ScaleLoader color="#00AFE5" />
              <p className="text-(--color-text-light) font-medium">
                Loading request details...
              </p>
            </div>
          ) : !student ? (
            <div className="rounded-xl border border-(--color-border) bg-(--color-bg) p-5">
              <p className="text-sm text-(--color-text-light)">
                No student doctor found or request details unavailable.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-(--color-border) bg-(--color-bg) p-4">
                  <p className="text-xs text-(--color-text-light)">Full Name</p>
                  <p className="text-sm font-medium text-(--color-text)">
                    {student.fullName}
                  </p>
                </div>
                <div className="rounded-xl border border-(--color-border) bg-(--color-bg) p-4">
                  <p className="text-xs text-(--color-text-light)">Status</p>
                  <p className="text-sm font-medium text-(--color-text)">
                    {student.status}
                  </p>
                </div>
                <div className="rounded-xl border border-(--color-border) bg-(--color-bg) p-4">
                  <p className="text-xs text-(--color-text-light)">
                    University
                  </p>
                  <p className="text-sm font-medium text-(--color-text)">
                    {student.university}
                  </p>
                </div>
                <div className="rounded-xl border border-(--color-border) bg-(--color-bg) p-4">
                  <p className="text-xs text-(--color-text-light)">
                    Academic Year
                  </p>
                  <p className="text-sm font-medium text-(--color-text)">
                    {student.academicYear}
                  </p>
                </div>
                <div className="rounded-xl border border-(--color-border) bg-(--color-bg) p-4 sm:col-span-2">
                  <p className="text-xs text-(--color-text-light)">
                    National ID
                  </p>
                  <p className="text-sm font-medium text-(--color-text)">
                    {student.nationalId}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-start gap-1">
                <label className="mb-1 inline-block text-sm font-medium text-(--color-text)">
                  Dental University Proof
                </label>
                <div className="w-full rounded-2xl border border-[#00AFE5]/25 bg-linear-to-br from-[#00AFE5]/8 via-transparent to-[#00AFE5]/4 p-6 sm:p-8">
                  {student.proofImageUrl ? (
                    <div className="flex flex-col items-center gap-4">
                      <img
                        src={
                          student.proofImageUrl.startsWith("http")
                            ? student.proofImageUrl
                            : backendUrl?.replace("/api/", "/") +
                              student.proofImageUrl
                        }
                        alt="Dental university proof"
                        className="max-h-80 w-full rounded-xl border border-(--color-border) bg-(--color-surface) object-contain p-2"
                      />
                      <p className="rounded-full bg-(--color-surface) px-4 py-1.5 text-sm text-(--color-text-light)">
                        Uploaded by student doctor
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-4 text-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#00AFE5]/15">
                        <LuUpload className="text-3xl text-[#00AFE5]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-(--color-text)">
                          No dental university proof uploaded
                        </h3>
                        <p className="text-sm text-(--color-text-light)">
                          Ask the student doctor to upload the required file.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {student && !isActionSuccess && (
            <div className="mt-6 flex flex-col gap-3 rounded-xl border border-(--color-border) bg-(--color-bg) p-4 sm:flex-row sm:items-center sm:justify-end">
              <button
                type="button"
                disabled={isLoading || isActionPending}
                onClick={() => {
                  if (student) approveMutation.mutate(student.id);
                }}
                className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-600/20 transition-all hover:-translate-y-0.5 hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 min-w-[120px] flex items-center justify-center"
              >
                {approveMutation.isPending ? (
                  <ScaleLoader color="white" height={15} width={2} margin={1} />
                ) : (
                  "Approve"
                )}
              </button>
              <button
                type="button"
                disabled={isLoading || isActionPending}
                onClick={() => {
                  if (student) rejectMutation.mutate(student.id);
                }}
                className="rounded-xl border border-red-300 bg-red-50 px-5 py-2.5 text-sm font-semibold text-red-700 transition-all hover:-translate-y-0.5 hover:bg-red-100 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300 disabled:cursor-not-allowed disabled:opacity-50 min-w-[120px] flex items-center justify-center"
              >
                {rejectMutation.isPending ? (
                  <ScaleLoader
                    color="#ef4444"
                    height={15}
                    width={2}
                    margin={1}
                  />
                ) : (
                  "Decline"
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ViewSupervisioningRequest;
