import { useState } from "react"
import RolePage from "../role-page/RolePage";
import type { roleType } from "@/types/types";
import { FaLongArrowAltLeft } from "react-icons/fa";
import RegisterForm from "@/components/register-form/RegisterForm";


function RegisterPage() {
    const [step, setStep] = useState<'role' | 'form'>('role');
    const [role, setRole] = useState<roleType>(undefined)
    function handleChangeRole(selectedRole: roleType) {
        setStep('form')
        setRole(selectedRole)
    }

    if (step == 'role') {
        return <RolePage handleChangeRole={handleChangeRole} />
    }


    return (
        <div className="py-16 px-4 flex flex-col items-center justify-center">
            <div className="  max-w-[500px] sm:w-[550px] flex flex-col items-start gap-4 bg-(--color-surface) p-8 rounded-lg shadow-xl">
                <div
                    className="flex items-center gap-1 text-(--color-primary) hover:text-(--color-primary-light) cursor-pointer w-fit"
                    onClick={() => { setStep('role'); setRole(undefined) }}
                >
                    <FaLongArrowAltLeft />
                    <span>Change Role</span>
                </div>
                <div className="flex flex-col items-center gap-4 w-full">
                    <div className="text-center">
                        <h1 className="text-3xl text-(--color-text)">Register as <span className="text-(--color-primary) capitalize">{role}</span></h1>
                        <p className=" text-(--color-text-light) mt-1">Fill in your details to continue</p>
                    </div>
                    < RegisterForm />
                </div>

            </div>
        </div>
    )
}

export default RegisterPage