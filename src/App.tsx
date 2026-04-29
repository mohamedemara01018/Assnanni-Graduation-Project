// Public pages
import Landing from "./pages/landing-page/Landing";
import Login from "./pages/login-page/Login";
import VerifyEmailPage from "./pages/verify-email-page/VerifyEmailPage";
import VerifyDoctorPage from "./pages/verify-doctor-page/VerifyDoctorPage";

// Authenticated Layout & Pages
// import HomePage from "./routers/Home Page/HomePage";
// import BrowseDoctors from "./components/HomePage/BrowseDoctors";
import DoctorDashboard from "./pages/doctor-pages/dashboard/DoctorDashboard";
import Schedule from "./pages/doctor-pages/schedule/Schedule";
import Reports from "./pages/doctor-pages/reports/Reports";
import Scan from "./pages/doctor-pages/Scan/Scan";
import Notifications from "./pages/doctor-pages/notifications/Notifications";

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
import ReceptionistDashboard from "./pages/receptionist-pages/dashboard/ReceptionistDashboard";
import AppointmentsBookingPage from "./pages/appointments-booking-page/AppointmentsBookingPage";
import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import AdminPage from "./pages/admin-page/AdminPage";
import RegisterPage from "./pages/register-page-v2/RegisterPage";
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
import PrescriptionsPage from "./pages/prescriptions-page/PrescriptionsPage";
import AppointmentDetailsPage from "./pages/appointment-details-page/AppointmentDetailsPage";

const App = () => {


  const role = useSelector(
    (state: { auth: { role: string } }) => state.auth.role,
  );



  return (
    <div className="min-h-screen w-full flex flex-col">
      <main className="grow">
        <Routes>

          {/* --- Public Routes --- */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register-v2" element={<RegisterPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/verify-doctor" element={<VerifyDoctorPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path='/password-reset' element={<PasswordResetRequestPage />} />
            <Route path='/password-reset/new' element={<PasswordResetNewPage />} />
            <Route path='/password-reset/success' element={<PasswordResetSuccessPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
          </Route>

          {/* patient dashboards */}
          <Route path="/patient" element={<PatientPage />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="/appointments/:id" element={<AppointmentDetailsPage />} />
          <Route path="/doctors-list" element={<DoctorsListPage />} />
          <Route path="/doctors-list/:id" element={<DoctorProfilePage />} />
          <Route path="/appointments/booking/:id" element={<AppointmentsBookingPage />} />
          <Route path="/patient-profile/:id" element={<PatientProfilePage />} />
          <Route path="/patient-profile/edit/:id" element={<EditPatientProfilePage />} />
          <Route path="/prescriptions" element={<PrescriptionsPage />} />

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

          {/* --- Authenticated Shared Layout --- */}
          {/* {role === "guest" && <Route path="/" element={<HomePage />} />} */}
          {/* Conditional Dashboard based on Role */}

          {/* <Route
            path="/"
            element={
              role === "patient" ? (
                <PatientPage />
              ) : role === "doctor" ? (
                <DoctorDashboard />
              ) : role === "studentDoctor" ? (
                <StudentDoctorDashboard />
              ) : (
                role === "receptionist" && <ReceptionistDashboard />
              )
            }
          /> */}

          {/* Shared dashboard Routes */}
          {/* <Route path="doctors-list" element={<BrowseDoctors />} />  */}
          <Route path="doctor-schedule" element={<Schedule />} />
          <Route path="doctor-patients" element={<Patients />} />
          <Route path="doctor-reports" element={<Reports />} />
          <Route path="scan/upload" element={<Scan />} />
          <Route path="notification" element={<Notifications />} />
          <Route path="student-notification" element={<StudentNotifications />} />
          <Route path="student-appointments" element={<StudentAppointments />} />


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
