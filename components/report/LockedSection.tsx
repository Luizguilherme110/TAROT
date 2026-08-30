import { LockSimple } from '@phosphor-icons/react/dist/ssr';

/**
 * The blurred block under a locked heading, drawn as bars rather than text.
 *
 * Two earlier versions put real sentences here — first one hard-coded pair
 * repeated under every heading, then a plausible pair per section. Neither was
 * the paid copy (that is server-side in lib/report-full.ts and never sent to a
 * reader who has not paid), but both created the same problem: CSS blur is two
 * clicks from being switched off, and anyone who inspected the element found
 * readable Portuguese sitting under a padlock. It reads as a leak whether or
 * not it is one, and "trust me, that text is fake" is not something a reader
 * can verify.
 *
 * Bars remove the question. The blurred shape is the same, the DOM holds no
 * readable characters at all, and from now on any legible text found under a
 * padlock is a real bug rather than something to squint at.
 */
const PLACEHOLDER_WIDTHS: Record<string, readonly number[]> = {
  pontos: [96, 88, 54],
  nascimento: [92, 76],
  meses: [98, 62],
  amor: [94, 84, 47],
  carreira: [90, 58],
  cartas: [97, 71],
  final: [86, 49],
};

export type LockedVariant = keyof typeof PLACEHOLDER_WIDTHS;

// A row inside the consolidated "locked" panel in ReportView, not its own boxed
// card - three near-identical bordered boxes stacked in a row read as filler,
// one panel with internal rhythm reads as a single considered block.
export function LockedSection({
  title,
  hint,
  variant,
}: {
  title: string;
  hint?: string;
  variant: LockedVariant;
}) {
  // Per-section widths, so the locked rows keep the ragged look of real
  // paragraphs instead of seven identical blocks.
  const widths = PLACEHOLDER_WIDTHS[variant];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display text-lg text-parchment-100">{title}</h3>
        <LockSimple size={16} weight="bold" className="shrink-0 text-gold-400" />
      </div>
      {hint ? <p className="mt-1 text-xs text-gold-400">{hint}</p> : null}
      <div aria-hidden="true" className="mt-4 select-none space-y-2.5 blur-[5px]">
        {widths.map((width, index) => (
          <div
            key={index}
            className="h-2.5 rounded-full bg-parchment-400/25"
            style={{ width: `${width}%` }}
          />
        ))}
      </div>
    </div>
  );
}
