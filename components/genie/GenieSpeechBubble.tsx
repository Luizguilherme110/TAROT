'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

const AUTO_HIDE_MS = 4500;

export function GenieSpeechBubble({ line }: { line: string }) {
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(true);
    const timeout = setTimeout(() => setVisible(false), AUTO_HIDE_MS);
    return () => clearTimeout(timeout);
  }, [line]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.p
          key={line}
          initial={reduce ? false : { opacity: 0, y: 8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduce ? undefined : { opacity: 0, y: -8, scale: 0.96 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-[220px] rounded-2xl border border-gold-400/30 bg-ink-900 px-4 py-3 text-sm leading-snug text-parchment-100 shadow-lg"
        >
          {line}
        </motion.p>
      )}
    </AnimatePresence>
  );
}
