export function HowItWorks() {
  return (
    <section className="px-6 py-20 md:px-12 md:py-28">
      <h2 className="max-w-2xl font-display text-3xl leading-tight tracking-tight text-parchment-100 md:text-4xl">
        Como funciona, do jeito mais simples possível.
      </h2>
      <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-ink-900 to-gold-400/10 p-8 md:col-span-2">
          <span className="font-display text-4xl text-gold-400">01</span>
          <h3 className="mt-4 font-display text-xl text-parchment-100">Você responde</h3>
          <p className="mt-2 max-w-[46ch] text-parchment-400">
            Perguntas rápidas sobre o seu momento agora: amor, decisões, dinheiro, fases da vida. Sem enrolação.
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-ink-900 p-8">
          <span className="font-display text-4xl text-gold-400">02</span>
          <h3 className="mt-4 font-display text-xl text-parchment-100">A IA monta sua leitura</h3>
          <p className="mt-2 text-parchment-400">
            Suas respostas viram uma leitura simbólica, escrita pra você, não um texto genérico.
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-ink-900 p-8 md:col-span-3">
          <span className="font-display text-4xl text-gold-400">03</span>
          <h3 className="mt-4 font-display text-xl text-parchment-100">Você recebe, na hora</h3>
          <p className="mt-2 max-w-[60ch] text-parchment-400">
            Um relatório gratuito aparece na tela em minutos, com pontos fortes, pontos de atenção e um gancho pro
            que vem a seguir.
          </p>
        </div>
      </div>
    </section>
  );
}
