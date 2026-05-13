import { Navigate } from "react-router";
import { useSelector } from "react-redux";

// Import all components individually
import AdminPage from "../pages/admin-page/AdminPage";
import AddUserPage from "../pages/add-user-page/AddUserPage";
import UsersPage from "../pages/users-page/UsersPage";
import VerifyDoctorsPage from "../pages/verify-doctors-page/VerifyDoctorsPage";
import AnalyticsPage from "../pages/analytics-page/AnalyticsPage";
import AIModelsPage from "../pages/ai-models-page/AIModelsPage";
import DoctorDashboard from "../pages/doctor-pages/dashboard/DoctorDashboard";
import Schedule from "../pages/doctor-pages/schedule/Schedule";
import AddTimeSlotPage from "../pages/add-time-slot-page/AddTimeSlotPage";
import Patients from "../pages/doctor-pages/patients/Patients";
import PatientDetails from "../pages/doctor-pages/patients/PatientDetails";
import MedicalHistory from "../pages/doctor-pages/patients/MedicalHistory";
import AddMedicalHistoryRecord from "../pages/doctor-pages/patients/AddMedicalHistoryRecord";
import Reports from "../pages/doctor-pages/reports/Reports";
import ManageSupervisioning from "../pages/doctor-pages/supervisioning/ManageSupervisioning";
import ViewSupervisioningRequest from "../pages/doctor-pages/supervisioning/ViewSupervisioningRequest";
import AssignStudentDoctor from "../pages/doctor-pages/supervisioning/AssignStudentDoctor";
import StudentRecordApprovals from "../pages/doctor-pages/supervisioning/StudentRecordApprovals";
import MedicalReportForm from "../components/Doctor/Reports/MedicalReportForm";
import ReceptionistAccess from "../components/Doctor/ReceptionistAccess/ReceptionistAccess";
import AddReceptionist from "../components/Doctor/ReceptionistAccess/AddReceptionist";
import Scan from "../pages/doctor-pages/Scan/Scan";
import ScanDetails from "../pages/doctor-pages/scans/ScanDetails";
import Notifications from "../pages/doctor-pages/notifications/Notifications";
import LearningSessions from "../pages/doctor-pages/learning-sessions/LearningSessions";
import CreateLearningSession from "../pages/doctor-pages/learning-sessions/CreateLearningSession";
import SessionDetails from "../pages/doctor-pages/learning-sessions/SessionDetails";
import StudentAppointments from "../pages/student-doctor-pages/appointments/StudentAppointments";
import StudentAppointmentDetails from "../pages/student-doctor-pages/appointments/StudentAppointmentDetails";
import StudentDoctorDashboard from "../pages/student-doctor-pages/dashboard/StudentDoctorDashboard";

import ContactSupervisor from "../pages/student-doctor-pages/supervisor/ContactSupervisor";
import CreateMedicalRecord from "../pages/student-doctor-pages/medical-records/CreateMedicalRecord";
import MedicalRecordDrafts from "../pages/student-doctor-pages/medical-records/MedicalRecordDrafts";
import ReceptionistDashboard from "../pages/receptionist-pages/dashboard/ReceptionistDashboard";
import ScheduleAppointment from "../pages/receptionist-pages/appointments/ScheduleAppointment";
import CheckIn from "../pages/receptionist-pages/appointments/CheckIn";
import RescheduleAppointment from "../pages/receptionist-pages/appointments/RescheduleAppointment";
import RegisterPatient from "../pages/receptionist-pages/patients/RegisterPatient";
import Settings from "../pages/doctor-pages/settings/Settings";
import ProfileSettings from "../components/Doctor/Settings/SettingsDetails/ProfileSettings";
import SecuritySettings from "../components/Doctor/Settings/SettingsDetails/SecuritySettings";
import NotificationPreferences from "../components/Doctor/Settings/SettingsDetails/NotificationPreferences";
import PatientPage from "../pages/patient-page/PatientPage";
import AppointmentsPage from "../pages/appointments-page/AppointmentsPage";
import DoctorsListPage from "../pages/doctors-list-page/DoctorsListPage";
import DoctorProfilePage from "../pages/doctor-profile-page/DoctorProfilePage";
import AppointmentsBookingPage from "../pages/appointments-booking-page/AppointmentsBookingPage";
import PatientProfilePage from "../pages/patient-profile-page/PatientProfilePage";
import EditPatientProfilePage from "../pages/edit-patient-profile-page/EditPatientProfilePage";
import ProfilePage from "../pages/profile-page/ProfilePage";

