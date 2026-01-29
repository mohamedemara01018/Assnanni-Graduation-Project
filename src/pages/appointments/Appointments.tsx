import CardComp from '@/components/card-comp/CardComp'
import DashboardLayout from '@/components/dashboard-layout/DashboardLayout'
import SearchInput from '@/components/search-input/SearchInput'
import { useState } from 'react'
import { CiCalendar, CiClock2, CiFilter, CiLocationOn } from 'react-icons/ci'
import { FaPlus } from 'react-icons/fa'
import { Link } from 'react-router'


function Appointments() {
    const [onFilter, setFilter] = useState(false);
    return (
        <DashboardLayout pageTitle='patient'>

            <div className='space-y-6'>
                {/* first */}
                <div className='flex items-center justify-between'>
                    <div >
                        <h1 className='text-2xl font-semibold'>Appointments</h1>
                        <p className='text-sm'>Manage and view all your appointments</p>
                    </div>
                    <Link to={'/doctors'}
                        className='flex items-center gap-2 bg-(--color-primary) hover:bg-(--color-primary-light) duration-150 p-2 rounded-sm text-white'
                    >
                        <FaPlus />
                        <span>Book Appointment</span>
                    </Link>
                </div>
                {/* second */}
                <CardComp>
                    <div className='w-full'>
                        <div className=' flex items-center justify-between gap-4'>
                            <SearchInput width='w-full' />
                            <button
                                onClick={() => setFilter(!onFilter)}
                                className={`flex items-center gap-2 border-2 border-(--color-border) py-2 px-4 hover:bg-(--color-bg)  rounded-lg cursor-pointer ${onFilter ? 'bg-(--color-bg-blue) text-(--color-text-blue)' : ''} `}>
                                <CiFilter />
                                Filters
                            </button>
                        </div>
                        {
                            onFilter && <div>
                                <hr className='my-4' />
                                <div className='flex flex-col gap-2 items-start '>
                                    <label htmlFor="status">Status</label>
                                    <select name="status" id="status" className='w-full p-2 border-2 border-(--color-border) rounded-lg'>
                                        <option value="allstatus">All Status</option>
                                        <option value="upcoming">Upcoming</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>

                                    </select>
                                </div>
                            </div>
                        }
                    </div>
                </CardComp>
                {/* third */}
                <div className='space-y-3'>
                    <CardComp>
                        <div className='flex items-start justify-between w-full'>
                            <div className='flex items-start gap-2'>
                                <img src="https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg" alt="doctor img" className='w-14 h-14 rounded-full' />
                                <div className='space-y-2'>
                                    <div>
                                        <h3 className='text-xl font-semibold'>Mohamed gamal</h3>
                                        <p className='text-sm'>Physical Examination</p>
                                    </div>
                                    <div className='flex items-center gap-4 flex-wrap'>
                                        <div className='flex items-center gap-2 text-sm'>
                                            <CiCalendar className='text-lg' />
                                            <span>Feb 5, 2026</span>
                                        </div>
                                        <div className='flex items-center gap-2 text-sm'>
                                            <CiClock2 className='text-lg' />
                                            <span>10:00 AM</span>
                                        </div>
                                        <div className='flex items-center gap-2 text-sm'>
                                            <CiLocationOn className='text-lg' />
                                            <span>Egy, Cairo</span>
                                        </div>
                                    </div>
                                    <div className='flex items-center gap-4'>
                                        <Link to={'/'} className='text-(--color-primary) hover:underline'>
                                            View Details
                                        </Link>
                                        <button className='text-red-500 hover:underline'>
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className='py-1 px-3 flex items-center gap-2 bg-(--color-bg-blue) text-(--color-text-blue) border border-(--color-primary) rounded-lg'>
                                <CiClock2 />
                                <span>Upcoming</span>
                            </div>
                        </div>

                    </CardComp>
                    <CardComp>
                        <div className='flex items-start justify-between w-full'>
                            <div className='flex items-start gap-2'>
                                <img src="https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg" alt="doctor img" className='w-14 h-14 rounded-full' />
                                <div className='space-y-2'>
                                    <div>
                                        <h3 className='text-xl font-semibold'>Mohamed gamal</h3>
                                        <p className='text-sm'>Physical Examination</p>
                                    </div>
                                    <div className='flex items-center gap-4 flex-wrap'>
                                        <div className='flex items-center gap-2 text-sm'>
                                            <CiCalendar className='text-lg' />
                                            <span>Feb 5, 2026</span>
                                        </div>
                                        <div className='flex items-center gap-2 text-sm'>
                                            <CiClock2 className='text-lg' />
                                            <span>10:00 AM</span>
                                        </div>
                                        <div className='flex items-center gap-2 text-sm'>
                                            <CiLocationOn className='text-lg' />
                                            <span>Egy, Cairo</span>
                                        </div>
                                    </div>
                                    <div className='flex items-center gap-4'>
                                        <Link to={'/'} className='text-(--color-primary) hover:underline'>
                                            View Details
                                        </Link>
                                        <button className='text-red-500 hover:underline'>
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className='py-1 px-3 flex items-center gap-2 bg-(--color-bg-blue) text-(--color-text-blue) border border-(--color-primary) rounded-lg'>
                                <CiClock2 />
                                <span>Upcoming</span>
                            </div>
                        </div>

                    </CardComp>
                    <CardComp>
                        <div className='flex items-start justify-between w-full'>
                            <div className='flex items-start gap-2'>
                                <img src="https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg" alt="doctor img" className='w-14 h-14 rounded-full' />
                                <div className='space-y-2'>
                                    <div>
                                        <h3 className='text-xl font-semibold'>Mohamed gamal</h3>
                                        <p className='text-sm'>Physical Examination</p>
                                    </div>
                                    <div className='flex items-center gap-4 flex-wrap'>
                                        <div className='flex items-center gap-2 text-sm'>
                                            <CiCalendar className='text-lg' />
                                            <span>Feb 5, 2026</span>
                                        </div>
                                        <div className='flex items-center gap-2 text-sm'>
                                            <CiClock2 className='text-lg' />
                                            <span>10:00 AM</span>
                                        </div>
                                        <div className='flex items-center gap-2 text-sm'>
                                            <CiLocationOn className='text-lg' />
                                            <span>Egy, Cairo</span>
                                        </div>
                                    </div>
                                    <div className='flex items-center gap-4'>
                                        <Link to={'/'} className='text-(--color-primary) hover:underline'>
                                            View Details
                                        </Link>
                                        <button className='text-red-500 hover:underline'>
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className='py-1 px-3 flex items-center gap-2 bg-(--color-bg-blue) text-(--color-text-blue) border border-(--color-primary) rounded-lg'>
                                <CiClock2 />
                                <span>Upcoming</span>
                            </div>
                        </div>

                    </CardComp>
                    <CardComp>
                        <div className='flex items-start justify-between w-full'>
                            <div className='flex items-start gap-2'>
                                <img src="https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg" alt="doctor img" className='w-14 h-14 rounded-full' />
                                <div className='space-y-2'>
                                    <div>
                                        <h3 className='text-xl font-semibold'>Mohamed gamal</h3>
                                        <p className='text-sm'>Physical Examination</p>
                                    </div>
                                    <div className='flex items-center gap-4 flex-wrap'>
                                        <div className='flex items-center gap-2 text-sm'>
                                            <CiCalendar className='text-lg' />
                                            <span>Feb 5, 2026</span>
                                        </div>
                                        <div className='flex items-center gap-2 text-sm'>
                                            <CiClock2 className='text-lg' />
                                            <span>10:00 AM</span>
                                        </div>
                                        <div className='flex items-center gap-2 text-sm'>
                                            <CiLocationOn className='text-lg' />
                                            <span>Egy, Cairo</span>
                                        </div>
                                    </div>
                                    <div className='flex items-center gap-4'>
                                        <Link to={'/'} className='text-(--color-primary) hover:underline'>
                                            View Details
                                        </Link>
                                        <button className='text-red-500 hover:underline'>
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className='py-1 px-3 flex items-center gap-2 bg-(--color-bg-blue) text-(--color-text-blue) border border-(--color-primary) rounded-lg'>
                                <CiClock2 />
                                <span>Upcoming</span>
                            </div>
                        </div>

                    </CardComp>
                </div>

            </div>
        </DashboardLayout>
    )
}

export default Appointments