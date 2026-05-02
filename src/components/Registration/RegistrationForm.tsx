import { NavLink, useLocation, useNavigate } from "react-router";
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
import { roles } from "@/constants/rolesConstant";
import RoleCard from "../role-card/RoleCard";

interface Inputs {
  image: File;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

const RegistrationForm = () => {
  // const backendUrl = import.meta.env.VITE_BACKEND_URL + 'Authentications/';
  const dispatch = useDispatch();
  const navigator = useNavigate();
  const { pathname } = useLocation();
  const doctor: boolean = pathname.includes("doctor-register");
  const studentDoctor: boolean = pathname.includes("studentDoctor-register");
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

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      // await axios.post(backendUrl + "Register-Doctor", data);
      dispatch(getEmail(data.email));
      if (doctor || studentDoctor) {
        // if (doctor) dispatch(setToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiZG9jdG9yIn0=.dummy"));
        // if (studentDoctor) dispatch(setToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic3R1ZGVudCBkb2N0b3IifQ==.dummy"));
        navigator("/verify-doctor");
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    }
  };
  return (
    <div className="register-container flex flex-col justify-center gap-4">
      <div className="flex justify-center items-center gap-4 bg-(--color-bg) border border-(--color-border) rounded-full ">
        {roles.map((role, idx) => {
          return (
            <RoleCard
              key={idx}
              path={role.path}
              label={role.label}
              icon={role.icon}
            />
          );
        })}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-3 ">
          <div className="name">
            <div>
              <label htmlFor="firstName">First Name</label>
              <div className="relative">
                <input
                  type="text"
                  className={`pl-12 p-2 bg-(--color-bg) text-(--color-text) border border-(--color-border) placeholder:text-gray-500 placeholder:text-sm placeholder:font-sans rounded-md  w-full ${
                    errors.firstName && "border-red-500"
                  }`}
                  placeholder="John"
                  id="firstName"
                  {...register("firstName", {
                    required: "First name is Required",
                  })}
                />
                <IoPersonCircleOutline className="absolute bottom-1 fill-gray-500 border-r-2 border-solid border-gray-400 w-10 px-2 text-3xl" />
              </div>
              {errors.firstName?.message && (
                <p className="text-xs text-red-600 ml-1 font-light">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div>
              {" "}
              <label htmlFor="lname">Last Name</label>
              <div className="relative">
                <input
                  type="text"
                  className={`pl-12 p-2 bg-(--color-bg) text-(--color-text) border border-(--color-border) placeholder:text-gray-500 placeholder:text-sm placeholder:font-sans rounded-md  w-full ${
                    errors.lastName && "border-red-500"
                  }`}
                  id="lastName"
                  placeholder="Doe"
                  {...register("lastName", {
                    required: "Last name is Required",
                  })}
                />
                <IoPersonCircleOutline className="absolute bottom-1 fill-gray-500 border-r-2 border-solid border-gray-400 w-10 px-2 text-3xl" />
              </div>
              {errors.lastName?.message && (
                <p className="text-xs text-red-600 ml-1 font-light">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <div className="relative">
              <input
                type="email"
                placeholder="John.doe@example.com"
                className={`pl-12 p-2 bg-(--color-bg) text-(--color-text) border border-(--color-border) placeholder:text-gray-500 placeholder:text-sm placeholder:font-sans rounded-md  w-full ${
                  errors.email && "border-red-500"
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
              <MdOutlineMail className="absolute bottom-1 fill-gray-500 border-r-2 border-solid border-gray-400 w-10 px-2 text-3xl" />
            </div>
            {errors.email?.message && (
              <p className="text-xs text-red-600 ml-1 font-light">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="phone">Phone Number</label>
            <div className="relative">
              <input
                type="text"
                className={`pl-12 p-2 bg-(--color-bg) text-(--color-text) border border-(--color-border) placeholder:text-gray-500 placeholder:text-sm placeholder:font-sans rounded-md  w-full ${
                  errors.phoneNumber && "border-red-500"
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
              <LuPhone className="absolute bottom-1 text-gray-500 border-r-2 border-solid border-gray-400 w-10 px-2 text-3xl" />
            </div>
            {errors.phoneNumber?.message && (
              <p className="text-xs text-red-600 ml-1 font-light">
                {errors.phoneNumber?.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <div className="relative">
              <input
                type="password"
                id="password"
                placeholder="password"
                className={`pl-12 p-2 bg-(--color-bg) text-(--color-text) border border-(--color-border) placeholder:text-gray-500 placeholder:text-sm placeholder:font-sans rounded-md  w-full ${
                  errors.password && "border-red-500"
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
              <CiLock className="absolute bottom-1 fill-gray-500 border-r-2 border-solid border-gray-400 w-10 px-2 text-3xl" />
            </div>
            {errors.password?.message && (
              <p className="text-xs text-red-600 ml-1 font-light">
                {errors.password?.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="cPassword">Confirm Password</label>
            <div className="relative">
              <input
                type="password"
                className={`pl-12 p-2 bg-(--color-bg) text-(--color-text) border border-(--color-border) placeholder:text-gray-500 placeholder:text-sm placeholder:font-sans rounded-md  w-full ${
                  errors.confirmPassword && "border-red-500"
                }`}
                id="cPassword"
                placeholder="confirm password"
                {...register("confirmPassword", {
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
              />
              <CiLock className="absolute bottom-1 fill-gray-500 border-r-2 border-solid border-gray-400 w-10 px-2 text-3xl" />
            </div>
            {errors.confirmPassword?.message && (
              <p className="text-xs text-red-600 ml-1 font-light">
                {errors.confirmPassword?.message}
              </p>
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
