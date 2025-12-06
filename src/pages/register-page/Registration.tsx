import logo from "../../assets/logo.png"
import { GoArrowLeft } from "react-icons/go";
import { Outlet } from "react-router";
import Role from "@/components/role-card/RoleCard";
import { roles } from "@/constants/rolesConstant";

const Registration = () => {
  return (
    <div className="mt-8 max-md:w-11/12 md:w-3/4  m-auto flex-col flex   justify-center bg-blue-600">
      <div className="md:ml-24 max-md:ml-20 translate-y-12">
        <p className="flex gap-2 text-gray-900  text-lg">
          <GoArrowLeft className="translate-y-1 text-xl font-extrabold font-sans text-gray-600" />
          Back to Home
        </p>
      </div>

      <div className="m-16 bg-gray-50 p-6 rounded-2xl shadow-sm">

        <div className="flex gap-2 justify-center">
          <img src={logo} className="w-15 h-15" alt="Logo" />
          <h1 className="text-4xl translate-y-2 font-semibold max-sm:text-3xl">
            Assnani
          </h1>
        </div>

        <div className="mt-4 flex flex-col items-center">
          <h3 className="text-2xl tracking-tighter font-semibold text-gray-700 max-sm:text-xl">
            Create Your Account
          </h3>
          <p className="text-xs mt-3 font-semibold text-gray-500">
            Choose your role and fill in your information
          </p>
        </div>


        <div className="flex flex-wrap justify-between bg-gray-200 rounded-full h-10 items-center my-4 gap-4">
          {
            roles.map((role, idx) => {
              return (
                <Role key={idx} path={role.path} label={role.label} icon={role.icon} />
              )
            })
          }
        </div>


        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Registration;
