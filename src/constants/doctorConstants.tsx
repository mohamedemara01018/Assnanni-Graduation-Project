import type {
  Appointment,
  Day,
  MedicalHistoryItem,
  Patient,
  RecentPatient,
  Receptionist,
  Scan,
  Schedule,
  StudentDoctor,
} from "@/interfaces/doctorInterfaces";
import type { ChartOptions } from "chart.js";
import { FiUsers, FiCalendar, FiFileText, FiDollarSign } from "react-icons/fi";
import { LuCalendar, LuClock, LuActivity } from "react-icons/lu";

export const defaultDashboardData = {
  todayAppointments: 12,
  totalPatients: 128,
  pendingScans: 1,
  satisfactionRate: 95,
};
export const dummySchedules: Schedule[] = [
  {
    appointmentId: 1,
    patientName: "Dr. Sarah Johnson",
    specialty: "Cardiology",
    time: "10:00",
    status: "confirmed",
  },
  {
    appointmentId: 2,
    patientName: "Dr. Emily Rodriguez",
    specialty: "Pediatrics",
    time: "14:00",
    status: "pending",
  },
  {
    appointmentId: 3,
    patientName: "Dr. Michael Chen",
    specialty: "Neurology",
    time: "09:00",
    status: "completed",
  },
];

export const dummyScans: Scan[] = [
  {
    id: 1,
    patientName: "5235299259",
    scanType: "CT Scan",
    uploadedAt: new Date().toISOString(),
  },
];

