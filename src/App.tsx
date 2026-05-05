// Public pages
import Landing from "./pages/landing-page/Landing";
import Login from "./pages/login-page/Login";
import VerifyEmailPage from "./pages/verify-email-page/VerifyEmailPage";
import VerifyDoctorPage from "./pages/verify-doctor-page/VerifyDoctorPage";
import PublicLayout from "./components/public-layout/PublicLayout";
import RoleSelection from "./pages/auth/RoleSelection";
import Registration from "./pages/register-page/Registration";
import DoctorRegistration from "./components/Registration/DoctorRegistration";
import PatientRegistration from "./components/Registration/PatientRegistration";
import ReceptionistRegistration from "./components/Registration/ReceptionistRegistration";
import StudentRegistration from "./components/Registration/StudentRegistration";
import TermsPage from "./pages/terms-page/TermsPage";
import PrivacyPage from "./pages/privacy-page/PrivacyPage";
import FAQPage from "./pages/faq-page/FAQPage";
import SupportPage from "./pages/support-page/SupportPage";
import PasswordResetRequestPage from "./pages/password-reset-request-page/PasswordResetRequestPage";
import PasswordResetNewPage from "./pages/password-reset-new-page/PasswordResetNewPage";
import PasswordResetSuccessPage from "./pages/password-reset-success-page/PasswordResetSuccessPage";
import OnboardingPage from "./pages/onboarding-page/OnboardingPage";
import PatientProfilePage from "./pages/patient-profile-page/PatientProfilePage";
import EditPatientProfilePage from "./pages/edit-patient-profile-page/EditPatientProfilePage";
import AppointmentsPage from "./pages/appointments-page/AppointmentsPage";
import DoctorsListPage from "./pages/doctors-list-page/DoctorsListPage";
import DoctorProfilePage from "./pages/doctor-profile-page/DoctorProfilePage";
import AppointmentsBookingPage from "./pages/appointments-booking-page/AppointmentsBookingPage";

import { useEffect } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router";
import { toast, ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { roleRoutePaths, sharedRoutePaths } from "./constants/routeConstants";
import {
  ProtectedRoute,
  homePageByRole,
  routeElements,
} from "./constants/appConstants";
import AppointmentDetailsPage from "./pages/appointment-details-page/AppointmentDetailsPage";
import AdminPage from "./pages/admin-page/AdminPage";
import AnalyticsPage from "./pages/analytics-page/AnalyticsPage";
import { logout } from "./store/slices/auth/authSlice";
import Scan from "./pages/doctor-pages/Scan/Scan";
import AdminPage from "./pages/admin-page/AdminPage";
import UsersPage from "./pages/users-page/UsersPage";

const sessionWarningTime = 5 * 60 * 1000;
const sessionWarningToastId = "session-expiry-warning";

// Main application component that handles routing and global layouts
const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { role, token, expiresAt } = useSelector(
    (state: {
      auth: {
        token: string | null;
        role: string;
        id: string | null;
        name: string | null;
        email: string | null;
        expiresAt: number | null;
      };
    }) => state.auth,
  );
  console.log(role);
  useEffect(() => {
    if (!token || !expiresAt) {
      return;
    }

    const timeUntilExpiration = expiresAt - Date.now();
    const timeUntilWarning = timeUntilExpiration - sessionWarningTime;

    if (timeUntilExpiration <= 0) {
      dispatch(logout());
      toast.info("Your session has expired. Please login again.");
      navigate("/login", { replace: true });
      return;
    }

    const warningTimeout = window.setTimeout(
      () => {
        toast.warn(
          "Your session will expire in 5 minutes. Please login again.",
          {
            toastId: sessionWarningToastId,
          },
        );
      },
      Math.max(timeUntilWarning, 0),
    );

    const expirationTimeout = window.setTimeout(() => {
      dispatch(logout());
      toast.info("Your session has expired. Please login again.");
      navigate("/login", { replace: true });
    }, timeUntilExpiration);

    return () => {
      window.clearTimeout(warningTimeout);
      window.clearTimeout(expirationTimeout);
    };
  }, [dispatch, expiresAt, navigate, token]);

  return (
    <div className="min-h-screen w-full flex flex-col">
      <main className="grow">
        <Routes>
          {/* Home page based on role */}
          {homePageByRole[role as keyof typeof homePageByRole] ? (
            <Route
              path="/"
              element={homePageByRole[role as keyof typeof homePageByRole]}
            />
          ) : (
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<Landing />} />
            </Route>
          )}
          {/* --- Public Routes --- */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Landing />} />
            {/* Registration System */}
            {role === "guest" && <Route path="/login" element={<Login />} />}
            <Route path="/register">

              <Route index element={<RoleSelection />} />
              <Route element={<Registration />}>
                <Route path="patient-register" element={<PatientRegistration />} />
                <Route path="doctor-register" element={<DoctorRegistration />} />
                <Route path="student-register" element={<StudentRegistration />} />
                {role === "doctor" && (
                  <Route path="receptionist-register" element={<ReceptionistRegistration />} />
                )}

              </Route>
            </Route>

<<<<<<< HEAD
            <Route path="admin" element={<AdminPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
              /////
=======
            /////
>>>>>>> 42e88f14c7399776f43c05c714a6b65a8250fe7d
            {/* <Route path="/register-v2" element={<RegisterPage />} /> */}
            < Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/verify-doctor" element={<VerifyDoctorPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/password-reset" element={<PasswordResetRequestPage />} />
            <Route path="/password-reset/new" element={<PasswordResetNewPage />} />
            <Route path="/password-reset/success" element={<PasswordResetSuccessPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
          </Route>

          {/* Public routes (accessible without authentication) */}
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="/appointments/:id" element={<AppointmentDetailsPage />} />
          <Route path="/doctors-list" element={<DoctorsListPage />} />
          <Route path="/doctors-list/:id" element={<DoctorProfilePage />} />
          <Route path="/appointments/booking/:id" element={<AppointmentsBookingPage />} />
          <Route path="/patient-profile/:id" element={<PatientProfilePage />} />
          <Route path="/patient-profile/edit/:id" element={<EditPatientProfilePage />} />
          <Route path="/scan/upload" element={<Scan />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/users" element={<UsersPage />} />

          {/* Protected routes using configurations */}
          {Object.entries(roleRoutePaths).map(([roleName, routes]) =>
            routes.map((path) => (
              <Route
                key={`${roleName}-${path}`}
                path={path}
                element={
                  <ProtectedRoute allowedRoles={[roleName]}>
                    {routeElements[path as keyof typeof routeElements]}
                  </ProtectedRoute>
                }
              />
            )),
          )}

          {/* Shared protected routes */}
          {sharedRoutePaths.map(({ path, allowedRoles, children }) => (
            <Route
              key={path}
              path={path}
              element={
                <ProtectedRoute allowedRoles={allowedRoles}>
                  {routeElements[path as keyof typeof routeElements]}
                </ProtectedRoute>
              }
            >
              {children?.map((childPath) => (
                <Route
                  key={childPath}
                  path={childPath}
                  element={
                    routeElements[childPath as keyof typeof routeElements]
                  }
                />
              ))}
            </Route>
          ))}

          {/* Fallback - Redirect to home if route not found */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <ToastContainer />
    </div>
  );
};

export default App;
