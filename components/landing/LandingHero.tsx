import Link from 'next/link';
import { GenieAvatar } from '@/components/genie/GenieAvatar';

export function LandingHero() {
  return (
    <section className="relative flex min-h-[100dvh] flex-col justify-center px-6 pt-16 pb-12 md:px-12 lg:grid lg:grid-cols-2 lg:items-center lg:gap-12">
      <div className="relative z-10 max-w-xl">
        <p className="mb-4 font-display text-sm uppercase tracking-[0.18em] text-gold-400">Tarot + IA</p>
        <h1 className="font-display text-3xl leading-[1.1] tracking-tight text-parchment-100 md:text-4xl lg:text-5xl">
          Uma leitura criada a partir das suas respostas.
        </h1>
        <p className="mt-6 max-w-[42ch] text-base leading-relaxed text-parchment-400">
          Responda algumas perguntas sobre o seu momento. A partir delas, uma IA monta uma leitura simbólica só sua.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/leitura"
            className="inline-flex items-center justify-center rounded-full bg-gold-400 px-8 py-4 font-display text-sm font-medium text-ink-950 transition-transform duration-300 ease-out hover:-translate-y-0.5 hover:bg-gold-300 active:translate-y-0 active:scale-[0.98]"
          >
            Descobrir minha leitura
          </Link>
        </div>
      </div>
      <div className="relative mt-12 flex flex-col items-center gap-4 lg:mt-0">
        <GenieAvatar mood="neutral" size="lg" priority />
        <p className="max-w-[26ch] text-center font-display text-base text-parchment-400">
          Sou seu guia nessa leitura. Vamos começar?
        </p>
      </div>
    </section>
  );
}
