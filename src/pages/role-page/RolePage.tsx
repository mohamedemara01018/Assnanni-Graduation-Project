import { rolesData } from "@/constants/registerConstant"
import type { roleType } from "@/types"
interface RolePageProps {
    handleChangeRole: (role: roleType) => void
}
function RolePage({ handleChangeRole }: RolePageProps) {

    return (
        <div className="py-16">
            <div className="wrapper flex flex-col items-center gap-2">
                <h2 className="text-4xl text-(--color-text)">Join Assnani</h2>
                <p className="text-2xl text-(--color-text-light) text-center">Select your role to get started</p>
                <div className=" grid grid-cols-1 sm:grid-cols-2 gap-8 mt-8">
                    {
                        rolesData.map((role, idx) => {
                            return (
                                <div
                                    key={idx}
                                    className="flex flex-col items-start gap-2 bg-(--color-surface) max-w-[400px] p-8 rounded-lg shadow-md border-2 hover:border-2 hover:border-(--color-primary) hover:cursor-pointer transition duration-200"
                                    onClick={() => handleChangeRole(role.id)}
                                >
                                    <div className={`w-20 h-20 flex items-center justify-center rounded-full ${role.circleColor}`}>
                                        {role.icon(`${role.iconColor} text-4xl `)}
                                    </div>
                                    <div className="text-2xl text-(--color-text)">
                                        <h1>{role.title}</h1>
                                    </div>
                                    <div className="text-(--color-text-light)">
                                        <p>{role.desc}</p>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default RolePage