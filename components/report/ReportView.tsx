import Image from 'next/image';
import type { Report } from '@/lib/report-types';
import { GenieAvatar } from '@/components/genie/GenieAvatar';
import { TeaserBlock } from './TeaserBlock';
import { PaywallCta } from './PaywallCta';

export function ReportView({ report }: { report: Report }) {
  return (
    <article className="mx-auto max-w-2xl px-6 py-16 md:px-0">
      <div className="flex items-center gap-4">
        <GenieAvatar mood={report.genie_intro.mood} size="sm" priority />
        <p className="font-display text-lg leading-snug text-parchment-100">{report.genie_intro.line}</p>
      </div>
      <p className="font-display text-sm uppercase tracking-[0.18em] text-gold-400">Sua leitura gratuita</p>
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
      </div>

      <section className="mt-10">
        <h2 className="font-display text-xl text-parchment-100">Seu momento atual</h2>
        <p className="mt-3 leading-relaxed text-parchment-400">{report.current_moment}</p>
      </section>

      <section className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <h2 className="font-display text-xl text-parchment-100">Pontos fortes</h2>
          <ul className="mt-3 flex flex-col gap-3 text-parchment-400">
            {report.strengths.map((item) => (
              <li key={item} className="leading-relaxed">
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-display text-xl text-parchment-100">Pontos de atenção</h2>
          <ul className="mt-3 flex flex-col gap-3 text-parchment-400">
            {report.tensions.map((item) => (
              <li key={item} className="leading-relaxed">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {report.sections.map((section) => (
        <section key={section.title} className="mt-10">
          <h2 className="font-display text-xl text-parchment-100">{section.title}</h2>
          <p className="mt-3 leading-relaxed text-parchment-400">{section.content}</p>
        </section>
      ))}

      <TeaserBlock teaser={report.personalized_teaser} finalMessage={report.final_message} />
      <PaywallCta />
    </article>
  );
}
