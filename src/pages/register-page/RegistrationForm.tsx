import { FormInput } from "@/components/form-input/FormInput";
import RoleCard from "@/components/role-card/RoleCard";
import { registrationFields, registrationNameFields } from "@/constants/registerConstant";
import { roles } from "@/constants/rolesConstant";
import type React from "react";
import { useState } from "react";
import { NavLink, useLocation } from "react-router";

const RegistrationForm = () => {


  const { pathname } = useLocation();
  const [fields, setFields] = useState({
    fname: '',
    lname: '',
    email: '',
    phone: '',
    password: '',
    cPassword: '',
  })


  const isDoctor: boolean =
    pathname.includes("/doctor-register") ||
    pathname.includes("/student-register");


  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFields((prev) => {
      return {
        ...prev,
        [name]: value
      }
    })
  }



  return (
    <div className="register-container flex flex-col justify-center gap-4">
      <div className="flex justify-center items-center gap-4 bg-gray-200 rounded-full ">
        {
          roles.map((role, idx) => {
            return (
              <RoleCard key={idx} path={role.path} label={role.label} icon={role.icon} />
            )
          })
        }
      </div>

      <div id="name" className="flex flex-col gap-4 sm:flex-row max-sm:gap-2">
        {registrationNameFields.map((field) => (
          <FormInput
            key={field.id}
            id={field.id}
            label={field.label}
            type={field.type}
            placeholder={field.placeholder}
            name={field.name}
            handleChange={handleChange}
          />
        ))}
      </div>


      {registrationFields.map((field) => (
        <FormInput
          key={field.id}
          id={field.id}
          label={field.label}
          type={field.type}
          placeholder={field.placeholder}
          name={field.name}
          handleChange={handleChange}
        />
      ))}

      {isDoctor && (
        <div className="bg-[#00E0a5]/20 p-2 rounded-sm text-[#00AFe5] text-center">
          <p>
            After registration, you'll need to upload your medical license and
            credentials for verification.
          </p>
        </div>
      )}

      <div className=" max-sm:w-11/12 w-1/3 m-auto">
        <button className="self-center text-white bg-linear-90 to-[#00AFE5] from-[#00E0A5] w-full rounded-3xl m-auto py-2 px-6 font-bold cursor-pointer hover:bg-blue-500 ">
          Register
        </button>
      </div>

      <div>
        <p className="mb-4 flex justify-center gap-1 ">
          Already have an account?{" "}
          <NavLink
            to="/"
            className="text-[#0c86ab] inline-block w-fit font-semibold"
          >
            Sign in
          </NavLink>
        </p>
      </div>
    </div>
  );
};

export default RegistrationForm;
