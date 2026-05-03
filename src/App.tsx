// Public pages
import Landing from "./pages/landing-page/Landing";
import Login from "./pages/login-page/Login";
import VerifyEmailPage from "./pages/verify-email-page/VerifyEmailPage";
import VerifyDoctorPage from "./pages/verify-doctor-page/VerifyDoctorPage";

// Authenticated Layout & Pages
// // import HomePage from "./routers/Home Page/HomePage";
// // import BrowseDoctors from "./components/HomePage/BrowseDoctors";
import DoctorDashboard from "./pages/doctor-pages/dashboard/DoctorDashboard";
import Schedule from "./pages/doctor-pages/schedule/Schedule";
import Reports from "./pages/doctor-pages/reports/Reports";
import Scan from "./pages/doctor-pages/Scan/Scan";
import Notifications from "./pages/doctor-pages/notifications/Notifications";
import ReceptionistAccess from "./components/Doctor/ReceptionistAccess/ReceptionistAccess";
import AddReceptionist from "./components/Doctor/ReceptionistAccess/AddReceptionist";
import MedicalReportForm from "./components/Doctor/Reports/MedicalReportForm";

// Registration (Old system - kept as requested)

import { Navigate, Route, Routes } from "react-router";
import PatientPage from "./pages/patient-page/PatientPage";
import PublicLayout from "./components/public-layout/PublicLayout";
import Settings from "./pages/doctor-pages/settings/Settings";
import ProfileSettings from "./components/Doctor/Settings/SettingsDetails/ProfileSettings";
import SecuritySettings from "./components/Doctor/Settings/SettingsDetails/SecuritySettings";
import NotificationPreferences from "./components/Doctor/Settings/SettingsDetails/NotificationPreferences";
import AppointmentsPage from "./pages/appointments-page/AppointmentsPage";
import DoctorsListPage from "./pages/doctors-list-page/DoctorsListPage";
import DoctorProfilePage from "./pages/doctor-profile-page/DoctorProfilePage";

import Patients from "./pages/doctor-pages/patients/Patients";
import StudentDoctorDashboard from "./pages/student-doctor-pages/dashboard/StudentDoctorDashboard";
import StudentNotifications from "./pages/student-doctor-pages/notifications/StudentNotifications";
import StudentSettings from "./pages/student-doctor-pages/settings/Settings";
import StudentAppointments from "./pages/student-doctor-pages/appointments/StudentAppointments";
import StudentAppointmentDetails from "./pages/student-doctor-pages/appointments/StudentAppointmentDetails";
import ContactSupervisor from "./pages/student-doctor-pages/supervisor/ContactSupervisor";
import ReceptionistDashboard from "./pages/receptionist-pages/dashboard/ReceptionistDashboard";
import AppointmentsBookingPage from "./pages/appointments-booking-page/AppointmentsBookingPage";
import ScheduleAppointment from "./pages/receptionist-pages/appointments/ScheduleAppointment";
import CheckIn from "./pages/receptionist-pages/appointments/CheckIn";
import RescheduleAppointment from "./pages/receptionist-pages/appointments/RescheduleAppointment";
import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import AdminPage from "./pages/admin-page/AdminPage";
// import RegisterPage from "./pages/register-page-v2/RegisterPage";
import TermsPage from "./pages/terms-page/TermsPage";
import PrivacyPage from "./pages/privacy-page/PrivacyPage";
import FAQPage from "./pages/faq-page/FAQPage";
import SupportPage from "./pages/support-page/SupportPage";
import UsersPage from "./pages/users-page/UsersPage";
import AddUserPage from "./pages/add-user-page/AddUserPage";
import VerifyDoctorsPage from "./pages/verify-doctors-page/VerifyDoctorsPage";
import PasswordResetRequestPage from "./pages/password-reset-request-page/PasswordResetRequestPage";
import PasswordResetNewPage from "./pages/password-reset-new-page/PasswordResetNewPage";
import PasswordResetSuccessPage from "./pages/password-reset-success-page/PasswordResetSuccessPage";
import AnalyticsPage from "./pages/analytics-page/AnalyticsPage";
import AIModelsPage from "./pages/ai-models-page/AIModelsPage";
import OnboardingPage from "./pages/onboarding-page/OnboardingPage";
import PatientProfilePage from "./pages/patient-profile-page/PatientProfilePage";
import EditPatientProfilePage from "./pages/edit-patient-profile-page/EditPatientProfilePage";
import RoleSelection from "./pages/auth/RoleSelection";
import Registration from "./pages/register-page/Registration";
import DoctorRegistration from "./components/Registration/DoctorRegistration";
import PatientRegistration from "./components/Registration/PatientRegistration";
import ReceptionistRegistration from "./components/Registration/ReceptionistRegistration";
import StudentRegistration from "./components/Registration/StudentRegistration";
import AddTimeSlotPage from "./pages/add-time-slot-page/AddTimeSlotPage";
import PatientDetails from "./pages/doctor-pages/patients/PatientDetails";
import MedicalHistory from "./pages/doctor-pages/patients/MedicalHistory";
import AddMedicalHistoryRecord from "./pages/doctor-pages/patients/AddMedicalHistoryRecord";
// import PatientDashboard from "./components/Patient/Dashboard/PatientDashboard";

