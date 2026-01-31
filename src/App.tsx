// Public pages
import Landing from "./pages/landing-page/Landing";
import Login from "./pages/login-page/Login";
import RegisterPage from "./pages/register-page-v2/RegisterPage";
import VerifyEmailPage from "./pages/verify-email-page/VerifyEmailPage";
import VerifyDoctorPage from "./pages/verify-doctor-page/VerifyDoctorPage";

// Authenticated Layout & Pages
import HomePage from "./routers/Home Page/HomePage";
import BrowseDoctors from "./components/HomePage/BrowseDoctors";
import DoctorDashboard from "./components/Doctor/Dashboard/DoctorDashboard";
import Schedule from "./components/Doctor/Schedule/Schedule";
import Reports from "./components/Doctor/Reports/Reports";
import Scan from "./components/Doctor/Scan/Scan";
import Notifications from "./components/Doctor/Notifications/Notifications";

// Registration (Old system - kept as requested)
import Registration from "./pages/register-page/Registration";
import PatientRegistration from "./pages/register-page/PatientRegistration";
import DoctorRegistration from "./pages/register-page/DoctorRegistration";
import StudentRegistration from "./pages/register-page/StudentRegistration";
import ReceptionistRegistration from "./pages/register-page/ReceptionistRegistration";
import { Navigate, Route, Routes } from "react-router";
import PatientPage from "./pages/patient-page/PatientPage";
import PublicLayout from "./components/public-layout/PublicLayout";
import Settings from "./components/Doctor/Settings/Settings";
import ProfileSettings from "./components/Doctor/Settings/SettingsDetails/ProfileSettings";
import SecuritySettings from "./components/Doctor/Settings/SettingsDetails/SecuritySettings";
import NotificationPreferences from "./components/Doctor/Settings/SettingsDetails/NotificationPreferences";
import Patients from "./components/Doctor/Patients/Patients";
import StudentDoctorDashboard from "./components/Student Doctor/Dashboard/StudentDoctorDashboard";
import StudentNotifications from "./components/Student Doctor/Notifications/StudentNotifications";
import StudentSettings from "./components/Student Doctor/Settings/Settings";
import AppointmentsPage from "./pages/appointments-page/AppointmentsPage";
import DoctorsListPage from "./pages/doctors-list-page/DoctorsListPage";
import DoctorProfilePage from "./pages/doctor-profile-page/DoctorProfilePage";

const App = () => {
  // In a real app, this would come from a Context or Redux store
  let role: string = "doctor";
  role = "studentDoctor";

  return (
    <div className="min-h-screen w-full flex flex-col">
      <main className="flex-grow">
        <Routes>
          {/* --- Public Routes --- */}
          <Route element={<PublicLayout />}>
            <Route path="/landing" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register-v2" element={<RegisterPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/verify-doctor" element={<VerifyDoctorPage />} />
          </Route>
          {/* dashboards */}
          <Route path="/patient" element={<PatientPage />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="/doctors-list" element={<DoctorsListPage />} />
          <Route path="/doctors-list/:id" element={<DoctorProfilePage />} />

          {/* authenticated routes
          <Route path="/home" element={<HomePage />}>
            <Route index element={<PatientDashboard />} />
            <Route path="browse-doctors" element={<BrowseDoctors />} />
          </Route> */}

          {/* old registration system */}
          <Route path="/register" element={<Registration />}>
            <Route path="patient-register" element={<PatientRegistration />} />
            <Route path="doctor-register" element={<DoctorRegistration />} />
            <Route path="student-register" element={<StudentRegistration />} />
            <Route
              path="receptionist-register"
              element={<ReceptionistRegistration />}
            />
          </Route>

          {/* --- Authenticated Shared Layout --- */}
          <Route path="/" element={<HomePage />}>
            {/* Conditional Dashboard based on Role */}
            <Route
              index
              element={
                role === "patient" ? (
                  <PatientPage />
                ) : role === "doctor" ? (
                  <DoctorDashboard />
                ) : role === "studentDoctor" ? (
                  <StudentDoctorDashboard />
                ) : (
                  ""
                )
              }
            />

            {/* Shared Routes */}
            <Route path="doctors-list" element={<BrowseDoctors />} />
            <Route path="doctor-schedule" element={<Schedule />} />
            <Route path="doctor-patients" element={<Patients />} />
            <Route path="doctor-reports" element={<Reports />} />
            <Route path="scan" element={<Scan />} />
            <Route path="notification" element={<Notifications />} />
            <Route
              path="student-notification"
              element={<StudentNotifications />}
            />
            <Route path="student-settings" element={<StudentSettings />}>
              <Route index element={<ProfileSettings />} />
              <Route path="security" element={<SecuritySettings />} />
              <Route
                path="notifications"
                element={<NotificationPreferences />}
              />
            </Route>
            <Route path="settings" element={<Settings />}>
              <Route index element={<ProfileSettings />} />
              <Route path="security" element={<SecuritySettings />} />
              <Route
                path="notifications"
                element={<NotificationPreferences />}
              />
            </Route>
          </Route>

          {/* Fallback - Redirect to landing if route not found */}
          <Route path="*" element={<Navigate to="/landing" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
