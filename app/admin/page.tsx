import { Star, CurrencyDollar, DownloadSimple } from '@phosphor-icons/react/dist/ssr';
import {
  getFunnelCounts,
  getRecentFeedback,
  getRecentPayments,
  getPaidCount,
  getOpenAnswers,
  getChoiceBreakdown,
} from '@/lib/admin-metrics';
import { LogoutButton } from '@/components/admin/LogoutButton';
import { TestSessionButtons } from '@/components/admin/TestSessionButtons';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const [funnel, feedback, payments, paidCount, openAnswers, choices] = await Promise.all([
    getFunnelCounts(),
    getRecentFeedback(),
    getRecentPayments(),
    getPaidCount(),
    getOpenAnswers(),
    getChoiceBreakdown(),
  ]);
  const top = funnel[0]?.count ?? 0;
  const funnelWithPayments = [...funnel, { event: 'paid', label: 'Comprou a leitura completa', count: paidCount }];
  const revenueCents = payments.reduce((sum, row) => sum + (row.amount_cents ?? 0), 0);

  return (
    <div className="min-h-dvh bg-ink-950 px-6 py-12 md:px-12">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-3">
        <h1 className="font-display text-2xl text-parchment-100">Analytics</h1>
        <div className="flex items-center gap-2">
          {/* A plain link, not a fetch: the browser saves the file straight from
              the response, and the admin cookie rides along because /admin/export
              sits under the cookie's path. */}
          <a
            href="/admin/export"
            className="flex items-center gap-2 rounded-full border border-gold-400/40 px-4 py-2 text-sm text-gold-400 transition-colors duration-200 hover:border-gold-400 hover:text-parchment-100"
          >
            <DownloadSimple size={16} weight="bold" />
            Exportar CSV
          </a>
          <LogoutButton />
        </div>
      </div>

      <TestSessionButtons />

      <section className="mx-auto mt-12 max-w-4xl">
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

      {/* The reader's own sentences, which is what ad copy gets written from —
          so this sits above the aggregates rather than below them. */}
      <section className="mx-auto mt-12 max-w-4xl">
        <h2 className="font-display text-sm uppercase tracking-[0.18em] text-gold-400">
          O que escreveram ({openAnswers.length})
        </h2>
        {openAnswers.length === 0 ? (
          <p className="mt-4 text-sm text-parchment-400">
            Nenhuma resposta escrita ainda. Elas aparecem aqui assim que alguém responder o quiz.
          </p>
        ) : (
          <div className="mt-4 flex flex-col gap-3">
            {openAnswers.map((row, index) => (
              <div key={index} className="rounded-2xl border border-white/10 bg-ink-900 p-5">
                <p className="text-xs leading-snug text-parchment-400">{row.prompt}</p>
                <p className="mt-2 leading-relaxed text-parchment-100">&ldquo;{row.answer}&rdquo;</p>
                <p className="mt-3 text-xs text-parchment-400/70">
                  {new Date(row.created_at).toLocaleString('pt-BR')}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto mt-12 max-w-4xl">
        <h2 className="font-display text-sm uppercase tracking-[0.18em] text-gold-400">
          Respostas de escolha
        </h2>
        {choices.length === 0 ? (
          <p className="mt-4 text-sm text-parchment-400">Nenhuma resposta ainda.</p>
        ) : (
          <div className="mt-4 flex flex-col gap-3">
            {choices.map((question) => (
              <div key={question.questionId} className="rounded-2xl border border-white/10 bg-ink-900 p-5">
                <div className="flex items-baseline justify-between gap-4">
                  <p className="text-sm leading-snug text-parchment-100">{question.prompt}</p>
                  <p className="shrink-0 text-xs text-parchment-400">{question.total} resp.</p>
                </div>
                <div className="mt-4 flex flex-col gap-2">
                  {question.options.map((option) => (
                    <div key={option.label}>
                      <div className="flex items-baseline justify-between gap-3">
                        <p className="text-sm text-parchment-400">{option.label}</p>
                        <p className="shrink-0 font-display text-sm text-gold-400">
                          {option.share}%{' '}
                          <span className="text-xs text-parchment-400">({option.count})</span>
                        </p>
                      </div>
                      <div className="mt-1 h-1 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full bg-gold-400/70" style={{ width: `${option.share}%` }} />
                      </div>
                    </div>
                  ))}
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
