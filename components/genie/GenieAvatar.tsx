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

// Target HEIGHT per size - the art is a tall, narrow portrait (turban to
// lamp), so width follows automatically from the image's own ratio.
const SIZE_PX: Record<'sm' | 'md' | 'lg', number> = {
  sm: 88,
  md: 200,
  lg: 380,
};

type Props = {
  mood: GenieMood;
  size?: 'sm' | 'md' | 'lg';
  priority?: boolean;
};

export function GenieAvatar({ mood, size = 'md', priority = false }: Props) {
  const reduce = useReducedMotion();
  const height = SIZE_PX[size];

  return (
    // Bob animation lives on its own wrapper with nothing else on it - an
    // earlier version combined an animating transform with a sibling clip
    // + scale on the same/child element and intermittently mis-composited
    // in Chromium (blank on some animation frames, not just first paint).
    <motion.div
      animate={reduce ? undefined : { y: [0, -8, 0] }}
      transition={reduce ? undefined : { duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      className="shrink-0"
    >
      <Image
        key={mood}
        src={MOOD_IMAGE[mood]}
        alt="O gênio, seu guia na leitura"
        width={294}
        height={512}
        priority={priority}
        style={{ height, width: 'auto' }}
      />
    </motion.div>
  );
}
