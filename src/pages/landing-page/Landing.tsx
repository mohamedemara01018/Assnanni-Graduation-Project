import FeaturesSection from "@/components/features-section/FeaturesSection";
import Hero from "@/components/hero-section/Hero";
import HowItWorkSection from "@/components/how-it-work-section/HowItWorkSection";
import PlatformDescription from "@/components/platform-description-section/PlatformDescription";
import TestimonialsSection from "@/components/testimonials-section/TestimonialsSection";
import DoctorsListPage from "../doctors-list-page/DoctorsListPage";
import { useSelector } from "react-redux";
// import TobNavbar from "@/components/tob-navbar/TobNavbar";

function Landing() {
  const role = useSelector((state) => state.auth.role);

  return (
    <div className="w-full">
      <Hero />
      <PlatformDescription />
      {role === "guest" && <DoctorsListPage />}
      <FeaturesSection />
      <HowItWorkSection />
      <TestimonialsSection />
    </div>
  );
}

export default Landing;
