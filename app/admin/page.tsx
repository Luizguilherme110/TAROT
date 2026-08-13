import { Star } from '@phosphor-icons/react/dist/ssr';
import { getFunnelCounts, getRecentFeedback } from '@/lib/admin-metrics';
import { LogoutButton } from '@/components/admin/LogoutButton';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const [funnel, feedback] = await Promise.all([getFunnelCounts(), getRecentFeedback()]);
  const top = funnel[0]?.count ?? 0;

  return (
    <div className="min-h-dvh bg-ink-950 px-6 py-12 md:px-12">
      <div className="mx-auto flex max-w-4xl items-center justify-between">
        <h1 className="font-display text-2xl text-parchment-100">Analytics</h1>
        <LogoutButton />
      </div>

      <section className="mx-auto mt-10 max-w-4xl">
        <h2 className="font-display text-sm uppercase tracking-[0.18em] text-gold-400">Funil</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {funnel.map((step, index) => {
            const previous = funnel[index - 1]?.count ?? step.count;
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
