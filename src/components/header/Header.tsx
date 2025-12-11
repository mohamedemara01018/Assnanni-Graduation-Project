import { IoMoonOutline } from 'react-icons/io5'
import { IoIosNotificationsOutline } from "react-icons/io";

import logo from '../../assets/logo.png'

function Header() {
    return (
        <header className='bg-(--color-surface)' >
            <div className=' wrapper   flex items-center justify-between py-4 '>
                <div className='flex items-center gap-1'>
                    <img src={logo} alt="" className='w-10 h-10' />
                    <h1>Assnani</h1>
                </div>
                <div className='flex items-center gap-2'>
                    <div className='hover:bg-blue-50 hover:text-(--color-bg) w-fit p-1 rounded-sm'>
                        <IoMoonOutline />
                    </div>
                    <div className='flex items-center gap-2'>
                        <button className='text-(--color-primary) hover:bg-blue-50 p-2 rounded-sm'>Login</button>
                        <button className=' bg-(--color-primary) hover:bg-(--color-primary-dark) p-2 rounded-sm'>Register</button>
                    </div>
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