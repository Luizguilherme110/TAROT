import { LockSimple } from '@phosphor-icons/react/dist/ssr';

const PLACEHOLDER_LINES = [
  'Isso aparece de um jeito que só faz sentido quando você lê a frase inteira, ligada ao que você mesmo trouxe pra essa leitura.',
  'Um padrão que se repete há mais tempo do que parece, esperando ser nomeado.',
];

export function LockedSection({ title, hint }: { title: string; hint?: string }) {
  return (
    <section className="relative mt-10 overflow-hidden rounded-2xl border border-white/10 bg-ink-900 p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-xl text-parchment-100">{title}</h2>
        <LockSimple size={18} weight="bold" className="shrink-0 text-gold-400" />
      </div>
      {hint ? <p className="mt-1 text-xs text-gold-400">{hint}</p> : null}
      <div aria-hidden="true" className="mt-3 select-none space-y-2 blur-[6px]">
        {PLACEHOLDER_LINES.map((line, index) => (
          <p key={index} className="leading-relaxed text-parchment-400">
            {line}
          </p>
        ))}
      </div>
    </section>
  );
}