// ProtectedRoute component for role-based access control
export const ProtectedRoute = ({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: string[];
}) => {
  const { role } = useSelector(
    (state: {
      auth: {
        role: string;
        id: string | null;
        name: string | null;
        email: string | null;
      };
    }) => state.auth,
  );

  return allowedRoles.includes(role) ? (
    <>{children}</>
  ) : (
    <Navigate to="/" replace />
  );
};

// Role-based home page mapping
// eslint-disable-next-line react-refresh/only-export-components
export const homePageByRole = {
  patient: <PatientPage />,
  doctor: <DoctorDashboard />,
  studentDoctor: <StudentDoctorDashboard />,
  receptionist: <ReceptionistDashboard />,
  admin: <AdminPage />,
  // guest: <Landing />,
};

// Route element mappings
// eslint-disable-next-line react-refresh/only-export-components
export const routeElements = {
  // Patient routes
  "/patient": <PatientPage />,
  // Admin routes
  "/admin": <AdminPage />,
  users: <UsersPage />,
  "add-user": <AddUserPage />,
  "verify-doctors": <VerifyDoctorsPage />,
  analytics: <AnalyticsPage />,
  "ai-models": <AIModelsPage />,

  // Doctor routes
  "/doctor": <DoctorDashboard />,
  "doctor-schedule": <Schedule />,
  "add-time-slot": <AddTimeSlotPage />,
  "doctor-patients": <Patients />,
  "doctor-patients/:id": <PatientDetails />,
  "doctor-patients/:id/medical-history": <MedicalHistory />,
  "doctor-patients/:id/medical-history/add": <AddMedicalHistoryRecord />,
  "doctor-reports": <Reports />,
  "doctor-supervisioning": <ManageSupervisioning />,
  "doctor-supervisioning/view-request/:id": <ViewSupervisioningRequest />,
  "doctor-supervisioning/assign-student-doctor/:id": <AssignStudentDoctor />,
  "doctor-reports/generate-new-report": <MedicalReportForm />,
  "receptionist-access": <ReceptionistAccess />,
  "receptionist-access/add": <AddReceptionist />,
  "scan/upload": <Scan />,
  "scan/analysis/:scanId": <ScanDetails />,
  notification: <Notifications />,
  "doctor-appointments": <StudentAppointments />,
  "doctor-appointments/:id": <StudentAppointmentDetails />,
  "doctor-learning-sessions": <LearningSessions />,
  "doctor-learning-sessions/create": <CreateLearningSession />,
  "doctor-learning-sessions/:id": <SessionDetails />,
  "doctor/student-record-approvals": <StudentRecordApprovals />,

  // Student Doctor routes
  "/student-doctor": <StudentDoctorDashboard />,
  "student-notification": <Notifications />,
  "contact-supervisor": <ContactSupervisor />,
  "student-doctor/create-medical-record/:id": <CreateMedicalRecord />,
  "student-doctor/medical-record-drafts": <MedicalRecordDrafts />,

  // Receptionist routes
  "/receptionist": <ReceptionistDashboard />,
  "/receptionist/schedule-appointment": <ScheduleAppointment />,
  "/receptionist/:id/check-in": <CheckIn />,
  "/receptionist/reschedule/:id": <RescheduleAppointment />,
  "/receptionist/register-patient": <RegisterPatient />,

  // Settings routes
  settings: <Settings />,
  "student-settings": <Settings />,
  "": <ProfileSettings />,
  security: <SecuritySettings />,
  notifications: <NotificationPreferences />,

  // Public routes
  "/appointments": <AppointmentsPage />,
  "/doctors-list": <DoctorsListPage />,
  "/doctors-list/:id": <DoctorProfilePage />,
  "/appointments/booking/:id": <AppointmentsBookingPage />,
  "/patient-profile/:id": <PatientProfilePage />,
  "/patient-profile/edit/:id": <EditPatientProfilePage />,
  profile: <ProfilePage />,
};
