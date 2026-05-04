import { useParams } from 'react-router';
import { Calendar, Clock, MapPin, FileText, Phone, Mail } from 'lucide-react';
import DashboardLayout from '@/components/dashboard-layout/DashboardLayout';


export default function AppointmentDetailsPage() {
    const { id } = useParams();

    // Mock appointment data
    const appointment = {
        id: id,
        date: 'January 25, 2024',
        time: '2:30 PM',
        duration: '30 minutes',
        status: 'Confirmed',
        type: 'General Consultation',
        doctor: {
            name: 'Dr. Michael Chen',
            specialty: 'Cardiologist',
            phone: '+1 (555) 123-4567',
            email: 'dr.chen@assnani.com',
            image: 'https://i.pravatar.cc/150?img=12'
        },
        patient: {
            name: 'Sarah Johnson',
            phone: '+1 (555) 987-6543',
            email: 'sarah.j@email.com'
        },
        location: 'Assnani Medical Center, Room 302',
        notes: 'Follow-up appointment for blood pressure monitoring',
        instructions: 'Please arrive 15 minutes early. Bring your previous medical records.'
    };

    return (
        <DashboardLayout pageTitle='Appointment Details'>
            <div>


                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-gray-900 dark:text-white mb-2">Appointment Details</h1>
                            <p className="text-gray-600 dark:text-gray-400">Appointment ID: {id}</p>
                        </div>
                        <span className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg">
                            {appointment.status}
                        </span>
                    </div>

                    {/* Doctor Information */}
                    <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <h2 className="text-gray-900 dark:text-white mb-4">Doctor Information</h2>
                        <div className="flex items-start space-x-4">
                            <img
                                src={appointment.doctor.image}
                                alt={appointment.doctor.name}
                                className="w-16 h-16 rounded-full"
                            />
                            <div className="flex-1">
                                <p className="text-gray-900 dark:text-white">{appointment.doctor.name}</p>
                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{appointment.doctor.specialty}</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="flex items-center space-x-2 text-sm">
                                        <Phone className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-600 dark:text-gray-400">{appointment.doctor.phone}</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-sm">
                                        <Mail className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-600 dark:text-gray-400">{appointment.doctor.email}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Appointment Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="space-y-4">
                            <div className="flex items-start space-x-3">
                                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
                                    <p className="text-gray-900 dark:text-white">{appointment.date}</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Time</p>
                                    <p className="text-gray-900 dark:text-white">{appointment.time}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Duration: {appointment.duration}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start space-x-3">
                                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                                    <p className="text-gray-900 dark:text-white">{appointment.location}</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Type</p>
                                    <p className="text-gray-900 dark:text-white">{appointment.type}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    {appointment.notes && (
                        <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                            <h3 className="text-blue-900 dark:text-blue-300 mb-2">Notes</h3>
                            <p className="text-blue-700 dark:text-blue-400 text-sm">{appointment.notes}</p>
                        </div>
                    )}

                    {/* Instructions */}
                    {appointment.instructions && (
                        <div className="mb-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                            <h3 className="text-yellow-900 dark:text-yellow-300 mb-2">Pre-appointment Instructions</h3>
                            <p className="text-yellow-700 dark:text-yellow-400 text-sm">{appointment.instructions}</p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            Reschedule
                        </button>
                        <button className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                            Cancel Appointment
                        </button>
                    </div>
                </div>
            </div>
        </DashboardLayout>

    );
}