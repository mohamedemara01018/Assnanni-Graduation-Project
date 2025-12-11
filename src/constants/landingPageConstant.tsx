import { CiCalendar } from "react-icons/ci";
import { LuAward, LuUsers } from "react-icons/lu";
import { FiActivity } from "react-icons/fi";
import { IoShieldOutline } from "react-icons/io5";
import { FaRegClock } from "react-icons/fa";

// imgs

import testimonialImg1 from '../assets/testmonial-1.jpg'
import testimonialImg2 from '../assets/testmonial-2.jpg'
import testimonialImg3 from '../assets/testmonial-2.jpg'

export const features = [
    {
        icon: (props: string) => <CiCalendar className={props} />,
        title: 'Easy Appointment Booking',
        description: 'Book appointments with top doctors in just a few clicks'
    },
    {
        icon: (props: string) => <LuUsers className={props} />,
        title: 'Expert Doctors',
        description: 'Connect with verified healthcare professionals'
    },
    {
        icon: (props: string) => <FiActivity className={props} />,
        title: 'AI-Powered Scan Analysis',
        description: 'Advanced AI analysis for medical scans and diagnostics'
    },
    {
        icon: (props: string) => <IoShieldOutline className={props} />,
        title: 'Secure & Private',
        description: 'Your medical data is encrypted and completely secure'
    },
    {
        icon: (props: string) => <FaRegClock className={props} />,
        title: '24/7 Access',
        description: 'Access your health records anytime, anywhere'
    },
    {
        icon: (props: string) => <LuAward className={props} />,
        title: 'Quality Care',
        description: 'Highest standards of medical care and service'
    }
];


export const howItWorks = [
    {
        step: 1,
        title: 'Create Account',
        description: 'Sign up as a patient, doctor, or healthcare professional'
    },
    {
        step: 2,
        title: 'Find a Doctor',
        description: 'Search and filter doctors by specialization and availability'
    },
    {
        step: 3,
        title: 'Book Appointment',
        description: 'Choose a convenient time slot and confirm your appointment'
    },
    {
        step: 4,
        title: 'Get Care',
        description: 'Receive quality healthcare and manage your medical records'
    }
];


export const testimonials = [
    {
        name: 'Sarah Mitchell',
        role: 'Patient',
        content: 'Assnani made it so easy to find a specialist. The booking process was seamless!',
        rating: 5,
        image: testimonialImg1
    },
    {
        name: 'Dr. James Cooper',
        role: 'Cardiologist',
        content: 'The platform helps me manage my schedule efficiently and provide better care to my patients.',
        rating: 5,
        image: testimonialImg2
    },
    {
        name: 'Emily Johnson',
        role: 'Patient',
        content: 'I love how I can access all my medical records in one place. Very convenient!',
        rating: 5,
        image: testimonialImg3
    }
];
