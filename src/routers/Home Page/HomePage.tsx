import LandingScape from "@/components/HomePage/LandingScape";
import MainNavBar from "@/components/Navigation bars/MainNavBar";
import DoctorNav from "@/components/Navigation bars/Side Navigation/DoctorNav";
import PatientNav from "@/components/Navigation bars/Side Navigation/PatientNav";

import { Outlet } from "react-router";

const HomePage = () => {
  const isRegistered = true;
  let role = "patient";
  role = "doctor";
  return (
    <div className="flex justify-between">
      {isRegistered && (
        <div className="flex-1 relative p-4 max-sm:hidden bg-gray-100 mr-0 ">
          {role === "patient" ? <PatientNav /> : <DoctorNav />}
        </div>
      )}
      <div className="flex-4">
        <MainNavBar />
        {!isRegistered && <LandingScape />}
        {/* <BrowseDoctors /> */}
        <Outlet />
      </div>
    </div>
  );
};

export default HomePage;
