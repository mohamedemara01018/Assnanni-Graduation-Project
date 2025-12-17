import { FiLogOut } from "react-icons/fi"
import { Link, NavLink } from "react-router"
import logo from '../../assets/logo.png'



function SideBar() {
    return (
        <div className=" flex flex-col justify-between bg-(--color-surface) border border-(--color-border)  fixed bottom-0 top-0 left-0 h-screen    w-64">
            <div>
                <Link to={'/'} className="flex items-center gap-1 h-16 px-4  border-b ">
                    <img src={logo} alt="" className="w-8 h-8 object-cover" />
                    <h1 className="text-xl font-semibold">Assnani</h1>
                </Link>
                <ul className="p-2 py-5 space-y-1">
                    <li >
                        <NavLink to={'/patient'} className={({ isActive }) =>
                            `flex  items-center gap-3 text-(--color-text) px-3 py-1.5 rounded-lg hover:bg-(--color-bg-link-hover) ${isActive ? 'bg-(--color-bg-blue) text-(--color-text-blue) ' : ''}`} >
                            <FiLogOut />
                            <span>dashboard</span>
                        </NavLink>
                    </li>
                    <li >
                        <NavLink to={'/patient'} className={({ isActive }) =>
                            `flex  items-center gap-3 px-3 py-1.5 rounded-lg hover:bg-(--color-bg-link-hover) ${isActive ? 'bg-(--color-bg-blue) text-(--color-text-blue) ' : ''}`} >
                            <FiLogOut />
                            <span>dashboard</span>
                        </NavLink>
                    </li>
                    <li >
                        <NavLink to={'/patient'} className={({ isActive }) =>
                            `flex  items-center gap-3 px-3 py-1.5 rounded-lg hover:bg-(--color-bg-link-hover) ${isActive ? 'bg-(--color-bg-blue) text-(--color-text-blue) ' : ''}`} >
                            <FiLogOut />
                            <span>dashboard</span>
                        </NavLink>
                    </li>
                    <li >
                        <NavLink to={'/patient'} className={({ isActive }) =>
                            `flex  items-center gap-3 px-3 py-1.5 rounded-lg hover:bg-(--color-bg-link-hover) ${isActive ? 'bg-(--color-bg-blue) text-(--color-text-blue) ' : ''}`} >
                            <FiLogOut />
                            <span>dashboard</span>
                        </NavLink>
                    </li>
                    <li >
                        <NavLink to={'/'} className={({ isActive }) =>
                            `flex  items-center gap-3 px-3 py-1.5 rounded-lg hover:bg-(--color-bg-link-hover) ${isActive ? 'bg-(--color-bg-blue) text-(--color-text-blue) ' : ''}`} >
                            <FiLogOut />
                            <span>dashboard</span>
                        </NavLink>
                    </li>

                </ul>

            </div>
            <div className="p-2  border-t border-(--color-border)">
                <button className="flex items-center gap-2 px-3 py-2.5 w-full text-start text-sm font-medium bg-(--color-bg-link) hover:bg-(--color-bg-link-hover) rounded-lg">
                    <FiLogOut className="w-5 h-5 shrink-0" />
                    <span className="text-sm font-medium">logout</span>
                </button>
            </div>
        </div>
    )
}

export default SideBar