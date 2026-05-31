import { useState, useRef, useEffect } from 'react';
import { CiSettings, CiUser } from 'react-icons/ci';
import { FiLogOut, FiChevronDown } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/slices/auth/authSlice';
import { clearEmail } from '../../store/slices/email/emailSlice';
import Cookies from 'js-cookie';

function UserComp() {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setShowUserMenu(false);
            }
        };
        if (showUserMenu) document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [showUserMenu]);

    const handleLogout = () => {
        dispatch(logout());
        dispatch(clearEmail());
        Cookies.remove('patientsView');
        setShowUserMenu(false);
        navigate('/');
    };

    return (
        <div className="relative" ref={menuRef}>

            {/* Trigger */}
            <button
                onClick={() => setShowUserMenu((v) => !v)}
                aria-haspopup="true"
                aria-expanded={showUserMenu}
                className="flex items-center gap-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-2.5 py-1.5 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
            >
                {/* Avatar */}
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 shrink-0">
                    <CiUser className="h-4 w-4 text-white" />
                </div>

                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    User
                </span>

                <FiChevronDown
                    className={`h-3.5 w-3.5 text-gray-400 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''
                        }`}
                />
            </button>

            {/* Dropdown */}
            {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden z-40">

                    {/* User info header */}
                    <div className="flex items-center gap-3 px-3.5 py-3 border-b border-gray-100 dark:border-gray-800">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 shrink-0">
                            <CiUser className="h-4 w-4 text-white" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">User</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 truncate">user@example.com</p>
                        </div>
                    </div>

                    {/* Nav items */}
                    <div className="py-1">
                        <Link
                            to="/profile"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                            <CiUser className="h-4 w-4 text-gray-400 dark:text-gray-500 shrink-0" />
                            Profile
                        </Link>

                        <Link
                            to="/settings"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                            <CiSettings className="h-4 w-4 text-gray-400 dark:text-gray-500 shrink-0" />
                            Settings
                        </Link>
                    </div>

                    <div className="h-px bg-gray-100 dark:bg-gray-800" />

                    {/* Logout */}
                    <div className="py-1">
                        <button
                            onClick={handleLogout}
                            className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                        >
                            <FiLogOut className="h-4 w-4 shrink-0" />
                            Log out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserComp;
