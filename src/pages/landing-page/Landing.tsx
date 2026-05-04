import FeaturesSection from "@/components/features-section/FeaturesSection";
import Hero from "@/components/hero-section/Hero";
import HowItWorkSection from "@/components/how-it-work-section/HowItWorkSection";
import PlatformDescription from "@/components/platform-description-section/PlatformDescription";
import TestimonialsSection from "@/components/testimonials-section/TestimonialsSection";
// import DoctorsListPage from "../doctors-list-page/DoctorsListPage";

// import TobNavbar from "@/components/tob-navbar/TobNavbar";

function Landing() {
  return (
    <div className="w-full mt-18">
      <Hero />
      <PlatformDescription />
      {/* {role === "guest" && <DoctorsListPage />} */}
      <FeaturesSection />
      <HowItWorkSection />
      <TestimonialsSection />
    </div>
  );
}

export default Landing;