export const dummyPatients: RecentPatient[] = [
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

export const receptionists: Receptionist[] = [
  {
    id: 1,
    name: "Emily Rodriguez",
    email: "emily.r@assnani.com",
    phone: "555-0201",
    status: "active",
    addedDate: "2025-11-01",
    lastActive: "2 hours ago",
    initials: "ER",
    color: "bg-blue-500",
  },
  {
    id: 2,
    name: "Michael Thompson",
    email: "michael.t@assnani.com",
    phone: "555-0202",
    status: "active",
    addedDate: "2025-10-15",
    lastActive: "1 day ago",
    initials: "MT",
    color: "bg-teal-500",
  },
  {
    id: 3,
    name: "Sarah Kim",
    email: "sarah.k@assnani.com",
    phone: "555-0203",
    status: "inactive",
    addedDate: "2025-09-20",
    lastActive: "2 weeks ago",
    initials: "SK",
    color: "bg-blue-600",
  },
];

export const statCards = [
  {
    title: "Total Patients",
    value: "1,234",
    change: "+12.5%",
    icon: <FiUsers className="text-blue-600 text-xl" />,
    iconBg: "bg-blue-50",
    trend: "up",
  },
  {
    title: "Appointments",
    value: "856",
    change: "+8.3%",
    icon: <FiCalendar className="text-green-600 text-xl" />,
    iconBg: "bg-green-50",
    trend: "up",
  },
  {
    title: "Scans Processed",
    value: "2,891",
    change: "+15.7%",
    icon: <FiFileText className="text-purple-600 text-xl" />,
    iconBg: "bg-purple-50",
    trend: "up",
  },
  {
    title: "Revenue",
    value: "$45,230",
    change: "+23.1%",
    icon: <FiDollarSign className="text-orange-600 text-xl" />,
    iconBg: "bg-orange-50",
    trend: "up",
  },
];

export const data = {
  labels: ["January", "February", "March", "April", "May", "June", "July"],
  datasets: [
    {
      label: "Patient Growth",
      data: [20, 30, 25, 40, 60, 65, 70], // The Y-values
      fill: false,
      borderColor: "rgb(75, 192, 192)",
      tension: 0.4, // Smooths the line
    },
  ],
};
export // 2. Define the chart options (optional, for customization)
const options: ChartOptions<"line"> = {
  responsive: true,
  plugins: {
    legend: {
      position: "top", // Position the legend at the top
    },
    title: {
      display: true,
      text: "Patients Growth Analytics", // Chart title
    },
  },

  scales: {
    x: {
      title: {
        display: true,
        text: "Month",
      },
    },
    y: {
      title: {
        display: true,
        text: "Value",
      },
      min: 0,
      max: 100,
    },
  },
};

export const reports = [
  {
    title: "Raw Data Export",
    date: "2024-05-02",
    size: "12.4 MB",
    type: "File" as const,
    fileUrl: "/report.pdf",
  },

  {
    title: "Patient Satisfaction Survey",
    date: "2024-01-10",
    size: "0.8 MB",
    type: "PDF" as const,
  },
  {
    title: "Quarterly Inventory Audit",
    date: "2024-01-05",
    size: "4.1 MB",
    type: "Excel" as const,
  },
  {
    title: "Staff Performance Review",
    date: "2024-01-02",
    size: "2.2 MB",
    type: "PDF" as const,
  },
];

export const fallbackAppointments: Appointment[] = [
  {
    id: 1,
    name: "John Smith",
    type: "Consultation",
    time: "09:00 AM",
    status: "Confirmed",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    type: "Follow-up",
    time: "10:00 AM",
    status: "Confirmed",
  },
  {
    id: 3,
    name: "Michael Brown",
    type: "Checkup",
    time: "02:00 PM",
    status: "Pending",
  },
];

export const fallbackDays: Day[] = [
  {
    day: "Monday",
    time: [
      "09:00 AM",
      "10:00 AM",
      "11:00 AM",
      "02:00 PM",
      "03:00 PM",
      "04:00 PM",
    ],
  },
  {
    day: "Tuesday",
    time: ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM"],
  },
  {
    day: "Wednesday",
    time: ["09:00 AM", "10:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"],
  },
  { day: "Thursday", time: [] },
  { day: "Friday", time: ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM"] },
  { day: "Saturday", time: ["09:00 AM", "10:00 AM", "11:00 AM"] },
  { day: "Sunday", time: [] },
];

export const initialNotifications = [
  {
    id: 1,
    icon: <LuCalendar />,
    title: "Appointment Confirmed",
    desc: "Your appointment with Dr. Sarah Johnson is confirmed for Dec 15, 2025 at 10:00 AM",
    time: "2 hours ago",
    isRead: false,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    id: 2,
    icon: <LuClock />,
    title: "Appointment Reminder",
    desc: "You have an appointment tomorrow with Dr. Emily Rodriguez",
    time: "1 day ago",
    isRead: false,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    id: 3,
    icon: <LuActivity />,
    title: "Scan Results Ready",
    desc: "Your X Ray scan results are now available",
    time: "3 days ago",
    isRead: true,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
];

export const fallbackHistory: MedicalHistoryItem[] = [
  {
    title: "Hypertension",
    doctorName: "Dr. Sarah Johnson",
    date: "2025-12-08",
    type: "Consultation",
    description: "Blood pressure elevated. Prescribed medication.",
    attachments: ["blood-test-results.pdf"],
  },
  {
    title: "Annual Checkup",
    doctorName: "Dr. Emily Rodriguez",
    date: "2025-11-20",
    type: "Lab Test",
    description: "All tests within normal range.",
    attachments: ["lab-results.pdf", "x-ray.jpg"],
  },
  {
    title: "Chest X-Ray",
    doctorName: "Dr. Robert Anderson",
    date: "2025-10-15",
    type: "Scan",
    description: "No abnormalities detected.",
    attachments: ["chest-xray.jpg"],
  },
];

export const fallbackPatients: Patient[] = [
  {
    id: 1,
    name: "John Smith",
    phone: "555-0101",
    age: 45,
    gender: "Male",
    status: "Active",
    lastVisit: "2025-12-10",
    doctor: "Dr. Chen",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    phone: "555-0102",
    age: 32,
    gender: "Female",
    status: "Active",
    lastVisit: "2025-12-12",
    doctor: "Dr. Williams",
  },
  {
    id: 3,
    name: "Michael Brown",
    phone: "555-0103",
    age: 58,
    gender: "Male",
    status: "Pending",
    lastVisit: "2025-11-28",
    doctor: "Dr. Chen",
  },
  {
    id: 4,
    name: "Emma Davis",
    phone: "555-0104",
    age: 28,
    gender: "Female",
    status: "Active",
    lastVisit: "2025-12-13",
    doctor: "Dr. Smith",
  },
  {
    id: 5,
    name: "David Wilson",
    phone: "555-0105",
    age: 62,
    gender: "Male",
    status: "Inactive",
    lastVisit: "2025-10-15",
    doctor: "Dr. Williams",
  },
  {
    id: 6,
    name: "Lisa Anderson",
    phone: "555-0106",
    age: 41,
    gender: "Female",
    status: "Active",
    lastVisit: "2025-12-11",
    doctor: "Dr. Chen",
  },
];

export const fallbackPatientsScan = [
  { id: 1, name: "John Smith" },
  { id: 2, name: "Sarah Johnson" },
  { id: 3, name: "Michael Brown" },
  { id: 4, name: "Emma Davis" },
  { id: 5, name: "David Wilson" },
  { id: 6, name: "Lisa Anderson" },
];

export const studentDoctors: StudentDoctor[] = [
  {
    id: 1,
    name: "Ahmed Khaled",
    university: "Cairo Dental University",
    year: "Year 5",
    supervisor: "Dr. John Doe",
    status: "Active",
    dentalUniversityProofImage:
      "https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 2,
    name: "Mariam Ali",
    university: "Alexandria University",
    year: "Year 4",
    supervisor: "Dr. John Doe",
    status: "Pending Review",
    dentalUniversityProofImage:
      "https://images.unsplash.com/photo-1598257006458-087169a1f08d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 3,
    name: "Youssef Hassan",
    university: "Ain Shams University",
    year: "Year 5",
    supervisor: "Dr. John Doe",
    status: "Active",
    dentalUniversityProofImage:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80",
  },
];
