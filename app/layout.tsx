import type { Metadata } from 'next';
import { Outfit, Manrope } from 'next/font/google';
import './globals.css';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit', display: 'swap' });
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope', display: 'swap' });

export const metadata: Metadata = {
  title: 'Sua Leitura de Tarot Personalizada',
  description: 'Uma leitura criada a partir das suas respostas, com IA e simbolismo do Tarot.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${outfit.variable} ${manrope.variable}`}>
      <body className="min-h-dvh bg-ink-950 text-parchment-100 font-body antialiased">
        {children}
      </body>
    </html>
  );
}
