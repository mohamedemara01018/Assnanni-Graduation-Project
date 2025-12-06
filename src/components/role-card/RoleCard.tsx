import type { ReactElement } from "react"
import { NavLink } from "react-router"

interface RoleCardProps {
    path: string,
    label: string,
    icon: ReactElement
}

function RoleCard({ path, label, icon }: RoleCardProps) {
    return (
        <NavLink
            to={path}
            className={"flex gap-2 text-gray-500 flex-1  h-full items-center"}
        >
            {icon}
            <span className="max-sm:hidden">{label}</span>
        </NavLink>
    )
}

export default RoleCard