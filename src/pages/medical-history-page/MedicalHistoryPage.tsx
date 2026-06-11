import MedicalHistoryInPatient from "@/components/medical-history-in-patient/MedicalHistoryInPatient";
import type { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import MedicalHistoryInDoctorDashboard from "../doctor-pages/patients/MedicalHistory";

const MedicalHistory = () => {
  const role = useSelector((state: RootState) => state.auth.role);

  if (role == "doctor") {
    return <MedicalHistoryInDoctorDashboard />;
  }

  if (role == "patient") {
    return <MedicalHistoryInPatient />;
  }
};

export default MedicalHistory;
