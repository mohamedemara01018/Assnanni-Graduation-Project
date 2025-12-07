import LoginForm from '@/components/login-form/LoginForm'
import loginImg from '../../assets/login-image.jpg'
import logo from '../../assets/logo.png'
import { NavLink } from 'react-router'
import { GoArrowLeft } from 'react-icons/go'

function Login() {
    return (
        <div className='flex justify-center items-center gap-10 w-full'>
            <div className="relative w-[600px] h-[300px] max-md:hidden ">
                <img src={loginImg} className='w-full h-full object-cover rounded-lg' alt="login-image" />
                <div className='absolute bottom-10 left-10 text-(--color-bg)'>
                    <h2>
                        Welcome Back
                    </h2>
                    <p className='text-(--color-border)'>
                        Access your healthcare dashboard
                    </p>
                </div>

            </div>

            <div className='flex flex-col  gap-3 w-[500px] '>
                <NavLink to={'/'} className="flex gap-2 text-gray-900 text-lg">
                    <GoArrowLeft className="translate-y-1  font-sans text-gray-900 text-xl font-medium " />
                    <span className='text-base font-medium'>
                        back to home
                    </span>
                </NavLink>
                <div className='bg-(--color-surface) flex flex-col  gap-5 p-6 rounded-lg shadow-xl'>
                    <div className='flex items-center'>
                        <img src={logo} className='w-10 h-10 rounded-full object-cover bg-(--color-primary) ' alt="" />
                        <span className='text-2xl font-bold'>Assnani</span>
                    </div>

                    <div className='flex flex-col gap-1'>
                        <span className='text-2xl font-bold'> Sign In</span>
                        <span className='text-(--color-text-light)'>Enter your credentials to access your account</span>
                    </div>

                    <LoginForm />

                    <div className='text-center text-(--color-text-light)'>
                        <span>Don't have an account?</span>
                        <NavLink to={'/register'} className={'text-(--color-primary)'}>
                            Register now
                        </NavLink>
                    </div>

                </div>
            </div>

        </div >
    )
}

export default Login