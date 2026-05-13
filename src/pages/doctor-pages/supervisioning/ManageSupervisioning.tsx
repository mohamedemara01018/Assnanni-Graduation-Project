import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import { MdOutlineManageAccounts } from "react-icons/md";
import { useNavigate } from "react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { ScaleLoader } from "react-spinners";
import { Plus, XCircle, FileText, Upload } from "lucide-react";
import { useForm } from "react-hook-form";

interface StudentDoctor {
  studentDoctorId: number;
  studentName: string;
  university: string;
  yearsOfStudy: number;
  nationalId: string;
  status: string;
}

interface MyStudentsResponse {
  succeeded: boolean;
  message: string;
  data: StudentDoctor[];
}

interface StudyCaseForm {
  title: string;
  description: string;
  scanFile: FileList;
}

const ManageSupervisioning = () => {
  const navigate = useNavigate();
  const backendUrl = useSelector((state: RootState) => state.config.backendUrl);
  const token = Cookies.get("jwtToken");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<StudyCaseForm>();

  const scanFile = watch("scanFile");

  useEffect(() => {
    if (scanFile && scanFile.length > 0) {
      const file = scanFile[0];
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [scanFile]);

  const {
    data: responseData,
    isLoading,
    error,
  } = useQuery<MyStudentsResponse>({
    queryKey: ["my-students"],
    queryFn: async () => {
      const response = await axios.get(`${backendUrl}Doctors/my-students`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    enabled: !!token && !!backendUrl,
  });

  const createStudyCaseMutation = useMutation({
    mutationFn: async (data: StudyCaseForm) => {
      const formData = new FormData();
      formData.append("Title", data.title);
      formData.append("Description", data.description);
      if (data.scanFile && data.scanFile[0]) {
        formData.append("ScanUrl", data.scanFile[0]);
      }

      await axios.post(`${backendUrl}StudentDoctor/case-study`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: () => {
      toast.success("Study case created successfully");
      setIsModalOpen(false);
      reset();
      setPreviewUrl(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to create study case");
    },
  });

  useEffect(() => {
    if (error) {
      toast.error("Failed to load student doctors");
    }
  }, [error]);

  const studentDoctors = responseData?.data || [];

  const onSubmit = (data: StudyCaseForm) => {
    createStudyCaseMutation.mutate(data);
  };

  return (
    <DashboardLayout pageTitle="Manage Supervisioning">
      <div className="-mt-6 rounded-2xl bg-(--color-bg) p-6">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-100 p-2 text-2xl text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              <MdOutlineManageAccounts />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-(--color-text)">
                Manage Supervisioning
              </h1>
              <p className="text-sm text-(--color-text-light)">
                Manage student Doctors
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-95 font-medium cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            Add New Study Case
          </button>
        </div>

        <div className="overflow-hidden rounded-xl border border-(--color-border) bg-(--color-surface)">
          <div className="grid grid-cols-12 gap-2 border-b border-(--color-border) bg-(--color-bg) px-4 py-3 text-xs font-semibold text-(--color-text-light)">
            <p className="col-span-3">Student Doctor</p>
            <p className="col-span-3">University</p>
            <p className="col-span-2">Academic Year</p>
            <p className="col-span-2">National ID</p>
            <p className="col-span-2 text-right">Actions</p>
          </div>

          {isLoading ? (
            <div className="py-20 flex justify-center items-center bg-(--color-surface)">
              <ScaleLoader color="#2563eb" />
            </div>
          ) : studentDoctors.length === 0 ? (
            <div className="py-20 text-center text-(--color-text-light) bg-(--color-surface)">
              <p>No student doctors found under your supervision.</p>
            </div>
          ) : (
            studentDoctors.map((student) => (
              <div
                key={student.studentDoctorId}
                className="grid grid-cols-12 items-center gap-2 border-b border-(--color-border) px-4 py-4 last:border-b-0"
              >
                <div className="col-span-3">
                  <p className="font-medium text-(--color-text)">
                    {student.studentName}
                  </p>
                  <p className="text-xs text-(--color-text-light)">
                    {student.status}
                  </p>
                </div>
                <p className="col-span-3 text-sm text-(--color-text-light)">
                  {student.university}
                </p>
                <p className="col-span-2 text-sm text-(--color-text-light)">
                  {student.yearsOfStudy}
                </p>
                <p className="col-span-2 text-sm text-(--color-text-light)">
                  {student.nationalId}
                </p>

                <div className="col-span-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/doctor-supervisioning/view-request/${student.studentDoctorId}`,
                      )
                    }
                    className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    View
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/doctor-supervisioning/assign-student-doctor/${student.studentDoctorId}`,
                        {
                          state: {
                            studentName: student.studentName,
                            university: student.university,
                            academicYear: student.yearsOfStudy,
                          },
                        },
                      )
                    }
                    className="rounded-lg border border-(--color-border) px-3 py-1.5 text-xs font-semibold text-(--color-text) transition-all hover:bg-(--color-bg) disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                  >
                    Assign
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* New Study Case Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-(--color-surface) w-full max-w-lg rounded-2xl shadow-2xl border border-(--color-border) overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-(--color-border)">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600">
                  <FileText size={20} />
                </div>
                <h2 className="text-xl font-bold text-(--color-text)">
                  New Study Case
                </h2>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  reset();
                }}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
              >
                <XCircle size={20} className="text-(--color-text-light)" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto max-h-[70vh]">
              <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-(--color-text) ml-1 text-black">
                    Title
                  </label>
                  <input
                    {...register("title", { required: "Title is required" })}
                    placeholder="Case study title"
                    className={`w-full px-4 py-3 rounded-xl border ${errors.title ? "border-red-500" : "border-(--color-border)"} bg-(--color-bg) text-(--color-text) focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm`}
                  />
                  {errors.title && (
                    <p className="text-[10px] text-red-500 font-bold uppercase ml-1 tracking-wider">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-(--color-text) ml-1 text-black">
                    Description
                  </label>
                  <textarea
                    {...register("description", {
                      required: "Description is required",
                    })}
                    placeholder="Detailed explanation of the case..."
                    rows={4}
                    className={`w-full px-4 py-3 rounded-xl border ${errors.description ? "border-red-500" : "border-(--color-border)"} bg-(--color-bg) text-(--color-text) focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm resize-none`}
                  />
                  {errors.description && (
                    <p className="text-[10px] text-red-500 font-bold uppercase ml-1 tracking-wider">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-(--color-text) ml-1 text-black">
                    Scan File
                  </label>

                  {previewUrl ? (
                    <div className="relative rounded-2xl overflow-hidden border border-(--color-border) group">
                      <img
                        src={previewUrl}
                        alt="Scan Preview"
                        className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => {
                            reset({ ...watch(), scanFile: undefined });
                            setPreviewUrl(null);
                          }}
                          className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                        >
                          <XCircle size={24} />
                        </button>
                      </div>
                      <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-black/90 px-3 py-1.5 rounded-lg text-[10px] font-bold text-blue-600 border border-blue-100 dark:border-blue-900/50">
                        {scanFile?.[0]?.name}
                      </div>
                    </div>
                  ) : (
                    <div className="relative group">
                      <input
                        type="file"
                        {...register("scanFile", {
                          required: "Scan file is required",
                        })}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div
                        className={`w-full border-2 border-dashed ${errors.scanFile ? "border-red-500 bg-red-50 dark:bg-red-900/10" : "border-(--color-border) bg-(--color-bg)"} rounded-xl p-8 flex flex-col items-center justify-center gap-3 transition-all group-hover:border-blue-500`}
                      >
                        <div
                          className={`p-3 rounded-full ${errors.scanFile ? "bg-red-100 text-red-600" : "bg-blue-50 dark:bg-blue-900/20 text-blue-600"}`}
                        >
                          <Upload size={24} />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-bold text-(--color-text)">
                            Click to upload scan
                          </p>
                          <p className="text-xs text-(--color-text-light) mt-1">
                            Select a binary file for the study case
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  {errors.scanFile && (
                    <p className="text-[10px] text-red-500 font-bold uppercase ml-1 tracking-wider">
                      {errors.scanFile.message}
                    </p>
                  )}
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      reset();
                    }}
                    className="flex-1 py-3 text-sm font-bold text-(--color-text-light) border border-(--color-border) rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createStudyCaseMutation.isPending}
                    className="flex-[2] bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {createStudyCaseMutation.isPending ? (
                      <>
                        <ScaleLoader color="#fff" height={10} width={2} />
                        Creating...
                      </>
                    ) : (
                      "Create Case"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ManageSupervisioning;
