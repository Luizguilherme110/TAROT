import { LockSimple } from '@phosphor-icons/react/dist/ssr';

/**
 * Blurred filler, one pair per locked row.
 *
 * There used to be a single hard-coded pair repeated under all seven titles, and
 * CSS blur is two clicks from being switched off. Anyone who did that read the
 * same two sentences under "Amor e relacionamentos", "Carreira e dinheiro" and
 * every other heading, and the honest conclusion was that the whole report is
 * one generic text — which costs more sales than it protects.
 *
 * None of this is the paid copy: that lives in lib/report-full.ts, server-side,
 * and is never sent to a reader who has not paid. These lines only describe the
 * shape of what each section covers, so unblurring them finds something
 * plausible and specific rather than proof of filler. They promise nothing.
 */
const PLACEHOLDER_LINES = {
  pontos: [
    'Duas forças que você usa sem perceber, e o preço silencioso que cada uma cobra quando ninguém está olhando.',
    'O ponto que mais se repetiu nas suas respostas, nomeado sem rodeio.',
  ],
  nascimento: [
    'O que o seu signo explica sobre o jeito que você reage quando alguma coisa aperta.',
    'O número que sai da sua data, e a tarefa que ele costuma trazer nesta fase.',
  ],
  meses: [
    'O que tende a se mover primeiro, e o que ainda vai levar tempo mesmo que você force.',
    'O sinal de que a virada começou, pra ele não passar batido.',
  ],
  amor: [
    'O que está realmente em jogo no seu campo afetivo agora, além do que aparece na superfície.',
    'A conversa que muda o rumo dessa história, e o motivo de ela vir sendo adiada.',
  ],
  carreira: [
    'Onde a sua energia está vazando no trabalho sem virar resultado nenhum.',
    'A mudança pequena que rende mais do que a decisão grande que você vem pensando.',
  ],
  cartas: [
    'O que a sua carta do Presente revela sobre o ponto exato em que você está.',
    'E o que a do Futuro começa a desenhar a partir daqui.',
  ],
  final: [
    'A frase que fecha a sua leitura, montada a partir do que você mesmo(a) trouxe.',
    'E o que fazer com tudo isso já a partir desta semana.',
  ],
} as const;

export type LockedVariant = keyof typeof PLACEHOLDER_LINES;

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
  return (
    <div className="p-6">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display text-lg text-parchment-100">{title}</h3>
        <LockSimple size={16} weight="bold" className="shrink-0 text-gold-400" />
      </div>
      {hint ? <p className="mt-1 text-xs text-gold-400">{hint}</p> : null}
      <div aria-hidden="true" className="mt-3 select-none space-y-2 blur-[6px]">
        {PLACEHOLDER_LINES[variant].map((line, index) => (
          <p key={index} className="leading-relaxed text-parchment-400">
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}
