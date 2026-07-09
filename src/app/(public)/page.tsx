
import Navbar from '@/components/public/Navbar'
import HeroSection from '@/components/public/HeroSection'
import FeaturesSection from '@/components/public/FeaturesSection'
import TestimonialsSection from '@/components/public/TestimonialsSection'
import CTASection from '@/components/public/CTASection'
import Footer from '@/components/public/Footer'

export const metadata = {
  title: 'BoraPOS | The modern POS for Kenyan businesses',
  description: 'Manage sales, inventory, purchases and staff across multiple stores from one platform.',
}

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}