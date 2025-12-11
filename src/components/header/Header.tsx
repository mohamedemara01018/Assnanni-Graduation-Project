import { IoMoonOutline } from 'react-icons/io5'
import { IoIosNotificationsOutline } from "react-icons/io";

import logo from '../../assets/logo.png'
import { Link } from 'react-router';

function Header() {
    return (
        <header className='bg-(--color-surface)' >
            <div className=' wrapper   flex items-center justify-between py-4 '>
                <div className='flex items-center gap-1'>
                    <img src={logo} alt="" className='w-10 h-10' />
                    <h1>Assnani</h1>
                </div>
                <div className='flex items-center gap-2'>
                    <button className=' text-xl text-(--color-text) hover:bg-black/5 hover:dark:bg-white/15 py-2 px-4 rounded-sm  cursor-pointer transform duration-200'>
                        <IoMoonOutline />
                    </button>
                    <div className='flex items-center gap-2'>
                        <Link to={'/login'} className='text-(--color-primary) hover:bg-black/5 hover:dark:bg-white/15 py-2 px-4 rounded-sm cursor-pointer transform duration-200'>Login</Link>
                        <Link to={'/register'} className=' text-white bg-(--color-primary) hover:bg-(--color-primary-dark) py-2 px-4 rounded-sm cursor-pointer transform duration-200'>Register</Link>
                    </div>


                    {/* when user have auth */}
                    {false && <div>
                        <div className='relative'>
                            <IoIosNotificationsOutline />
                            <div className='w-2 h-2 rounded-full bg-red-500 absolute top-0.5 right-0.5'></div>
                        </div>
                        <div>

                        </div>
                    </div>}
                </div>
            </div>
        </header>
    )
}

export default Header