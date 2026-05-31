import { useParams, useNavigate } from 'react-router';
import {
    ArrowLeft,
    Calendar,
    Clock,
    MapPin,
    User,
    FileText,
    Phone,
    Building2,
    Star,
    Briefcase,
    AlertCircle,
    Loader2
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard-layout/DashboardLayout';
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch } from '@/store/store';
import { appointmentDetailsState, fetchAppointmentDetails, type AppointmentDetailsState } from '@/store/slices/patient-slice/appintment-details-slice/appointmentDetailsSlice';
import { useEffect, useState } from 'react';
import { RescheduleAppointmentModal } from '@/components/reschedule-appointment-modal/RescheduleAppointmentModal';


// helpers


function parseDate(iso: string) {
    const d = new Date(iso + 'T00:00:00');
    return {
        day: d.toLocaleDateString('en-US', { weekday: 'short' }),
        dateNum: d.getDate(),
        monthLabel: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        fullLabel: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        iso,
    };
}

function formatTime(t: string) {
    const [h, m] = t.split(':').map(Number);
    const ampm = h < 12 ? 'AM' : 'PM';
    const hour = h % 12 || 12;
    return `${hour}:${String(m).padStart(2, '0')} ${ampm}`;
}

export default function AppointmentDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const user = { role: 'patient' };
    const [showRescheduleModal, setShowRescheduleModal] = useState<boolean>(false)

    const dispatch: AppDispatch = useDispatch();
    const { data, loading, error } = useSelector(appointmentDetailsState) as AppointmentDetailsState

    useEffect(() => {
        dispatch(fetchAppointmentDetails({ id: String(id) }));
    }, [dispatch, id]);

    const isPatient = user?.role === 'patient';
    const isDoctor = user?.role === 'doctor' || user?.role === 'student_doctor';

    // ─── Loading State ──────────────────────────────────────────────────────────
    if (loading) {
        return (
            <DashboardLayout pageTitle="Appointment Details">
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="flex flex-col items-center space-y-3 text-gray-500 dark:text-gray-400">
                        <Loader2 className="w-8 h-8 animate-spin" />
                        <p className="text-sm">Loading appointment details...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    // ─── Error State ────────────────────────────────────────────────────────────
    if (error) {
        return (
            <DashboardLayout pageTitle="Appointment Details">
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="flex flex-col items-center space-y-3 text-red-500 dark:text-red-400">
                        <AlertCircle className="w-8 h-8" />
                        <p className="text-sm">{error}</p>
                        <button
                            onClick={() => navigate(-1)}
                            className="text-sm text-gray-600 dark:text-gray-400 hover:underline"
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    // ─── Derived values from real API data ──────────────────────────────────────
    const { status, date, time, location, type, doctor, clinic, notes, instructions } = data;
    console.log(data)
    // Format duration display — the API doesn't return it, so omit or hardcode fallback
    const statusColorMap: Record<string, string> = {
        Confirmed: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
        Pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
        Cancelled: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
        Completed: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    };
    const statusClass = statusColorMap[status] ?? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';

    return (
        <DashboardLayout pageTitle="Appointment Details">
            <div>
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="text-sm">Back to Appointments</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* ── Main Content ────────────────────────────────────────── */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Header */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h1 className="text-2xl text-gray-900 dark:text-white mb-1">Appointment Details</h1>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">ID: #{id}</p>
                                </div>
                                <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${statusClass}`}>
                                    {status}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex items-start space-x-3">
                                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Date</p>
                                        <p className="text-sm text-gray-900 dark:text-white font-medium">{parseDate(date).fullLabel || '—'}</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Time</p>
                                        <p className="text-sm text-gray-900 dark:text-white font-medium">{formatTime(time) || '—'}</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Location</p>
                                        <p className="text-sm text-gray-900 dark:text-white font-medium">{location || '—'}</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Type</p>
                                        <p className="text-sm text-gray-900 dark:text-white font-medium">{type || '—'}</p>
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
                                    {doctor.imageUrl ? (
                                        <img
                                            src={doctor.imageUrl}
                                            alt={doctor.name}
                                            className="w-20 h-20 rounded-full border-2 border-blue-100 dark:border-blue-900 object-cover"
                                        />
                                    ) : (
                                        <div className="w-20 h-20 rounded-full border-2 border-blue-100 dark:border-blue-900 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                            <User className="w-8 h-8 text-gray-400" />
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <h3 className="text-lg text-gray-900 dark:text-white font-medium">{doctor.name || '—'}</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{doctor.specialization || '—'}</p>
                                        <div className="flex items-center space-x-4">
                                            {doctor.rating > 0 && (
                                                <div className="flex items-center space-x-1">
                                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                    <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{doctor.rating}</span>
                                                </div>
                                            )}
                                            {doctor.experienceYears > 0 && (
                                                <div className="flex items-center space-x-1">
                                                    <Briefcase className="w-4 h-4 text-gray-400" />
                                                    <span className="text-xs text-gray-600 dark:text-gray-400">
                                                        {doctor.experienceYears} yr{doctor.experienceYears !== 1 ? 's' : ''} experience
                                                    </span>
                                                </div>
                                            )}
                                        </div>
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
                                        <h3 className="text-base text-gray-900 dark:text-white font-medium mb-1">{clinic.name || '—'}</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{clinic.address || '—'}</p>
                                    </div>
                                    {clinic.phone && (
                                        <div className="flex items-center space-x-2 text-sm pt-3 border-t border-gray-200 dark:border-gray-700">
                                            <Phone className="w-4 h-4 text-gray-400" />
                                            <span className="text-gray-600 dark:text-gray-400">{clinic.phone}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Notes */}
                        {notes && (
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                                <h3 className="text-sm text-blue-900 dark:text-blue-300 font-medium mb-2 flex items-center">
                                    <FileText className="w-4 h-4 mr-2" />
                                    Notes
                                </h3>
                                <p className="text-sm text-blue-700 dark:text-blue-400">{notes}</p>
                            </div>
                        )}

                        {/* Instructions (for patients) */}
                        {isPatient && instructions && (
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
                                <h3 className="text-sm text-yellow-900 dark:text-yellow-300 font-medium mb-2 flex items-center">
                                    <AlertCircle className="w-4 h-4 mr-2" />
                                    Pre-appointment Instructions
                                </h3>
                                <p className="text-sm text-yellow-700 dark:text-yellow-400">{instructions}</p>
                            </div>
                        )}
                    </div>

                    {/* ── Sidebar Actions ──────────────────────────────────────── */}
                    {(status == 'Pending' || status == 'Confirmed') && <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 sticky top-6">
                            <h3 className="text-base text-gray-900 dark:text-white font-medium mb-4">Actions</h3>
                            <div className="space-y-3">
                                {isPatient && (
                                    <>
                                        <button
                                            onClick={() => setShowRescheduleModal(true)}
                                            className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                                            Reschedule Appointment
                                        </button>
                                        <button className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm">
                                            Cancel Appointment
                                        </button>
                                    </>
                                )}
                                {isDoctor && (
                                    <button className="w-full px-4 py-2.5 border border-blue-600 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-sm">
                                        View Medical History
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>}
                </div>
            </div >
            {/* Reschedule Modal */}
            <RescheduleAppointmentModal
                isOpen={showRescheduleModal}
                onClose={() => setShowRescheduleModal(false)}
                appointment={{
                    id: id || '',
                    date: data.date,
                    time: data.time,
                    doctorName: data.doctor.name,
                    doctorImage: String(data.doctor.imageUrl)
                }}
                id={String(28)}
            />
        </DashboardLayout >
    );
}