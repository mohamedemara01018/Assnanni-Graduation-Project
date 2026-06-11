import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import PatientsTable from "../../../components/Doctor/Patients/PatientsTable";
import { FaDownload, FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { MdOutlinePersonAddAlt1 } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import { useState, useEffect } from "react";
import PatientsCard from "../../../components/Doctor/Patients/PatientsCard";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { NavLink } from "react-router";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import type { Patient } from "@/interfaces/doctorInterfaces";
import { UserPlus, XCircle } from "lucide-react";
import { ScaleLoader } from "react-spinners";
import { useForm } from "react-hook-form";

interface StudentDoctor {
  studentDoctorId: number;
  studentName: string;
  university: string;
  status: string;
}

interface MyStudentsResponse {
  succeeded: boolean;
  message: string;
  data: StudentDoctor[];
}

interface AssignForm {
  studentDoctorId: number;
  notes: string;
}

const Patients = () => {
  const [view, setView] = useState<"Table" | "Cards">(
    (Cookies.get("patientsView") as "Table" | "Cards") || "Table",
  );
  const backendUrl = useSelector((state: RootState) => state.config.backendUrl);
  const token = Cookies.get("jwtToken");
  const queryClient = useQueryClient();

  const { role } = useSelector(
    (state: {
      auth: {
        role: string;
      };
    }) => state.auth,
  );

  // Modal State
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<
    number | string | null
  >(null);
  const [selectedStudentIdInModal, setSelectedStudentIdInModal] = useState<
    number | null
  >(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<AssignForm>();

  // Filters and Pagination State
  const [search, setSearch] = useState("");
  const [patientStatus, setPatientStatus] = useState<
    "Active" | "InActive" | ""
  >("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading, isError, error, isSuccess } = useQuery({
    queryKey: [
      "DoctorPatients",
      role,
      search,
      pageNumber,
      pageSize,
      patientStatus,
    ],
    queryFn: async () => {
      const endpoint =
        role === "receptionist"
          ? "Receptionist/doctor-patients"
          : "Doctors/patients";

      const response = await axios.get(`${backendUrl}${endpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          PageNumber: pageNumber,
          PageSize: pageSize,
          Search: search,
          PatientStatus: patientStatus || undefined,
        },
      });
      return response.data;
    },
  });

  const { data: studentsData } = useQuery<MyStudentsResponse>({
    queryKey: ["my-students"],
    queryFn: async () => {
      const response = await axios.get(`${backendUrl}Doctors/my-students`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    enabled: role === "doctor" && isAssignModalOpen,
  });

  const assignMutation = useMutation({
    mutationFn: async (formData: AssignForm) => {
      await axios.post(
        `${backendUrl}StudentDoctor/assign-patient-case`,
        {
          patientId: selectedPatientId,
          studentDoctorId: Number(formData.studentDoctorId),
          notes: formData.notes,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
    },
    onSuccess: () => {
      setIsAssignModalOpen(false);
      reset();
      queryClient.invalidateQueries({ queryKey: ["DoctorPatients"] });
    },
    onError: (err: any) => {
      toast.error(
        err.response?.data?.message || "Failed to assign patient case",
      );
    },
  });

  const paginatedData = data?.data;
  const items: Patient[] = paginatedData?.items || [];
  const totalCount = paginatedData?.totalCount || 0;
  const totalPages = paginatedData?.totalPages || 0;

  useEffect(() => {
    if (isError) {
      console.error("Error fetching patients:", error);
      toast.error(
        (error as any)?.response?.data?.message || "Failed to load patients",
      );
    }
  }, [isSuccess, isError, error, data]);

  useEffect(() => {
    Cookies.set("patientsView", view, { expires: 365 });
  }, [view]);

  // Reset page number when filters change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPageNumber(1);
  }, [search, patientStatus]);

  const exportToCSV = () => {
    if (items.length === 0) {
      toast.warning("No data to export");
      return;
    }
    const headers = ["Name", "Phone", "Age", "Gender", "Status", "Last Visit"];
    const rows = items.map((p) => [
      p.name,
      p.phone,
      p.age,
      p.gender,
      p.status,
      p.lastVisit,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      headers.join(",") +
      "\n" +
      rows.map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "patients_list.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Exporting data to CSV...");
  };

  const handleOpenAssignModal = (id: number | string) => {
    setSelectedPatientId(id);
    setIsAssignModalOpen(true);
  };

  const onAssignSubmit = (data: AssignForm) => {
    assignMutation.mutate(data);
  };

  return (
    <DashboardLayout pageTitle={"Patients"}>
      <div className=" -mt-6 p-6 bg-(--color-bg) min-h-[85vh] rounded-2xl">
        <div className="flex justify-between gap-2 items-center mb-8">
          <div>
            <h1 className="text-2xl text-(--color-text) font-bold">
              Patients List
            </h1>
            <p className="font-medium text-(--color-text-light) text-sm mt-1">
              {totalCount} patients found
            </p>
          </div>
          <div className="flex gap-4 items-center">
            <button
              onClick={exportToCSV}
              className="text-(--color-text-light) font-semibold px-5 py-2.5 bg-(--color-surface) border border-(--color-border) hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl flex gap-2 items-center cursor-pointer transition-all shadow-sm"
            >
              <FaDownload className="text-sm" />
              Export
            </button>
            {role === "receptionist" && (
              <NavLink
                to="/receptionist/register-patient"
                className="text-white font-semibold px-5 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-xl cursor-pointer flex gap-2 items-center transition-all shadow-md shadow-blue-500/20"
              >
                <MdOutlinePersonAddAlt1 className="text-xl" />
                Add Patient
              </NavLink>
            )}
          </div>
        </div>

        <div className="flex justify-between gap-4 bg-(--color-surface) p-4 rounded-2xl mb-8 border border-(--color-border) shadow-sm max-md:flex-col relative">
          <div className="flex-1 relative flex items-center">
            <FaSearch className="absolute left-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-(--color-bg) border border-(--color-border) rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-(--color-text)"
              placeholder="Search by name or phone..."
            />
          </div>

          <div className="flex gap-3 max-sm:flex-col">
            <select
              value={patientStatus}
              onChange={(e) =>
                setPatientStatus(e.target.value as "Active" | "InActive" | "")
              }
              className="px-4 py-2 bg-(--color-bg) border border-(--color-border) rounded-xl text-sm font-medium text-(--color-text) focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            >
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="InActive">Inactive</option>
            </select>

            <div className="flex p-1 bg-(--color-bg) border border-(--color-border) rounded-xl ml-2">
              <button
                onClick={() => setView("Table")}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  view === "Table"
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-(--color-text-light) hover:text-(--color-text)"
                }`}
              >
                Table
              </button>
              <button
                onClick={() => setView("Cards")}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  view === "Cards"
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-(--color-text-light) hover:text-(--color-text)"
                }`}
              >
                Cards
              </button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20 bg-(--color-surface) rounded-2xl border border-(--color-border)">
            <div className="w-10 h-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 bg-(--color-surface) rounded-2xl border border-(--color-border)">
            <p className="text-(--color-text-light) font-medium">
              No patients found.
            </p>
          </div>
        ) : (
          <>
            <div className="rounded-2xl border border-(--color-border) overflow-hidden shadow-sm bg-(--color-surface)">
              {view === "Table" ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50/50 dark:bg-gray-800/30 text-(--color-text-light) text-xs uppercase tracking-wider border-b border-(--color-border)">
                        <th className="px-8 py-4 text-left font-semibold">
                          PATIENT
                        </th>
                        <th className="px-4 py-4 text-left font-semibold">
                          AGE/GENDER
                        </th>
                        <th className="px-4 py-4 text-left font-semibold">
                          STATUS
                        </th>
                        <th className="px-4 py-4 text-left font-semibold">
                          LAST VISIT
                        </th>
                        <th className="px-8 py-4 text-right font-semibold">
                          ACTIONS
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-(--color-border)">
                      {items.map((patient) => (
                        <PatientsTable
                          key={patient.id}
                          id={patient.id}
                          title={patient.name}
                          phone={patient.phone}
                          age={patient.age}
                          gender={patient.gender}
                          status={patient.status}
                          lastVisit={patient.lastVisit}
                          role={role}
                          onAssign={handleOpenAssignModal}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-6 grid max-md:grid-cols-1 max-lg:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map((patient) => (
                    <PatientsCard
                      key={patient.id}
                      id={patient.id}
                      title={patient.name}
                      phone={patient.phone}
                      age={patient.age}
                      gender={patient.gender}
                      status={patient.status}
                      lastVisit={patient.lastVisit}
                      role={role}
                      onAssign={handleOpenAssignModal}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Pagination */}
            <div className="mt-6 flex flex-wrap justify-between items-center bg-(--color-surface) p-4 rounded-2xl border border-(--color-border) shadow-sm gap-4">
              <div className="flex items-center gap-6">
                <span className="text-sm text-(--color-text-light) font-medium">
                  Showing {(pageNumber - 1) * pageSize + 1} to{" "}
                  {Math.min(pageNumber * pageSize, totalCount)} of {totalCount}{" "}
                  patients
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-(--color-text-light) font-semibold uppercase tracking-wider">
                    Show:
                  </span>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setPageNumber(1);
                    }}
                    className="bg-(--color-bg) border border-(--color-border) rounded-lg px-2 py-1 text-xs font-bold text-(--color-text) focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 items-center">
                <button
                  onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
                  disabled={pageNumber === 1 || isLoading}
                  className={`p-2.5 rounded-xl border border-(--color-border) transition-all ${
                    pageNumber === 1 || isLoading
                      ? "bg-gray-50 text-gray-400 cursor-not-allowed"
                      : "bg-(--color-bg) text-(--color-text) hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                  }`}
                >
                  <FaChevronLeft className="text-xs" />
                </button>

                {/* Page numbers */}
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setPageNumber(i + 1)}
                      className={`w-9 h-9 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                        pageNumber === i + 1
                          ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                          : "bg-(--color-bg) text-(--color-text) border border-(--color-border) hover:bg-gray-100"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  {totalPages > 5 && (
                    <span className="px-2 self-center text-gray-400">...</span>
                  )}
                </div>

                <button
                  onClick={() =>
                    setPageNumber((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={pageNumber >= totalPages || isLoading}
                  className={`p-2.5 rounded-xl border border-(--color-border) transition-all ${
                    pageNumber >= totalPages || isLoading
                      ? "bg-gray-50 text-gray-400 cursor-not-allowed"
                      : "bg-(--color-bg) text-(--color-text) hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                  }`}
                >
                  <FaChevronRight className="text-xs" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Assign Student Doctor Modal */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-(--color-surface) w-full max-w-lg rounded-2xl shadow-2xl border border-(--color-border) overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-(--color-border)">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-violet-50 dark:bg-violet-900/20 rounded-lg text-violet-600">
                  <UserPlus size={20} />
                </div>
                <h2 className="text-xl font-bold text-(--color-text)">
                  Assign Student Doctor
                </h2>
              </div>
              <button
                onClick={() => {
                  setIsAssignModalOpen(false);
                  reset();
                }}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
              >
                <XCircle size={20} className="text-(--color-text-light)" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit(onAssignSubmit)}
              className="p-6 space-y-5 flex-1 overflow-y-auto"
            >
              <div className="space-y-3">
                <label className="text-sm font-bold text-(--color-text) ml-1">
                  Select Student Doctor
                </label>
                <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                  {studentsData?.data.map((student) => {
                    const isSelected =
                      Number(selectedStudentIdInModal) ===
                      student.studentDoctorId;
                    return (
                      <div
                        key={student.studentDoctorId}
                        onClick={() => {
                          setSelectedStudentIdInModal(student.studentDoctorId);
                          setValue("studentDoctorId", student.studentDoctorId);
                        }}
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex justify-between items-center ${
                          isSelected
                            ? "border-blue-600 bg-blue-50/50 dark:bg-blue-900/20"
                            : "border-(--color-border) hover:border-gray-300 dark:hover:border-gray-700 bg-(--color-bg)"
                        }`}
                      >
                        <div className="flex flex-col gap-0.5">
                          <h4 className="text-sm font-bold text-(--color-text)">
                            {student.studentName}
                          </h4>
                          <p className="text-[11px] text-(--color-text-light) font-medium">
                            {student.university} •{" "}
                            {student.status || "Clinical Level"}
                          </p>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                            isSelected
                              ? "border-blue-600 bg-blue-600 shadow-[0_0_0_2px_white_inset]"
                              : "border-gray-300 dark:border-gray-600"
                          }`}
                        >
                          {isSelected && (
                            <div className="w-1.5 h-1.5 bg-white rounded-full" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <input
                  type="hidden"
                  {...register("studentDoctorId", {
                    required: "Please select a student",
                  })}
                />
                {errors.studentDoctorId && (
                  <p className="text-[10px] text-red-500 font-bold uppercase ml-1 tracking-wider">
                    {errors.studentDoctorId.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-(--color-text) ml-1">
                  Assignment Notes
                </label>
                <textarea
                  {...register("notes", { required: "Notes are required" })}
                  placeholder="Instructions or context for the student..."
                  rows={3}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.notes ? "border-red-500" : "border-(--color-border)"} bg-(--color-bg) text-(--color-text) focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm resize-none`}
                />
                {errors.notes && (
                  <p className="text-[10px] text-red-500 font-bold uppercase ml-1 tracking-wider">
                    {errors.notes.message}
                  </p>
                )}
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAssignModalOpen(false);
                    reset();
                    setSelectedStudentIdInModal(null);
                  }}
                  className="flex-1 py-3 text-sm font-bold text-(--color-text-light) border border-(--color-border) rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={assignMutation.isPending}
                  className="flex-[2] bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
                >
                  {assignMutation.isPending ? (
                    <>
                      <ScaleLoader color="#fff" height={10} width={2} />
                      Assigning...
                    </>
                  ) : (
                    "Assign Case"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Patients;
