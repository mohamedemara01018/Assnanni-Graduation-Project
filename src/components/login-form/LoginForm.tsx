import { loginFields } from "@/constants/loginConstant"
import { FormInput } from "../form-input/FormInput"
import { NavLink } from "react-router"
import { Button } from "../ui/button"
import InputField from "../input-field/InputField"

function LoginForm() {

    function handleChange() {

    }
    return (
        <div className="login-form-container flex flex-col gap-3">
            <div className="flex flex-col gap-1">
                <label htmlFor="role">IAM a</label>
                <select id="role" name="role" className="border-2 py-3 px-4 w-full rounded-md bg-(--color-bg) focus:ring-2 focus:border-0">
                    <option value={'patient'}>Patient</option>
                    <option value={'doctor'}>Doctor</option>
                    <option value={'student doctor'}>Student Doctor</option>
                    <option value={'reciptionist'}>Reciptionist</option>
                </select>
            </div>


            {
                loginFields.map((field) => {
                    return <InputField
                        key={field.id}
                        id={field.id}
                        name={field.name}
                        type={field.type}
                        placeholder={field.placeholder}
                        label={field.label}
                        handleChange={handleChange}
                    />
                })
            }

            <div className="flex justify-between">
                <div className="flex gap-2">
                    <input type="checkbox" name="check" id="check" />
                    <label htmlFor="check">Remember me</label>
                </div>
                <NavLink to={'/'} className={'text-(--color-primary)'}>
                    Forgot password?
                </NavLink>
            </div>
            <div>
                <Button className="bg-(--color-primary) hover:bg-(--color-primary-dark) p-4cursor-pointer w-full">Sign In</Button>
            </div>

        </div>
    )
}

export default LoginForm