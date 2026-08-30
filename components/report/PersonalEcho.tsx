import { Check } from '@phosphor-icons/react/dist/ssr';
import type { Report } from '@/lib/report-types';

// The single strongest objection to a paid tarot reading is "this is the same
// text everybody gets". Quoting the reader's own selections back verbatim,
// above the paywall, answers that before it is raised.
//
// Laid out as stacked rows rather than a two-column grid: on a phone a label and
// a full sentence side by side leaves the answer three words wide.
export function PersonalEcho({
  entries,
  name,
  paid,
}: {
  entries: Report['personalized_echo'];
  name: string;
  paid: boolean;
}) {
  if (entries.length === 0) return null;

  return (
    <section className="mt-10 rounded-2xl border border-white/10 bg-ink-900/60 p-5 sm:p-6">
      <p className="font-display text-xs uppercase tracking-[0.16em] text-gold-400">
        Lido a partir das suas respostas
      </p>
      <ul className="mt-4 space-y-3">
        {entries.map((entry) => (
          <li key={entry.label} className="flex items-start gap-3">
            <Check size={15} weight="bold" className="mt-[3px] shrink-0 text-gold-400" />
            <p className="text-sm leading-snug text-parchment-400">
              <span className="text-parchment-100">{entry.label}: </span>
              {entry.answer}
            </p>
          </li>
        ))}
      </ul>
      <p className="mt-5 border-t border-white/10 pt-4 text-sm leading-snug text-parchment-400">
        {paid
          ? `Cada seção abaixo foi montada a partir de uma dessas respostas — nenhuma outra leitura combina exatamente essas.`
          : `Foi isso que ${name} respondeu — e é só a partir disso que a leitura abaixo foi montada.`}
      </p>
    </section>
  );
}
