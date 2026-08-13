import Image from 'next/image';
import type { Report } from '@/lib/report-types';
import { GenieAvatar } from '@/components/genie/GenieAvatar';
import { CardFace } from '@/components/cards/CardFace';
import { FeedbackForm } from '@/components/feedback/FeedbackForm';
import { TeaserBlock } from './TeaserBlock';
import { LockedSection } from './LockedSection';
import { PaywallCta } from './PaywallCta';

export function ReportView({ report }: { report: Report }) {
  const pointCount = report.strengths.length + report.tensions.length;

  return (
    <article className="mx-auto max-w-2xl px-6 py-16 md:px-0">
      <div className="flex items-center gap-4">
        <GenieAvatar mood={report.genie_intro.mood} size="sm" priority />
        <p className="font-display text-lg leading-snug text-parchment-100">{report.genie_intro.line}</p>
      </div>
      <p className="font-display text-sm uppercase tracking-[0.18em] text-gold-400">Prévia da sua leitura</p>
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

      <LockedSection title="Seu momento atual" />
      <LockedSection
        title="Pontos fortes e pontos de atenção"
        hint={`${pointCount} pontos identificados`}
      />
      <LockedSection title={report.sections[0]?.title ?? 'O que seu elemento revela'} />

      <PaywallCta />
      <FeedbackForm />
    </article>
  );
}
