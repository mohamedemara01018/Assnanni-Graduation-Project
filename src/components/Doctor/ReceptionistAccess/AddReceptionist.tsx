import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import { NavLink } from "react-router";
import { FiArrowLeft, FiUser, FiMail, FiPhone, FiLock, FiCamera, FiCheckCircle } from "react-icons/fi";
import { BsBuilding } from "react-icons/bs";
import { BiInfoCircle } from "react-icons/bi";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "react-toastify";

interface ReceptionistFormInput {
  fullName: string;
  email: string;
  phone: string;
  clinic: string;
  username: string;
  password?: string;
}

const AddReceptionist = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ReceptionistFormInput>();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: ReceptionistFormInput) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Form Data:", { ...data, profileImage });
    toast.success("Receptionist account created successfully!");
    reset();
    setProfileImage(null);
  };

  return (
    <DashboardLayout pageTitle={"Add Receptionist"}>
      <div className="-mt-6 -ml-6 bg-(--color-bg) rounded-2xl min-h-screen">
        <div className="p-6">
          <NavLink
            to="/receptionist-access"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition mb-6 text-sm w-fit group"
          >
            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            Access Control / <span className="text-gray-500 dark:text-gray-400">Add Receptionist</span>
          </NavLink>

          <div className="flex flex-col mb-8">
            <h1 className="text-3xl text-(--color-text) font-semibold font-sans tracking-tight">
              Create Receptionist Profile
            </h1>
            <p className="text-(--color-text-light) font-light text-base mt-2">
              Set up credentials and clinic access for your new team member
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl">
            <div className="bg-(--color-surface) border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
              {/* Profile Header Decoration */}
              <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-600 w-full relative"></div>

              <div className="px-8 pb-8">
                {/* Profile Picture Upload */}
                <div className="flex flex-col items-center -mt-12 mb-8 relative">
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-2xl border-4 border-(--color-surface) bg-gray-100 dark:bg-gray-800 overflow-hidden shadow-lg transition-transform group-hover:scale-[1.02]">
                      {profileImage ? (
                        <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <FiUser className="text-5xl" />
                        </div>
                      )}
                    </div>
                    <label className="absolute bottom-2 right-2 p-2.5 bg-blue-600 text-white rounded-xl cursor-pointer shadow-lg hover:bg-blue-700 transition-all hover:scale-110 active:scale-95">
                      <FiCamera className="text-lg" />
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                    </label>
                  </div>
                  <p className="text-xs text-(--color-text-light) mt-3 font-medium">Upload Profile Photo</p>
                </div>

                <div className="grid grid-cols-2 max-md:grid-cols-1 gap-x-8 gap-y-6">
                  {/* Full Name */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-(--color-text)">Full Name</label>
                    <div className="relative">
                      <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        {...register("fullName", { required: "Full name is required" })}
                        type="text"
                        placeholder="Jane Smith"
                        className={`w-full bg-gray-50/50 dark:bg-gray-800/50 border ${errors.fullName ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'} rounded-xl pl-11 pr-4 py-3 text-sm text-(--color-text) focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all`}
                      />
                    </div>
                    {errors.fullName && <span className="text-[11px] text-red-500 mt-1">{errors.fullName.message as string}</span>}
                  </div>

                  {/* Email Address */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-(--color-text)">Email Address</label>
                    <div className="relative">
                      <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        {...register("email", {
                          required: "Email is required",
                          pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" }
                        })}
                        type="email"
                        placeholder="jane.smith@assnani.com"
                        className={`w-full bg-gray-50/50 dark:bg-gray-800/50 border ${errors.email ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'} rounded-xl pl-11 pr-4 py-3 text-sm text-(--color-text) focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all`}
                      />
                    </div>
                    {errors.email && <span className="text-[11px] text-red-500 mt-1">{errors.email.message as string}</span>}
                  </div>

                  {/* Phone Number */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-(--color-text)">Phone Number</label>
                    <div className="relative">
                      <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        {...register("phone")}
                        type="tel"
                        placeholder="+1 234-567-8900"
                        className="w-full bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl pl-11 pr-4 py-3 text-sm text-(--color-text) focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>

                  {/* Clinic Assignment */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-(--color-text)">Clinic Assignment</label>
                    <div className="relative">
                      <BsBuilding className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <select
                        {...register("clinic")}
                        className="w-full bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl pl-11 pr-4 py-3 text-sm text-(--color-text) focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none transition-all cursor-pointer"
                      >
                        <option value="">Select a clinic</option>
                        <option value="main">Assnani Main Clinic</option>
                        <option value="downtown">Downtown Branch</option>
                        <option value="west">West Side Medical</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </div>
                  </div>

                  {/* Username */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-(--color-text)">Username</label>
                    <div className="relative">
                      <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        {...register("username", { required: "Username is required" })}
                        type="text"
                        placeholder="janesmith"
                        className={`w-full bg-gray-50/50 dark:bg-gray-800/50 border ${errors.username ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'} rounded-xl pl-11 pr-4 py-3 text-sm text-(--color-text) focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all`}
                      />
                    </div>
                    {errors.username && <span className="text-[11px] text-red-500 mt-1">{errors.username.message as string}</span>}
                  </div>

                  {/* Temporary Password */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-(--color-text)">Temporary Password</label>
                    <div className="relative">
                      <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        {...register("password", { required: "Password is required", minLength: { value: 8, message: "Min 8 characters" } })}
                        type="password"
                        placeholder="Min. 8 characters"
                        className={`w-full bg-gray-50/50 dark:bg-gray-800/50 border ${errors.password ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'} rounded-xl pl-11 pr-4 py-3 text-sm text-(--color-text) focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all`}
                      />
                    </div>
                    {errors.password ? (
                      <span className="text-[11px] text-red-500 mt-1">{errors.password.message as string}</span>
                    ) : (
                      <p className="text-[11px] text-(--color-text-light) mt-1">User will be prompted to change password on first login</p>
                    )}
                  </div>
                </div>

                {/* Account Security Info */}
                <div className="bg-blue-50/50 border border-blue-100 dark:bg-blue-900/10 dark:border-blue-900/20 rounded-2xl p-5 mb-8 mt-10">
                  <h3 className="flex items-center gap-2 text-blue-800 dark:text-blue-400 font-semibold mb-3 text-sm">
                    <BiInfoCircle className="text-xl" /> Account Security
                  </h3>
                  <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-4">
                    <div className="flex gap-2.5 items-start">
                      <FiCheckCircle className="text-blue-500 mt-0.5 shrink-0" />
                      <p className="text-xs text-blue-700/80 dark:text-blue-500/80 leading-relaxed">
                        Temporary password will be sent to the registered email address.
                      </p>
                    </div>
                    <div className="flex gap-2.5 items-start">
                      <FiCheckCircle className="text-blue-500 mt-0.5 shrink-0" />
                      <p className="text-xs text-blue-700/80 dark:text-blue-500/80 leading-relaxed">
                        Access is restricted to assigned clinics and authorized patient records.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4 border-t border-gray-100 dark:border-gray-800 mt-8">
                  <button
                    disabled={isSubmitting}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3.5 rounded-xl text-sm font-semibold transition-all shadow-md shadow-blue-500/20 active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : (
                      "Create Receptionist Profile"
                    )}
                  </button>
                  <NavLink
                    to="/receptionist-access"
                    className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-3.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center border border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                  >
                    Discard Changes
                  </NavLink>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AddReceptionist;
