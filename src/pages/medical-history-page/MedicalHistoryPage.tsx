import MedicalHistoryInDoctorDashboard from '@/components/medical-history-in-doctor/MedicalHistoryInDoctor';
import MedicalHistoryInPatient from '@/components/medical-history-in-patient/MedicalHistoryInPatient';
import type { RootState } from '@/store/store';
import { useSelector } from 'react-redux'

const MedicalHistory = () => {
    const role = useSelector((state: RootState) => state.auth.role);
    console.log(role)
    if (role == 'doctor') {
        return <MedicalHistoryInDoctorDashboard />
    }

    if (role == 'patient') {
        return <MedicalHistoryInPatient />
    }
}


export default MedicalHistory
