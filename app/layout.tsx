import type { Metadata } from 'next';
import Script from 'next/script';
import { Outfit, Manrope } from 'next/font/google';
import './globals.css';
import { META_PIXEL_IDS, metaPixelSnippet } from '@/lib/analytics/meta-pixel';

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
        <Script id="meta-pixel" strategy="afterInteractive">
          {metaPixelSnippet}
        </Script>
        <noscript>
          {META_PIXEL_IDS.map((id) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={id}
              height="1"
              width="1"
              style={{ display: 'none' }}
              src={`https://www.facebook.com/tr?id=${id}&ev=PageView&noscript=1`}
              alt=""
            />
          ))}
        </noscript>
        {children}
      </body>
    </html>
  );
}
