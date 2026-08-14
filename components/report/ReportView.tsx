'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import type { Report } from '@/lib/report-types';
import { GenieAvatar } from '@/components/genie/GenieAvatar';
import { CardFace } from '@/components/cards/CardFace';
import { FeedbackForm } from '@/components/feedback/FeedbackForm';
import { TeaserBlock } from './TeaserBlock';
import { LockedSection } from './LockedSection';
import { PaywallCta } from './PaywallCta';
import { getOrCreateSessionId } from '@/lib/analytics/track';

export function ReportView({ report }: { report: Report }) {
  const pointCount = report.strengths.length + report.tensions.length;
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    const sessionId = getOrCreateSessionId();
    if (!sessionId) return;
    fetch(`/api/payments/status?session_id=${sessionId}`)
      .then((res) => res.json())
      .then((data: { paid?: boolean }) => setPaid(Boolean(data.paid)))
      .catch(() => {});
  }, []);

  return (
    <article className="mx-auto max-w-2xl px-6 py-16 md:px-0">
      <div className="flex items-center gap-4">
        <GenieAvatar mood={report.genie_intro.mood} size="sm" priority />
        <p className="font-display text-lg leading-snug text-parchment-100">{report.genie_intro.line}</p>
      </div>
      <p className="font-display text-sm uppercase tracking-[0.18em] text-gold-400">
        {paid ? 'Sua leitura completa' : 'Prévia da sua leitura'}
      </p>
      <h1 className="mt-4 font-display text-3xl leading-tight text-parchment-100 md:text-4xl">{report.title}</h1>
      <p className="mt-6 text-lg leading-relaxed text-parchment-400">{report.opening}</p>

      <div className="relative mt-10 aspect-[16/9] w-full overflow-hidden rounded-2xl">
        <Image
          src="/images/card-motif.jpg"
          alt="Carta de tarot iluminada por luz dourada sobre tecido escuro"
          fill
          sizes="(min-width: 768px) 42rem, 100vw"
          className="object-cover"
        />
        {report.card && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-ink-950/60 text-center backdrop-blur-sm">
            <CardFace icon={report.card.icon} size={40} />
            <p className="font-display text-lg text-parchment-100">{report.card.name}</p>
          </div>
        )}
      </div>

      <TeaserBlock teaser={report.personalized_teaser} />

      {paid ? (
        <>
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
          <UnlockedSection title="Mensagem final" content={report.full.final_message} />
        </>
      ) : (
        <>
          <LockedSection title="Seu momento atual" />
          <LockedSection title="Pontos fortes e pontos de atenção" hint={`${pointCount} pontos identificados`} />
          <LockedSection title={report.sections[0]?.title ?? 'O que seu elemento revela'} />
          <PaywallCta />
        </>
      )}

      <FeedbackForm />
    </article>
  );
}

function UnlockedSection({ title, content }: { title: string; content: string }) {
  return (
    <section className="mt-10 rounded-2xl border border-white/10 bg-ink-900 p-6">
      <h2 className="font-display text-xl text-parchment-100">{title}</h2>
      <p className="mt-3 leading-relaxed text-parchment-400">{content}</p>
    </section>
  );
}
