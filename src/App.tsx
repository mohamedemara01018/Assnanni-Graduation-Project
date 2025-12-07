import { Route, Routes } from "react-router";
import PatientRegistration from "./pages/register-page/PatientRegistration";
import Registration from "./pages/register-page/Registration";
import DoctorRegistration from "./pages/register-page/DoctorRegistration";
import StudentRegistration from "./pages/register-page/StudentRegistration";
import ReceptionistRegistration from "./pages/register-page/ReceptionistRegistration";
import HomePage from "./pages/home-page/HomePage";
import Login from "./pages/login-page/Login";

const App = () => {
  return (
    <div className="w-screen max-w-7xl px-4 flex items-center justify-center h-screen" >
      < Routes >
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />}>
          <Route
            path="patient-register"
            index
            element={<PatientRegistration />}
          />
          <Route
            path="doctor-register"
            index
            element={<DoctorRegistration />}
          />
          <Route
            path="student-register"
            index
            element={<StudentRegistration />}
          />
          <Route
            path="receptionist-register"
            index
            element={<ReceptionistRegistration />}
          />
        </Route>
      </Routes >
    </div >
  );
};

export default App;
