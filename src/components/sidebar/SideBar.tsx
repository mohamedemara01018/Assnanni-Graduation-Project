import { FiLogOut } from "react-icons/fi"
import { Link, NavLink } from "react-router"
import logo from '../../assets/logo.png'
import { AiOutlineSchedule } from "react-icons/ai"
import { FaUserDoctor } from "react-icons/fa6"
import { IoAnalytics, IoPersonAddOutline } from "react-icons/io5"
import { IoIosNotifications, IoIosNotificationsOutline } from "react-icons/io"
import { CiSettings } from "react-icons/ci"
import { FaHistory } from "react-icons/fa"
interface SideBarProp {
    collapsed: boolean,
    onToggleCollapse: () => void
}


function SideBar({ collapsed, onToggleCollapse }: SideBarProp) {
    return (
        <>
            <div>
                <Link to={'/'} className={`flex items-center ${'justify-center'} gap-1 h-16 px-4  border-b `}>
                    <img src={logo} alt="" className="w-8 h-8 object-cover" />
                    {<h1 className="text-xl font-semibold">Assnani</h1>}
                </Link>
                <ul className="p-2 py-5 space-y-1">
                    <li >
                        <NavLink to={'/patient'} className={({ isActive }) =>
                            `flex  items-center ${collapsed ? 'justify-center' : ''} gap-3 text-(--color-text) px-3 py-2.5 rounded-lg hover:bg-(--color-bg-link-hover) ${isActive ? 'bg-(--color-bg-blue) text-(--color-text-blue) ' : ''}`} >
                            <FiLogOut className="text-xl" />
                            {<span>dashboard</span>}
                        </NavLink>
                    </li>
                    <li >
                        <NavLink to={'/'} className={({ isActive }) =>
                            `flex  items-center ${collapsed ? 'justify-center' : ''} gap-3 text-(--color-text) px-3 py-2.5 rounded-lg hover:bg-(--color-bg-link-hover) ${isActive ? 'bg-(--color-bg-blue) text-(--color-text-blue) ' : ''}`} >
                            <AiOutlineSchedule className="text-xl" />
                            {<span>Appointments</span>}
                        </NavLink>
                    </li>
                    <li >
                        <NavLink to={'/'} className={({ isActive }) =>
                            `flex  items-center ${collapsed ? 'justify-center' : ''} gap-3 text-(--color-text) px-3 py-2.5 rounded-lg hover:bg-(--color-bg-link-hover) ${isActive ? 'bg-(--color-bg-blue) text-(--color-text-blue) ' : ''}`} >
                            <IoPersonAddOutline className="text-xl" />
                            {<span>Doctors</span>}
                        </NavLink>
                    </li>
                    <li >
                        <NavLink to={'/'} className={({ isActive }) =>
                            `flex  items-center ${collapsed ? 'justify-center' : ''} gap-3 text-(--color-text) px-3 py-2.5 rounded-lg hover:bg-(--color-bg-link-hover) ${isActive ? 'bg-(--color-bg-blue) text-(--color-text-blue) ' : ''}`} >
                            <IoAnalytics className="text-xl" />
                            {<span>Scans</span>}
                        </NavLink>
                    </li>
                    <li >
                        <NavLink to={'/'} className={({ isActive }) =>
                            `flex  items-center ${collapsed ? 'justify-center' : ''} gap-3 text-(--color-text) px-3 py-2.5 rounded-lg hover:bg-(--color-bg-link-hover) ${isActive ? 'bg-(--color-bg-blue) text-(--color-text-blue) ' : ''}`} >
                            <IoIosNotificationsOutline className="text-xl" />
                            {<span>Notifications</span>}
                        </NavLink>
                    </li>
                   
                    <li >
                        <NavLink to={'/'} className={({ isActive }) =>
                            `flex  items-center ${collapsed ? 'justify-center' : ''} gap-3 text-(--color-text) px-3 py-2.5 rounded-lg hover:bg-(--color-bg-link-hover) ${isActive ? 'bg-(--color-bg-blue) text-(--color-text-blue) ' : ''}`} >
                            <CiSettings className="text-xl" />
                            {<span>Settings</span>}
                        </NavLink>
                    </li>

                </ul>

            </div>
            <div className="p-2  border-t border-(--color-border)">
                <button className={`flex items-center ${'justify-center'} gap-2 px-3 py-2.5 w-full text-start text-sm font-medium bg-(--color-bg-link) hover:bg-(--color-bg-link-hover) rounded-lg`}>
                    <FiLogOut className="w-5 h-5 shrink-0" />
                    {<span className="text-sm font-medium">logout</span>}
                </button>
            </div>
        </>

    )
}

export default SideBar