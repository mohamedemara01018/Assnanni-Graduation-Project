import type {
  AppointmentFormData,
  AppointmentSummary,
  CheckInDetails,
} from "@/interfaces/receptionistInterfaces";

export const checkInDetails: CheckInDetails = {
  patientId: "P12345",
  patientName: "John Smith",
  status: "Waiting",
  doctorName: "Dr. Michael Chen",
  specialty: "Cardiologist",
  date: "Feb 6, 2026",
  time: "10:00 AM",
  appointmentType: "Follow-up Consultation",
  paymentMethod: "Cash",
  amount: 150,
};

export const appointmentSummary: AppointmentSummary = {
  patientName: "Sarah Johnson",
  doctorName: "Dr. Michael Chen",
  currentDate: "Feb 5, 2026",
  currentTime: "10:00 AM",
};

export const appointmentFormData: AppointmentFormData = {
  patientId: "1",
  patientName: "Sarah Johnson",
  doctorId: "",
  doctorName: "",
  date: "",
  time: "",
  reason: "",
  paymentMethod: "cash",
  fee: 180,
};
