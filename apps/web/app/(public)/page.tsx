import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/marketplace/HeroSection';
import { CategoryBar } from '@/components/marketplace/CategoryBar';
import { TrendingCollections } from '@/components/marketplace/TrendingCollections';
import { HowItWorks } from '@/components/marketplace/HowItWorks';
import { ProductShowcase } from '@/components/marketplace/ProductShowcase';
import { IntegrationBar } from '@/components/marketplace/IntegrationBar';
import { ProfitCalculator } from '@/components/marketplace/ProfitCalculator';
import { Testimonials } from '@/components/marketplace/Testimonials';
import { WhyChoose } from '@/components/marketplace/WhyChoose';
import { GlobalReach } from '@/components/marketplace/GlobalReach';
import { BlogPreview } from '@/components/marketplace/BlogPreview';
import { FinalCTA } from '@/components/marketplace/FinalCTA';

export default function LandingPage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <CategoryBar />
        <TrendingCollections />
        <HowItWorks />
        <ProductShowcase />
        <IntegrationBar />
        <ProfitCalculator />
        <Testimonials />
        <WhyChoose />
        <GlobalReach />
        <BlogPreview />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
