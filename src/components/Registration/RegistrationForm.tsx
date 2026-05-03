import { NavLink, useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { MdOutlineMail } from "react-icons/md";
import { LuPhone } from "react-icons/lu";
import { CiLock } from "react-icons/ci";
import { IoPersonCircleOutline } from "react-icons/io5";
import { GrAlert } from "react-icons/gr";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
// import axios from "axios";
import { useDispatch } from "react-redux";
import { setToken } from "@/store/slices/auth/authSlice";
import { getEmail } from "@/store/slices/email/emailSlice";


interface Inputs {
  image: FileList;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

interface RegistrationFormProps {
  isDoctorRegister?: boolean;
  isStudentDoctorRegister?: boolean;
}

const RegistrationForm = ({
  isDoctorRegister = false,
  isStudentDoctorRegister = false,
}: RegistrationFormProps) => {
  // API base: useSelector((s: RootState) => s.config.backendUrl) + 'Authentications/'
  const dispatch = useDispatch();
  const navigator = useNavigate();
  const { pathname } = useLocation();
  const doctor: boolean =
    isDoctorRegister || (!isStudentDoctorRegister && pathname.includes("doctor-register"));
  const studentDoctor: boolean =
    isStudentDoctorRegister || pathname.includes("student-register");
  const isDoctor: boolean =
    pathname.includes("/doctor-register") ||
    pathname.includes("/student-register");
  const isPatient =
    (!pathname.includes("/doctor-register") ||
      !pathname.includes("/student-register") ||
      !pathname.includes("/receptionist-register")) &&
    pathname.includes("register");
  const isReceptionist = pathname.includes("receptionist-register");

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
  const labelClass = "mb-1 inline-block text-sm font-medium text-(--color-text)";
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

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      console.log(data);
      // await axios.post(authBase + "Register-Doctor", data);
      dispatch(getEmail(data.email));
      if (doctor || studentDoctor) {
        // if (doctor) dispatch(setToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiZG9jdG9yIn0=.dummy"));
        // if (studentDoctor) dispatch(setToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic3R1ZGVudCBkb2N0b3IifQ==.dummy"));
        navigator("/verify-doctor", {
          state: { isStudentDoctor: studentDoctor },
        });
      } else {
        // Mock JWT tokens for testing. Replace with actual tokens from backend.
        if (isPatient)
          dispatch(
            setToken(
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoicGF0aWVudCJ9.dummy",
            ),
          );
        if (isReceptionist)
          dispatch(
            setToken(
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoicmVjZXB0aW9uaXN0In0=.dummy",
            ),
          );
        navigator("/verify-email");
      }
      
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    }
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
            <button className="self-center text-white bg-[#00AFE5]  w-full rounded-3xl m-auto py-2 px-6 font-bold cursor-pointer hover:bg-blue-500 ">
              Register
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
