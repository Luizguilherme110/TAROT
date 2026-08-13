'use client';

import { motion, useReducedMotion } from 'motion/react';

const STARS = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  top: `${(i * 37) % 100}%`,
  left: `${(i * 53) % 100}%`,
  delay: (i % 8) * 0.4,
  size: i % 3 === 0 ? 3 : 2,
}));

export function CelestialBackdrop() {
  const reduce = useReducedMotion();

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink-950">
      <motion.div
        className="absolute -left-1/4 top-[-10%] h-[60vh] w-[60vh] rounded-full bg-gold-400/10 blur-3xl"
        animate={reduce ? undefined : { x: [0, 40, 0], y: [0, 30, 0] }}
        transition={reduce ? undefined : { duration: 26, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute -right-1/4 bottom-[-15%] h-[50vh] w-[50vh] rounded-full bg-ink-900/60 blur-3xl"
        animate={reduce ? undefined : { x: [0, -30, 0], y: [0, -24, 0] }}
        transition={reduce ? undefined : { duration: 32, repeat: Infinity, ease: 'linear' }}
      />
      {STARS.map((star) => (
        <motion.span
          key={star.id}
          className="absolute rounded-full bg-parchment-100"
          style={{ top: star.top, left: star.left, width: star.size, height: star.size }}
          animate={reduce ? undefined : { opacity: [0.15, 0.9, 0.15] }}
          transition={reduce ? undefined : { duration: 3.5, repeat: Infinity, delay: star.delay, ease: 'easeInOut' }}
        />
      ))}
      <svg
        className="absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 opacity-[0.06]"
        viewBox="0 0 200 200"
        fill="none"
        stroke="currentColor"
        aria-hidden="true"
      >
        <motion.g
          className="text-gold-400"
          style={{ transformOrigin: '100px 100px' }}
          animate={reduce ? undefined : { rotate: 360 }}
          transition={reduce ? undefined : { duration: 90, repeat: Infinity, ease: 'linear' }}
        >
          <circle cx="100" cy="100" r="80" strokeWidth="0.5" />
          <path d="M100 20 L107 85 L172 100 L107 115 L100 180 L93 115 L28 100 L93 85 Z" strokeWidth="0.75" />
          <path d="M60 40 a24 24 0 1 0 0.5 0" strokeWidth="0.75" />
        </motion.g>
      </svg>
    </div>
  );
}
