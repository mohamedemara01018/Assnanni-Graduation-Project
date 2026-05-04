export interface AppointmentData {
  id: number | string;
  name: string;
  desc: string;
  date: string;
  time: string;
  meetingType: "In-Person" | "Video Call" | "Phone Call";
  address?: string;
  status: "Upcoming" | "Completed" | "Cancelled";
  imageUrl?: string;
}

export interface Observation {
  id: number;
  doctorName: string;
  specialty: string;
  time: string;
  supervisor: string;
  status: string;
}

export interface Scan {
  id: number;
  type: string;
  caseStudyNum: string;
  note: string;
  status: string;
}

export interface Supervisor {
  name: string;
  specialty: string;
  imageUrl: string;
}
