export interface CheckInDetails {
  patientId: string;
  patientName: string;
  status: "Waiting" | "In Progress" | "Completed";
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  appointmentType: string;
  paymentMethod: "Cash" | "Online";
  amount: number;
}

export interface AppointmentSummary {
  patientName: string;
  doctorName: string;
  currentDate: string;
  currentTime: string;
}

export interface AppointmentFormData {
  patientId: string | number;
  patientName: string;
  doctorId: string | number;
  doctorName: string;
  date: string;
  time: string;
  reason: string;
  paymentMethod: "cash" | "online";
  fee: number;
}

export interface ReceptionistFormInput {
  fullName: string;
  email: string;
  phone: string;
  clinic: string;
  username: string;
  password?: string;
}
