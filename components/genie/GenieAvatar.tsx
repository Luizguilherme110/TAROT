'use client';

import { motion, useReducedMotion } from 'motion/react';
import type { GenieMood } from '@/lib/genie-lines';

// Rendered as a CSS sprite: one shared sheet, windowed via
// background-position, instead of five individually-cropped files.
//
// Two Chromium rendering quirks shaped this implementation, both
// reproduced in isolation (plain static HTML, no Next.js/React):
// 1. `sharp().extract()` output PNGs render with content missing in
//    Chromium specifically, even after a clean re-encode - avoided
//    entirely by never pre-cropping server side.
// 2. A `background-position` window narrower than ~300px into this
//    (1920x1280) sheet renders with roughly half the visible area
//    blank, regardless of file format or scale - the window below
//    stays at a safe native width and is scaled down afterward with
//    `transform: scale()` (GPU compositing, not re-rasterized) rather
//    than shrinking `background-size` directly.
const SHEET_W = 1920;
const SHEET_H = 1280;
const CELL_W = 384;
const CELL_H = 640;
// Poses aren't perfectly confined to their cell (arms, hearts, sparkles
// bleed into the neighboring column), so the window is inset from the
// cell's left edge and narrower than a full cell.
const WINDOW_INSET_LEFT = 15;
const WINDOW_W = 310;

const MOOD_CELL: Record<GenieMood, [col: number, row: number]> = {
  neutral: [0, 0],
  thinking: [1, 0],
  pleased: [2, 0],
  excited: [3, 0],
  warm: [3, 1],
};

// Target HEIGHT per size - the art is a tall, narrow portrait (turban to
// lamp), so width follows automatically from the window's own ratio.
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
  const displayHeight = SIZE_PX[size];
  const scale = displayHeight / CELL_H;
  const displayWidth = WINDOW_W * scale;
  const [col, row] = MOOD_CELL[mood];
  const x = col * CELL_W + WINDOW_INSET_LEFT;
  const y = row * CELL_H;

  return (
    <>
      {priority ? <link rel="preload" as="image" href="/images/genie/sheet.webp" /> : null}
      <motion.div
        animate={reduce ? undefined : { y: [0, -8, 0] }}
        transition={reduce ? undefined : { duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        role="img"
        aria-label="O gênio, seu guia na leitura"
        className="relative shrink-0 overflow-hidden"
        style={{ width: displayWidth, height: displayHeight }}
      >
        <div
          className="bg-no-repeat"
          style={{
            width: WINDOW_W,
            height: CELL_H,
            backgroundImage: 'url(/images/genie/sheet.webp)',
            backgroundSize: `${SHEET_W}px ${SHEET_H}px`,
            backgroundPosition: `-${x}px -${y}px`,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
        />
      </motion.div>
    </>
  );
}
