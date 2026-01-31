import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import PatientsTable from "../../../components/Doctor/Patients/PatientsTable";
import { FaDownload } from "react-icons/fa6";
import { MdOutlinePersonAddAlt1 } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import { useState } from "react";
import PatientsCard from "../../../components/Doctor/Patients/PatientsCard";

const Patients = () => {
  const [view, setView] = useState<"Table" | "Cards">("Table");
  return (
    <DashboardLayout pageTitle={"Patients"}>
      <div className=" -mt-6 p-4 bg-(--color-bg) min-h-[85vh] rounded-2xl">
        <div className="flex justify-between gap-2 items-center p-1 mb-8">
          <div>
            <h1 className="text-2xl text-(--color-text) font-semibold">
              Patients List
            </h1>
            <p className="font-thin text-(--color-text-light) text-sm">
              8 patients found
            </p>
          </div>
          <div className="flex gap-4 items-center">
            <button className="text-(--color-text-light) font-semibold px-4 py-2 bg-(--color-surface) hover:bg-gray-300/90 rounded-md flex gap-1.5  items-center cursor-pointer">
              <FaDownload />
              Export
            </button>
            <button className="text-white font-semibold px-4 py-2 bg-blue-500 hover:bg-blue-500/90 rounded-md cursor-pointer flex gap-1.5 items-center">
              <MdOutlinePersonAddAlt1 className="text-lg" />
              Add Patient
            </button>
          </div>
        </div>
        <div className="flex justify-between gap-4 bg-(--color-surface)  p-5 px-2 rounded-2xl mb-6 max-md:flex-col relative">
          <div className="flex flex-3 p-2">
            <FaSearch className="absolute left-7     top-7   pr-2 border-r-2 border-gray-400 h-11 text-3xl text-gray-400 max-sm:hidden" />
            <input
              type="text"
              className=" w-full px-3 pl-12 py-2 text-lg border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring-blue-500 text-(--color-text-light)"
              placeholder="Search by Phone or Name"
            />
          </div>

          <div className="flex flex-2 gap-4 justify-between max-sm:px-4">
            <select
              name="status"
              id="status"
              className=" block min-w-fit  rounded-lg border border-gray-300 bg-(--color-surface) px-2 py-0 pr-8 leading-tight text-(--color-text) shadow-sm hover:border-gray-400 h-10 self-center focus:border-blue-500 focus:outline-none focus:ring-blue-500 text-center cursor-pointer  text-xs font-semibold"
            >
              <option value="allStatus">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
            <select
              name="doctors"
              id="doctors"
              className=" block min-w-fit text-xs  rounded-lg border border-gray-300 bg-(--color-surface) px-2 py-0 pr-8 leading-tight text-(--color-text) font-semibold h-10 self-center shadow-sm cursor-pointer hover:border-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 text-center "
            >
              <option value="allDoctors">All Doctors</option>
              <option value="chen">Dr.Chen</option>
              <option value="william">Dr.William</option>
            </select>
            <div className=" flex  w-fit ml-4 mr-2 self-center  bg-gray-100 justify-between rounded-2xl font-medium text-gray-800 cursor-pointer text-sm max-sm:hidden">
              <div
                onClick={() => setView("Table")}
                className={` rounded-l-2xl w-full p-3 px-6 ${
                  view === "Table" && "bg-blue-500 text-white"
                }`}
              >
                <span>Table</span>
              </div>
              <div
                className={`p-3 px-6 rounded-r-2xl cursor-pointer ${
                  view === "Cards" && "bg-blue-500 text-white"
                }`}
                onClick={() => setView("Cards")}
              >
                <span>Cards</span>
              </div>
            </div>
          </div>
        </div>
        <div className="p-2 overflow-x-auto overflow-y-hidden rounded-2xl">
          {view === "Table" ? (
            <table className=" table-auto w-full border-collapse rounded-2xl  min-w-fit border-2 border-gray-300  ">
              <thead className="border-2 border-gray-200 rounded-2xl ">
                <tr className="bg-(--color-bg) rounded-2xl text-(--color-text-light) ">
                  <th className="px-4 py-3 text-left font-medium ">PATIENT</th>
                  <th className="px-4 py-3 text-left font-medium ">
                    AGE/GENDER
                  </th>
                  <th className="px-4 py-3 text-left font-medium ">STATUS</th>
                  <th className="px-4 py-3 text-left font-medium ">
                    LAST VISIT
                  </th>
                  <th className="px-4 py-3 text-left font-medium ">
                    ASSIGNED DOCTOR
                  </th>
                  <th className="px-4 py-3 text-center font-medium ">ACTION</th>
                </tr>
              </thead>
              <tbody>
                <PatientsTable
                  title="John Smith"
                  phone="5555-4545-54"
                  age={45}
                  gender="Male"
                  status="Active"
                  lastVisit="2025-12-10"
                  doctor="Dr.Chen"
                />
                <PatientsTable
                  title="John Smith"
                  phone="5555-4545-54"
                  age={45}
                  gender="Male"
                  status="Inactive"
                  lastVisit="2025-12-10"
                  doctor="Dr.Chen"
                />
                <PatientsTable
                  title="John Smith"
                  phone="5555-4545-54"
                  age={45}
                  gender="Male"
                  status="Pending"
                  lastVisit="2025-12-10"
                  doctor="Dr.Chen"
                />
              </tbody>
            </table>
          ) : (
            <div className="grid max-md:grid-cols-1 max-lg:grid-cols-2 grid-cols-3 gap-5">
              <PatientsCard
                title="John Smith"
                phone="5555-4545-54"
                age={45}
                gender="Male"
                status="Pending"
                lastVisit="2025-12-10"
                doctor="Dr.Chen"
              />
              <PatientsCard
                title="John Smith"
                phone="5555-4545-54"
                age={45}
                gender="Male"
                status="Active"
                lastVisit="2025-12-10"
                doctor="Dr.Chen"
              />
              <PatientsCard
                title="John Smith"
                phone="5555-4545-54"
                age={45}
                gender="Male"
                status="InActive"
                lastVisit="2025-12-10"
                doctor="Dr.Chen"
              />
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Patients;
