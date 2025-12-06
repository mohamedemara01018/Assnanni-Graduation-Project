import { FormInput } from "@/components/form-input/FormInput";
import { registrationFields, registrationNameFields } from "@/constants/registerConstant";
import type React from "react";
import { useEffect, useState } from "react";
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
    pathname.includes("/doctor-registration") ||
    pathname.includes("/student-registration");


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
    <div className="register-container">


      <div id="name">
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
        <div className="bg-[#00E0a5]/20 p-2 rounded-sm !mt-8 text-[#00AFe5]">
          <p>
            After registration, you'll need to upload your medical license and
            credentials for verification.
          </p>
        </div>
      )}

      <div className="!mt-10 max-sm:w-11/12 w-1/3 m-auto">
        <button className="self-center text-white bg-linear-90 to-[#00AFE5] from-[#00E0A5] w-full rounded-3xl m-auto py-2 px-6 font-bold cursor-pointer hover:bg-blue-500 ">
          Register
        </button>
      </div>

      <div>
        <p className="mt-6 mb-4 flex justify-center gap-1 ">
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
