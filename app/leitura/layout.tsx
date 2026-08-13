import { QuizProvider } from '@/components/providers/QuizProvider';
import { CelestialBackdrop } from '@/components/motion/CelestialBackdrop';

export default function LeituraLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CelestialBackdrop />
      <QuizProvider>{children}</QuizProvider>
    </>
  );
}
