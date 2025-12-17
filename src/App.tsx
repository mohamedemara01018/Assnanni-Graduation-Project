


import { Route, Routes } from "react-router";

// public pages
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
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

const App = () => {
  const isRegister = true;

  return (
    <div className="min-h-screen w-full flex flex-col">

      {/* public header */}
      {/* <Header /> */}

      <main className="flex-1 w-full">
        <Routes>

          {/* public routes */}

          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/verify-doctor" element={<VerifyDoctorPage />} />


          {/* dashboards */}
          <Route path="/patient" element={<PatientPage />} />


          {/* authenticated routes
          <Route path="/home" element={<HomePage />}>
            <Route index element={<PatientDashboard />} />
            <Route path="browse-doctors" element={<BrowseDoctors />} />
          </Route> */}

        </Routes>
      </main>

      {/* <Footer /> */}
    </div>
  );
};

export default App;
