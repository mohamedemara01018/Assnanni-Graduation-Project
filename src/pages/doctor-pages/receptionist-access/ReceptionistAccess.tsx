import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import { FiShield } from "react-icons/fi";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";
import { FaRegClock } from "react-icons/fa6";
import { NavLink } from "react-router";
import { receptionists } from "@/constants/doctorConstants";

const ReceptionistAccess = () => {
  const totalReceptionists = receptionists.length;
  const activeReceptionists = receptionists.filter(
    (r) => r.status === "active"
  ).length;
  const inactiveReceptionists = totalReceptionists - activeReceptionists;

  return (
    <DashboardLayout pageTitle={"Access Control"}>
      <div className="-mt-6 -ml-6 bg-(--color-bg) rounded-2xl min-h-screen">
        <div className="flex justify-between items-center p-6 pb-2">
          <div>
            <h1 className="text-2xl text-(--color-text) font-medium font-sans">
              Receptionist Access Control
            </h1>
            <p className="text-(--color-text-light) font-thin text-sm mt-1">
              Manage receptionist accounts and access status
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
                  {totalReceptionists}
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
                  {activeReceptionists}
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
                  {inactiveReceptionists}
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
              {receptionists.map((receptionist, index) => (
                <div
                  key={receptionist.id}
                  className={`flex items-center justify-between ${
                    index !== receptionists.length - 1
                      ? "border-b border-gray-100 dark:border-gray-800 pb-4"
                      : "pb-2"
                  } max-lg:flex-col max-lg:items-start max-lg:gap-4`}
                >
                  <div className="flex gap-4 items-center max-lg:w-full">
                    <div
                      className={`w-12 h-12 ${receptionist.color} rounded-full flex items-center justify-center text-white font-semibold shrink-0`}
                    >
                      {receptionist.initials}
                    </div>
                    <div>
                      <div className="flex gap-2 items-center">
                        <h3 className="text-(--color-text) font-semibold">
                          {receptionist.name}
                        </h3>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded ${
                            receptionist.status === "active"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                          }`}
                        >
                          {receptionist.status}
                        </span>
                      </div>
                      <p className="text-xs text-(--color-text-light) mt-1">
                        {receptionist.email} • {receptionist.phone}
                      </p>
                      <p className="text-xs text-(--color-text-light) mt-0.5">
                        Added {receptionist.addedDate} • Last active{" "}
                        {receptionist.lastActive}
                      </p>
                    </div>
                  </div>
                  <div>
                    <button
                      className={`${
                        receptionist.status === "active"
                          ? "bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40"
                          : "bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/40"
                      } px-4 py-2 rounded-lg text-sm transition`}
                    >
                      {receptionist.status === "active"
                        ? "Deactivate"
                        : "Activate"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-(--color-surface) border border-gray-100 dark:border-gray-800 rounded-xl p-6 mb-6">
            <h3 className="flex items-center gap-2 text-(--color-text) font-medium mb-4">
              <FaRegClock /> Recent Activity
            </h3>
            <div className="flex flex-col gap-4 relative">
              <div className="absolute left-[3px] top-2 bottom-2 w-px bg-gray-200 dark:bg-gray-800"></div>

              {[
                {
                  text: "Emily Rodriguez's account status updated",
                  time: "2 hours ago",
                  color: "bg-blue-500",
                },
                {
                  text: "Michael Thompson activated",
                  time: "1 day ago",
                  color: "bg-green-500",
                },
                {
                  text: "Sarah Kim deactivated",
                  time: "2 weeks ago",
                  color: "bg-red-500",
                },
              ].map((activity, idx) => (
                <div key={idx} className="flex gap-3 relative">
                  <div
                    className={`w-2 h-2 rounded-full ${activity.color} mt-1.5 shrink-0 z-10 relative left-0`}
                  ></div>
                  <div>
                    <p className="text-sm text-(--color-text)">
                      {activity.text}
                    </p>
                    <p className="text-xs text-(--color-text-light)">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReceptionistAccess;
