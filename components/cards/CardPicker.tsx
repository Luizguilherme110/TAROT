'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkle, Check } from '@phosphor-icons/react';
import { CARD_POSITIONS, POSITION_LABEL, TAROT_CARDS } from '@/lib/tarot-cards';
import { GenieAvatar } from '@/components/genie/GenieAvatar';
import { useQuiz } from '@/components/providers/QuizProvider';
import { trackEvent } from '@/lib/analytics/track';
import { CardFace } from './CardFace';

export function CardPicker() {
  const router = useRouter();
  const { dispatch } = useQuiz();

  useEffect(() => {
    trackEvent('card_picker_view');
  }, []);

  // Reduced-motion preference can't be known during SSR, and it can't be known on
  // the very first client render either (that happens before this effect runs).
  // Defaulting to `true` (assume reduced motion) makes the server render and the
  // client's first render agree on the static, fully-visible state, so there is
  // nothing to flash and nothing to hydration-mismatch on. The effect below then
  // corrects it to the real value post-hydration. See RitualTransition.tsx for the
  // fuller writeup of this bug class, which this component previously reintroduced
  // by calling motion/react's `useReducedMotion()` directly.
  const [reduce, setReduce] = useState(true);
  const [pickedIds, setPickedIds] = useState<string[]>([]);
  const [revealedId, setRevealedId] = useState<string | null>(null);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduce(query.matches);
    const handleChange = () => setReduce(query.matches);
    query.addEventListener('change', handleChange);
    return () => query.removeEventListener('change', handleChange);
  }, []);

  const round = pickedIds.length;
  const position = CARD_POSITIONS[round];
  const revealedCard = TAROT_CARDS.find((card) => card.id === revealedId);
  const availableCards = TAROT_CARDS.filter((card) => !pickedIds.includes(card.id));
  const isLastRound = round === CARD_POSITIONS.length - 1;

  function pickCard(cardId: string) {
    setRevealedId(cardId);
    dispatch({ type: 'ADD_CARD', cardId });
    trackEvent('card_picked', { cardId, position });
  }

  function confirmReveal() {
    if (!revealedId) return;
    const nextPicked = [...pickedIds, revealedId];
    setRevealedId(null);
    if (nextPicked.length >= CARD_POSITIONS.length) {
      router.push('/leitura/preparando');
    } else {
      setPickedIds(nextPicked);
    }
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 py-12 md:px-12">
      <div className="mb-8 flex items-center gap-2">
        {CARD_POSITIONS.map((pos, index) => (
          <div key={pos} className="flex items-center gap-2">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs font-medium transition-colors duration-300 ${
                index < round
                  ? 'border-gold-400 bg-gold-400 text-ink-950'
                  : index === round
                    ? 'border-gold-400 text-gold-400'
                    : 'border-white/15 text-parchment-400/60'
              }`}
            >
              {index < round ? <Check size={14} weight="bold" /> : index + 1}
            </div>
            <span
              className={`text-xs uppercase tracking-[0.1em] ${
                index <= round ? 'text-parchment-100' : 'text-parchment-400/50'
              }`}
            >
              {POSITION_LABEL[pos]}
            </span>
            {index < CARD_POSITIONS.length - 1 && <div className="mx-1 h-px w-6 bg-white/10" />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {!revealedCard ? (
          <motion.div
            key={`grid-${position}`}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-sm"
          >
            <h1 className="text-center font-display text-2xl leading-snug text-parchment-100">
              Escolha a carta do seu <span className="text-gold-400">{POSITION_LABEL[position]}</span>.
            </h1>
            <div className="mt-8 grid grid-cols-3 justify-items-center gap-4">
              {availableCards.map((card, index) => (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => pickCard(card.id)}
                  aria-label={`Escolher carta ${index + 1}`}
                  className="group flex aspect-[3/4] w-full max-w-20 items-center justify-center rounded-xl border border-gold-400/30 bg-ink-900 shadow-panel transition-colors duration-200 hover:border-gold-400/60"
                >
                  <Sparkle
                    size={22}
                    weight="light"
                    className="text-gold-400/50 transition-colors duration-200 group-hover:text-gold-400/80"
                  />
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="reveal"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex w-full max-w-sm flex-col items-center text-center"
          >
            <CardFace icon={revealedCard.icon} size="lg" />
            <p className="mt-4 text-xs uppercase tracking-[0.14em] text-gold-400">{POSITION_LABEL[position]}</p>
            <h1 className="mt-1 font-display text-2xl text-parchment-100">{revealedCard.name}</h1>
            <p className="mt-3 leading-relaxed text-parchment-400">{revealedCard.meaning}</p>
            <div className="mt-8 flex items-center gap-4">
              <GenieAvatar mood={revealedCard.genieReaction.mood} size="sm" />
              <p className="text-left font-display text-base leading-snug text-parchment-100">
                {revealedCard.genieReaction.line}
              </p>
            </div>
            <button
              type="button"
              onClick={confirmReveal}
              className="mt-10 inline-flex items-center justify-center rounded-full bg-gold-400 px-8 py-4 font-display text-sm font-medium text-ink-950 shadow-gold transition-transform duration-300 ease-out hover:-translate-y-0.5 hover:bg-gold-300 active:scale-[0.98]"
            >
              {isLastRound ? 'Ver minha leitura' : `Escolher carta do ${POSITION_LABEL[CARD_POSITIONS[round + 1]]}`}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
