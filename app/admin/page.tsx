import { Star, CurrencyDollar } from '@phosphor-icons/react/dist/ssr';
import { getFunnelCounts, getRecentFeedback, getRecentPayments, getPaidCount } from '@/lib/admin-metrics';
import { LogoutButton } from '@/components/admin/LogoutButton';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const [funnel, feedback, payments, paidCount] = await Promise.all([
    getFunnelCounts(),
    getRecentFeedback(),
    getRecentPayments(),
    getPaidCount(),
  ]);
  const top = funnel[0]?.count ?? 0;
  const funnelWithPayments = [...funnel, { event: 'paid', label: 'Comprou a leitura completa', count: paidCount }];
  const revenueCents = payments.reduce((sum, row) => sum + (row.amount_cents ?? 0), 0);

  return (
    <div className="min-h-dvh bg-ink-950 px-6 py-12 md:px-12">
      <div className="mx-auto flex max-w-4xl items-center justify-between">
        <h1 className="font-display text-2xl text-parchment-100">Analytics</h1>
        <LogoutButton />
      </div>

      <section className="mx-auto mt-10 max-w-4xl">
        <h2 className="font-display text-sm uppercase tracking-[0.18em] text-gold-400">Funil</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {funnelWithPayments.map((step, index) => {
            const previous = funnelWithPayments[index - 1]?.count ?? step.count;
            const stepConversion = previous > 0 ? Math.round((step.count / previous) * 100) : 100;
            const penetration = top > 0 ? Math.round((step.count / top) * 100) : 0;
            return (
              <div key={step.event} className="rounded-2xl border border-white/10 bg-ink-900 p-5">
                <p className="text-xs uppercase tracking-wide text-parchment-400">Etapa {index + 1}</p>
                <p className="mt-1 font-display text-base text-parchment-100">{step.label}</p>
                <p className="mt-3 font-display text-3xl text-gold-400">{step.count}</p>
                <p className="mt-1 text-xs text-parchment-400">
                  {index === 0 ? `${penetration}% penetração` : `${stepConversion}% da etapa anterior`}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto mt-12 max-w-4xl">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-sm uppercase tracking-[0.18em] text-gold-400">
            Pagamentos ({payments.length})
          </h2>
          <p className="flex items-center gap-1 font-display text-lg text-gold-400">
            <CurrencyDollar size={18} weight="bold" />
            {(revenueCents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
        </div>
        {payments.length === 0 ? (
          <p className="mt-4 text-sm text-parchment-400">Nenhum pagamento ainda.</p>
        ) : (
          <div className="mt-4 divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-ink-900">
            {payments.map((row) => (
              <div key={row.session_id} className="flex items-center justify-between gap-4 p-4">
                <div className="min-w-0">
                  <p className="truncate font-mono text-xs text-parchment-400">{row.session_id}</p>
                  {row.cakto_order_id && (
                    <p className="mt-0.5 truncate text-xs text-parchment-400/70">Pedido {row.cakto_order_id}</p>
                  )}
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-display text-sm text-gold-400">
                    {row.amount_cents != null
                      ? (row.amount_cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                      : '-'}
                  </p>
                  <p className="text-xs text-parchment-400">
                    {row.paid_at ? new Date(row.paid_at).toLocaleString('pt-BR') : '-'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto mt-12 max-w-4xl pb-16">
        <h2 className="font-display text-sm uppercase tracking-[0.18em] text-gold-400">
          Feedback ({feedback.length})
        </h2>
        {feedback.length === 0 ? (
          <p className="mt-4 text-sm text-parchment-400">Nenhum feedback ainda.</p>
        ) : (
          <div className="mt-4 flex flex-col gap-3">
            {feedback.map((row, index) => (
              <div key={index} className="rounded-2xl border border-white/10 bg-ink-900 p-5">
                <div className="flex items-center justify-between">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <Star
                        key={value}
                        size={16}
                        weight={row.rating !== null && value <= row.rating ? 'fill' : 'light'}
                        className={row.rating !== null && value <= row.rating ? 'text-gold-400' : 'text-parchment-400/30'}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-parchment-400">{new Date(row.created_at).toLocaleString('pt-BR')}</p>
                </div>
                {row.message && <p className="mt-3 text-sm leading-relaxed text-parchment-100">{row.message}</p>}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
