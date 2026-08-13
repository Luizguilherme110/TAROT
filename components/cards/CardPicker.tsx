'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import type { Icon as PhosphorIcon } from '@phosphor-icons/react';
import { Sparkle, CompassRose, ArrowsClockwise, Heart, Lightning, Star, Sun } from '@phosphor-icons/react';
import { TAROT_CARDS, type TarotCardIcon } from '@/lib/tarot-cards';
import { GenieAvatar } from '@/components/genie/GenieAvatar';

const ICONS: Record<TarotCardIcon, PhosphorIcon> = {
  CompassRose,
  ArrowsClockwise,
  Heart,
  Lightning,
  Star,
  Sun,
};

export function CardPicker() {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedCard = TAROT_CARDS.find((card) => card.id === selectedId);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 py-12 md:px-12">
      <AnimatePresence mode="wait">
        {!selectedCard ? (
          <motion.div
            key="grid"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-sm"
          >
            <h1 className="text-center font-display text-2xl leading-snug text-parchment-100">
              Escolha uma carta.
            </h1>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {TAROT_CARDS.map((card, index) => (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => setSelectedId(card.id)}
                  aria-label={`Escolher carta ${index + 1}`}
                  className="flex aspect-[3/4] items-center justify-center rounded-2xl border border-gold-400/30 bg-ink-900 transition-colors duration-200 hover:border-gold-400/60"
                >
                  <Sparkle size={28} weight="light" className="text-gold-400/50" />
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
            <RevealedCardIcon icon={selectedCard.icon} />
            <h1 className="mt-4 font-display text-2xl text-parchment-100">{selectedCard.name}</h1>
            <p className="mt-3 leading-relaxed text-parchment-400">{selectedCard.meaning}</p>
            <div className="mt-8 flex items-center gap-4">
              <GenieAvatar mood={selectedCard.genieReaction.mood} size="sm" />
              <p className="text-left font-display text-base leading-snug text-parchment-100">
                {selectedCard.genieReaction.line}
              </p>
            </div>
            <button
              type="button"
              onClick={() => router.push('/leitura/preparando')}
              className="mt-10 inline-flex items-center justify-center rounded-full bg-gold-400 px-8 py-4 font-display text-sm font-medium text-ink-950 transition-transform duration-300 ease-out hover:-translate-y-0.5 hover:bg-gold-300 active:scale-[0.98]"
            >
              Continuar
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function RevealedCardIcon({ icon }: { icon: TarotCardIcon }) {
  const Icon = ICONS[icon];
  return <Icon size={48} weight="light" className="text-gold-400" />;
}
