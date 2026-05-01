import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import { NavLink } from "react-router";
import { FiArrowLeft, FiUser, FiMail, FiPhone, FiLock } from "react-icons/fi";
import { BsBuilding } from "react-icons/bs";
import { BiInfoCircle } from "react-icons/bi";

const AddReceptionist = () => {
  return (
    <DashboardLayout pageTitle={"Add Receptionist"}>
      <div className="-mt-6 -ml-6 bg-(--color-bg) rounded-2xl min-h-screen">
        <div className="p-6">
          <NavLink to="/receptionist-access" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition mb-6 text-sm w-fit">
            <FiArrowLeft /> Access Control / <span className="text-gray-500 dark:text-gray-400">Add Receptionist</span>
          </NavLink>

          <h1 className="text-2xl text-(--color-text) font-medium font-sans">
            Add New Receptionist
          </h1>
          <p className="text-(--color-text-light) font-thin text-sm mt-1 mb-6">
            Create a new receptionist account and assign clinic access
          </p>

          <div className="bg-(--color-surface) border border-gray-100 dark:border-gray-800 rounded-xl p-6">
            <div className="grid grid-cols-2 max-md:grid-cols-1 gap-6 mb-6">
              {/* Full Name */}
              <div className="flex flex-col gap-2">
                <label className="text-sm text-(--color-text)">Full Name</label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" placeholder="Jane Smith" className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-(--color-text) focus:outline-none focus:border-blue-500" />
                </div>
              </div>

              {/* Email Address */}
              <div className="flex flex-col gap-2">
                <label className="text-sm text-(--color-text)">Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="email" placeholder="jane.smith@assnani.com" className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-(--color-text) focus:outline-none focus:border-blue-500" />
                </div>
              </div>

              {/* Phone Number */}
              <div className="flex flex-col gap-2">
                <label className="text-sm text-(--color-text)">Phone Number</label>
                <div className="relative">
                  <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="tel" placeholder="+1 234-567-8900" className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-(--color-text) focus:outline-none focus:border-blue-500" />
                </div>
              </div>

              {/* Clinic Assignment */}
              <div className="flex flex-col gap-2">
                <label className="text-sm text-(--color-text)">Clinic Assignment</label>
                <div className="relative">
                  <BsBuilding className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-(--color-text) focus:outline-none focus:border-blue-500 appearance-none">
                    <option>Select a clinic</option>
                  </select>
                </div>
              </div>

              {/* Username */}
              <div className="flex flex-col gap-2">
                <label className="text-sm text-(--color-text)">Username</label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" placeholder="janesmith" className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-(--color-text) focus:outline-none focus:border-blue-500" />
                </div>
              </div>

              {/* Temporary Password */}
              <div className="flex flex-col gap-2">
                <label className="text-sm text-(--color-text)">Temporary Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="password" placeholder="Min. 8 characters" className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-(--color-text) focus:outline-none focus:border-blue-500" />
                </div>
                <p className="text-[11px] text-(--color-text-light) mt-1">User will be prompted to change password on first login</p>
              </div>
            </div>

            {/* Account Security Info */}
            <div className="bg-blue-50 border border-blue-200 dark:bg-blue-900/10 dark:border-blue-900/30 rounded-xl p-4 mb-6 mt-4">
              <h3 className="flex items-center gap-2 text-blue-800 dark:text-blue-400 font-semibold mb-2 text-sm">
                <BiInfoCircle className="text-lg" /> Account Security
              </h3>
              <ul className="list-disc list-inside text-xs text-blue-700 dark:text-blue-500 flex flex-col gap-1 ml-1">
                <li>The temporary password will be sent to the receptionist's email</li>
                <li>They must change it upon first login</li>
                <li>Default permissions can be customized after account creation</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition">
                Create Receptionist
              </button>
              <NavLink to="/receptionist-access" className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-2.5 rounded-lg text-sm font-medium transition flex items-center">
                Cancel
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AddReceptionist;
