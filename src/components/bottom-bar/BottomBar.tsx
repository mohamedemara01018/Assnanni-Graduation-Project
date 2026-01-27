import { AiOutlineSchedule } from "react-icons/ai"
import { CiSearch } from "react-icons/ci"
import { FaHome } from "react-icons/fa"
import { IoAnalytics } from "react-icons/io5"
import { NavLink } from "react-router"

function BottomBar() {
    return (
        <div className=" bg-(--color-surface) fixed bottom-0 left-0 right-0 z-20 shadow-sm p-4">
            <div>
                <ul className="wrapper flex justify-between items-center">
                    <li>
                        <NavLink to={'/patient'} className={({ isActive }) =>
                            `flex flex-col justify-center items-center text-(--color-text) px-3 py-1.5 rounded-lg hover:bg-(--color-bg-link-hover) ${isActive ? 'bg-(--color-bg-blue) text-(--color-text-blue) ' : ''}`}>
                            <FaHome className="" />
                            <p className="text-sm" >Home</p>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={'/'} className={({ isActive }) =>
                            `flex flex-col justify-center items-center text-(--color-text) px-3 py-1.5 rounded-lg hover:bg-(--color-bg-link-hover) ${isActive ? 'bg-(--color-bg-blue) text-(--color-text-blue) ' : ''}`}>
                            <CiSearch className="" />
                            <p className="text-sm" >Search</p>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={'/'} className={({ isActive }) =>
                            `flex flex-col justify-center items-center text-(--color-text) px-3 py-1.5 rounded-lg hover:bg-(--color-bg-link-hover) ${isActive ? 'bg-(--color-bg-blue) text-(--color-text-blue) ' : ''}`}>
                            <AiOutlineSchedule className="" />
                            <p className="text-sm" >Appointments</p>
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to={'/'} className={({ isActive }) =>
                            `flex flex-col justify-center items-center text-(--color-text) px-3 py-1.5 rounded-lg hover:bg-(--color-bg-link-hover) ${isActive ? 'bg-(--color-bg-blue) text-(--color-text-blue) ' : ''}`}>
                            <IoAnalytics className="" />
                            <p className="text-sm" >Scan</p>
                        </NavLink>
                    </li>

                </ul>
            </div>
        </div>
    )
}

export default BottomBar