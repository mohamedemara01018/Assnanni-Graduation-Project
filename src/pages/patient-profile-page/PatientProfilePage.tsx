import { useState } from 'react';
import { Link, useParams } from 'react-router';
import {
    User,
    Mail,
    Phone,
    Calendar,
    Heart,
    AlertCircle,
    Edit,
    Activity,
    FileText,
    Clock,
    Users,
    Home,
    Shield,
    Pill
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard-layout/DashboardLayout';

export default function PatientProfilePage() {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('overview');

    // Mock patient data
    const patient = {
        id: id || '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        dateOfBirth: '1985-03-15',
        age: 39,
        gender: 'Male',
        bloodType: 'O+',
        profileImage: null,
        address: {
            street: '123 Main Street',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'United States'
        },
        emergencyContact: {
            name: 'Jane Doe',
            relationship: 'Spouse',
            phone: '+1 (555) 987-6543'
        },
        insurance: {
            provider: 'Blue Cross Blue Shield',
            policyNumber: 'BCBS-123456789',
            groupNumber: 'GRP-987654',
            expiryDate: '2025-12-31'
        },
        occupation: 'Software Engineer',
        maritalStatus: 'Married',
        height: '5\'10"',
        weight: '165 lbs',
        bmi: '23.7',
        allergies: ['Penicillin', 'Peanuts', 'Latex'],
        chronicConditions: ['Hypertension', 'Type 2 Diabetes'],
        currentMedications: [
            { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily' },
            { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily' }
        ],
        registrationDate: '2024-01-15',
        lastVisit: '2024-04-20',
        nextAppointment: '2024-05-05',
        totalAppointments: 12,
        upcomingAppointments: 2
    };

    const medicalHistory = [
        {
            id: '1',
            date: '2024-04-20',
            type: 'Consultation',
            doctor: 'Dr. Sarah Williams',
            diagnosis: 'Routine checkup',
            notes: 'Blood pressure stable, continue current medication'
        },
        {
            id: '2',
            date: '2024-03-15',
            type: 'Lab Test',
            doctor: 'Dr. Michael Chen',
            diagnosis: 'Blood work',
            notes: 'HbA1c levels improving, glucose control good'
        },
        {
            id: '3',
            date: '2024-02-10',
            type: 'Follow-up',
            doctor: 'Dr. Sarah Williams',
            diagnosis: 'Diabetes management',
            notes: 'Adjusted medication dosage'
        }
    ];

    const recentScans = [
        { id: '1', date: '2024-04-20', type: 'Chest X-Ray', result: 'Normal', doctor: 'Dr. Michael Chen' },
        { id: '2', date: '2024-03-10', type: 'Blood Test', result: 'Pending', doctor: 'Dr. Sarah Williams' },
        { id: '3', date: '2024-02-05', type: 'ECG', result: 'Normal', doctor: 'Dr. James Brown' }
    ];

    return (
        <DashboardLayout pageTitle="Patient Profile">
            <div>
                {/* Header */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
                    <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-6">
                            {/* Profile Image */}
                            <div className="w-24 h-24 bg-linear-to-br from-blue-600 to-green-500 rounded-xl flex items-center justify-center text-white text-3xl font-bold">
                                {patient.firstName.charAt(0)}{patient.lastName.charAt(0)}
                            </div>

                            {/* Basic Info */}
                            <div>
                                <h2 className="text-2xl text-gray-900 dark:text-white mb-2">
                                    {patient.firstName} {patient.lastName}
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                                        <Mail className="w-4 h-4" />
                                        <span>{patient.email}</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                                        <Phone className="w-4 h-4" />
                                        <span>{patient.phone}</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                                        <Calendar className="w-4 h-4" />
                                        <span>{patient.age} years old ({patient.dateOfBirth})</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                                        <Heart className="w-4 h-4" />
                                        <span>Blood Type: {patient.bloodType}</span>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2 mt-3">
                                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs">
                                        Active Patient
                                    </span>
                                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs">
                                        {patient.gender}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Edit Button */}
                        <Link
                            to={`/patient-profile/edit/${patient.id}`}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                        >
                            <Edit className="w-4 h-4" />
                            <span>Edit Profile</span>
                        </Link>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 mb-6">
                    <div className="border-b border-gray-200 dark:border-gray-700">
                        <div className="flex space-x-8 px-6">
                            <button
                                onClick={() => setActiveTab('overview')}
                                className={`py-4 border-b-2 transition-colors ${activeTab === 'overview'
                                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                    }`}
                            >
                                Overview
                            </button>
                            <button
                                onClick={() => setActiveTab('medical')}
                                className={`py-4 border-b-2 transition-colors ${activeTab === 'medical'
                                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                    }`}
                            >
                                Medical History
                            </button>
                            <button
                                onClick={() => setActiveTab('scans')}
                                className={`py-4 border-b-2 transition-colors ${activeTab === 'scans'
                                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                    }`}
                            >
                                Scans & Reports
                            </button>
                        </div>
                    </div>

                    <div className="p-6">
                        {/* Overview Tab */}
                        {activeTab === 'overview' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Personal Information */}
                                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                                        <div className="flex items-center space-x-2 mb-4">
                                            <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                            <h3 className="text-lg text-gray-900 dark:text-white">Personal Information</h3>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">Full Name</span>
                                                <span className="text-gray-900 dark:text-white">{patient.firstName} {patient.lastName}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">Gender</span>
                                                <span className="text-gray-900 dark:text-white">{patient.gender}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">Marital Status</span>
                                                <span className="text-gray-900 dark:text-white">{patient.maritalStatus}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">Occupation</span>
                                                <span className="text-gray-900 dark:text-white">{patient.occupation}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Contact Information */}
                                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                                        <div className="flex items-center space-x-2 mb-4">
                                            <Phone className="w-5 h-5 text-green-600 dark:text-green-400" />
                                            <h3 className="text-lg text-gray-900 dark:text-white">Contact Information</h3>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">Email</span>
                                                <span className="text-gray-900 dark:text-white">{patient.email}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">Phone</span>
                                                <span className="text-gray-900 dark:text-white">{patient.phone}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">City</span>
                                                <span className="text-gray-900 dark:text-white">{patient.address.city}, {patient.address.state}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">Country</span>
                                                <span className="text-gray-900 dark:text-white">{patient.address.country}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Address */}
                                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                                        <div className="flex items-center space-x-2 mb-4">
                                            <Home className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                            <h3 className="text-lg text-gray-900 dark:text-white">Address</h3>
                                        </div>
                                        <p className="text-gray-900 dark:text-white">
                                            {patient.address.street}<br />
                                            {patient.address.city}, {patient.address.state} {patient.address.zipCode}<br />
                                            {patient.address.country}
                                        </p>
                                    </div>

                                    {/* Emergency Contact */}
                                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                                        <div className="flex items-center space-x-2 mb-4">
                                            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                                            <h3 className="text-lg text-gray-900 dark:text-white">Emergency Contact</h3>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">Name</span>
                                                <span className="text-gray-900 dark:text-white">{patient.emergencyContact.name}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">Relationship</span>
                                                <span className="text-gray-900 dark:text-white">{patient.emergencyContact.relationship}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">Phone</span>
                                                <span className="text-gray-900 dark:text-white">{patient.emergencyContact.phone}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Medical Summary */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Vital Statistics */}
                                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                                        <div className="flex items-center space-x-2 mb-4">
                                            <Activity className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                            <h3 className="text-lg text-gray-900 dark:text-white">Vital Statistics</h3>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">Height</span>
                                                <span className="text-gray-900 dark:text-white">{patient.height}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">Weight</span>
                                                <span className="text-gray-900 dark:text-white">{patient.weight}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">BMI</span>
                                                <span className="text-gray-900 dark:text-white">{patient.bmi}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">Blood Type</span>
                                                <span className="text-gray-900 dark:text-white">{patient.bloodType}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Allergies */}
                                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                                        <div className="flex items-center space-x-2 mb-4">
                                            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                                            <h3 className="text-lg text-gray-900 dark:text-white">Allergies</h3>
                                        </div>
                                        <div className="space-y-2">
                                            {patient.allergies.map((allergy, index) => (
                                                <div key={index} className="px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg text-sm">
                                                    {allergy}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Chronic Conditions */}
                                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                                        <div className="flex items-center space-x-2 mb-4">
                                            <Heart className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                                            <h3 className="text-lg text-gray-900 dark:text-white">Chronic Conditions</h3>
                                        </div>
                                        <div className="space-y-2">
                                            {patient.chronicConditions.map((condition, index) => (
                                                <div key={index} className="px-3 py-2 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 rounded-lg text-sm">
                                                    {condition}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Current Medications */}
                                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                                    <div className="flex items-center space-x-2 mb-4">
                                        <Pill className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        <h3 className="text-lg text-gray-900 dark:text-white">Current Medications</h3>
                                    </div>
                                    <div className="space-y-3">
                                        {patient.currentMedications.map((medication, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                                                <div>
                                                    <p className="text-gray-900 dark:text-white font-medium">{medication.name}</p>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">{medication.dosage}</p>
                                                </div>
                                                <span className="text-sm text-gray-600 dark:text-gray-400">{medication.frequency}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Insurance Information */}
                                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                                    <div className="flex items-center space-x-2 mb-4">
                                        <Shield className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                        <h3 className="text-lg text-gray-900 dark:text-white">Insurance Information</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Provider</span>
                                            <span className="text-gray-900 dark:text-white">{patient.insurance.provider}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Policy Number</span>
                                            <span className="text-gray-900 dark:text-white">{patient.insurance.policyNumber}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Group Number</span>
                                            <span className="text-gray-900 dark:text-white">{patient.insurance.groupNumber}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Expiry Date</span>
                                            <span className="text-gray-900 dark:text-white">{patient.insurance.expiryDate}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Medical History Tab */}
                        {activeTab === 'medical' && (
                            <div className="space-y-4">
                                {medicalHistory.map((record) => (
                                    <div key={record.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h4 className="text-lg text-gray-900 dark:text-white mb-1">{record.type}</h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Dr. {record.doctor}</p>
                                            </div>
                                            <span className="text-sm text-gray-500 dark:text-gray-400">{record.date}</span>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-gray-900 dark:text-white">
                                                <span className="font-medium">Diagnosis:</span> {record.diagnosis}
                                            </p>
                                            <p className="text-gray-600 dark:text-gray-400">{record.notes}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Scans & Reports Tab */}
                        {activeTab === 'scans' && (
                            <div className="space-y-4">
                                {recentScans.map((scan) => (
                                    <div key={scan.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                                    <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                                </div>
                                                <div>
                                                    <h4 className="text-gray-900 dark:text-white mb-1">{scan.type}</h4>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">Dr. {scan.doctor}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{scan.date}</p>
                                                <span className={`px-3 py-1 rounded-full text-xs ${scan.result === 'Normal'
                                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                                    : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                                                    }`}>
                                                    {scan.result}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-2xl text-gray-900 dark:text-white">{patient.totalAppointments}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Total Visits</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                                <Clock className="w-5 h-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="text-2xl text-gray-900 dark:text-white">{patient.upcomingAppointments}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Upcoming</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                                <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <p className="text-2xl text-gray-900 dark:text-white">{recentScans.length}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Scans</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                                <Users className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div>
                                <p className="text-2xl text-gray-900 dark:text-white">{patient.currentMedications.length}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Medications</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
