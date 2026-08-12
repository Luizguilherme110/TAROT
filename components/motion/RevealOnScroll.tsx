'use client';

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import type { ReactNode } from 'react';

export function RevealOnScroll({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  // Reduced-motion preference is read in an effect, not during render. The server
  // has no way to know the client's OS preference, so the server and the first
  // client render must agree (both assume motion is fine) to avoid a hydration
  // mismatch. React does not patch mismatched `style` attributes after hydration,
  // so branching this on a value that could differ between server and first client
  // render (e.g. framer-motion's own useReducedMotion, which resolves synchronously
  // during render) leaves reduced-motion users with permanently invisible content:
  // the DOM keeps the server-rendered "opacity: 0" style forever. Deferring the
  // check to useEffect guarantees the first render always matches, then a normal
  // (non-hydration) re-render swaps to the plain, always-visible element.
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduce(query.matches);
    const handleChange = () => setReduce(query.matches);
    query.addEventListener('change', handleChange);
    return () => query.removeEventListener('change', handleChange);
  }, []);

  if (reduce) {
    return <div>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
