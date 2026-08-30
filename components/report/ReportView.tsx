'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';
import { LockSimple } from '@phosphor-icons/react/dist/ssr';
import type { QuizSession, Report } from '@/lib/report-types';
import { POSITION_LABEL } from '@/lib/tarot-cards';
import { GenieAvatar } from '@/components/genie/GenieAvatar';
import { CardFace } from '@/components/cards/CardFace';
import { FeedbackForm } from '@/components/feedback/FeedbackForm';
import { TeaserBlock } from './TeaserBlock';
import { LockedSection } from './LockedSection';
import { PaywallCta } from './PaywallCta';
import { PersonalEcho } from './PersonalEcho';
import { LeadCapture } from './LeadCapture';
import { usePaymentStatus } from './usePaymentStatus';
import { useFullReport } from './useFullReport';
import { DevtoolsNotice } from './DevtoolsNotice';

export function ReportView({
  report,
  session,
  sessionReady,
}: {
  report: Report;
  session: QuizSession;
  sessionReady: boolean;
}) {
  const paid = usePaymentStatus();
  const fullState = useFullReport(paid && sessionReady, session);
  const pointCount = report.strengths.length + report.tensions.length;
  const birthSign = report.personalized_echo.find((entry) => entry.label === 'Seu signo')?.answer;
  const presenteCard = report.spread.find((entry) => entry.position === 'presente');
  const futuroCard = report.spread.find((entry) => entry.position === 'futuro');

  return (
    <article className="mx-auto max-w-2xl px-6 py-16 md:px-0">
      <DevtoolsNotice paid={paid} />
      <div className="flex items-center gap-4">
        <GenieAvatar mood={report.genie_intro.mood} size="sm" priority />
        <p className="font-display text-lg leading-snug text-parchment-100">{report.genie_intro.line}</p>
      </div>
      <p className="mt-8 font-display text-xs uppercase tracking-[0.16em] text-gold-400">
        {paid ? 'Sua leitura completa' : 'Prévia da sua leitura'}
      </p>
      <h1 className="mt-3 font-display text-3xl leading-tight text-parchment-100 md:text-4xl">{report.title}</h1>
      <p className="mt-6 text-lg leading-relaxed text-parchment-400">{report.opening}</p>

      {/* Renders paid as well as unpaid. It used to be gated behind `!paid`,
          so the proof that the reading was built from this reader's own answers
          vanished at the exact moment they paid for it. */}
      <PersonalEcho entries={report.personalized_echo} name={report.reader_name} paid={paid} />

      <CardSpread spread={report.spread} paid={paid} />

      <TeaserBlock teaser={report.personalized_teaser} />

      {!paid && <LeadCapture />}

      {paid ? (
        <div className="mt-4">
          {fullState.status === 'ready' ? (
            <>
              <UnlockedSection title="Suas palavras" content={fullState.full.your_words} />
              <UnlockedSection title="Seu momento atual" content={report.current_moment} />
              <PointsSection strengths={report.strengths} tensions={report.tensions} />
              {fullState.full.birth_reading && (
                <UnlockedSection
                  title="O que sua data de nascimento revela"
                  content={fullState.full.birth_reading}
                />
              )}
              <UnlockedSection title="Próximos meses" content={fullState.full.months_ahead} />
              <UnlockedSection title="Amor e relacionamentos" content={fullState.full.love} />
              <UnlockedSection title="Carreira e dinheiro" content={fullState.full.career_money} />
              <UnlockedSection title="O que merece sua atenção" content={fullState.full.attention} />
              <UnlockedSection title="Possível ponto de alerta" content={fullState.full.warning} />
            </>
          ) : (
            <FullReportPlaceholder failed={fullState.status === 'error'} />
          )}
          <UnlockedSection
            title={report.sections[0]?.title ?? 'O que seu elemento revela'}
            content={report.sections[0]?.content ?? ''}
          />
          {presenteCard && (
            <UnlockedSection
              title={`Sua carta do Presente: ${presenteCard.card.name}`}
              content={presenteCard.reading}
            />
          )}
          {futuroCard && (
            <UnlockedSection
              title={`Sua carta do Futuro: ${futuroCard.card.name}`}
              content={futuroCard.reading}
            />
          )}
          {fullState.status === 'ready' && (
            <UnlockedSection title="Mensagem final" content={fullState.full.final_message} />
          )}
        </div>
      ) : (
        <>
          <UnlockedSection title="Seu momento atual" content={report.current_moment} />
          {/* Six rows, not ten. A taller stack of near-identical locks stops
              reading as withheld content and starts reading as a toll gate —
              and on a phone it was most of a screen of nothing but padlocks.
              Nothing is withheld by this: the paid branch above still renders
              every section, these titles just group them. */}
          <div className="mt-4 divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-ink-900 shadow-panel">
            <LockedSection title="Pontos fortes e pontos de atenção" hint={`${pointCount} pontos identificados`} />
            <LockedSection
              title="O que sua data de nascimento revela"
              hint={birthSign ? `Sua leitura de ${birthSign} e o seu número` : undefined}
            />
            <LockedSection title="Próximos meses" />
            <LockedSection title="Amor e relacionamentos" />
            <LockedSection title="Carreira e dinheiro" />
            <LockedSection
              title="Suas cartas do Presente e do Futuro, interpretadas"
              hint={
                futuroCard ? `Incluindo o que ${futuroCard.card.name} significa pra você` : undefined
              }
            />
            <LockedSection title="Mensagem final" />
          </div>
          <PaywallCta />
        </>
      )}

      <FeedbackForm />
    </article>
  );
}

