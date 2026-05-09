import { useEffect, useState } from 'react';
import { Search, Filter, CheckCircle, XCircle, Eye, Download, FileText, Award, Briefcase, Calendar, MapPin, Mail, Phone, AlertCircle } from 'lucide-react';
import DashboardLayout from '@/components/dashboard-layout/DashboardLayout';
import { useSelector, useDispatch } from "react-redux";
import { getTimeAgo } from '@/lib/utils';
import { fetchSearchPendingDoctor, selectSearchPendingDoctor, type SearchPendingDoctor, type SearchPendingDoctorState } from '@/store/slices/admin-slice/search-pending-doctors-slice/searchPendingDoctorSlice';
import type { AppDispatch } from '@/store/store';
import Error from '@/components/error/Error';
import { ScaleLoader } from 'react-spinners';
import { fetchApprovePendingDoctor, selectApprovePendingDoctor, type ApprovePendingDoctorState } from '@/store/slices/admin-slice/approve-pending-doctor-slice/approvePendingDoctorSlice';
import { toast } from 'react-toastify';
import { fetchRejectPendingDoctor, selectRejectPendingDoctor, type RejectPendingDoctorState } from '@/store/slices/admin-slice/reject-pending-doctor-slice/rejectPendingDoctorSlice';



export default function VerifyDoctorsPage() {
    const dispatch: AppDispatch = useDispatch();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
    const [selectedDoctor, setSelectedDoctor] = useState<SearchPendingDoctor | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectButton, setSelectButton] = useState<string>("")
    // const [selectedRejectButton, setSelectedRejectButton] = useState<string>("")


    useEffect(() => {
        dispatch(
            fetchSearchPendingDoctor({
                searchTerm: searchQuery,
                pageNumber: 1,
                pageSize: 10,
            })
        );
    }, [dispatch, searchQuery]);



    const { doctors, error, loading } = useSelector(selectSearchPendingDoctor) as SearchPendingDoctorState;
    const approvedDoctor = useSelector(selectApprovePendingDoctor) as ApprovePendingDoctorState
    const rejectedDoctor = useSelector(selectRejectPendingDoctor) as RejectPendingDoctorState

    // Mock data for pending verifications
    // const verifications: DoctorVerification[] = [
    //     {
    //         id: '1',
    //         name: 'Dr. Emily Chen',
    //         email: 'emily.chen@email.com',
    //         phone: '+1 (555) 123-4567',
    //         specialty: 'Cardiologist',
    //         experience: '12 years',
    //         location: 'New York, NY',
    //         submittedDate: '2 days ago',
    //         licenseNumber: 'MD-NY-123456',
    //         education: 'Harvard Medical School',
    //         status: 'pending',
    //         documents: [
    //             { id: '1', name: 'Medical License', type: 'PDF', size: '2.3 MB', url: '#' },
    //             { id: '2', name: 'Board Certification', type: 'PDF', size: '1.8 MB', url: '#' },
    //             { id: '3', name: 'CV/Resume', type: 'PDF', size: '1.2 MB', url: '#' },
    //             { id: '4', name: 'ID Proof', type: 'PDF', size: '0.9 MB', url: '#' },
    //             { id: '5', name: 'Education Certificates', type: 'PDF', size: '3.1 MB', url: '#' },
    //         ]
    //     },
    //     {
    //         id: '2',
    //         name: 'Dr. Michael Brown',
    //         email: 'michael.brown@email.com',
    //         phone: '+1 (555) 234-5678',
    //         specialty: 'Neurologist',
    //         experience: '8 years',
    //         location: 'Los Angeles, CA',
    //         submittedDate: '1 day ago',
    //         licenseNumber: 'MD-CA-789012',
    //         education: 'Stanford University School of Medicine',
    //         status: 'pending',
    //         documents: [
    //             { id: '1', name: 'Medical License', type: 'PDF', size: '2.1 MB', url: '#' },
    //             { id: '2', name: 'Board Certification', type: 'PDF', size: '1.5 MB', url: '#' },
    //             { id: '3', name: 'CV/Resume', type: 'PDF', size: '1.0 MB', url: '#' },
    //             { id: '4', name: 'ID Proof', type: 'PDF', size: '0.8 MB', url: '#' },
    //         ]
    //     },
    //     {
    //         id: '3',
    //         name: 'Dr. Sarah Williams',
    //         email: 'sarah.williams@email.com',
    //         phone: '+1 (555) 345-6789',
    //         specialty: 'Pediatrician',
    //         experience: '15 years',
    //         location: 'Chicago, IL',
    //         submittedDate: '3 hours ago',
    //         licenseNumber: 'MD-IL-345678',
    //         education: 'Johns Hopkins School of Medicine',
    //         status: 'pending',
    //         documents: [
    //             { id: '1', name: 'Medical License', type: 'PDF', size: '2.5 MB', url: '#' },
    //             { id: '2', name: 'Board Certification', type: 'PDF', size: '1.9 MB', url: '#' },
    //             { id: '3', name: 'CV/Resume', type: 'PDF', size: '1.4 MB', url: '#' },
    //             { id: '4', name: 'ID Proof', type: 'PDF', size: '1.0 MB', url: '#' },
    //             { id: '5', name: 'Education Certificates', type: 'PDF', size: '2.8 MB', url: '#' },
    //             { id: '6', name: 'Malpractice Insurance', type: 'PDF', size: '1.1 MB', url: '#' },
    //         ]
    //     },
    //     {
    //         id: '4',
    //         name: 'Dr. James Anderson',
    //         email: 'james.anderson@email.com',
    //         phone: '+1 (555) 456-7890',
    //         specialty: 'Orthopedic Surgeon',
    //         experience: '10 years',
    //         location: 'Houston, TX',
    //         submittedDate: '5 days ago',
    //         licenseNumber: 'MD-TX-901234',
    //         education: 'University of Pennsylvania School of Medicine',
    //         status: 'pending',
    //         documents: [
    //             { id: '1', name: 'Medical License', type: 'PDF', size: '2.2 MB', url: '#' },
    //             { id: '2', name: 'Board Certification', type: 'PDF', size: '1.7 MB', url: '#' },
    //             { id: '3', name: 'CV/Resume', type: 'PDF', size: '1.3 MB', url: '#' },
    //             { id: '4', name: 'ID Proof', type: 'PDF', size: '0.9 MB', url: '#' },
    //         ]
    //     },
    //     {
    //         id: '5',
    //         name: 'Dr. Patricia Martinez',
    //         email: 'patricia.martinez@email.com',
    //         phone: '+1 (555) 567-8901',
    //         specialty: 'Dermatologist',
    //         experience: '6 years',
    //         location: 'Phoenix, AZ',
    //         submittedDate: '1 week ago',
    //         licenseNumber: 'MD-AZ-567890',
    //         education: 'Yale School of Medicine',
    //         status: 'pending',
    //         documents: [
    //             { id: '1', name: 'Medical License', type: 'PDF', size: '2.4 MB', url: '#' },
    //             { id: '2', name: 'Board Certification', type: 'PDF', size: '1.6 MB', url: '#' },
    //             { id: '3', name: 'CV/Resume', type: 'PDF', size: '1.1 MB', url: '#' },
    //             { id: '4', name: 'ID Proof', type: 'PDF', size: '0.7 MB', url: '#' },
    //             { id: '5', name: 'Education Certificates', type: 'PDF', size: '2.9 MB', url: '#' },
    //         ]
    //     },
    // ];
    const handleApprove = async (doctorId: string) => {
        setSelectButton(doctorId)
        try {
            const response = await dispatch(
                fetchApprovePendingDoctor({
                    note: "",
                    id: doctorId,
                })
            ).unwrap();

            toast.success(response.message || "Doctor approved successfully");
            dispatch(
                fetchSearchPendingDoctor({
                    searchTerm: searchQuery,
                    pageNumber: 1,
                    pageSize: 10,
                })
            );
        } catch (error: any) {
            toast.error(error || "Failed To Approve");
        } finally {
            setSelectButton("")
        }
    };
    const handleReject = async (doctorId: string) => {
        setSelectButton(doctorId)
        try {
            const response = await dispatch(
                fetchRejectPendingDoctor({
                    reason: "",
                    id: doctorId,
                })
            ).unwrap();

            toast.success(response.message || "Doctor approved successfully");
            dispatch(
                fetchSearchPendingDoctor({
                    searchTerm: searchQuery,
                    pageNumber: 1,
                    pageSize: 10,
                })
            );
        } catch (error: any) {
            toast.error(error || "Failed To Approve");
        } finally {
            setSelectButton("")
        }
        // Handle rejection logic
    };

    const handleViewDetails = (doctor: SearchPendingDoctor) => {
        setSelectedDoctor(doctor);
        setShowDetailModal(true);
    };


    return (
        <DashboardLayout pageTitle="Verify Doctors">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-2xl text-gray-900 dark:text-white mb-2">Doctor Verifications</h2>
                <p className="text-gray-600 dark:text-gray-400">Review and verify pending doctor applications</p>
            </div>

            {/* Stats Cards */}
            {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total Pending</p>
                            <p className="text-2xl text-gray-900 dark:text-white mt-1">5</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                            <AlertCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Approved Today</p>
                            <p className="text-2xl text-gray-900 dark:text-white mt-1">3</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Rejected Today</p>
                            <p className="text-2xl text-gray-900 dark:text-white mt-1">1</p>
                        </div>
                        <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                            <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Review Time</p>
                            <p className="text-2xl text-gray-900 dark:text-white mt-1">2.5h</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                    </div>
                </div>
            </div> */}

            {/* Search and Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name, specialty, or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Filter */}
                    <div className="flex items-center space-x-2">
                        <Filter className="w-5 h-5 text-gray-400" />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value as any)}
                            className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Verifications List */}
            <div className="space-y-4">
                {doctors.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
                        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-400">No verifications found</p>
                    </div>
                ) : (

                    loading ?
                        <div className="w-full  flex items-center justify-center">
                            <ScaleLoader color="#6d61ff" />{" "}
                        </div> :
                        error ?
                            <Error message={error} /> :
                            doctors.map((doctor) => (
                                <div
                                    key={doctor.doctorId}
                                    className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                        {/* Doctor Info */}
                                        <div className="flex items-start space-x-4 flex-1">
                                            <div className="w-16 h-16 bg-linear-to-br from-blue-600 to-green-500 rounded-full flex items-center justify-center text-white text-xl shrink-0">
                                                {/* {doctor.fullProfileImageUrl && <img src={doctor.fullProfileImageUrl} alt="" />} */}
                                                {doctor.fullName ? doctor.fullName.charAt(0) : 'D'}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                {doctor.fullName && <div className="flex items-center space-x-2 mb-1">
                                                    <h3 className="text-lg text-gray-900 dark:text-white font-medium">{doctor.fullName}</h3>

                                                </div>}

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                                                    {doctor.email && <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                                                        <Mail className="w-4 h-4 shrink-0" />
                                                        <span className="truncate">{doctor.email}</span>
                                                    </div>}
                                                    {doctor.phoneNumber && <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                                                        <Phone className="w-4 h-4 shrink-0" />
                                                        <span>{doctor.phoneNumber}</span>
                                                    </div>}
                                                    {doctor.clinicLocation && <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                                                        <MapPin className="w-4 h-4 shrink-0" />
                                                        <span>{doctor.clinicLocation}</span>
                                                    </div>}
                                                    {doctor.yearsOfExperience && <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                                                        <Briefcase className="w-4 h-4 shrink-0" />
                                                        <span>{doctor.yearsOfExperience} experience</span>
                                                    </div>}
                                                    {doctor.education && <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                                                        <Award className="w-4 h-4 shrink-0" />
                                                        <span className="truncate">{doctor.education}</span>
                                                    </div>}
                                                    {/* <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                                                <FileText className="w-4 h-4 shrink-0" />
                                                <span>{doctor.documents.length} documents</span>
                                            </div> */}
                                                </div>

                                                {doctor.createdAt && <div className="mt-3 flex items-center space-x-2">
                                                    <Calendar className="w-4 h-4 text-gray-400" />
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                                        Submitted {getTimeAgo(doctor.createdAt)}
                                                    </span>
                                                </div>}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-row lg:flex-col gap-2 justify-end lg:justify-start">
                                            <button
                                                onClick={() => handleViewDetails(doctor)}
                                                className="flex-1 lg:flex-none px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2"
                                            >
                                                <Eye className="w-4 h-4" />
                                                <span>View Details</span>
                                            </button>
                                            <button
                                                disabled={selectButton == doctor.doctorId && approvedDoctor.loading}
                                                onClick={() => handleApprove(doctor.doctorId)}
                                                className="flex-1 lg:flex-none px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                                            >
                                                {selectButton == doctor.doctorId && approvedDoctor.loading ? ' approving...' : <><CheckCircle className="w-4 h-4" />
                                                    <span>Approve</span></>}
                                            </button>
                                            <button
                                                disabled={selectButton == doctor.doctorId && rejectedDoctor.loading}
                                                onClick={() => handleReject(doctor.doctorId)}
                                                className="flex-1 lg:flex-none px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                                            >
                                                <XCircle className="w-4 h-4" />
                                                <span>Reject</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                )}
            </div>

            {/* Detail Modal */}
            {
                showDetailModal && selectedDoctor && (
                    <>
                        <div className="fixed inset-0 bg-black/25 backdrop-blur-sm z-10" />

                        <div className="fixed  inset-0 bg-opacity-50 flex items-center justify-center p-4 z-50">
                            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                                {/* Modal Header */}
                                <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-16 h-16 bg-linear-to-br from-blue-600 to-green-500 rounded-full flex items-center justify-center text-white text-xl">
                                            {selectedDoctor.fullName ? selectedDoctor.fullName.charAt(0) : 'D'}
                                        </div>
                                        {selectedDoctor.fullName && <div className="flex items-center space-x-2 mb-1">
                                            <h3 className="text-lg text-gray-900 dark:text-white font-medium">{selectedDoctor.fullName}</h3>

                                        </div>}

                                    </div>
                                    <button
                                        onClick={() => setShowDetailModal(false)}
                                        className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                    >
                                        <XCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                    </button>
                                </div>

                                {/* Modal Content */}
                                <div className="p-6 space-y-6">
                                    {/* Personal Information */}
                                    <div>
                                        <h3 className="text-lg text-gray-900 dark:text-white mb-4">Personal Information</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {selectedDoctor.email && <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Email</p>
                                                <p className="text-gray-900 dark:text-white">{selectedDoctor.email}</p>
                                            </div>}
                                            {selectedDoctor.phoneNumber && <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Phone</p>
                                                <p className="text-gray-900 dark:text-white">{selectedDoctor.phoneNumber}</p>
                                            </div>}
                                            {selectedDoctor.medicalLicenseNumber && <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">License Number</p>
                                                <p className="text-gray-900 dark:text-white">{selectedDoctor.medicalLicenseNumber}</p>
                                            </div>}
                                            {selectedDoctor.clinicLocation && <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Location</p>
                                                <p className="text-gray-900 dark:text-white">{selectedDoctor.clinicLocation}</p>
                                            </div>}
                                            {selectedDoctor.yearsOfExperience && <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Experience</p>
                                                <p className="text-gray-900 dark:text-white">{selectedDoctor.yearsOfExperience}</p>
                                            </div>}
                                            {selectedDoctor.education && <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Education</p>
                                                <p className="text-gray-900 dark:text-white">{selectedDoctor.education}</p>
                                            </div>}
                                        </div>
                                    </div>

                                    {/* Documents */}
                                    <div>
                                        <h3 className="text-lg text-gray-900 dark:text-white mb-4">Submitted Documents</h3>
                                        <div className="space-y-2">

                                            <div
                                                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                                        <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-900 dark:text-white font-medium">Board Certification</p>
                                                        {/* <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            {doc.type} • {doc.size}
                                                        </p> */}
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <button className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                                                        <Download className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <button
                                            onClick={() => {
                                                handleReject(selectedDoctor.doctorId);
                                                setShowDetailModal(false);
                                            }}
                                            className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                                        >
                                            <XCircle className="w-5 h-5" />
                                            <span>Reject Application</span>
                                        </button>
                                        <button
                                            onClick={() => {
                                                handleApprove(selectedDoctor.doctorId);
                                                setShowDetailModal(false);
                                            }}
                                            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                                        >
                                            <CheckCircle className="w-5 h-5" />
                                            <span>Approve & Activate</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )
            }
        </DashboardLayout >
    );
}
