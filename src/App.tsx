import { Route, Routes } from "react-router";

// public pages
import Landing from "./pages/landing-page/Landing";
import Login from "./pages/login-page/Login";
import RegisterPage from "./pages/register-page-v2/RegisterPage";
import VerifyEmailPage from "./pages/verify-email-page/VerifyEmailPage";
import VerifyDoctorPage from "./pages/verify-doctor-page/VerifyDoctorPage";

// registration system
import Registration from "./pages/register-page/Registration";
import PatientRegistration from "./pages/register-page/PatientRegistration";
import DoctorRegistration from "./pages/register-page/DoctorRegistration";
import StudentRegistration from "./pages/register-page/StudentRegistration";
import ReceptionistRegistration from "./pages/register-page/ReceptionistRegistration";

// authenticated pages
import HomePage from "./routers/Home Page/HomePage";
import PatientDashboard from "./components/Patient/Dashboard/PatientDashboard";
import BrowseDoctors from "./components/HomePage/BrowseDoctors";
import PatientPage from "./pages/patient-page/PatientPage";
import DoctorDashboard from "./components/Doctor/Dashboard/DoctorDashboard";
<<<<<<< HEAD
import PublicLayout from "./components/public-layout/PublicLayout";
=======
import Schedule from "./components/Doctor/Schedule/Schedule";
import Reports from "./components/Doctor/Reports/Reports";
import Scan from "./components/Doctor/Scan/Scan";
import Notifications from "./components/Doctor/Notifications/Notifications";
>>>>>>> c844a3fbc6804fafd5233113fd50a2a3b082d2a0

const App = () => {
  let role = "doctor";
  role = "doctor";

  return (
    <div className="min-h-screen w-full flex flex-col">
      {/* public header */}
      {/* <Header /> */}


      <Routes>
        {/* public routes */}
        <Route element={<PublicLayout />}>
          <Route path="/landing" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/verify-doctor" element={<VerifyDoctorPage />} />
        </Route>

<<<<<<< HEAD

        {/* dashboards */}
        <Route path="/patient" element={<PatientPage />} />


        {/* authenticated routes
=======
          {/* dashboards */}
          <Route path="/patient" element={<PatientPage />} />

          {/* authenticated routes
>>>>>>> c844a3fbc6804fafd5233113fd50a2a3b082d2a0
          <Route path="/home" element={<HomePage />}>
            <Route index element={<PatientDashboard />} />
            <Route path="browse-doctors" element={<BrowseDoctors />} />
          </Route> */}

        {/* old registration system */}
        <Route path="/register" element={<Registration />}>
          <Route
            index
            path="patient-register"
            element={<PatientRegistration />}
          />
          <Route path="doctor-register" element={<DoctorRegistration />} />
          <Route path="student-register" element={<StudentRegistration />} />
          <Route
            path="receptionist-register"
            element={<ReceptionistRegistration />}
          />
        </Route>

        {/* authenticated routes */}
        <Route path="/" element={<HomePage />}>
          <Route
            index
            element={
              role === "patient" ? <PatientDashboard /> : <DoctorDashboard />
            }
          />
          <Route path="browse-doctors" element={<BrowseDoctors />} />
        </Route>
      </Routes>

<<<<<<< HEAD
=======
          {/* authenticated routes */}
          <Route path="/" element={<HomePage />}>
            <Route
              index
              element={
                role === "patient" ? (
                  <PatientDashboard />
                ) : role === "doctor" ? (
                  <DoctorDashboard />
                ) : (
                  ""
                )
              }
            />
            <Route path="browse-doctors" element={<BrowseDoctors />} />
            <Route path="doctor-schedule" element={<Schedule />} />
            <Route path="doctor-reports" element={<Reports />} />
            <Route path="scan" element={<Scan />} />
            <Route path="notification" element={<Notifications />} />
          </Route>
        </Routes>
      </main>
>>>>>>> c844a3fbc6804fafd5233113fd50a2a3b082d2a0

      {/* <Footer /> */}
    </div>
  );
};

export default App;
