import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import Landing from "@/pages/landing-page/Landing";
// import MainNavBar from "@/components/Navigation bars/MainNavBar";
// import DoctorNav from "@/components/Navigation bars/Side Navigation/DoctorNav";
// import PatientNav from "@/components/Navigation bars/Side Navigation/PatientNav";

const HomePage = () => {
  return (
    <div>
      <Header />
      <Landing />
      <Footer />
    </div>
    // <div className="flex justify-between">
    //   {isRegistered && (
    //     <div className="flex-1 relative p-4 max-sm:hidden bg-gray-100 mr-0 ">
    //       {/* {role === "patient" ? <PatientNav /> : <DoctorNav />} */}
    //     </div>
    //   )}
    //   {/* <div className="flex-4"> */}
    //   <div>
    //     {/* <MainNavBar /> */}
    //     {isRegistered ? <Outlet /> : <LandingScape />}
    //     {!isRegistered && <BrowseDoctors />}
    //   </div>
    // </div>
  );
};

export default HomePage;
