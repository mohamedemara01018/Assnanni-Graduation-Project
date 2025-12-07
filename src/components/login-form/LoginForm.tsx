import { loginFields } from "@/constants/loginConstant"
import { FormInput } from "../form-input/FormInput"
import { NavLink } from "react-router"
import { Button } from "../ui/button"

function LoginForm() {

    function handleChange() {

    }
    return (
        <div className="login-form-container flex flex-col gap-3">
            <div className="flex flex-col gap-1">
                <label htmlFor="role">IAM a</label>
                <select id="role" name="role" className="bg-(--color-bg) p-2   placeholder:text-gray-500 placeholder:text-sm placeholder:font-sans rounded-md ">
                    <option value={'patient'}>Patient</option>
                    <option value={'doctor'}>Doctor</option>
                    <option value={'student doctor'}>Student Doctor</option>
                    <option value={'reciptionist'}>Reciptionist</option>
                </select>
            </div>


            {
                loginFields.map((field) => {
                    return <FormInput
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
                <div>
                    <input type="checkbox" name="check" id="check" />
                    <label htmlFor="check">Remember me</label>
                </div>
                <NavLink to={'/'} className={'text-(--color-primary)'}>
                    Forgot password?
                </NavLink>
            </div>
            <div>
                <Button className="bg-(--color-primary) hover:bg-(--color-primary-dark) cursor-pointer w-full">Sign In</Button>
            </div>

        </div>
    )
}

export default LoginForm