import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import { NavLink, useNavigate } from "react-router";
import {
  FiArrowLeft,
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiCalendar,
  FiMapPin,
} from "react-icons/fi";
import { MdOutlineBloodtype, MdOutlineTransgender } from "react-icons/md";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import Cookies from "js-cookie";
import axios from "axios";

interface RegisterPatientInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  dateOfBirth: string;
  address: string;
  gender: string;
  bloodType: string;
}

const RegisterPatient = () => {
  const navigate = useNavigate();
  const backendUrl = useSelector((state: RootState) => state.config.backendUrl);
  const token = Cookies.get("jwtToken");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterPatientInput>({
    defaultValues: {
      gender: "Male",
      bloodType: "A_Positive",
    },
  });

  const onSubmit = async (data: RegisterPatientInput) => {
    try {
      // Format date to ISO string as required (e.g., 2004-05-06T19:00:46.988Z)
      const formattedData = {
        ...data,
        dateOfBirth: new Date(data.dateOfBirth).toISOString(),
      };
      console.log(formattedData);
      const response = await axios.post(
        `${backendUrl}Receptionist/register-patient`,
        formattedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data.succeeded) {
        toast.success(
          response.data.message || "Patient registered successfully!",
        );
        reset();
        navigate("/doctor-patients");
      } else {
        toast.error(response.data.message || "Failed to register patient");
      }
    } catch (err: any) {
      console.error("Registration error:", err);
      toast.error(
        err.response?.data?.message || "An error occurred during registration",
      );
    }
  };

  const labelClass = "text-sm font-medium text-(--color-text)";
  const inputContainerClass = "relative";
  const iconClass = "absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400";
  const inputClass = (hasError: any) => `
    w-full bg-gray-50/50 dark:bg-gray-800/50 border 
    ${
      hasError
        ? "border-red-400 ring-2 ring-red-500/10"
        : "border-gray-200 dark:border-gray-700"
    } 
    rounded-xl pl-11 pr-4 py-3 text-sm text-(--color-text) 
    focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all
  `;

  return (
    <DashboardLayout pageTitle={"Add Patient"}>
      <div className="-mt-6 -ml-6 bg-(--color-bg) rounded-2xl min-h-screen">
        <div className="p-6">
          <NavLink
            to="/doctor-patients"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition mb-6 text-sm w-fit group"
          >
            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            Patients /{" "}
            <span className="text-gray-500 dark:text-gray-400">
              Register New Patient
            </span>
          </NavLink>

          <div className="flex flex-col mb-8">
            <h1 className="text-3xl text-(--color-text) font-semibold tracking-tight">
              Register New Patient
            </h1>
            <p className="text-(--color-text-light) font-light text-base mt-2">
              Create a new medical record by filling out the patient's
              information
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl">
            <div className="bg-(--color-surface) border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm p-8">
              <div className="grid grid-cols-2 max-md:grid-cols-1 gap-x-8 gap-y-6">
                {/* First Name */}
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>First Name</label>
                  <div className={inputContainerClass}>
                    <FiUser className={iconClass} />
                    <input
                      {...register("firstName", {
                        required: "First name is required",
                      })}
                      type="text"
                      placeholder="John"
                      className={inputClass(errors.firstName)}
                    />
                  </div>
                  {errors.firstName && (
                    <span className="text-[11px] text-red-500 mt-1">
                      {errors.firstName.message}
                    </span>
                  )}
                </div>

                {/* Last Name */}
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>Last Name</label>
                  <div className={inputContainerClass}>
                    <FiUser className={iconClass} />
                    <input
                      {...register("lastName", {
                        required: "Last name is required",
                      })}
                      type="text"
                      placeholder="Doe"
                      className={inputClass(errors.lastName)}
                    />
                  </div>
                  {errors.lastName && (
                    <span className="text-[11px] text-red-500 mt-1">
                      {errors.lastName.message}
                    </span>
                  )}
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>Email Address</label>
                  <div className={inputContainerClass}>
                    <FiMail className={iconClass} />
                    <input
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^\S+@\S+$/i,
                          message: "Invalid email",
                        },
                      })}
                      type="email"
                      placeholder="john.doe@example.com"
                      className={inputClass(errors.email)}
                    />
                  </div>
                  {errors.email && (
                    <span className="text-[11px] text-red-500 mt-1">
                      {errors.email.message}
                    </span>
                  )}
                </div>

                {/* Password */}
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>Temporary Password</label>
                  <div className={inputContainerClass}>
                    <FiLock className={iconClass} />
                    <input
                      {...register("password", {
                        required: "Password is required",
                        minLength: { value: 8, message: "Min 8 characters" },
                      })}
                      type="password"
                      placeholder="••••••••"
                      className={inputClass(errors.password)}
                    />
                  </div>
                  {errors.password && (
                    <span className="text-[11px] text-red-500 mt-1">
                      {errors.password.message}
                    </span>
                  )}
                </div>

                {/* Phone Number */}
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>Phone Number</label>
                  <div className={inputContainerClass}>
                    <FiPhone className={iconClass} />
                    <input
                      {...register("phoneNumber", {
                        maxLength: 11,
                        minLength: 11,
                        pattern: {
                          value: /^[0-9]{11}$/,
                          message: "Phone number must be 11 digits",
                        },
                        required: "Phone number is required",
                      })}
                      type="tel"
                      placeholder="01012345678"
                      className={inputClass(errors.phoneNumber)}
                    />
                  </div>
                  {errors.phoneNumber && (
                    <span className="text-[11px] text-red-500 mt-1">
                      {errors.phoneNumber.message}
                    </span>
                  )}
                </div>

                {/* Date of Birth */}
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>Date of Birth</label>
                  <div className={inputContainerClass}>
                    <FiCalendar className={iconClass} />
                    <input
                      {...register("dateOfBirth", {
                        required: "Date of birth is required",
                      })}
                      type="date"
                      className={inputClass(errors.dateOfBirth)}
                    />
                  </div>
                  {errors.dateOfBirth && (
                    <span className="text-[11px] text-red-500 mt-1">
                      {errors.dateOfBirth.message}
                    </span>
                  )}
                </div>

                {/* Address */}
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className={labelClass}>Address</label>
                  <div className={inputContainerClass}>
                    <FiMapPin className={iconClass} />
                    <input
                      {...register("address", {
                        required: "Address is required",
                      })}
                      type="text"
                      placeholder="Street name, City"
                      className={inputClass(errors.address)}
                    />
                  </div>
                  {errors.address && (
                    <span className="text-[11px] text-red-500 mt-1">
                      {errors.address.message}
                    </span>
                  )}
                </div>

                {/* Gender */}
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>Gender</label>
                  <div className={inputContainerClass}>
                    <MdOutlineTransgender className={iconClass + " text-lg"} />
                    <select
                      {...register("gender", {
                        required: "Gender is required",
                      })}
                      className={inputClass(errors.gender)}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  {errors.gender && (
                    <span className="text-[11px] text-red-500 mt-1">
                      {errors.gender.message}
                    </span>
                  )}
                </div>

                {/* Blood Type */}
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>Blood Type</label>
                  <div className={inputContainerClass}>
                    <MdOutlineBloodtype className={iconClass + " text-lg"} />
                    <select
                      {...register("bloodType", {
                        required: "Blood type is required",
                      })}
                      className={inputClass(errors.bloodType)}
                    >
                      <option value="A_Positive">A+</option>
                      <option value="A_Negative">A-</option>
                      <option value="B_Positive">B+</option>
                      <option value="B_Negative">B-</option>
                      <option value="AB_Positive">AB+</option>
                      <option value="AB_Negative">AB-</option>
                      <option value="O_Positive">O+</option>
                      <option value="O_Negative">O-</option>
                    </select>
                  </div>
                  {errors.bloodType && (
                    <span className="text-[11px] text-red-500 mt-1">
                      {errors.bloodType.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-4 mt-12 pt-8 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3.5 rounded-xl text-sm font-semibold transition-all shadow-md shadow-blue-500/20 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    "Register Patient"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-3.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center border border-transparent hover:border-gray-300 dark:hover:border-gray-600 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RegisterPatient;
