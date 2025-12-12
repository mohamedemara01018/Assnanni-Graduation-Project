import { registrationFields } from "@/constants/registerConstant"
import { FormInput } from "../form-input/FormInput"
import { Link } from "react-router"
import InputField from "../input-field/InputField"

function RegisterForm() {
    return (
        <form action="" className=" flex flex-col gap-4 w-full">
            {registrationFields.map((field) => (
                <InputField
                    key={field.id}
                    id={field.id}
                    label={field.label}
                    type={field.type}
                    placeholder={field.placeholder}
                    name={field.name}
                    handleChange={() => { }}
                />
            ))}
            <div className="flex items-center gap-2">
                <input type="checkbox" />
                <label htmlFor="">I agree to the
                    <Link to={'terms'} className="text-(--color-primary) hover:text-(--color-primary-light)">Terms of Service </Link>
                    and <Link to={'privacy'} className="text-(--color-primary) hover:text-(--color-primary-light)"> Privacy Policy</Link>
                </label>
            </div>
            <div >
                <button type="submit" className="text-white bg-(--color-primary)  w-full px-4 py-2 rounded-md hover:bg-(--color-primary-dark) transition duration-200 cursor-pointer">Create Account</button>
            </div>
        </form>
    )
}

export default RegisterForm