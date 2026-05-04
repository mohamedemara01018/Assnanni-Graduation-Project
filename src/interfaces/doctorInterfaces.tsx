export interface Schedule {
  appointmentId: number;
  patientName: string;
  specialty: string;
  time: string;
  status: string;
}

export interface Scan {
  id: number;
  patientName: string;
  scanType: string;
  uploadedAt: string;
}

export interface RecentPatient {
  id: number;
  name: string;
  imageUrl: string;
  lastInteractionDate: string;
}

export interface Receptionist {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: string;
  addedDate: string;
  lastActive: string;
  initials: string;
  color: string;
}

export interface Appointment {
  id: number;
  name: string;
  type: string;
  time: string;
  status: "Confirmed" | "Pending";
}

export interface Day {
  day: string;
  time: string[];
}

export interface MedicalHistoryItem {
  title: string;
  doctorName: string;
  date: string;
  type: string;
  description: string;
  attachments: string[];
}

export interface Patient {
  id: number;
  name: string;
  phone: string;
  age: number;
  gender: "Male" | "Female";
  status: "Active" | "Inactive" | "Pending";
  lastVisit: string;
  doctor: string;
}

export interface Receptionist {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: string;
  addedDate: string;
  lastActive: string;
  initials: string;
  color: string;
}

export interface ScanFormData {
  patientId: number;
  notes: string;
}

export type StudentDoctor = {
  id: number;
  name: string;
  university: string;
  year: string;
  supervisor: string;
  status: "Active" | "Pending Review";
  dentalUniversityProofImage: string;
};
