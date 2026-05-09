import { NavLink, useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { MdOutlineMail, MdBloodtype } from "react-icons/md";
import { LuPhone } from "react-icons/lu";
import { CiLock, CiCalendarDate, CiLocationOn } from "react-icons/ci";
import { IoPersonCircleOutline } from "react-icons/io5";
import { GrAlert } from "react-icons/gr";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
// import { setToken } from "@/store/slices/auth/authSlice";
import { getEmail } from "@/store/slices/email/emailSlice";
import type { RootState } from "@/store/store";

interface Inputs {
  image: FileList;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  dateOfBirth?: string;
  address?: string;
  gender?: string;
  bloodType?: string;
}

interface RegistrationFormProps {
  isDoctorRegister?: boolean;
  isStudentDoctorRegister?: boolean;
}

const RegistrationForm = ({
  isDoctorRegister = false,
  isStudentDoctorRegister = false,
}: RegistrationFormProps) => {
  const authBase = useSelector((s: RootState) => s.config.backendUrl);
  const dispatch = useDispatch();
  const navigator = useNavigate();
  const { pathname } = useLocation();
  const doctor: boolean =
    isDoctorRegister ||
    (!isStudentDoctorRegister && pathname.includes("doctor-register"));
  const studentDoctor: boolean =
    isStudentDoctorRegister || pathname.includes("student-register");
  const isDoctor: boolean =
    pathname.includes("/doctor-register") ||
    pathname.includes("/student-register");
  const isPatient: boolean = !doctor && !studentDoctor;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  // eslint-disable-next-line react-hooks/incompatible-library
  const password = watch("password");
  const imageFile = watch("image");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const labelClass =
    "mb-1 inline-block text-sm font-medium text-(--color-text)";
  const inputBaseClass =
    "w-full rounded-xl border bg-(--color-bg) py-2.5 pl-12 pr-3 text-(--color-text) placeholder:text-gray-500 placeholder:text-sm transition focus:outline-none focus:ring-2 focus:ring-[#00AFE5]/30";
  const inputBorderClass = "border-(--color-border)";
  const inputErrorClass = "border-red-500";
  const iconClass =
    "absolute left-0 top-1/2 -translate-y-1/2 border-r-2 border-solid border-gray-300 px-2 text-4xl text-gray-500";
  const errorClass = "ml-1 mt-1 text-xs font-light text-red-600";

  useEffect(() => {
    const selectedImage = imageFile?.[0];
    if (!selectedImage) {
      setImagePreview(null);
      return;
    }

    const imageUrl = URL.createObjectURL(selectedImage);
    setImagePreview(imageUrl);

    return () => URL.revokeObjectURL(imageUrl);
  }, [imageFile]);

  const registerMutation = useMutation({
    mutationFn: async (data: Inputs) => {
      console.log(data);
      if (doctor) {
        return axios.post(authBase + "Authentications/Register-Doctor", {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phoneNumber: data.phoneNumber,
          password: data.password,
          confirmPassword: data.confirmPassword,
        });
      } else if (studentDoctor) {
        const formData = new FormData();
        formData.append("FirstName", data.firstName);
        formData.append("LastName", data.lastName);
        formData.append("Email", data.email);
        formData.append("Password", data.password);
        formData.append("ConfirmPassword", data.confirmPassword);
        formData.append("PhoneNumber", data.phoneNumber);
        
        if (data.image?.[0]) {
          formData.append("ProfileImage", data.image[0]);
        }

        return axios.post(authBase + "StudentDoctor/register", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        console.log(
          data.dateOfBirth
            ? new Date(data.dateOfBirth).toISOString()
            : new Date().toISOString(),
        );
        return axios.post(authBase + "Patient/register", {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
          phoneNumber: data.phoneNumber,
          dateOfBirth: data.dateOfBirth
            ? new Date(data.dateOfBirth).toISOString()
            : new Date().toISOString(),
          address: data.address,
          gender: data.gender,
          bloodType: data.bloodType,
        });
      }
    },
    onSuccess: (_, data) => {
      dispatch(getEmail(data.email));
      navigator("/verify-email", {
        state: { isDoctor: doctor, isStudentDoctor: studentDoctor },
      });
    },
    onError: (error: any) => {
      console.log(error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "Registration failed";
      toast.error(
        typeof errorMessage === "string" ? errorMessage : "Registration failed",
      );
    },
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    registerMutation.mutate(data);
  };
  return (
    <div className="register-container flex flex-col justify-center gap-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col items-center gap-3 py-2">
            <label htmlFor="image" className="cursor-pointer">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Selected profile preview"
                  className="h-28 w-28 rounded-full object-cover ring-2 ring-[#00AFE5]/40"
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-full border-2 border-dashed border-[#00AFE5]/50 bg-[#00AFE5]/10">
                  <IoPersonCircleOutline className="text-6xl text-[#00AFE5]" />
                </div>
              )}
            </label>
            <input
              id="image"
              type="file"
              accept="image/*"
              className="hidden"
              {...register("image", {
                required: "Profile image is required",
              })}
            />
            <label
              htmlFor="image"
              className="cursor-pointer rounded-full bg-[#00AFE5] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
            >
              {imagePreview ? "Change profile image" : "Upload profile image"}
            </label>
            {!errors.image && (
              <p className="text-xs text-gray-500">JPG, PNG, WEBP supported</p>
            )}
            {errors.image?.message && (
              <p className="text-xs text-red-600">{errors.image.message}</p>
            )}
          </div>
          <div className="name grid grid-cols-2 gap-3 max-sm:grid-cols-1">
            <div>
              <label htmlFor="firstName" className={labelClass}>
                First Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  className={`${inputBaseClass} ${
                    errors.firstName ? inputErrorClass : inputBorderClass
                  }`}
                  placeholder="John"
                  id="firstName"
                  {...register("firstName", {
                    required: "First name is Required",
                  })}
                />
                <IoPersonCircleOutline className={iconClass} />
              </div>
              {errors.firstName?.message && (
                <p className={errorClass}>{errors.firstName.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="lastName" className={labelClass}>
                Last Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  className={`${inputBaseClass} ${
                    errors.lastName ? inputErrorClass : inputBorderClass
                  }`}
                  id="lastName"
                  placeholder="Doe"
                  {...register("lastName", {
                    required: "Last name is Required",
                  })}
                />
                <IoPersonCircleOutline className={iconClass} />
              </div>
              {errors.lastName?.message && (
                <p className={errorClass}>{errors.lastName.message}</p>
              )}
            </div>
          </div>
          <div>
            <label htmlFor="email" className={labelClass}>
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="John.doe@example.com"
                className={`${inputBaseClass} ${
                  errors.email ? inputErrorClass : inputBorderClass
                }`}
                id="email"
                {...register("email", {
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Please, make sure your Email Address is correct",
                  },
                  required: "Email Address is Required",
                })}
              />
              <MdOutlineMail className={iconClass} />
            </div>
            {errors.email?.message && (
              <p className={errorClass}>{errors.email.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="phoneNumber" className={labelClass}>
              Phone Number
            </label>
            <div className="relative">
              <input
                type="text"
                className={`${inputBaseClass} ${
                  errors.phoneNumber ? inputErrorClass : inputBorderClass
                }`}
                placeholder="+1 (555) 000-000"
                id="phoneNumber"
                {...register("phoneNumber", {
                  required: "PhonephoneNumber Number is Required",
                  minLength: 11,
                  pattern: {
                    value: /^01[0-2]\d{1,8}$/i,
                    message: "Please, make sure your number is correct",
                  },
                })}
              />
              <LuPhone className={iconClass} />
            </div>
            {errors.phoneNumber?.message && (
              <p className={errorClass}>{errors.phoneNumber?.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="password" className={labelClass}>
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                id="password"
                placeholder="password"
                className={`${inputBaseClass} ${
                  errors.password ? inputErrorClass : inputBorderClass
                }`}
                {...register("password", {
                  required: "Password is Required",
                  pattern: {
                    value:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
                    message: "Min 8 chars, 1 uppercase, 1 lowercase, 1 number",
                  },
                })}
              />
              <CiLock className={iconClass} />
            </div>
            {errors.password?.message && (
              <p className={errorClass}>{errors.password?.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="cPassword" className={labelClass}>
              Confirm Password
            </label>
            <div className="relative">
              <input
                type="password"
                className={`${inputBaseClass} ${
                  errors.confirmPassword ? inputErrorClass : inputBorderClass
                }`}
                id="cPassword"
                placeholder="confirm password"
                {...register("confirmPassword", {
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
              />
              <CiLock className={iconClass} />
            </div>
            {errors.confirmPassword?.message && (
              <p className={errorClass}>{errors.confirmPassword?.message}</p>
            )}
          </div>
          {isPatient && (
            <>
              <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
                <div>
                  <label htmlFor="dateOfBirth" className={labelClass}>
                    Date of Birth
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      className={`${inputBaseClass} ${
                        errors.dateOfBirth ? inputErrorClass : inputBorderClass
                      }`}
                      id="dateOfBirth"
                      {...register("dateOfBirth", {
                        required: "Date of Birth is Required",
                      })}
                    />
                    <CiCalendarDate className={iconClass} />
                  </div>
                  {errors.dateOfBirth?.message && (
                    <p className={errorClass}>{errors.dateOfBirth.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="gender" className={labelClass}>
                    Gender
                  </label>
                  <div className="relative">
                    <select
                      className={`${inputBaseClass} ${
                        errors.gender ? inputErrorClass : inputBorderClass
                      }`}
                      id="gender"
                      {...register("gender", {
                        required: "Gender is Required",
                      })}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                    <IoPersonCircleOutline className={iconClass} />
                  </div>
                  {errors.gender?.message && (
                    <p className={errorClass}>{errors.gender.message}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
                <div>
                  <label htmlFor="address" className={labelClass}>
                    Address
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      className={`${inputBaseClass} ${
                        errors.address ? inputErrorClass : inputBorderClass
                      }`}
                      id="address"
                      placeholder="123 Main St"
                      {...register("address", {
                        required: "Address is Required",
                      })}
                    />
                    <CiLocationOn className={iconClass} />
                  </div>
                  {errors.address?.message && (
                    <p className={errorClass}>{errors.address.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="bloodType" className={labelClass}>
                    Blood Type
                  </label>
                  <div className="relative">
                    <select
                      className={`${inputBaseClass} ${
                        errors.bloodType ? inputErrorClass : inputBorderClass
                      }`}
                      id="bloodType"
                      {...register("bloodType", {
                        required: "Blood Type is Required",
                      })}
                    >
                      <option value="">Select Blood Type</option>
                      <option value="A_Positive">A+</option>
                      <option value="A_Negative">A-</option>
                      <option value="B_Positive">B+</option>
                      <option value="B_Negative">B-</option>
                      <option value="AB_Positive">AB+</option>
                      <option value="AB_Negative">AB-</option>
                      <option value="O_Positive">O+</option>
                      <option value="O_Negative">O-</option>
                    </select>
                    <MdBloodtype className={iconClass} />
                  </div>
                  {errors.bloodType?.message && (
                    <p className={errorClass}>{errors.bloodType.message}</p>
                  )}
                </div>
              </div>
            </>
          )}
          {isDoctor && (
            <div className="bg-[#00E0a5]/20 p-2 rounded-sm font-semibold  text-[#00AFe5]">
              <p className="flex gap-2">
                <GrAlert className="translate-y-0.5 text-xl" />
                After registration, you'll need to upload your medical license
                and credentials for verification.
              </p>
            </div>
          )}
          <div className=" max-sm:w-11/12 w-1/3 m-auto">
            <button
              disabled={registerMutation.isPending}
              className="self-center text-white bg-[#00AFE5]  w-full rounded-3xl m-auto py-2 px-6 font-bold cursor-pointer hover:bg-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {registerMutation.isPending ? "Registering..." : "Register"}
            </button>
          </div>
          <div>
            <p className=" mb-4 flex justify-center gap-1 max-sm:flex-col">
              Already have an account?{" "}
              <NavLink
                to="/login"
                className="text-[#0c86ab] inline-block   font-semibold"
              >
                Sign in
              </NavLink>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;
