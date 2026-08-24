
import Navbar from '@/components/public/Navbar'
import HeroSection from '@/components/public/HeroSection'
import FeaturesSection from '@/components/public/FeaturesSection'
import ServicesSection from '@/components/public/ServicesSection'
import BusinessTypesSection from '@/components/public/BusinessTypesSection'
import TestimonialsSection from '@/components/public/TestimonialsSection'
import CTASection from '@/components/public/CTASection'
import Footer from '@/components/public/Footer'

export const metadata = {
  title: 'PapoPOS | The modern POS for Kenyan businesses',
  description: 'Manage sales, inventory, purchases and staff across multiple stores from one platform.',
}

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ServicesSection />
        <BusinessTypesSection />
        <FeaturesSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}