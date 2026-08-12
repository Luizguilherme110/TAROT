import { LandingHero } from '@/components/landing/LandingHero';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { TrustSection } from '@/components/landing/TrustSection';
import { FinalCta } from '@/components/landing/FinalCta';
import { RevealOnScroll } from '@/components/motion/RevealOnScroll';

export default function LandingPage() {
  return (
    <main>
      <LandingHero />
      <RevealOnScroll>
        <HowItWorks />
      </RevealOnScroll>
      <RevealOnScroll delay={0.1}>
        <TrustSection />
      </RevealOnScroll>
      <FinalCta />
    </main>
  );
}
