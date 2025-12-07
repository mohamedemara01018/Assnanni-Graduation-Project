import { AiOutlineUser } from 'react-icons/ai'
import { CiHospital1 } from 'react-icons/ci'
import { LuGraduationCap } from 'react-icons/lu'

export const roles = [
    { path: '/register/patient-register', label: 'Patient', icon: <AiOutlineUser /> },
    { path: '/register/doctor-register', label: 'Doctor', icon: <CiHospital1 /> },
    { path: '/register/student-register', label: 'Student', icon: <LuGraduationCap /> },
    { path: '/register/receptionist-register', label: 'Receptionist', icon: <AiOutlineUser /> },
]