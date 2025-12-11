import LoginForm from '@/components/login-form/LoginForm'
import loginImg from '../../assets/login-image.jpg'
import logo from '../../assets/logo.png'
import { NavLink } from 'react-router'
import BackHome from '@/components/back-home/BackHome'

function Login() {
    return (
        <div className='wrapper flex justify-between items-center gap-2 max-lg:justify-center w-full  py-16'>
            <div className="relative w-[600px] h-[300px] max-xl:w-[500px] max-xl:h-[250px]  max-lg:hidden  ">
                <img src={loginImg} className='w-full h-full object-cover rounded-lg' alt="login-image" />
                <div className='absolute bottom-10 left-10 '>
                    <h2 className='text-(--color-primary) text-3xl font-bold'>
                        Welcome Back
                    </h2>
                    <p className=' text-(--color-primary-dark) text-xl font-bold'>
                        Access your healthcare dashboard
                    </p>
                </div>

            </div>

            <div className='flex flex-col  gap-3 w-[500px] '>

                <BackHome />

                <div className='bg-(--color-surface) flex flex-col  gap-5 p-6 rounded-lg shadow-xl'>
                    <div className='flex items-center max-md:justify-center'>
                        <img src={logo} className='w-10 h-10 rounded-full object-cover bg-(--color-primary) ' alt="" />
                        <span className='text-2xl font-bold'>Assnani</span>
                    </div>

                    <div className='flex flex-col gap-1  max-md:items-center'>
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