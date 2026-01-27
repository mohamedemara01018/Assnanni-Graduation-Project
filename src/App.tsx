

// Public pages
import Landing from "./pages/landing-page/Landing";
import Login from "./pages/login-page/Login";
import RegisterPage from "./pages/register-page-v2/RegisterPage";
import VerifyEmailPage from "./pages/verify-email-page/VerifyEmailPage";
import VerifyDoctorPage from "./pages/verify-doctor-page/VerifyDoctorPage";

// Authenticated Layout & Pages
import HomePage from "./routers/Home Page/HomePage";
import PatientDashboard from "./components/Patient/Dashboard/PatientDashboard";
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

const App = () => {
  // In a real app, this would come from a Context or Redux store
  const role: "doctor" | "patient" | "student" | "receptionist" = "doctor";

  return (
    <div className="min-h-screen w-full flex flex-col">
      <main className="flex-grow">
        <Routes>
          {/* --- Public Routes --- */}
          <Route path="/landing" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register-v2" element={<RegisterPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/verify-doctor" element={<VerifyDoctorPage />} />


          {/* dashboards */}
          <Route path="/patient" element={<PatientPage />} />

          {/* --- Old Registration System ---
          <Route path="/register" element={<Registration />}>
            <Route path="patient-register" element={<PatientRegistration />} />
            <Route path="doctor-register" element={<DoctorRegistration />} />
            <Route path="student-register" element={<StudentRegistration />} />
            <Route path="receptionist-register" element={<ReceptionistRegistration />} />
          </Route> */}

          {/* --- Authenticated Shared Layout --- */}
          <Route path="/" element={<HomePage />}>
            {/* Conditional Dashboard based on Role */}
            <Route
              index
              element={
                role === "doctor" ? <DoctorDashboard /> : <PatientDashboard />
              }
            />

            {/* Shared Routes */}
            <Route path="browse-doctors" element={<BrowseDoctors />} />
            <Route path="notification" element={<Notifications />} />

            {/* Doctor Specific Routes (You could protect these further) */}
            {role === "doctor" && (
              <>
                <Route path="doctor-schedule" element={<Schedule />} />
                <Route path="doctor-reports" element={<Reports />} />
                <Route path="scan" element={<Scan />} />
              </>
            )}
          </Route>

          {/* Fallback - Redirect to landing if route not found */}
          <Route path="*" element={<Navigate to="/landing" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;