import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import { MdOutlineManageAccounts } from "react-icons/md";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { ScaleLoader } from "react-spinners";

interface StudentDoctor {
  id: number;
  name: string;
  university: string;
  year: string;
  supervisor: string;
  status: string;
}

interface MyStudentsResponse {
  succeeded: boolean;
  message: string;
  data: StudentDoctor[];
}

const ManageSupervisioning = () => {
  const navigate = useNavigate();
  const backendUrl = useSelector((state: RootState) => state.config.backendUrl);
  const token = Cookies.get("jwtToken");

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

  if (error) {
    toast.error("Failed to load student doctors");
  }

  const studentDoctors = responseData?.data || [];

  return (
    <DashboardLayout pageTitle="Manage Supervisioning">
      <div className="-mt-6 rounded-2xl bg-(--color-bg) p-6">
        <div className="mb-6 flex items-center gap-3">
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

        <div className="overflow-hidden rounded-xl border border-(--color-border) bg-(--color-surface)">
          <div className="grid grid-cols-12 gap-2 border-b border-(--color-border) bg-(--color-bg) px-4 py-3 text-xs font-semibold text-(--color-text-light)">
            <p className="col-span-3">Student Doctor</p>
            <p className="col-span-3">University</p>
            <p className="col-span-2">Academic Year</p>
            <p className="col-span-2">Supervisor</p>
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
                key={student.id}
                className="grid grid-cols-12 items-center gap-2 border-b border-(--color-border) px-4 py-4 last:border-b-0"
              >
                <div className="col-span-3">
                  <p className="font-medium text-(--color-text)">
                    {student.name}
                  </p>
                  <p className="text-xs text-(--color-text-light)">
                    {student.status}
                  </p>
                </div>
                <p className="col-span-3 text-sm text-(--color-text-light)">
                  {student.university}
                </p>
                <p className="col-span-2 text-sm text-(--color-text-light)">
                  {student.year}
                </p>
                <p className="col-span-2 text-sm text-(--color-text-light)">
                  {student.supervisor || "N/A"}
                </p>

                <div className="col-span-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/doctor-supervisioning/view-request/${student.id}`,
                      )
                    }
                    className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
                  >
                    View
                  </button>
                  <button
                    type="button"
                    disabled={student.status !== "Active"}
                    onClick={() =>
                      navigate(
                        `/doctor-supervisioning/assign-student-doctor/${student.id}`,
                        {
                          state: {
                            studentName: student.name,
                            university: student.university,
                            academicYear: student.year,
                          },
                        },
                      )
                    }
                    className="rounded-lg border border-(--color-border) px-3 py-1.5 text-xs font-semibold text-(--color-text) transition-all hover:bg-(--color-bg) disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Assign
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManageSupervisioning;