function CardSpread({ spread, paid }: { spread: Report['spread']; paid: boolean }) {
  const reduce = useReducedMotion();

  if (spread.length === 0) return null;

  return (
    <div className="relative mt-10 overflow-hidden rounded-2xl border border-white/10">
      <Image
        src="/images/card-motif.jpg"
        alt=""
        fill
        sizes="(min-width: 768px) 42rem, 100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink-950/80 via-ink-950/70 to-ink-950/90" />
      <div className="relative grid grid-cols-3 gap-4 p-6">
        {spread.map((entry, index) => {
        // The card itself is always revealed, only its reading is gated.
        // A row of anonymous padlocks gives a reader nothing to be curious
        // about; seeing "A Torre" sit in their Futuro and not knowing what it
        // means is the thing that makes them want the rest.
        const meaningLocked = entry.position !== 'passado' && !paid;
        return (
          <motion.div
            key={entry.position}
            initial={reduce ? false : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-2"
          >
            <CardFace icon={entry.card.icon} />
            <p className="text-[11px] uppercase tracking-[0.1em] text-gold-400">{POSITION_LABEL[entry.position]}</p>
            <p className="text-center text-xs leading-snug text-parchment-100">{entry.card.name}</p>
            {meaningLocked && (
              <p className="flex items-center gap-1 text-center text-[10px] leading-tight text-parchment-400">
                <LockSimple size={10} weight="bold" className="shrink-0 text-gold-400" />
                significado
              </p>
            )}
          </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function UnlockedSection({ title, content }: { title: string; content: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.section
      initial={reduce ? false : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="mt-8 border-l-2 border-gold-400/40 py-1 pl-6"
    >
      <h2 className="font-display text-xl text-parchment-100">{title}</h2>
      <p className="mt-2 leading-relaxed text-parchment-400">{content}</p>
    </motion.section>
  );
}

// The paid sections arrive over the network now, so there is a real gap between
// "payment confirmed" and "text on screen". Showing the reader that their
// reading is being assembled beats an empty page or a spinner with no promise.
function FullReportPlaceholder({ failed }: { failed: boolean }) {
  if (failed) {
    return (
      <div className="mt-4 rounded-2xl border border-white/10 bg-ink-900 p-6">
        <p className="font-display text-base text-parchment-100">Sua leitura já está paga e guardada.</p>
        <p className="mt-2 text-sm leading-relaxed text-parchment-400">
          Não conseguimos carregar as seções completas agora. Atualize a página em alguns instantes — seu
          acesso continua liberado.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4 rounded-2xl border border-white/10 bg-ink-900 p-6">
      <p className="font-display text-base text-parchment-100">Montando sua leitura completa...</p>
      <div className="mt-4 flex flex-col gap-2" aria-hidden>
        {[100, 92, 78].map((width, index) => (
          <div
            key={index}
            className="h-2 animate-pulse rounded-full bg-white/10"
            style={{ width: `${width}%`, animationDelay: `${index * 120}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

// The locked list promises "{n} pontos identificados" and the paid report never
// showed them — the reader paid and the points they were told about were
// nowhere on the page.
function PointsSection({ strengths, tensions }: { strengths: string[]; tensions: string[] }) {
  if (strengths.length === 0 && tensions.length === 0) return null;

  return (
    <section className="mt-4 rounded-2xl border border-white/10 bg-ink-900 p-6">
      <h2 className="font-display text-lg leading-snug text-parchment-100">
        Pontos fortes e pontos de atenção
      </h2>
      {strengths.length > 0 && (
        <>
          <p className="mt-4 font-display text-xs uppercase tracking-[0.16em] text-gold-400">A seu favor</p>
          <ul className="mt-2 flex flex-col gap-2">
            {strengths.map((item) => (
              <li key={item} className="text-sm leading-relaxed text-parchment-400">
                {item}
              </li>
            ))}
          </ul>
        </>
      )}
      {tensions.length > 0 && (
        <>
          <p className="mt-5 font-display text-xs uppercase tracking-[0.16em] text-gold-400">Merece atenção</p>
          <ul className="mt-2 flex flex-col gap-2">
            {tensions.map((item) => (
              <li key={item} className="text-sm leading-relaxed text-parchment-400">
                {item}
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
