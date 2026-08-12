import { QuizProvider } from '@/components/providers/QuizProvider';

export default function LeituraLayout({ children }: { children: React.ReactNode }) {
  return <QuizProvider>{children}</QuizProvider>;
}
