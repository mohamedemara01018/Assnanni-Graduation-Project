import CardComp from "@/components/card-comp/CardComp"
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout"
import { BsCurrencyDollar } from "react-icons/bs"
import { CiBookmark } from "react-icons/ci"
import { FaStar } from "react-icons/fa"
import { FiAward } from "react-icons/fi"
import { IoLanguageOutline, IoLocationOutline } from "react-icons/io5"
import { LuAward } from "react-icons/lu"

function DoctorProfilePage() {
    return (
        <DashboardLayout pageTitle="patient">
            <div className="space-y-6">
                <CardComp>
                    <div className="flex items-center gap-4">
                        <img className="w-32 h-32 rounded-full object-cover" src="https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg" alt="doctor-img" />
                        <div className="space-y-2">
                            <h1 className="text-3xl">Dr.Mohamed Gamal</h1>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <FaStar className=" w-5 h-5 text-yellow-500 fill-yellow-500" />
                                    <span className="text-(--color-text-light)">4.9 (312 reviews)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <LuAward className="w-5 h-5" />
                                    <span className="text-(--color-text-light)">15 years experience</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <BsCurrencyDollar className="w-5 h-5" />
                                    <span className="text-(--color-text-light)">$180 consultation</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardComp>
                <div className="flex items-start max-lg:flex-col gap-4">
                    {/* left */}
                    <div className=" flex flex-col gap-4 grow-2">
                        <CardComp>
                            <div className="space-y-4">
                                <h2 className="text-xl">About</h2>
                                <p className="text-(--color-text-light">
                                    Renowned neurologist specializing in brain disorders and neurodegenerative diseases.
                                </p>
                                <div className="space-y-2">
                                    <div className="flex items-start gap-2">
                                        <FiAward className="w-5 h-5 mt-1" />
                                        <div>
                                            <h3>Education</h3>
                                            <p className="text-sm text-(--color-text-light)">MD from Stanford University</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <IoLanguageOutline className="w-5 h-5 mt-1" />
                                        <div>
                                            <h3>Languages</h3>
                                            <p className="text-sm text-(--color-text-light)">English, Mandarin</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardComp>
                        <CardComp>
                            <div className="space-y-4">
                                <h2 className="text-xl">Clinic Information</h2>
                                <div className="flex items-start gap-2 ">
                                    <IoLocationOutline className="w-5 h-5 mt-1" />
                                    <div>
                                        <h3>Brain & Spine Institute</h3>
                                        <p className="text-sm text-(--color-text-light)">Los Angeles, CA</p>
                                    </div>

                                </div>
                            </div>
                        </CardComp>
                        <CardComp>
                            <div className="space-y-4  w-full">
                                <h2 className="text-xl">Patient Reviews</h2>
                                <div className="space-y-4 ">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-1">
                                            {
                                                Array(5).fill('').map((_) => {
                                                    return (<FaStar className="w-5 h-5 text-yellow-500" />)
                                                })
                                            }

                                        </div>
                                        <h2>Sarah M.</h2>
                                        <p className="text-sm text-(--color-text-light)">  Excellent doctor! Very thorough and caring. Highly recommend.</p>
                                        <p className="text-xs text-(--color-text-light)">2 weeks ago</p>
                                    </div>
                                    <hr className="border border-(--color-border)" />
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-1">
                                            {
                                                Array(5).fill('').map((_) => {
                                                    return (<FaStar className="w-5 h-5 text-yellow-500" />)
                                                })
                                            }

                                        </div>
                                        <h2>Sarah M.</h2>
                                        <p className="text-sm text-(--color-text-light)">  Excellent doctor! Very thorough and caring. Highly recommend.</p>
                                        <p className="text-xs text-(--color-text-light)">2 weeks ago</p>
                                    </div>
                                    <hr className="border border-(--color-border)" />
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-1">
                                            {
                                                Array(5).fill('').map((_) => {
                                                    return (<FaStar className="w-5 h-5 text-yellow-500" />)
                                                })
                                            }

                                        </div>
                                        <h2>Sarah M.</h2>
                                        <p className="text-sm text-(--color-text-light)">  Excellent doctor! Very thorough and caring. Highly recommend.</p>
                                        <p className="text-xs text-(--color-text-light)">2 weeks ago</p>
                                    </div>
                                    <hr className="border border-(--color-border)" />
                                </div>
                            </div>
                        </CardComp>
                    </div>
                    {/* right */}
                    <div className="flex flex-col gap-4 grow max-lg:w-full">
                        <CardComp>
                            <div className="space-y-4">
                                <h2 className="text-xl">Clinic Information</h2>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className="p-1 rounded-full bg-red-600"></span>
                                        <p>Busy</p>
                                    </div>
                                    <button className="flex items-center  gap-2 p-2 bg-(--color-primary) hover:bg-(--color-primary-light) text-white rounded-md cursor-pointer duration-150">
                                        <CiBookmark className="w-5 h-5" />
                                        <span>Book Appointment</span>
                                    </button>
                                </div>
                            </div>
                        </CardComp>
                        <CardComp>
                            <div className="space-y-4">
                                <h2 className="text-xl">Available Time Slots</h2>
                                <div className="space-y-3">
                                    <div className="space-y-2">
                                        <p className="text-sm text-(--color-text-light)">2025-12-15</p>
                                        <div className="flex items-center justify-center flex-wrap gap-2">
                                            {
                                                Array(3).fill('').map((_) => {
                                                    return (
                                                        <span className="text-sm py-1 px-3 rounded-lg bg-(--color-bg-link-hover)">10:00</span>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-sm text-(--color-text-light)">2025-12-15</p>
                                        <div className="flex items-center justify-center flex-wrap gap-2">
                                            {
                                                Array(3).fill('').map((_) => {
                                                    return (
                                                        <span className="text-sm py-1 px-3 rounded-lg bg-(--color-bg-link-hover)">10:00</span>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-sm text-(--color-text-light)">2025-12-15</p>
                                        <div className="flex items-center justify-center flex-wrap gap-2">
                                            {
                                                Array(3).fill('').map((_) => {
                                                    return (
                                                        <span className="text-sm py-1 px-3 rounded-lg bg-(--color-bg-link-hover)">10:00</span>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </CardComp>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}

export default DoctorProfilePage