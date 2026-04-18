import { useState } from 'react'
import { CiSettings, CiUser } from 'react-icons/ci';
import { FaRegUser } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';
import { Link } from 'react-router';

function UserComp() {
    const [showUserMenu, setShowUserMenu] = useState(false);

    return (
        <div>
            <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3  hover:bg-(--color-bg-link-hover) p-2 rounded-lg cursor-pointer"
            >
                <div className="p-2 bg-blue-500 rounded-full ">
                    <FaRegUser className="text-(--color-text)" />
                </div>
                <span className="font-medium text-(--color-text)">User</span>
            </button>
            {/* drob down */}
            {showUserMenu && (
                <div className="relative">
                    <div
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="fixed inset-0 z-30"
                    ></div>
                    <div className="absolute z-40 right-0 mt-3 py-1 bg-(--color-surface) shadow-lg  w-48 rounded-sm border-2 border-(--color-border)">
                        <Link
                            to={"/"}
                            className="flex items-center gap-2 hover:bg-(--color-bg-link-hover) px-4 py-2 text-md font-medium text-(--color-text)  cursor-pointer "
                        >
                            <CiUser className="w-4 h-4 text-(--color-text)" />
                            <span>Profile</span>
                        </Link>

                        <Link
                            to={"/"}
                            className="flex items-center gap-2 hover:bg-(--color-bg-link-hover) px-4 py-2 text-md font-medium text-(--color-text)  cursor-pointer "
                        >
                            <CiSettings className="w-4 h-4 " />
                            Settings
                        </Link>

                        <hr className="mb-1" />
                        <button className=" flex items-center gap-2 hover:bg-(--color-bg-link-hover) px-4 py-2 text-md font-medium text-red-400  cursor-pointer w-full">
                            <FiLogOut className="w-5 h-5 shrink-0" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default UserComp