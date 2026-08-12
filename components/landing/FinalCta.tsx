import Link from 'next/link';

export function FinalCta() {
  return (
    <section className="border-t border-white/10 px-6 py-20 text-center md:px-12 md:py-28">
      <h2 className="mx-auto max-w-xl font-display text-3xl text-parchment-100 md:text-4xl">
        Veja o que sua leitura revela sobre o momento que você está vivendo.
      </h2>
      <Link
        href="/leitura"
        className="mt-8 inline-flex items-center justify-center rounded-full bg-gold-400 px-8 py-4 font-display text-sm font-medium text-ink-950 transition-transform duration-300 ease-out hover:-translate-y-0.5 hover:bg-gold-300 active:translate-y-0 active:scale-[0.98]"
      >
        Descobrir minha leitura
      </Link>
    </section>
  );
}
