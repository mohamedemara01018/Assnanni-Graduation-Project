import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import { studentDoctors } from "@/constants/doctorConstants";
import { useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";

// Mock data - in a real app, this would come from an API call

const AssignStudentDoctor = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const student = studentDoctors.find((s) => s.id === parseInt(id || "0"));
  const [supervisor, setSupervisor] = useState(student?.supervisor ?? "");
  const [clinic, setClinic] = useState("");
  const [notes, setNotes] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!student) {
      toast.error("No student doctor selected");
      return;
    }
    if (!supervisor.trim()) {
      toast.error("Supervisor name is required");
      return;
    }
    toast.success("Student doctor assigned successfully");
    navigate("/doctor-supervisioning");
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

        {!student ? (
          <div className="rounded-xl border border-(--color-border) bg-(--color-surface) p-5">
            <p className="text-sm text-(--color-text-light)">
              No student doctor selected. Please return to Manage Supervisioning
              and choose a student.
            </p>
          </div>
        ) : (
          <form
            onSubmit={onSubmit}
            className="rounded-xl border border-(--color-border) bg-(--color-surface) p-5"
          >
            <div className="mb-4 rounded-lg bg-(--color-bg) p-4">
              <p className="text-xs text-(--color-text-light)">
                Student Doctor
              </p>
              <p className="text-sm font-semibold text-(--color-text)">
                {student.name} - {student.university} ({student.year})
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <label
                  htmlFor="supervisor"
                  className="mb-1 inline-block text-sm font-medium text-(--color-text)"
                >
                  Supervisor Doctor
                </label>
                <input
                  id="supervisor"
                  value={supervisor}
                  onChange={(e) => setSupervisor(e.target.value)}
                  placeholder="Dr. John Doe"
                  className="w-full rounded-xl border border-(--color-border) bg-(--color-bg) px-4 py-3 text-(--color-text) placeholder:text-gray-500 focus:border-[#00AFE5] focus:outline-none focus:ring-2 focus:ring-[#00AFE5]/25"
                />
              </div>
              <div className="sm:col-span-1">
                <label
                  htmlFor="clinic"
                  className="mb-1 inline-block text-sm font-medium text-(--color-text)"
                >
                  Clinic Name
                </label>
                <input
                  id="clinic"
                  value={clinic}
                  onChange={(e) => setClinic(e.target.value)}
                  placeholder="Assnani Clinic"
                  className="w-full rounded-xl border border-(--color-border) bg-(--color-bg) px-4 py-3 text-(--color-text) placeholder:text-gray-500 focus:border-[#00AFE5] focus:outline-none focus:ring-2 focus:ring-[#00AFE5]/25"
                />
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="notes"
                  className="mb-1 inline-block text-sm font-medium text-(--color-text)"
                >
                  Notes
                </label>
                <textarea
                  id="notes"
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add supervision plan or any notes..."
                  className="w-full resize-none rounded-xl border border-(--color-border) bg-(--color-bg) px-4 py-3 text-(--color-text) placeholder:text-gray-500 focus:border-[#00AFE5] focus:outline-none focus:ring-2 focus:ring-[#00AFE5]/25"
                />
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => navigate("/doctor-supervisioning")}
                className="rounded-lg border border-(--color-border) px-4 py-2 text-sm font-semibold text-(--color-text) hover:bg-(--color-bg)"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Confirm Assignment
              </button>
            </div>
          </form>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AssignStudentDoctor;