const App = () => {
  const role = useSelector(
    (state: { auth: { role: string } }) => state.auth.role,
  );
  console.log(role);
  return (
    <div className="min-h-screen w-full flex flex-col">
      <main className="grow">
        {/* Set home page according to the role */}
        <Routes>
          {role === "patient" ? (
            <Route path="/" element={<PatientPage />} />
          ) : role === "doctor" ? (
            <Route path="/" element={<DoctorDashboard />} />
          ) : role === "studentDoctor" ? (
            <Route path="/" element={<StudentDoctorDashboard />} />
          ) : role === "receptionist" ? (
            <Route path="/" element={<ReceptionistDashboard />} />
          ) : role === "admin" ? (
            <Route path="/" element={<AdminPage />} />
          ) : (
            ""
          )}
          {/* --- Public Routes --- */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            {/* Registration System */}
            <Route path="/register">
              <Route index element={<RoleSelection />} />
              <Route element={<Registration />}>
                <Route
                  path="patient-register"
                  element={<PatientRegistration />}
                />
                <Route path="doctor-register" element={<DoctorRegistration />} />
                <Route
                  path="student-register"
                  element={<StudentRegistration />}
                />
                <Route
                  path="receptionist-register"
                  element={<ReceptionistRegistration />}
                />
              </Route>
            </Route>
            /////
            {/* <Route path="/register-v2" element={<RegisterPage />} /> */}
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/verify-doctor" element={<VerifyDoctorPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route
              path="/password-reset"
              element={<PasswordResetRequestPage />}
            />
            <Route
              path="/password-reset/new"
              element={<PasswordResetNewPage />}
            />
            <Route
              path="/password-reset/success"
              element={<PasswordResetSuccessPage />}
            />
            <Route path="/onboarding" element={<OnboardingPage />} />
          </Route>

          {/* patient dashboards */}
          {/* <Route path="/patient" element={<PatientPage />} /> */}
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="/doctors-list" element={<DoctorsListPage />} />
          <Route path="/doctors-list/:id" element={<DoctorProfilePage />} />
          <Route
            path="/appointments/booking/:id"
            element={<AppointmentsBookingPage />}
          />
          <Route path="/patient-profile/:id" element={<PatientProfilePage />} />
          <Route
            path="/patient-profile/edit/:id"
            element={<EditPatientProfilePage />}
          />

          {/* admin dashboards  */}
          <Route path="/admin" element={<AdminPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="add-user" element={<AddUserPage />} />
          <Route path="verify-doctors" element={<VerifyDoctorsPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="ai-models" element={<AIModelsPage />} />

          {/* doctor dashboards */}
          <Route path="/doctor" element={<DoctorDashboard />} />

          {/* student doctor dashboards */}
          <Route path="/student-doctor" element={<StudentDoctorDashboard />} />

          {/* receptionist dashboards */}
          <Route path="/receptionist" element={<ReceptionistDashboard />} />
          <Route
            path="/receptionist/schedule-appointment"
            element={<ScheduleAppointment />}
          />
          <Route
            path="/receptionist/check-in"
            element={<CheckIn />}
          />
          <Route
            path="/receptionist/reschedule/:id"
            element={<RescheduleAppointment />}
          />

          {/* --- Authenticated Shared Layout --- */}
          {/* {role === "guest" && <Route path="/" element={<HomePage />} />} */}
          {/* Conditional Dashboard based on Role */}

          {/* Shared dashboard Routes */}
          {/* <Route path="doctors-list" element={<BrowseDoctors />} />  */}
          <Route path="doctor-schedule" element={<Schedule />} />
          <Route path="add-time-slot" element={<AddTimeSlotPage />} />
          <Route path="doctor-patients" element={<Patients />} />
          <Route path="doctor-patients/:id" element={<PatientDetails />} />
          <Route
            path="doctor-patients/:id/medical-history"
            element={<MedicalHistory />}
          />
          <Route
            path="doctor-patients/:id/medical-history/add"
            element={<AddMedicalHistoryRecord />}
          />
          <Route path="doctor-reports" element={<Reports />} />
          <Route
            path="doctor-reports/generate-new-report"
            element={<MedicalReportForm />}
          />
          <Route path="receptionist-access" element={<ReceptionistAccess />} />
          <Route path="receptionist-access/add" element={<AddReceptionist />} />
          <Route path="scan/upload" element={<Scan />} />
          <Route path="notification" element={<Notifications />} />
          <Route
            path="student-notification"
            element={<StudentNotifications />}
          />
          <Route
            path="doctor-appointments"
            element={<StudentAppointments />}
          />
          <Route
            path="doctor-appointments/:id"
            element={<StudentAppointmentDetails />}
          />
          <Route path="contact-supervisor" element={<ContactSupervisor />} />

          <Route path="student-settings" element={<StudentSettings />}>
            <Route index element={<ProfileSettings />} />
            <Route path="security" element={<SecuritySettings />} />
            <Route path="notifications" element={<NotificationPreferences />} />
          </Route>

          <Route path="settings" element={<Settings />}>
            <Route index element={<ProfileSettings />} />
            <Route path="security" element={<SecuritySettings />} />
            <Route path="notifications" element={<NotificationPreferences />} />
          </Route>

          {/* Fallback - Redirect to landing if route not found */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <ToastContainer />
    </div>
  );
};

export default App;
