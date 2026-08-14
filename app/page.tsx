import { LandingHero } from '@/components/landing/LandingHero';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { TrustSection } from '@/components/landing/TrustSection';
import { FinalCta } from '@/components/landing/FinalCta';
import { RevealOnScroll } from '@/components/motion/RevealOnScroll';
import { CelestialBackdrop } from '@/components/motion/CelestialBackdrop';
import { TrackOnMount } from '@/components/analytics/TrackOnMount';

export default function LandingPage() {
  return (
    <>
      <TrackOnMount event="landing_view" />
      <CelestialBackdrop />
      <main className="relative">
        <LandingHero />
        <RevealOnScroll>
          <HowItWorks />
        </RevealOnScroll>
        <RevealOnScroll delay={0.1}>
          <TrustSection />
        </RevealOnScroll>
        <FinalCta />
      </main>
    </>
  );
}
