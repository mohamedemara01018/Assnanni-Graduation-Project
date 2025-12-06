import { NavLink, useLocation } from "react-router";

const RegistrationForm = () => {
  const { pathname } = useLocation();

  const isDoctor: boolean =
    pathname.includes("/doctor-registration") ||
    pathname.includes("/student-registration");

  return (
    <div className="registrationContainer">
      <div id="name">
        <div>
          <label htmlFor="fname">First Name</label>
          <input type="text" placeholder="John" id="fname" />
        </div>
        <div>
          <label htmlFor="lname">Last Name</label>
          <input type="text" id="lname" placeholder="John" />
        </div>
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input type="email" placeholder="John.doe@example.com" id="email" />
      </div>
      <div>
        <label htmlFor="phone">Phone Number</label>
        <input type="text" placeholder="+1 (555) 000-000" id="phone" />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input type="password" id="password" placeholder="password" />
      </div>
      <div>
        <label htmlFor="cPassword">Confirm Password</label>
        <input type="password" id="cPassword" placeholder="confirm password" />
      </div>
      {isDoctor && (
        <div className="bg-[#00E0a5]/20 p-2 rounded-sm !mt-8 text-[#00AFe5]">
          <p>
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
        <p className="mt-6 mb-4 flex justify-center gap-1">
          Already have an account?{" "}
          <NavLink
            to="/"
            className="text-[#0c86ab] inline-block w-fit  font-semibold"
          >
            Sign in
          </NavLink>
        </p>
      </div>
    </div>
  );
};

export default RegistrationForm;
