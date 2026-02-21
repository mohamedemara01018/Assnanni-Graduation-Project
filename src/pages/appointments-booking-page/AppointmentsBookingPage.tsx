import CardComp from "@/components/card-comp/CardComp"
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout"
import { CiCalendar, CiClock2 } from "react-icons/ci"


function AppointmentsBookingPage() {
    return (
        <DashboardLayout pageTitle="patient">
            <CardComp>
                <div className="w-full space-y-8">
                    <div>
                        <h1 className="text-3xl">Book Appointment</h1>
                        <p className="text-(--color-text-light)">Schedule your consultation with Dr. Michael Chen </p>
                    </div>
                    <div className="flex items-center gap-4 bg-(--color-bg) p-4 rounded-lg">
                        <img className="w-16 h-16 rounded-full" src="https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg" alt="doctor-img" />
                        <div>
                            <h2 className="text-lg">Dr. Michael Chen</h2>
                            <p className="text-sm text-(--color-text-light)">$180 consultation fee</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex flex-col items-start gap-2">
                            <label className="text-lg">Select Date</label>
                            <div className="flex items-center justify-start gap-2 flex-wrap">
                                <button className="flex flex-col items-center justify-center border-2 border-(--color-border) p-4 w-44 rounded-lg cursor-pointer hover:bg-(--color-bg-link-hover) duration-150">
                                    <CiCalendar className="w-6 h-6" />
                                    <p className="text-sm text-(--color-text-light)">2025-2-2</p>
                                </button>
                                <button className="flex flex-col items-center justify-center border-2 border-(--color-border) p-4 w-44 rounded-lg cursor-pointer hover:bg-(--color-bg-link-hover) duration-150">
                                    <CiCalendar className="w-6 h-6" />
                                    <p className="text-sm text-(--color-text-light)">2025-2-2</p>
                                </button>
                                <button className="flex flex-col items-center justify-center border-2 border-(--color-border) p-4 w-44 rounded-lg cursor-pointer hover:bg-(--color-bg-link-hover) duration-150">
                                    <CiCalendar className="w-6 h-6" />
                                    <p className="text-sm text-(--color-text-light)">2025-2-2</p>
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-col items-start gap-2">
                            <label className="text-lg">Select Time</label>
                            <div className="flex items-center justify-start gap-2 flex-wrap">
                                <button className="flex flex-col items-center justify-center border-2 border-(--color-border) p-4 w-44 rounded-lg cursor-pointer hover:bg-(--color-bg-link-hover) duration-150">
                                    <CiClock2  className="w-6 h-6 text-sm" />
                                    <p className="text-sm text-(--color-text-light)">10:00</p>
                                </button>
                                <button className="flex flex-col items-center justify-center border-2 border-(--color-border) p-4 w-44 rounded-lg cursor-pointer hover:bg-(--color-bg-link-hover) duration-150">
                                    <CiClock2  className="w-6 h-6" />
                                    <p className="text-sm text-(--color-text-light)">10:00</p>
                                </button>
                                <button className="flex flex-col items-center justify-center border-2 border-(--color-border) p-4 w-44 rounded-lg cursor-pointer hover:bg-(--color-bg-link-hover) duration-150">
                                    <CiClock2  className="w-6 h-6" />
                                    <p className="text-sm text-(--color-text-light)">10:00</p>
                                </button>

                            </div>
                        </div>

                    </div>
                    <div className="flex flex-col items-start gap-2">
                        <label htmlFor="reason">Reason for Visit (Optional)</label>
                        <textarea
                            rows={4}
                            className="px-4 py-3 w-full bg-(--color-bg) border border-(--color-border) focus:ring-1 focus:ring-(--color-primary) outline-0 rounded-lg"
                            name="reason" id="reason" placeholder="Describe your symptoms or reason for consultation..."></textarea>
                    </div>
                    <button disabled className=" w-full py-3 bg-(--color-primary) hover:bg-(--color-primary-dark) duration-150 rounded-lg cursor-pointer">
                        Confirm Booking
                    </button>
                </div>
            </CardComp>
        </DashboardLayout>
    )
}

export default AppointmentsBookingPage