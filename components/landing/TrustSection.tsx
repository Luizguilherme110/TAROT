import { ShieldCheck, Sparkle, LockKey } from '@phosphor-icons/react/dist/ssr';

const POINTS = [
  {
    icon: Sparkle,
    title: 'Leitura simbólica, não científica',
    body: 'Tarot e numerologia aqui são ferramentas de reflexão e autoconhecimento, não previsão garantida.',
  },
  {
    icon: ShieldCheck,
    title: 'Suas respostas moldam o resultado',
    body: 'Nada de texto genérico: a IA usa o que você escreveu de verdade.',
  },
  {
    icon: LockKey,
    title: 'Seus dados, protegidos',
    body: 'Usamos suas respostas só pra gerar sua leitura. Nada de venda de dados.',
  },
];

export function TrustSection() {
  return (
    <section className="border-t border-white/10 px-6 py-20 md:px-12 md:py-28">
      <h2 className="max-w-xl font-display text-2xl text-parchment-100 md:text-3xl">
        Transparência antes de qualquer coisa.
      </h2>
      <div className="mt-10 divide-y divide-white/10 border-t border-white/10">
        {POINTS.map(({ icon: Icon, title, body }) => (
          <div key={title} className="flex items-start gap-5 py-6">
            <Icon size={24} weight="light" className="mt-1 shrink-0 text-gold-400" />
            <div>
              <h3 className="font-display text-lg text-parchment-100">{title}</h3>
              <p className="mt-1 max-w-[60ch] text-parchment-400">{body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
