import { Route, Routes } from "react-router";
import PatientRegistration from "./pages/register-page/PatientRegistration";
import Registration from "./pages/register-page/Registration";
import DoctorRegistration from "./pages/register-page/DoctorRegistration";
import StudentRegistration from "./pages/register-page/StudentRegistration";
import ReceptionistRegistration from "./pages/register-page/ReceptionistRegistration";
import HomePage from "./pages/home-page/HomePage";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/registration" element={<Registration />}>
          <Route
            path="patient-registration"
            index
            element={<PatientRegistration />}
          />
          <Route
            path="doctor-registration"
            index
            element={<DoctorRegistration />}
          />
          <Route
            path="student-registration"
            index
            element={<StudentRegistration />}
          />
          <Route
            path="receptionist-registration"
            index
            element={<ReceptionistRegistration />}
          />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
