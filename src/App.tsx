import { useEffect } from "react";
import {
  Navigate,
  Route,
  Routes,
  useNavigate,
  useLocation,
} from "react-router";
import { toast, ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";

// Layout
import PublicLayout from "./components/public-layout/PublicLayout";

// Public pages
import Landing from "./pages/landing-page/Landing";
import Login from "./pages/login-page/Login";
import VerifyEmailPage from "./pages/verify-email-page/VerifyEmailPage";
import VerifyDoctorPage from "./pages/verify-doctor-page/VerifyDoctorPage";
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

// Feature pages
import PatientProfilePage from "./pages/patient-profile-page/PatientProfilePage";
import EditPatientProfilePage from "./pages/edit-patient-profile-page/EditPatientProfilePage";
import AppointmentsPage from "./pages/appointments-page/AppointmentsPage";
import AppointmentDetailsPage from "./pages/appointment-details-page/AppointmentDetailsPage";
import AppointmentsBookingPage from "./pages/appointments-booking-page/AppointmentsBookingPage";
import DoctorsListPage from "./pages/doctors-list-page/DoctorsListPage";
import DoctorProfilePage from "./pages/doctor-profile-page/DoctorProfilePage";
import Scan from "./pages/doctor-pages/Scan/Scan";
import ChatbotWidget from "./components/chatbot/ChatbotWidget";

// Constants & helpers
import { roleRoutePaths, sharedRoutePaths } from "./constants/routeConstants";
import {
  ProtectedRoute,
  homePageByRole,
  routeElements,
} from "./constants/appConstants";
import { logout } from "./store/slices/auth/authSlice";
// (Removed unused imports that caused TS6133 build failures)

// ─── Constants ───────────────────────────────────────────────────────────────

const SESSION_WARNING_BEFORE_EXPIRY_MS = 5 * 60 * 1000;
const SESSION_WARNING_TOAST_ID = "session-expiry-warning";

// ─── Types ───────────────────────────────────────────────────────────────────

interface AuthState {
  token: string | null;
  role: string;
  id: string | null;
  name: string | null;
  email: string | null;
  expiresAt: number | null;
}

// ─── Hooks ───────────────────────────────────────────────────────────────────

function useEmailVerificationRedirect() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const needsVerification = Cookies.get("needsVerification");
    if (needsVerification === "true" && pathname !== "/verify-email") {
      navigate("/verify-email", { replace: true });
    }
  }, [pathname, navigate]);
}

function useSessionExpiry(token: string | null, expiresAt: number | null) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || !expiresAt) return;

    const timeUntilExpiry = expiresAt - Date.now();

    if (timeUntilExpiry <= 0) {
      dispatch(logout());
      toast.info("Your session has expired. Please login again.");
      navigate("/login", { replace: true });
      return;
    }

    const warningDelay = Math.max(
      timeUntilExpiry - SESSION_WARNING_BEFORE_EXPIRY_MS,
      0,
    );

    const warningTimer = window.setTimeout(() => {
      toast.warn("Your session will expire in 5 minutes. Please login again.", {
        toastId: SESSION_WARNING_TOAST_ID,
      });
    }, warningDelay);

    const expiryTimer = window.setTimeout(() => {
      dispatch(logout());
      toast.info("Your session has expired. Please login again.");
      navigate("/login", { replace: true });
    }, timeUntilExpiry);

    return () => {
      window.clearTimeout(warningTimer);
      window.clearTimeout(expiryTimer);
    };
  }, [dispatch, expiresAt, navigate, token]);
}

// ─── Route Groups ─────────────────────────────────────────────────────────────

function PublicRoutes({ role }: { role: string }) {
  return (
    <Route element={<PublicLayout />}>
      <Route path="/" element={<Landing />} />

      {role === "guest" && <Route path="/login" element={<Login />} />}

      <Route path="/register">
        <Route index element={<RoleSelection />} />
        <Route element={<Registration />}>
          <Route path="patient-register" element={<PatientRegistration />} />
          <Route path="doctor-register" element={<DoctorRegistration />} />
          <Route path="student-register" element={<StudentRegistration />} />
          {role === "doctor" && (
            <Route
              path="receptionist-register"
              element={<ReceptionistRegistration />}
            />
          )}
        </Route>
      </Route>

      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/verify-doctor" element={<VerifyDoctorPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/faq" element={<FAQPage />} />
      <Route path="/support" element={<SupportPage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />

      <Route path="/password-reset" element={<PasswordResetRequestPage />} />
      <Route path="/password-reset/new" element={<PasswordResetNewPage />} />
      <Route
        path="/password-reset/success"
        element={<PasswordResetSuccessPage />}
      />
    </Route>
  );
}

function FeatureRoutes() {
  return (
    <>
      <Route path="/appointments" element={<AppointmentsPage />} />
      <Route path="/appointments/:id" element={<AppointmentDetailsPage />} />
      <Route
        path="/appointments/booking/:id"
        element={<AppointmentsBookingPage />}
      />
      <Route path="/doctors-list" element={<DoctorsListPage />} />
      <Route path="/doctors-list/:id" element={<DoctorProfilePage />} />
      <Route path="/patient-profile/:id" element={<PatientProfilePage />} />
      <Route
        path="/patient-profile/edit/:id"
        element={<EditPatientProfilePage />}
      />
      <Route path="/scan/upload" element={<Scan />} />
    </>
  );
}

function RoleProtectedRoutes() {
  return (
    <>
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
    </>
  );
}

function SharedProtectedRoutes() {
  return (
    <>
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
              element={routeElements[childPath as keyof typeof routeElements]}
            />
          ))}
        </Route>
      ))}
    </>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

const App = () => {
  const { role, token, expiresAt } = useSelector(
    (state: { auth: AuthState }) => state.auth,
  );

  useEmailVerificationRedirect();
  useSessionExpiry(token, expiresAt);

  const homePage = homePageByRole[role as keyof typeof homePageByRole];

  return (
    <div className="min-h-screen w-full flex flex-col">
      <main className="grow">
        <Routes>
          {/* Home: role-based dashboard or public landing */}
          <Route path="/" element={homePage ?? <PublicLayout />}>
            {!homePage && <Route index element={<Landing />} />}
          </Route>

          {PublicRoutes({ role })}
          {FeatureRoutes()}
          {RoleProtectedRoutes()}
          {SharedProtectedRoutes()}

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <ChatbotWidget />
      <ToastContainer />
    </div>
  );
};

export default App;
