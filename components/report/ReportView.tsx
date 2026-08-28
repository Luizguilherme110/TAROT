'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';
import type { Report } from '@/lib/report-types';
import { POSITION_LABEL } from '@/lib/tarot-cards';
import { GenieAvatar } from '@/components/genie/GenieAvatar';
import { CardFace } from '@/components/cards/CardFace';
import { FeedbackForm } from '@/components/feedback/FeedbackForm';
import { TeaserBlock } from './TeaserBlock';
import { LockedSection } from './LockedSection';
import { PaywallCta } from './PaywallCta';
import { usePaymentStatus } from './usePaymentStatus';

export function ReportView({ report }: { report: Report }) {
  const pointCount = report.strengths.length + report.tensions.length;
  const paid = usePaymentStatus();
  const presenteCard = report.spread.find((entry) => entry.position === 'presente');
  const futuroCard = report.spread.find((entry) => entry.position === 'futuro');

  return (
    <article className="mx-auto max-w-2xl px-6 py-16 md:px-0">
      <div className="flex items-center gap-4">
        <GenieAvatar mood={report.genie_intro.mood} size="sm" priority />
        <p className="font-display text-lg leading-snug text-parchment-100">{report.genie_intro.line}</p>
      </div>
      <p className="mt-8 font-display text-xs uppercase tracking-[0.16em] text-gold-400">
        {paid ? 'Sua leitura completa' : 'Prévia da sua leitura'}
      </p>
      <h1 className="mt-3 font-display text-3xl leading-tight text-parchment-100 md:text-4xl">{report.title}</h1>
      <p className="mt-6 text-lg leading-relaxed text-parchment-400">{report.opening}</p>

      <CardSpread spread={report.spread} paid={paid} />

      <TeaserBlock teaser={report.personalized_teaser} />

      {paid ? (
        <div className="mt-4">
          <UnlockedSection title="Seu momento atual" content={report.current_moment} />
          <UnlockedSection title="Próximos meses" content={report.full.months_ahead} />
          <UnlockedSection title="Amor e relacionamentos" content={report.full.love} />
          <UnlockedSection title="Carreira e dinheiro" content={report.full.career_money} />
          <UnlockedSection title="O que merece sua atenção" content={report.full.attention} />
          <UnlockedSection title="Possível ponto de alerta" content={report.full.warning} />
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
          <UnlockedSection title="Mensagem final" content={report.full.final_message} />
        </div>
      ) : (
        <>
          <UnlockedSection title="Seu momento atual" content={report.current_moment} />
          <div className="mt-4 divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-ink-900 shadow-panel">
            <LockedSection title="Pontos fortes e pontos de atenção" hint={`${pointCount} pontos identificados`} />
            <LockedSection title="Próximos meses" />
            <LockedSection title="Amor e relacionamentos" />
            <LockedSection title="Carreira e dinheiro" />
            <LockedSection title="O que merece sua atenção" />
            <LockedSection title="Possível ponto de alerta" />
            <LockedSection title={report.sections[0]?.title ?? 'O que seu elemento revela'} />
            <LockedSection title="Sua carta do Presente, revelada" />
            <LockedSection title="Sua carta do Futuro, revelada" />
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
        const locked = entry.position !== 'passado' && !paid;
        return (
          <motion.div
            key={entry.position}
            initial={reduce ? false : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-2"
          >
            <CardFace icon={entry.card.icon} locked={locked} />
            <p className="text-[11px] uppercase tracking-[0.1em] text-gold-400">{POSITION_LABEL[entry.position]}</p>
            <p className="text-center text-xs leading-snug text-parchment-100">
              {locked ? 'Trancada' : entry.card.name}
            </p>
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
