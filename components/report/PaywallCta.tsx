'use client';

import { Check } from '@phosphor-icons/react/dist/ssr';
import { getOrCreateSessionId, trackEvent } from '@/lib/analytics/track';
import { buildCaktoCheckoutUrl } from '@/lib/cakto';

const DELIVERABLES = [
  'Próximos meses',
  'Amor e relacionamentos',
  'Carreira e dinheiro',
  'O que merece sua atenção',
  'Possível ponto de alerta',
  'Suas cartas do Presente e Futuro, reveladas',
];

export function PaywallCta() {
  function handleClick() {
    trackEvent('paywall_checkout_click');
    window.location.href = buildCaktoCheckoutUrl(getOrCreateSessionId());
  }

  return (
    <section className="mt-10 rounded-3xl bg-gradient-to-b from-gold-400/40 via-gold-400/10 to-transparent p-px shadow-gold">
      <div className="rounded-[calc(1.5rem-1px)] bg-ink-900 px-6 py-9 text-center sm:px-10">
        <p className="font-display text-xs uppercase tracking-[0.16em] text-gold-400">Leitura completa</p>
        <h2 className="mt-2 font-display text-2xl text-parchment-100">O que você ainda não viu</h2>
        <ul className="mx-auto mt-7 grid max-w-md grid-cols-1 gap-x-6 gap-y-3 text-left text-parchment-400 sm:grid-cols-2">
          {DELIVERABLES.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <Check size={16} weight="bold" className="mt-1 shrink-0 text-gold-400" />
              <span className="text-sm leading-snug">{item}</span>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={handleClick}
          className="mt-8 inline-flex items-center justify-center rounded-full bg-gold-400 px-10 py-4 font-display text-sm font-medium text-ink-950 shadow-gold transition-transform duration-300 ease-out hover:-translate-y-0.5 hover:bg-gold-300 active:scale-[0.98]"
        >
          Desbloquear leitura completa
        </button>
        <p className="mt-3 font-display text-lg text-gold-400">R$ 19,90</p>
        <p className="mt-2 text-xs leading-snug text-parchment-400">
          Essa leitura foi montada a partir do seu momento atual. Quanto mais tempo passa, menos ela reflete onde
          você está agora.
        </p>
      </div>
    </section>
  );
}
