import { Briefcase, Building2, Clock, Star, User } from 'lucide-react'
import MiniLoading from '../mini-loading/MiniLoading'
import Error from '../error/Error'

function DoctorDetails({ doctorDetails, loadingDoctorDetails, errorDoctorDetails, selectedDate, selectedTime, handleBooking, paymentMethod, appointmentType, loadingBookAppointment, errorBookAppointment }: { doctorDetails: any, loadingDoctorDetails: boolean, errorDoctorDetails: string | null, selectedDate: string, selectedTime: string, handleBooking: () => void, paymentMethod: string, appointmentType: string, loadingBookAppointment: boolean, errorBookAppointment: string | null }) {

    if (loadingDoctorDetails) {
        return <MiniLoading />
    }

    if (errorDoctorDetails) {
        return <Error message={errorDoctorDetails ?? 'there is something wrong'} />
    }

    return (
        <div className="lg:col-span-1 space-y-6">
            {/* Doctor Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 sticky top-6">
                <h2 className="text-sm text-gray-900 dark:text-white font-medium mb-4 flex items-center">
                    <User className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                    Doctor Details
                </h2>
                <div className="flex flex-col items-center mb-4">
                    {
                        // doctor.imageUrl ? (
                        //   <img
                        //     src={doctor.imageUrl}
                        //     alt={doctor.name}
                        //     className="w-20 h-20 rounded-full object-cover border-2 border-blue-100 dark:border-blue-900 mb-2"
                        //   />
                        // ) :
                        (
                            <div className="w-20 h-20 rounded-full bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-100 dark:border-blue-900 flex items-center justify-center mb-2">
                                <User className="w-8 h-8 text-blue-400" />
                            </div>
                        )}
                    <h3 className="text-base text-gray-900 dark:text-white font-medium text-center">
                        {doctorDetails?.name}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                        {doctorDetails?.specialization}
                    </p>
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                            <span className="text-xs text-gray-700 dark:text-gray-300">
                                {doctorDetails?.rating}
                            </span>
                        </div>
                        <span className="text-gray-300 dark:text-gray-600">•</span>
                        <div className="flex items-center space-x-1">
                            <Briefcase className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                                {doctorDetails?.experienceYears} exp
                            </span>
                        </div>
                    </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500 dark:text-gray-400">
                            Consultation Fee
                        </span>
                        <span className="text-gray-900 dark:text-white font-medium">
                            ${doctorDetails?.consultationFee}
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-1 pt-2">
                        {doctorDetails?.languages.map((lang: string) => (
                            <span
                                key={lang}
                                className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs"
                            >
                                {lang}
                            </span>
                        ))}
                    </div>
                </div>

                <>
                    <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                        <h3 className="text-xs text-gray-900 dark:text-white font-medium mb-3 flex items-center">
                            <Building2 className="w-3 h-3 mr-1 text-blue-600 dark:text-blue-400" />
                            Clinic Location
                        </h3>
                        <div className="space-y-2">
                            <p className="text-xs text-gray-900 dark:text-white font-medium">
                                {doctorDetails?.clinicName}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                {doctorDetails?.address}
                            </p>
                            {/* <p className="text-xs text-gray-600 dark:text-gray-400">
                        {clinic.city}
                      </p> */}
                            <div className="flex items-center space-x-1 pt-2">
                                <Clock className="w-3 h-3 text-gray-400" />
                                <span className="text-xs text-gray-600 dark:text-gray-400">
                                    {doctorDetails?.workingHours}
                                </span>
                            </div>
                        </div>
                    </div>
                </>

                {/* Summary */}
                {selectedDate && selectedTime && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <h3 className="text-xs text-gray-900 dark:text-white font-medium mb-3">
                            Appointment Summary
                        </h3>
                        <div className="space-y-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-600 dark:text-gray-400">
                                    Date
                                </span>
                                <span className="text-gray-900 dark:text-white font-medium">
                                    {selectedDate}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-600 dark:text-gray-400">
                                    Time
                                </span>
                                <span className="text-gray-900 dark:text-white font-medium">
                                    {selectedTime}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-600 dark:text-gray-400">
                                    Type
                                </span>
                                <span className="text-gray-900 dark:text-white font-medium capitalize">
                                    In-Person
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {
                    errorBookAppointment && <Error message={errorBookAppointment ?? "there is problem when book appointment"} />
                }
                <button
                    onClick={handleBooking}
                    disabled={
                        !selectedDate ||
                        !selectedTime ||
                        !appointmentType ||
                        !paymentMethod

                    }
                    className="w-full mt-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-sm font-medium"
                >
                    {loadingBookAppointment ? 'Booking...' : 'Confirm Booking'}
                </button>
            </div>
        </div >
    )
}



export default DoctorDetails