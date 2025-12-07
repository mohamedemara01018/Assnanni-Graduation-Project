import logo from "../../assets/logo.png"
import { GoArrowLeft } from "react-icons/go";
import { NavLink, Outlet } from "react-router";

//max-md:w-11/12 md:w-3/4
const Registration = () => {
  return (
    <div className=" w-full sm:w-3/4 lg:w-1/2 m-auto py-6 flex flex-col justify-center gap-4">

      <NavLink to={'/'} className="flex gap-2 text-gray-900 text-lg">
        <GoArrowLeft className="translate-y-1 text-xl font-extrabold font-sans text-gray-900 " />
        <span>
          back to home
        </span>
      </NavLink>


      <div className="p-6 bg-gray-50 rounded-2xl shadow-sm flex flex-col w-full justify-center gap-10">
        <div className="flex flex-col justify-center gap-3">
          <div className="flex gap-2 justify-center">
            <img src={logo} className="object-cover w-10 h-10 bg-blue-600 rounded-full" alt="Logo" />
            <h1 className="text-4xl font-semibold max-sm:text-3xl">
              Assnani
            </h1>
          </div>

          <div className=" flex flex-col items-center">
            <h3 className="text-2xl tracking-tighter font-semibold text-gray-700 max-sm:text-xl">
              Create Your Account
            </h3>
            <p className="text-xs font-semibold text-gray-500">
              Choose your role and fill in your information
            </p>
          </div>
        </div>


        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Registration;
