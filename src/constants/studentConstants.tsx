import type {
  AppointmentData,
  Observation,
  Scan,
  Supervisor,
} from "@/interfaces/studentInterfaces";

export const dummyPatients = [
  {
    id: 1,
    name: "John Doe",
    imageUrl: "https://randomuser.me/api/portraits/men/32.jpg",
    lastInteractionDate: "2026-04-30",
  },
  {
    id: 2,
    name: "Mary Smith",
    imageUrl: "https://randomuser.me/api/portraits/women/44.jpg",
    lastInteractionDate: "2026-04-29",
  },
  {
    id: 3,
    name: "Robert Brown",
    imageUrl: "https://randomuser.me/api/portraits/men/46.jpg",
    lastInteractionDate: "2026-04-28",
  },
];

export const dummyObservations: Observation[] = [
  {
    id: 1,
    doctorName: "Dr. Sarah Johnson",
    specialty: "Cardiology",
    time: "10:00",
    supervisor: "Dr. Smith",
    status: "Observe Only",
  },
  {
    id: 2,
    doctorName: "Dr. Emily Rodriguez",
    specialty: "Pediatrics",
    time: "14:00",
    supervisor: "Dr. Miller",
    status: "Observe Only",
  },
];

export const dummyScans: Scan[] = [
  {
    id: 1,
    type: "CT Scan",
    caseStudyNum: "#",
    note: "For educational purposes only",
    status: "View & Learn",
  },
];

export const dummySupervisor: Supervisor = {
  name: "Dr. Sarah Miller",
  specialty: "Senior Cardiologist",
  imageUrl: "https://randomuser.me/api/portraits/women/65.jpg",
};

export const dummyAppointments: AppointmentData[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    desc: "Annual Checkup",
    date: "Feb 5, 2026",
    time: "10:00 AM",
    meetingType: "In-Person",
    address: "Room 302, Medical Center",
    status: "Upcoming",
    imageUrl: "https://randomuser.me/api/portraits/women/11.jpg",
  },
  {
    id: 2,
    name: "James Wilson",
    desc: "Follow-up Consultation",
    date: "Feb 6, 2026",
    time: "2:30 PM",
    meetingType: "Video Call",
    status: "Upcoming",
    imageUrl: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 3,
    name: "Robert Brown",
    desc: "Prescription Renewal",
    date: "Feb 8, 2026",
    time: "11:30 AM",
    meetingType: "Phone Call",
    status: "Upcoming",
    imageUrl: "https://randomuser.me/api/portraits/men/44.jpg",
  },
  {
    id: 4,
    name: "Lisa Anderson",
    desc: "General Consultation",
    date: "Jan 25, 2026",
    time: "3:00 PM",
    meetingType: "Video Call",
    status: "Cancelled",
    imageUrl: "https://randomuser.me/api/portraits/women/65.jpg",
  },
];

export const supervisor = {
  name: "Dr. Sarah Miller",
  specialty: "Senior Cardiologist",
  imageUrl: "https://randomuser.me/api/portraits/women/65.jpg",
  email: "sarah.miller@hospital.com",
  phone: "+1 (555) 123-4567",
};
