'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';
import type { GenieMood } from '@/lib/genie-lines';

const MOOD_IMAGE: Record<GenieMood, string> = {
  neutral: '/images/genie/neutral.png',
  thinking: '/images/genie/thinking.png',
  pleased: '/images/genie/pleased.png',
  excited: '/images/genie/excited.png',
  warm: '/images/genie/warm.png',
};

const SIZE_PX: Record<'sm' | 'md' | 'lg', number> = {
  sm: 64,
  md: 140,
  lg: 320,
};

type Props = {
  mood: GenieMood;
  size?: 'sm' | 'md' | 'lg';
  priority?: boolean;
};

export function GenieAvatar({ mood, size = 'md', priority = false }: Props) {
  const reduce = useReducedMotion();
  const pixels = SIZE_PX[size];

  return (
    <motion.div
      animate={reduce ? undefined : { y: [0, -8, 0] }}
      transition={reduce ? undefined : { duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      className="relative aspect-[2/3] shrink-0"
      style={{ width: pixels }}
    >
      <Image
        key={mood}
        src={MOOD_IMAGE[mood]}
        alt="O gênio, seu guia na leitura"
        fill
        priority={priority}
        sizes={`${pixels}px`}
        className="object-contain"
      />
    </motion.div>
  );
}
