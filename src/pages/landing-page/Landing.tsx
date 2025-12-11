import FeaturesSection from '@/components/features-section/FeaturesSection'
import Hero from '@/components/hero-section/Hero'
import HowItWorkSection from '@/components/how-it-work-section/HowItWorkSection'
import PlatformDescription from '@/components/platform-description-section/PlatformDescription'
import TestimonialsSection from '@/components/testimonials-section/TestimonialsSection'


function Landing() {
    return (
        <div className='w-full'>
            <Hero />
            <PlatformDescription />
            <FeaturesSection />
            <HowItWorkSection />
            <TestimonialsSection />
        </div>
    )
}

export default Landing