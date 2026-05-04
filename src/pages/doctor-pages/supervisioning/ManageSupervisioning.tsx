import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import { studentDoctors } from "@/constants/doctorConstants";
import { FaRegAddressCard } from "react-icons/fa6";
import { MdOutlineManageAccounts } from "react-icons/md";
import { useNavigate } from "react-router";

const ManageSupervisioning = () => {
  const navigate = useNavigate();

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

          {studentDoctors.map((student) => (
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
                {student.supervisor}
              </p>

              <div className="col-span-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/doctor-supervisioning/view-request/${student.id}`
                    )
                  }
                  className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
                >
                  View
                </button>
                <button
                  type="button"
                  disabled={student.status !== "Active"}
                  onClick={() =>
                    navigate(
                      `/doctor-supervisioning/assign-student-doctor/${student.id}`
                    )
                  }
                  className="rounded-lg border border-(--color-border) px-3 py-1.5 text-xs font-semibold text-(--color-text) transition-opacity hover:bg-(--color-bg) disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Assign
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-900/40 dark:bg-green-900/10">
          <FaRegAddressCard className="mt-0.5 text-lg text-green-700 dark:text-green-400" />
          <p className="text-sm text-green-800 dark:text-green-300">
            This page is ready to connect with backend APIs for assigning and
            monitoring student doctors under supervision.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManageSupervisioning;
