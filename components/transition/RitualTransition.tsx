'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';

const LINES = [
  'Respire fundo.',
  'Pense na pergunta que você mais gostaria de ver respondida neste momento.',
  'Quando estiver pronto(a), continue.',
];

export function RitualTransition() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  // Reduced-motion preference can't be known during SSR, and it can't be known on
  // the very first client render either (that happens before this effect runs).
  // Defaulting this to `false` (the more common "motion is fine" case) is what the
  // original implementation did, and it caused a real, measurable bug: the server
  // always renders the entrance-fade "hidden" style (opacity: 0), so reduced-motion
  // users saw a genuine flash of invisible content on first paint, plus a React
  // hydration-mismatch console error, while the correction caught up a tick later.
  // Defaulting to `true` instead means the server and the first client render
  // always agree on rendering the line fully visible with no animation, so there is
  // nothing to flash and nothing to mismatch. The one-time trade-off: a
  // non-reduced-motion user's very first line (step 0) also renders without its
  // entrance fade, since by the time the effect confirms motion is fine, that first
  // `motion.p` has already mounted and settled. Every later line swap (step 1, 2, ...)
  // is a fresh mount with the effect's real value already resolved, so those animate
  // normally for non-reduced-motion users.
  const [reduce, setReduce] = useState(true);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduce(query.matches);
    const handleChange = () => setReduce(query.matches);
    query.addEventListener('change', handleChange);
    return () => query.removeEventListener('change', handleChange);
  }, []);

  function goToResult() {
    router.push('/leitura/resultado');
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <p className="font-display text-sm uppercase tracking-[0.18em] text-gold-400">
        Antes de revelar sua leitura...
      </p>
      <AnimatePresence mode="wait">
        <motion.p
          key={step}
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: 0.5 }}
          className="mt-8 max-w-md font-display text-2xl leading-snug text-parchment-100"
        >
          {LINES[step]}
        </motion.p>
      </AnimatePresence>
      <div className="mt-12 flex flex-col items-center gap-4">
        {step < LINES.length - 1 ? (
          <button
            type="button"
            onClick={() => setStep((current) => current + 1)}
            className="inline-flex items-center justify-center rounded-full bg-gold-400 px-8 py-4 font-display text-sm font-medium text-ink-950 transition-transform duration-300 ease-out hover:-translate-y-0.5 hover:bg-gold-300 active:scale-[0.98]"
          >
            Continuar
          </button>
        ) : (
          <button
            type="button"
            onClick={goToResult}
            className="inline-flex items-center justify-center rounded-full bg-gold-400 px-8 py-4 font-display text-sm font-medium text-ink-950 transition-transform duration-300 ease-out hover:-translate-y-0.5 hover:bg-gold-300 active:scale-[0.98]"
          >
            Revelar minha leitura
          </button>
        )}
        <button
          type="button"
          onClick={goToResult}
          className="text-sm text-parchment-400 underline-offset-4 hover:underline"
        >
          Pular
        </button>
      </div>
    </div>
  );
}
