import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import { FiShield } from "react-icons/fi";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";
import { BiInfoCircle } from "react-icons/bi";
import { FaRegClock } from "react-icons/fa6";
import { NavLink } from "react-router";

const ReceptionistAccess = () => {
  return (
    <DashboardLayout pageTitle={"Access Control"}>
      <div className="-mt-6 -ml-6 bg-(--color-bg) rounded-2xl min-h-screen">
        <div className="flex justify-between items-center p-6 pb-2">
          <div>
            <h1 className="text-2xl text-(--color-text) font-medium font-sans">
              Receptionist Access Control
            </h1>
            <p className="text-(--color-text-light) font-thin text-sm mt-1">
              Manage receptionist permissions and access levels
            </p>
          </div>
          <NavLink
            to="/receptionist-access/add"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition w-fit"
          >
            <span className="text-lg leading-none">+</span> Add Receptionist
          </NavLink>
        </div>

        <div className="px-6 flex flex-col gap-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4 max-md:grid-cols-1">
            <div className="bg-(--color-surface) rounded-xl p-4 flex gap-4 items-center border border-gray-100 dark:border-gray-800">
              <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-2xl">
                <FiShield />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-(--color-text)">
                  3
                </h2>
                <p className="text-xs text-(--color-text-light)">
                  Total Receptionists
                </p>
              </div>
            </div>
            <div className="bg-(--color-surface) rounded-xl p-4 flex gap-4 items-center border border-gray-100 dark:border-gray-800">
              <div className="w-12 h-12 rounded-lg bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center text-2xl">
                <AiOutlineCheckCircle />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-(--color-text)">
                  2
                </h2>
                <p className="text-xs text-(--color-text-light)">Active</p>
              </div>
            </div>
            <div className="bg-(--color-surface) rounded-xl p-4 flex gap-4 items-center border border-gray-100 dark:border-gray-800">
              <div className="w-12 h-12 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 flex items-center justify-center text-2xl">
                <AiOutlineCloseCircle />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-(--color-text)">
                  1
                </h2>
                <p className="text-xs text-(--color-text-light)">Inactive</p>
              </div>
            </div>
          </div>

          {/* List */}
          <div className="bg-(--color-surface) rounded-xl p-6 border border-gray-100 dark:border-gray-800">
            <h2 className="text-lg font-medium text-(--color-text) mb-4">
              Receptionist List
            </h2>
            <div className="flex flex-col gap-4">
              {/* Item 1 */}
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4 max-lg:flex-col max-lg:items-start max-lg:gap-4">
                <div className="flex gap-4 items-center w-1/3 max-lg:w-full">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold shrink-0">
                    ER
                  </div>
                  <div>
                    <div className="flex gap-2 items-center">
                      <h3 className="text-(--color-text) font-semibold">
                        Emily Rodriguez
                      </h3>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        active
                      </span>
                    </div>
                    <p className="text-xs text-(--color-text-light) mt-1">
                      emily.r@assnani.com • 555-0201
                    </p>
                    <p className="text-xs text-(--color-text-light) mt-0.5">
                      Added 2025-11-01 • Last active 2 hours ago
                    </p>
                  </div>
                </div>
                <div className="w-1/2 max-lg:w-full">
                  <p className="text-xs text-(--color-text-light) mb-2">
                    Permissions:
                  </p>
                  <div className="flex gap-4 text-xs text-(--color-text) flex-wrap">
                    <label className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked
                        readOnly
                        className="accent-gray-600"
                      />{" "}
                      View Patients
                    </label>
                    <label className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked
                        readOnly
                        className="accent-gray-600"
                      />{" "}
                      Manage Appointments
                    </label>
                    <label className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked
                        readOnly
                        className="accent-gray-600"
                      />{" "}
                      Upload Data
                    </label>
                    <label className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked
                        readOnly
                        className="accent-gray-600"
                      />{" "}
                      View Reports
                    </label>
                  </div>
                </div>
                <div>
                  <button className="bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 px-4 py-2 rounded-lg text-sm transition">
                    Deactivate
                  </button>
                </div>
              </div>

              {/* Item 2 */}
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4 max-lg:flex-col max-lg:items-start max-lg:gap-4">
                <div className="flex gap-4 items-center w-1/3 max-lg:w-full">
                  <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center text-white font-semibold shrink-0">
                    MT
                  </div>
                  <div>
                    <div className="flex gap-2 items-center">
                      <h3 className="text-(--color-text) font-semibold">
                        Michael Thompson
                      </h3>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        active
                      </span>
                    </div>
                    <p className="text-xs text-(--color-text-light) mt-1">
                      michael.t@assnani.com • 555-0202
                    </p>
                    <p className="text-xs text-(--color-text-light) mt-0.5">
                      Added 2025-10-15 • Last active 1 day ago
                    </p>
                  </div>
                </div>
                <div className="w-1/2 max-lg:w-full">
                  <p className="text-xs text-(--color-text-light) mb-2">
                    Permissions:
                  </p>
                  <div className="flex gap-4 text-xs text-(--color-text) flex-wrap">
                    <label className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked
                        readOnly
                        className="accent-gray-600"
                      />{" "}
                      View Patients
                    </label>
                    <label className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked
                        readOnly
                        className="accent-gray-600"
                      />{" "}
                      Manage Appointments
                    </label>
                    <label className="flex items-center gap-1">
                      <input type="checkbox" readOnly /> Upload Data
                    </label>
                    <label className="flex items-center gap-1">
                      <input type="checkbox" readOnly /> View Reports
                    </label>
                  </div>
                </div>
                <div>
                  <button className="bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 px-4 py-2 rounded-lg text-sm transition">
                    Deactivate
                  </button>
                </div>
              </div>

              {/* Item 3 */}
              <div className="flex items-center justify-between pb-2 max-lg:flex-col max-lg:items-start max-lg:gap-4">
                <div className="flex gap-4 items-center w-1/3 max-lg:w-full">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold shrink-0">
                    SK
                  </div>
                  <div>
                    <div className="flex gap-2 items-center">
                      <h3 className="text-(--color-text) font-semibold">
                        Sarah Kim
                      </h3>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400">
                        inactive
                      </span>
                    </div>
                    <p className="text-xs text-(--color-text-light) mt-1">
                      sarah.k@assnani.com • 555-0203
                    </p>
                    <p className="text-xs text-(--color-text-light) mt-0.5">
                      Added 2025-09-20 • Last active 2 weeks ago
                    </p>
                  </div>
                </div>
                <div className="w-1/2 max-lg:w-full">
                  <p className="text-xs text-(--color-text-light) mb-2">
                    Permissions:
                  </p>
                  <div className="flex gap-4 text-xs text-(--color-text) flex-wrap">
                    <label className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked
                        readOnly
                        className="accent-gray-600"
                      />{" "}
                      View Patients
                    </label>
                    <label className="flex items-center gap-1">
                      <input type="checkbox" readOnly /> Manage Appointments
                    </label>
                    <label className="flex items-center gap-1">
                      <input type="checkbox" readOnly /> Upload Data
                    </label>
                    <label className="flex items-center gap-1">
                      <input type="checkbox" readOnly /> View Reports
                    </label>
                  </div>
                </div>
                <div>
                  <button className="bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/40 px-4 py-2 rounded-lg text-sm transition">
                    Activate
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Guidelines */}
          <div className="bg-blue-50 border border-blue-200 dark:bg-blue-900/10 dark:border-blue-900/30 rounded-xl p-4">
            <h3 className="flex items-center gap-2 text-blue-800 dark:text-blue-400 font-semibold mb-2 text-sm">
              <BiInfoCircle className="text-lg" /> Permission Guidelines
            </h3>
            <ul className="list-disc list-inside text-xs text-blue-700 dark:text-blue-500 flex flex-col gap-1 ml-1">
              <li>
                <strong>View Patients:</strong> Access to patient list and basic
                information
              </li>
              <li>
                <strong>Manage Appointments:</strong> Schedule, reschedule, and
                cancel appointments
              </li>
              <li>
                <strong>Upload Data:</strong> Upload patient documents and test
                results
              </li>
              <li>
                <strong>View Reports:</strong> Access to analytics and patient
                reports
              </li>
            </ul>
          </div>

          {/* Recent Activity */}
          <div className="bg-(--color-surface) border border-gray-100 dark:border-gray-800 rounded-xl p-6 mb-6">
            <h3 className="flex items-center gap-2 text-(--color-text) font-medium mb-4">
              <FaRegClock /> Recent Activity
            </h3>
            <div className="flex flex-col gap-4 relative">
              <div className="absolute left-[3px] top-2 bottom-2 w-px bg-gray-200 dark:bg-gray-800"></div>

              <div className="flex gap-3 relative">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0 z-10 relative left-[0px]"></div>
                <div>
                  <p className="text-sm text-(--color-text)">
                    Emily Rodriguez's permissions updated
                  </p>
                  <p className="text-xs text-(--color-text-light)">
                    2 hours ago
                  </p>
                </div>
              </div>

              <div className="flex gap-3 relative">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 shrink-0 z-10 relative left-[0px]"></div>
                <div>
                  <p className="text-sm text-(--color-text)">
                    Michael Thompson activated
                  </p>
                  <p className="text-xs text-(--color-text-light)">1 day ago</p>
                </div>
              </div>

              <div className="flex gap-3 relative">
                <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0 z-10 relative left-[0px]"></div>
                <div>
                  <p className="text-sm text-(--color-text)">
                    Sarah Kim deactivated
                  </p>
                  <p className="text-xs text-(--color-text-light)">
                    2 weeks ago
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReceptionistAccess;
