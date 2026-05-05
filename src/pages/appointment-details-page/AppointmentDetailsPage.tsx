import { useParams, useNavigate } from 'react-router';
import {
    ArrowLeft,
    Calendar,
    Clock,
    MapPin,
    User,
    FileText,
    Phone,
    Mail,
    Building2,
    Globe,
    Star,
    Briefcase,
    AlertCircle
} from 'lucide-react';
// import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from '@/components/dashboard-layout/DashboardLayout';

export default function AppointmentDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const user = { role: 'patient' }

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
            experience: '15 years',
            rating: 4.8,
            reviews: 234,
            phone: '+1 (555) 123-4567',
            email: 'dr.chen@assnani.com',
            image: 'https://i.pravatar.cc/150?img=12',
            languages: ['English', 'Mandarin', 'Spanish']
        },
        clinic: {
            name: 'Assnani Heart Care Center',
            address: '123 Medical Plaza, Suite 302',
            city: 'New York, NY 10001',
            phone: '+1 (555) 100-2000',
            email: 'info@heartcare.assnani.com',
            website: 'www.heartcare.assnani.com',
            hours: 'Mon-Fri: 8:00 AM - 6:00 PM',
        },
        patient: {
            name: 'Sarah Johnson',
            age: 34,
            gender: 'Female',
            phone: '+1 (555) 987-6543',
            email: 'sarah.j@email.com',
            image: 'https://i.pravatar.cc/150?img=5',
            bloodType: 'A+',
        },
        location: 'Room 302, 3rd Floor',
        notes: 'Follow-up appointment for blood pressure monitoring. Patient reported occasional dizziness.',
        instructions: 'Please arrive 15 minutes early. Bring your previous medical records and current medication list.',
        symptoms: 'Occasional chest discomfort, fatigue',
        reason: 'Follow-up cardiovascular assessment'
    };

    const isPatient = user?.role === 'patient';
    const isDoctor = user?.role === 'doctor' || user?.role === 'student_doctor';

    return (
        <DashboardLayout pageTitle="Appointment Details">
            <div >
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="text-sm">Back to Appointments</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Header */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h1 className="text-2xl text-gray-900 dark:text-white mb-1">Appointment Details</h1>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">ID: #{id}</p>
                                </div>
                                <span className="px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg text-sm font-medium">
                                    {appointment.status}
                                </span>
                            </div>

                            {/* Appointment Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex items-start space-x-3">
                                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Date</p>
                                        <p className="text-sm text-gray-900 dark:text-white font-medium">{appointment.date}</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Time</p>
                                        <p className="text-sm text-gray-900 dark:text-white font-medium">{appointment.time}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Duration: {appointment.duration}</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Location</p>
                                        <p className="text-sm text-gray-900 dark:text-white font-medium">{appointment.location}</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Type</p>
                                        <p className="text-sm text-gray-900 dark:text-white font-medium">{appointment.type}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Patient View: Doctor Information */}
                        {isPatient && (
                            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                                <h2 className="text-lg text-gray-900 dark:text-white mb-4 flex items-center">
                                    <User className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                                    Doctor Information
                                </h2>
                                <div className="flex items-start space-x-4 mb-6">
                                    <img
                                        src={appointment.doctor.image}
                                        alt={appointment.doctor.name}
                                        className="w-20 h-20 rounded-full border-2 border-blue-100 dark:border-blue-900"
                                    />
                                    <div className="flex-1">
                                        <h3 className="text-lg text-gray-900 dark:text-white font-medium">{appointment.doctor.name}</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{appointment.doctor.specialty}</p>
                                        <div className="flex items-center space-x-4 mb-3">
                                            <div className="flex items-center space-x-1">
                                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{appointment.doctor.rating}</span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400">({appointment.doctor.reviews} reviews)</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <Briefcase className="w-4 h-4 text-gray-400" />
                                                <span className="text-xs text-gray-600 dark:text-gray-400">{appointment.doctor.experience} experience</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {appointment.doctor.languages.map((lang) => (
                                                <span key={lang} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs">
                                                    {lang}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
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
                        )}

                        {/* Patient View: Clinic Information */}
                        {isPatient && (
                            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                                <h2 className="text-lg text-gray-900 dark:text-white mb-4 flex items-center">
                                    <Building2 className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                                    Clinic Information
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-base text-gray-900 dark:text-white font-medium mb-1">{appointment.clinic.name}</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{appointment.clinic.address}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{appointment.clinic.city}</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                        <div className="flex items-center space-x-2 text-sm">
                                            <Phone className="w-4 h-4 text-gray-400" />
                                            <span className="text-gray-600 dark:text-gray-400">{appointment.clinic.phone}</span>
                                        </div>
                                        <div className="flex items-center space-x-2 text-sm">
                                            <Mail className="w-4 h-4 text-gray-400" />
                                            <span className="text-gray-600 dark:text-gray-400">{appointment.clinic.email}</span>
                                        </div>
                                        <div className="flex items-center space-x-2 text-sm">
                                            <Globe className="w-4 h-4 text-gray-400" />
                                            <span className="text-gray-600 dark:text-gray-400">{appointment.clinic.website}</span>
                                        </div>
                                        <div className="flex items-center space-x-2 text-sm">
                                            <Clock className="w-4 h-4 text-gray-400" />
                                            <span className="text-gray-600 dark:text-gray-400">{appointment.clinic.hours}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Doctor View: Patient Information */}
                        {isDoctor && (
                            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                                <h2 className="text-lg text-gray-900 dark:text-white mb-4 flex items-center">
                                    <User className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                                    Patient Information
                                </h2>
                                <div className="flex items-start space-x-4 mb-6">
                                    <img
                                        src={appointment.patient.image}
                                        alt={appointment.patient.name}
                                        className="w-20 h-20 rounded-full border-2 border-blue-100 dark:border-blue-900"
                                    />
                                    <div className="flex-1">
                                        <h3 className="text-lg text-gray-900 dark:text-white font-medium">{appointment.patient.name}</h3>
                                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2">
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                <span className="text-xs text-gray-500 dark:text-gray-500">Age:</span> {appointment.patient.age} years
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                <span className="text-xs text-gray-500 dark:text-gray-500">Gender:</span> {appointment.patient.gender}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                <span className="text-xs text-gray-500 dark:text-gray-500">Blood Type:</span> {appointment.patient.bloodType}
                                            </p>
                                           
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center space-x-2 text-sm">
                                        <Phone className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-600 dark:text-gray-400">{appointment.patient.phone}</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-sm">
                                        <Mail className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-600 dark:text-gray-400">{appointment.patient.email}</span>
                                    </div>
                                </div>

                                
                            </div>
                        )}

                        {/* Reason & Symptoms (for doctors) */}
                        {isDoctor && (
                            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                                <h2 className="text-lg text-gray-900 dark:text-white mb-4">Appointment Reason</h2>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Chief Complaint</p>
                                        <p className="text-sm text-gray-900 dark:text-white">{appointment.reason}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Symptoms</p>
                                        <p className="text-sm text-gray-900 dark:text-white">{appointment.symptoms}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Notes */}
                        {appointment.notes && (
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                                <h3 className="text-sm text-blue-900 dark:text-blue-300 font-medium mb-2 flex items-center">
                                    <FileText className="w-4 h-4 mr-2" />
                                    Notes
                                </h3>
                                <p className="text-sm text-blue-700 dark:text-blue-400">{appointment.notes}</p>
                            </div>
                        )}

                        {/* Instructions (for patients) */}
                        {isPatient && appointment.instructions && (
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
                                <h3 className="text-sm text-yellow-900 dark:text-yellow-300 font-medium mb-2 flex items-center">
                                    <AlertCircle className="w-4 h-4 mr-2" />
                                    Pre-appointment Instructions
                                </h3>
                                <p className="text-sm text-yellow-700 dark:text-yellow-400">{appointment.instructions}</p>
                            </div>
                        )}
                    </div>

                    {/* Sidebar Actions */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 sticky top-6">
                            <h3 className="text-base text-gray-900 dark:text-white font-medium mb-4">Actions</h3>
                            <div className="space-y-3">
                                {isPatient && (
                                    <>
                                        <button className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                                            Reschedule Appointment
                                        </button>
                                        <button className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm">
                                            Cancel Appointment
                                        </button>
                                    </>
                                )}
                                {isDoctor && (
                                    <>
                                        <button className="w-full px-4 py-2.5 border border-blue-600 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-sm">
                                            View Medical History
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}