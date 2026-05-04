import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import PatientsTable from "../../../components/Doctor/Patients/PatientsTable";
import { FaDownload } from "react-icons/fa6";
import { MdOutlinePersonAddAlt1 } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import { useState, useEffect } from "react";
import PatientsCard from "../../../components/Doctor/Patients/PatientsCard";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { NavLink } from "react-router";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { fallbackPatients } from "@/constants/doctorConstants";
import type { Patient } from "@/interfaces/doctorInterfaces";

const Patients = () => {
  const [view, setView] = useState<"Table" | "Cards">(
    (Cookies.get("patientsView") as "Table" | "Cards") || "Table"
  );
  const backendUrl = useSelector((state: RootState) => state.config.backendUrl);

  const {
    data: patients = fallbackPatients,
    isError,
    error,
    isSuccess,
  } = useQuery<Patient[]>({
    queryKey: ["DoctorPatients"],
    queryFn: async () => {
      const response = await axios.get(`${backendUrl}Doctors/patients`);
      const data = response.data?.value || response.data;
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
      return fallbackPatients;
    },
  });

  useEffect(() => {
    if (isSuccess && patients !== fallbackPatients) {
      toast.success("Patients list loaded successfully");
    }
    if (isError) {
      console.error("Error fetching patients:", error);
      toast.error(error.message || "Failed to load patients");
    }
  }, [isSuccess, isError, error, patients]);

  useEffect(() => {
    Cookies.set("patientsView", view, { expires: 365 });
  }, [view]);

  const exportToCSV = () => {
    const headers = [
      "Name",
      "Phone",
      "Age",
      "Gender",
      "Status",
      "Last Visit",
      "Doctor",
    ];
    const rows = patients.map((p) => [
      p.name,
      p.phone,
      p.age,
      p.gender,
      p.status,
      p.lastVisit,
      p.doctor,
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

  return (
    <DashboardLayout pageTitle={"Patients"}>
      <div className=" -mt-6 p-6 bg-(--color-bg) min-h-[85vh] rounded-2xl">
        <div className="flex justify-between gap-2 items-center mb-8">
          <div>
            <h1 className="text-2xl text-(--color-text) font-bold">
              Patients List
            </h1>
            <p className="font-medium text-(--color-text-light) text-sm mt-1">
              {patients.length} patients found
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
            <NavLink
              to="/register/patient-register"
              className="text-white font-semibold px-5 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-xl cursor-pointer flex gap-2 items-center transition-all shadow-md shadow-blue-500/20"
            >
              <MdOutlinePersonAddAlt1 className="text-xl" />
              Add Patient
            </NavLink>
          </div>
        </div>

        <div className="flex justify-between gap-4 bg-(--color-surface) p-4 rounded-2xl mb-8 border border-(--color-border) shadow-sm max-md:flex-col relative">
          <div className="flex-1 relative flex items-center">
            <FaSearch className="absolute left-4 text-gray-400" />
            <input
              type="text"
              className="w-full pl-11 pr-4 py-3 bg-(--color-bg) border border-(--color-border) rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-(--color-text)"
              placeholder="Search by name or phone..."
            />
          </div>

          <div className="flex gap-3 max-sm:flex-col">
            <select className="px-4 py-2 bg-(--color-bg) border border-(--color-border) rounded-xl text-sm font-medium text-(--color-text) focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer">
              <option value="allStatus">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
            <select className="px-4 py-2 bg-(--color-bg) border border-(--color-border) rounded-xl text-sm font-medium text-(--color-text) focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer">
              <option value="allDoctors">All Doctors</option>
              <option value="chen">Dr. Chen</option>
              <option value="william">Dr. Williams</option>
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
                    <th className="px-4 py-4 text-left font-semibold">
                      ASSIGNED DOCTOR
                    </th>
                    <th className="px-8 py-4 text-right font-semibold">
                      ACTIONS
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-(--color-border)">
                  {patients.map((patient) => (
                    <PatientsTable
                      key={patient.id}
                      id={patient.id}
                      title={patient.name}
                      phone={patient.phone}
                      age={patient.age}
                      gender={patient.gender}
                      status={patient.status}
                      lastVisit={patient.lastVisit}
                      doctor={patient.doctor}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 grid max-md:grid-cols-1 max-lg:grid-cols-2 lg:grid-cols-3 gap-6">
              {patients.map((patient) => (
                <PatientsCard
                  key={patient.id}
                  id={patient.id}
                  title={patient.name}
                  phone={patient.phone}
                  age={patient.age}
                  gender={patient.gender}
                  status={patient.status}
                  lastVisit={patient.lastVisit}
                  doctor={patient.doctor}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Patients;
