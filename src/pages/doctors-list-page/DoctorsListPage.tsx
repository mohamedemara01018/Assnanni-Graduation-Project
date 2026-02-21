import DashboardLayout from "@/components/dashboard-layout/DashboardLayout"
import SearchInput from "@/components/search-input/SearchInput"
import { selectInputData } from "@/constants/doctorsListConstant"
import SelectInput from "@/reusable-components/select-input/SelectInput"
import { CiBookmark } from "react-icons/ci"
import { FaStar } from "react-icons/fa"
import { IoLocationOutline } from "react-icons/io5"
import { Link } from "react-router"


function DoctorsListPage() {
    return (
        <DashboardLayout pageTitle="patient ">
            <div className="flex flex-col items-center gap-9">
                <SearchInput style="w-[80%] max-sm:w-full bg-(--color-surface)" placeholder="Search by doctor name, specialization, or location" padding="p-4" />
                <div className="flex items-center justify-center flex-wrap gap-4">
                    <button className="px-6 py-2 border border-(--color-border) bg-(--color-surface) hover:bg-(--color-bg-blue) hover:border-(--color-primary) rounded-full shadow-sm cursor-pointer">
                        Top Rated
                    </button>
                    <button className="px-6 py-2 border border-(--color-border) bg-(--color-surface) hover:bg-(--color-bg-blue) hover:border-(--color-primary) rounded-full shadow-sm cursor-pointer">
                        Available Now
                    </button>
                    <button className="px-6 py-2 border border-(--color-border) bg-(--color-surface) hover:bg-(--color-bg-blue) hover:border-(--color-primary) rounded-full shadow-sm cursor-pointer">
                        Most Experienced
                    </button>

                </div>
                <div className="relative flex w-full space-x-6">
                    <div className="sticky self-start top-1 p-4 bg-(--color-surface) border border-(--color-border) rounded-lg shadow-sm w-[300px] max-sm:hidden">
                        <div className="space-y-6">
                            <h1 className="text-2xl">
                                Filters
                            </h1>
                            <div className="space-y-4">
                                {
                                    selectInputData && selectInputData.map((item) => {
                                        return <>
                                            <SelectInput id={item.id} label={item.label} options={item.options}></SelectInput>
                                        </>
                                    })
                                }

                            </div>

                            <button className="border border-(--color-border) w-full p-2 rounded-lg hover:bg-(--color-bg) duration-150 cursor-pointer">
                                Clear All Filter
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-col items-start w-full gap-4">
                        <h1 className="text-2xl">6 Doctors Founded</h1>
                        <div className="grid md:grid-cols-1 xl:grid-cols-3 gap-4  w-full">
                            {
                                Array(5).fill('').map((_) => {
                                    return (
                                        <div className="bg-(--color-surface) p-4 border border-(--color-border) shadow-sm rounded-lg flex items-center justify-center grow">
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-4">
                                                    <img src="https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg" alt="docotr-img" className="w-16 h-16 rounded-full" />
                                                    <div className="space-y-2">
                                                        <h2 className="text-lg">Dr.Mohamed Gamal</h2>
                                                        <div className="flex items-center gap-4">
                                                            <div className="flex items-center gap-1">
                                                                <FaStar className="text-amber-400" />
                                                                <span className="text-(--color-text-light) text-sm">4.9 (200)</span>
                                                            </div>
                                                            <span className="bg-(--color-bg-blue) px-2 text-sm rounded-sm border border-(--color-primary) text-(--color-primary)">
                                                                15 years
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-1">
                                                        <IoLocationOutline />
                                                        <span className="text-sm text-(--color-text-light)">cairo, Egypt</span>
                                                    </div>
                                                    <div className="flex gap-1 items-center ml-1">
                                                        <span className="p-1 w-1 rounded-full bg-red-500 block"></span>
                                                        <span className="text-sm text-(--color-text-light)">busy</span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-center  gap-2">
                                                    <Link to={'/doctors-list/1'} className="w-full p-2 text-center border border-(--color-primary) rounded-lg text-(--color-primary) cursor-pointer hover:bg-(--color-bg-blue) duration-150">
                                                        View Profile
                                                    </Link>
                                                    <button className=" flex items-center justify-center gap-1 w-full p-2 border border-(--color-primary) rounded-lg bg-(--color-primary) text-white cursor-pointer hover:bg-(--color-primary-dark) duration-150 ">
                                                        <CiBookmark className="text-xl text-white" />
                                                        <span>Book</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }





                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}

export default DoctorsListPage