import { NavLink, useLocation } from "react-router";
import { MdOutlineMail } from "react-icons/md";
import { LuPhone } from "react-icons/lu";
import { CiLock } from "react-icons/ci";
import { IoPersonCircleOutline } from "react-icons/io5";
import { GrAlert } from "react-icons/gr";

const RegistrationForm = () => {
  const { pathname } = useLocation();

  const isDoctor: boolean =
    pathname.includes("/doctor-registration") ||
    pathname.includes("/student-registration");

  return (
    <div className="registrationContainer">
      <div id="name">
        <div className="relative">
          <label htmlFor="fname">First Name</label>
          <input type="text" className="!pl-12" placeholder="John" id="fname" />
          <IoPersonCircleOutline className="absolute bottom-1 fill-gray-500 border-r-2 border-solid border-gray-400 w-10 px-2 text-3xl" />
        </div>
        <div className="relative">
          <label htmlFor="lname">Last Name</label>
          <input type="text" className="!pl-12" id="lname" placeholder="Doe" />
          <IoPersonCircleOutline className="absolute bottom-1 fill-gray-500 border-r-2 border-solid border-gray-400 w-10 px-2 text-3xl" />
        </div>
      </div>
      <div className="relative">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          placeholder="John.doe@example.com"
          className="!pl-12"
          id="email"
        />
        <MdOutlineMail className="absolute bottom-1 fill-gray-500 border-r-2 border-solid border-gray-400 w-10 px-2 text-3xl" />
      </div>
      <div className="relative">
        <label htmlFor="phone">Phone Number</label>
        <input
          type="text"
          className="!pl-12"
          placeholder="+1 (555) 000-000"
          id="phone"
        />
        <LuPhone className="absolute bottom-1 text-gray-500 border-r-2 border-solid border-gray-400 w-10 px-2 text-2xl" />
      </div>
      <div className="relative">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          placeholder="password"
          className="!pl-12"
        />
        <CiLock className="absolute bottom-1 fill-gray-500 border-r-2 border-solid border-gray-400 w-10 px-2 text-3xl" />
      </div>
      <div className="relative">
        <label htmlFor="cPassword">Confirm Password</label>
        <input
          type="password"
          className="!pl-12"
          id="cPassword"
          placeholder="confirm password"
        />
        <CiLock className="absolute bottom-1 fill-gray-500 border-r-2 border-solid border-gray-400 w-10 px-2 text-3xl" />
      </div>
      {isDoctor && (
        <div className="bg-[#00E0a5]/20 p-2 rounded-sm font-semibold !mt-8 text-[#00AFe5]">
          <p className="flex gap-2">
            <GrAlert className="translate-y-0.5 text-xl" />
            After registration, you'll need to upload your medical license and
            credentials for verification.
          </p>
        </div>
      )}
      <div className="!mt-10 max-sm:w-11/12 w-1/3 m-auto">
        <button className="self-center text-white bg-linear-90  to-[#00AFE5] from-[#00E0A5] w-full rounded-3xl m-auto py-2 px-6 font-bold cursor-pointer hover:bg-blue-500 ">
          Register
        </button>
      </div>
      <div>
        <p className="mt-6 mb-4 flex justify-center gap-1 max-sm:flex-col">
          Already have an account?{" "}
          <NavLink
            to="/"
            className="text-[#0c86ab] inline-block   font-semibold"
          >
            Sign in
          </NavLink>
        </p>
      </div>
    </div>
  );
};

export default RegistrationForm;
