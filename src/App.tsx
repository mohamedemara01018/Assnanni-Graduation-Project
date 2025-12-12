import { Route, Routes } from "react-router";
import PatientRegistration from "./pages/register-page/PatientRegistration";
import Registration from "./pages/register-page/Registration";
import DoctorRegistration from "./pages/register-page/DoctorRegistration";
import StudentRegistration from "./pages/register-page/StudentRegistration";
import ReceptionistRegistration from "./pages/register-page/ReceptionistRegistration";
import Login from "./pages/login-page/Login";
import Header from "./components/header/Header";
import Landing from "./pages/landing-page/Landing";
import Footer from "./components/footer/Footer";
import RegisterPage from "./pages/register-page-v2/RegisterPage";
import VerifyEmailPage from "./pages/verify-email-page/VerifyEmailPage";
import VerifyDoctorPage from "./pages/verify-doctor-page/VerifyDoctorPage";

const App = () => {
  return (
    <div className="min-h-screen w-full flex flex-col">
      <Header />

      <main className="flex-1 w-full">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/verify-doctor" element={<VerifyDoctorPage />} />


          <Route path="/register" element={<Registration />}>
            <Route index path="patient-register" element={<PatientRegistration />} />
            <Route path="doctor-register" element={<DoctorRegistration />} />
            <Route path="student-register" element={<StudentRegistration />} />
            <Route path="receptionist-register" element={<ReceptionistRegistration />} />
          </Route>
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default App;
