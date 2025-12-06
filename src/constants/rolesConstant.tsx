import { AiOutlineUser } from 'react-icons/ai'
import { CiHospital1 } from 'react-icons/ci'
import { LuGraduationCap } from 'react-icons/lu'

export const roles = [
    { path: '/registration/patient-registration', label: 'Patient', icon: <AiOutlineUser /> },
    { path: '/registration/doctor-registration', label: 'Doctor', icon: <CiHospital1 /> },
    { path: '/registration/student-registration', label: 'Student', icon: <LuGraduationCap /> },
    { path: '/registration/receptionist-registration', label: 'Receptionist', icon: <AiOutlineUser /> },
]