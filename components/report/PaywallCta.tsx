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
    const url = buildCaktoCheckoutUrl(getOrCreateSessionId());

    // Navigate in place. Cakto is configured to send the reader back to
    // /leitura/resultado once the card or PIX is approved, and the session id
    // and quiz answers now live in localStorage, so the returning page rebuilds
    // the same report and usePaymentStatus polls until the webhook lands.
    //
    // A second tab would also work, but much of this funnel arrives from Meta
    // ads inside the Instagram/Facebook in-app browser, where window.open is
    // unreliable and a stranded duplicate tab is worse than a plain redirect.
    window.location.href = url;
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
        {/* Price sits above the button: the reader should know the number before
            the thing that asks for the tap, not after they have already read past it. */}
        <div className="mt-8">
          <p className="text-sm text-parchment-400">
            De <span className="line-through">R$ 47,00</span> por
          </p>
          <p className="mt-1 font-display text-4xl leading-none text-gold-400">R$ 19,90</p>
          <p className="mt-2 text-xs text-parchment-400">Pagamento único. Sem assinatura.</p>
        </div>

        <button
          type="button"
          onClick={handleClick}
          className="mt-6 flex w-full items-center justify-center rounded-full bg-gold-400 px-8 py-4 font-display text-base font-medium text-ink-950 shadow-gold transition-transform duration-300 ease-out hover:-translate-y-0.5 hover:bg-gold-300 active:scale-[0.98] sm:mx-auto sm:w-auto sm:px-12"
        >
          Desbloquear leitura completa
        </button>

        <p className="mt-4 text-xs leading-snug text-parchment-400">
          Você respondeu a partir do que está vivendo agora. Daqui a algumas semanas suas respostas seriam
          outras — e a leitura também. Essa é a do seu momento de hoje.
        </p>
      </div>
    </section>
  );
}
