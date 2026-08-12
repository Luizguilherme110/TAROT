import Image from 'next/image';
import Link from 'next/link';

export function LandingHero() {
  return (
    <section className="relative flex min-h-[100dvh] flex-col justify-center px-6 pt-16 pb-12 md:px-12 lg:grid lg:grid-cols-2 lg:items-center lg:gap-12">
      <div className="relative z-10 max-w-xl">
        <p className="mb-4 font-display text-sm uppercase tracking-[0.18em] text-gold-400">Tarot + IA</p>
        <h1 className="font-display text-4xl leading-[1.05] tracking-tight text-parchment-100 md:text-5xl lg:text-6xl">
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
      <div className="relative mt-12 aspect-[4/5] w-full overflow-hidden rounded-2xl lg:mt-0">
        <Image
          src="/images/hero-celestial.jpg"
          alt="Ilustração mística de uma carta de tarot iluminada sob um céu estrelado"
          fill
          priority
          sizes="(min-width: 1024px) 40vw, 90vw"
          className="object-cover"
        />
      </div>
    </section>
  );
}
