export function TeaserBlock({ teaser, finalMessage }: { teaser: string; finalMessage: string }) {
  return (
    <section className="mt-14 rounded-2xl border border-gold-400/30 bg-gold-400/5 p-8">
      {teaser.split('\n\n').map((paragraph, index) => (
        <p key={index} className="mt-3 leading-relaxed text-parchment-100 first:mt-0">
          {paragraph}
        </p>
      ))}
      <p className="mt-6 leading-relaxed text-parchment-400">{finalMessage}</p>
    </section>
  );
}
