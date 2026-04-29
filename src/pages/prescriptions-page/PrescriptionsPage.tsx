import DashboardLayout from '@/components/dashboard-layout/DashboardLayout';
import { Pill, Calendar, Download } from 'lucide-react';


export default function PrescriptionsPage() {

    const prescriptions = [
        {
            id: '1',
            doctorName: 'Dr. Sarah Johnson',
            date: '2025-12-08',
            diagnosis: 'Hypertension',
            medications: [
                { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', duration: '30 days' },
                { name: 'Aspirin', dosage: '81mg', frequency: 'Once daily', duration: '30 days' }
            ],
            notes: 'Monitor blood pressure regularly. Follow up in 4 weeks.'
        },
        {
            id: '2',
            doctorName: 'Dr. Michael Chen',
            date: '2025-11-25',
            diagnosis: 'Migraine',
            medications: [
                { name: 'Sumatriptan', dosage: '50mg', frequency: 'As needed', duration: '15 days' }
            ],
            notes: 'Take at first sign of migraine. Avoid triggers.'
        }
    ];
    return (
        <DashboardLayout pageTitle='prescriptions page'>
            <div>
                <h1 className="text-3xl text-gray-900 dark:text-white mb-8">Prescriptions</h1>

                <div className="space-y-6">
                    {prescriptions.map((prescription) => (
                        <div key={prescription.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                        <Pill className="w-6 h-6 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg text-gray-900 dark:text-white mb-1">{prescription.diagnosis}</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{prescription.doctorName}</p>
                                        <div className="flex items-center space-x-2 mt-2 text-sm text-gray-500 dark:text-gray-500">
                                            <Calendar className="w-4 h-4" />
                                            <span>{prescription.date}</span>
                                        </div>
                                    </div>
                                </div>
                                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                    <Download className="w-4 h-4" />
                                    <span>Download</span>
                                </button>
                            </div>

                            <div className="mb-4">
                                <h4 className="text-gray-900 dark:text-white mb-3">Medications:</h4>
                                <div className="space-y-3">
                                    {prescription.medications.map((med, index) => (
                                        <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <p className="text-gray-900 dark:text-white mb-1">{med.name}</p>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        {med.dosage} - {med.frequency}
                                                    </p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-500">Duration: {med.duration}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {prescription.notes && (
                                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        <strong>Notes:</strong> {prescription.notes}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>

    );
}
