import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import { useForm } from "react-hook-form";
import { useNavigate, useParams, useLocation } from "react-router";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import axios from "axios";
import Cookies from "js-cookie";
import { ScaleLoader } from "react-spinners";
import { useQuery } from "@tanstack/react-query";

interface AssignFormInputs {
  clinicName: string;
  clinicLocation: string;
  notes: string;
}

const AssignStudentDoctor = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { studentName, university, academicYear } = location.state || {};

  const backendUrl = useSelector((state: RootState) => state.config.backendUrl);
  const token = Cookies.get("jwtToken");

  const { data: profileResponse, isLoading: profileLoading } = useQuery({
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

  const doctorName = profileResponse?.data?.fullName || "Loading...";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AssignFormInputs>();

  const onSubmit = async (data: AssignFormInputs) => {
    if (!id) return;

    try {
      const response = await axios.post(
        `${backendUrl}Doctors/assign-supervisor`,
        {
          studentDoctorId: parseInt(id),
          clinicName: data.clinicName,
          clinicLocation: data.clinicLocation,
          notes: data.notes,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.succeeded) {
        toast.success("Student doctor assigned successfully");
        navigate("/doctor-supervisioning");
      } else {
        toast.error(response.data.message || "Assignment failed");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <DashboardLayout pageTitle="Assign Student Doctor">
      <div className="-mt-6 rounded-2xl bg-(--color-bg) p-6">
        <div className="mb-5">
          <h1 className="text-2xl font-semibold text-(--color-text)">
            Assign Student Doctor
          </h1>
          <p className="text-sm text-(--color-text-light)">
            Assign supervision details for the selected student doctor.
          </p>
        </div>

        {!studentName ? (
          <div className="rounded-xl border border-(--color-border) bg-(--color-surface) p-5">
            <p className="text-sm text-(--color-text-light)">
              No student doctor selected. Please return to Manage Supervisioning
              and choose a student.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="rounded-xl border border-(--color-border) bg-(--color-surface) p-5"
          >
            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-lg bg-(--color-bg) p-4 border border-(--color-border)">
                <p className="text-xs text-(--color-text-light) uppercase font-bold tracking-wider mb-1">
                  Student Doctor
                </p>
                <p className="text-sm font-semibold text-(--color-text)">
                  {studentName}
                </p>
              </div>
              <div className="rounded-lg bg-(--color-bg) p-4 border border-(--color-border)">
                <p className="text-xs text-(--color-text-light) uppercase font-bold tracking-wider mb-1">
                  University
                </p>
                <p className="text-sm font-semibold text-(--color-text)">
                  {university}
                </p>
              </div>
              <div className="rounded-lg bg-(--color-bg) p-4 border border-(--color-border)">
                <p className="text-xs text-(--color-text-light) uppercase font-bold tracking-wider mb-1">
                  Academic Year
                </p>
                <p className="text-sm font-semibold text-(--color-text)">
                  {academicYear}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <label className="mb-1 inline-block text-sm font-medium text-(--color-text)">
                  Supervisor Doctor
                </label>
                <div className="relative">
                  <input
                    readOnly
                    value={profileLoading ? "Loading..." : `Dr. ${doctorName}`}
                    className="w-full rounded-xl border border-(--color-border) bg-gray-50 dark:bg-gray-800/50 px-4 py-3 text-(--color-text-light) cursor-not-allowed outline-none"
                  />
                </div>
              </div>

              <div className="sm:col-span-1">
                <label className="mb-1 inline-block text-sm font-medium text-(--color-text)">
                  Clinic Name
                </label>
                <input
                  {...register("clinicName", {
                    required: "Clinic name is required",
                  })}
                  placeholder="Assnani Clinic"
                  className={`w-full rounded-xl border ${errors.clinicName ? "border-red-500" : "border-(--color-border)"} bg-(--color-bg) px-4 py-3 text-(--color-text) placeholder:text-gray-500 focus:border-[#00AFE5] focus:outline-none focus:ring-2 focus:ring-[#00AFE5]/25`}
                />
                {errors.clinicName && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.clinicName.message}
                  </p>
                )}
              </div>

              <div className="sm:col-span-1">
                <label className="mb-1 inline-block text-sm font-medium text-(--color-text)">
                  Clinic Location
                </label>
                <input
                  {...register("clinicLocation", {
                    required: "Clinic location is required",
                  })}
                  placeholder="Main Street, Cairo"
                  className={`w-full rounded-xl border ${errors.clinicLocation ? "border-red-500" : "border-(--color-border)"} bg-(--color-bg) px-4 py-3 text-(--color-text) placeholder:text-gray-500 focus:border-[#00AFE5] focus:outline-none focus:ring-2 focus:ring-[#00AFE5]/25`}
                />
                {errors.clinicLocation && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.clinicLocation.message}
                  </p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 inline-block text-sm font-medium text-(--color-text)">
                  Notes
                </label>
                <textarea
                  {...register("notes")}
                  rows={4}
                  placeholder="Add supervision plan or any notes..."
                  className="w-full resize-none rounded-xl border border-(--color-border) bg-(--color-bg) px-4 py-3 text-(--color-text) placeholder:text-gray-500 focus:border-[#00AFE5] focus:outline-none focus:ring-2 focus:ring-[#00AFE5]/25"
                />
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => navigate("/doctor-supervisioning")}
                className="rounded-lg border border-(--color-border) px-4 py-2 text-sm font-semibold text-(--color-text) hover:bg-(--color-bg) transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-all flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <ScaleLoader
                      size={10}
                      color="#fff"
                      height={15}
                      width={2}
                      margin={1}
                    />
                    Processing...
                  </>
                ) : (
                  "Confirm Assignment"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AssignStudentDoctor;
