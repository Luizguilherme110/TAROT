import { Check } from '@phosphor-icons/react/dist/ssr';

const DELIVERABLES = [
  'Próximos meses',
  'Amor e relacionamentos',
  'Carreira e dinheiro',
  'O que merece sua atenção',
  'Possível ponto de alerta',
  'Mensagem final personalizada',
];

export function PaywallCta() {
  return (
    <section className="mt-10 rounded-2xl border border-white/10 bg-ink-900 p-8 text-center">
      <h2 className="font-display text-2xl text-parchment-100">Sua Leitura Completa</h2>
      <ul className="mx-auto mt-6 flex max-w-sm flex-col gap-2 text-left text-parchment-400">
        {DELIVERABLES.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <Check size={16} weight="bold" className="mt-1 shrink-0 text-gold-400" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <button
        type="button"
        disabled
        className="mt-8 inline-flex items-center justify-center rounded-full bg-gold-400 px-8 py-4 font-display text-sm font-medium text-ink-950 opacity-60"
      >
        Desbloquear leitura completa
      </button>
      <p className="mt-3 text-sm text-gold-400">R$ 19,90</p>
      <p className="mt-1 text-xs text-parchment-400">O checkout chega na próxima etapa do projeto.</p>
    </section>
  );
}
