import { Link } from 'react-router'
import img from '../../assets/landing-img.jpg'

function Hero() {
    return (
        <section className='gap-10 bg-linear-to-br from-blue-600 to-blue-800 dark:from-blue-800 dark:to-blue-950 text-white w-full py-24'>
            <div className='wrapper flex justify-between gap-10'>
                <div className='flex flex-col justify-center items-start gap-4 flex-4 '>
                    <h1 className="text-5xl">Your Health, Our Priority</h1>
                    <p className="text-xl text-blue-100 mb-8">
                        Connect with top healthcare professionals, book appointments instantly, and manage your health records all in one place.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Link
                            to="/register"
                            className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            Get Started
                        </Link>
                        <Link
                            to="/login"
                            className="px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white/10 transition-colors"
                        >
                            Login
                        </Link>
                    </div>
                </div>
                <div className='flex-3 w-[300px] h-[300px] rounded-lg overflow-hidden max-sm:hidden shadow-2xl'>
                    <img src={img} alt="" className='w-full h-full object-cover' />
                </div>
            </div>
        </section>
    )
}

export default Hero