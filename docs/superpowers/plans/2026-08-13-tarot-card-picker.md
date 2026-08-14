# Tarot Card Picker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a new step between the quiz and the ritual transition where the user picks 1 of 6 face-down tarot cards, revealing its name, meaning, and a genie reaction line specific to that card.

**Architecture:** A pure content module (`lib/tarot-cards.ts`, same pattern as `lib/genie-lines.ts`) holds 6 fixed Major Arcana cards. A new client component (`components/cards/CardPicker.tsx`) renders a grid of identical card backs; picking one swaps to a reveal panel (name, Phosphor icon, meaning, genie reaction) with a "Continuar" button. A new route (`/leitura/carta`) hosts it, and `QuizFlow`'s end-of-quiz navigation is retargeted to land there instead of jumping straight to the ritual transition.

**Tech Stack:** Next.js 15 (App Router), React 19, TypeScript, Tailwind v4, `motion/react`, `@phosphor-icons/react`, Vitest.

**Spec:** `docs/superpowers/specs/2026-08-13-tarot-card-picker-design.md`

## Global Constraints

- Palette locked: `ink-950 #09090b`, `ink-900 #131316`, `parchment-100 #f5f3ef`, `parchment-400 #a8a29e`, `gold-400 #d4a24e`, `gold-300 #e8b968`. No new colors.
- Shape lock: cards `rounded-2xl`, buttons `rounded-full`.
- Zero em-dash (`—`/`–`) anywhere in copy.
- `GenieMood` is defined once in `lib/genie-lines.ts` (`'neutral' | 'thinking' | 'pleased' | 'excited' | 'warm'`) - import it, never redeclare it.
- 6 fixed cards, no randomization/sorting at render time (a shuffled order computed differently on server vs. client is exactly the class of hydration-mismatch bug already fixed twice elsewhere in this codebase).
- The card choice is not persisted and does not affect `Report`/`generateMockReport` - local component state only (`useState`), never touches `QuizState`/`quizReducer`.
- All animation above trivial hover/tap wraps `useReducedMotion()` from `motion/react` and degrades to static (same pattern as `RitualTransition.tsx`).
- PT-BR copy, warm/reflective tone, no factual claims of certainty about the future (parent product spec §9) - "A Torre" specifically must read as an opening, not a disaster.
- Icons from `@phosphor-icons/react` only (client components import the default export, not `/dist/ssr`, which is for Server Components only - see `components/report/PaywallCta.tsx` for the ssr-variant pattern this does NOT use).

---

### Task 1: Tarot card content bank

**Files:**
- Create: `lib/tarot-cards.ts`
- Test: `lib/__tests__/tarot-cards.test.ts`

**Interfaces:**
- Consumes: `GenieLine`, `GenieMood` types from `lib/genie-lines.ts` (`{ mood: GenieMood; line: string }`).
- Produces: `TarotCardIcon` (string union of 6 icon names), `TarotCard` type (`{ id: string; name: string; icon: TarotCardIcon; meaning: string; genieReaction: GenieLine }`), `TAROT_CARDS: TarotCard[]` (6 entries, fixed order). Task 2 imports all three.

- [ ] **Step 1: Write the failing test**

```ts
// lib/__tests__/tarot-cards.test.ts
import { describe, it, expect } from 'vitest';
import { TAROT_CARDS } from '../tarot-cards';

describe('TAROT_CARDS', () => {
  it('has exactly 6 cards', () => {
    expect(TAROT_CARDS).toHaveLength(6);
  });

  it('has unique ids', () => {
    const ids = TAROT_CARDS.map((card) => card.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('has name, icon, meaning, and a genie reaction line filled in for every card', () => {
    for (const card of TAROT_CARDS) {
      expect(card.name.length).toBeGreaterThan(0);
      expect(card.icon.length).toBeGreaterThan(0);
      expect(card.meaning.length).toBeGreaterThan(0);
      expect(card.genieReaction.line.length).toBeGreaterThan(0);
    }
  });

  it('has zero em-dash or en-dash in meaning or genie reaction text', () => {
    for (const card of TAROT_CARDS) {
      expect(card.meaning).not.toMatch(/[—–]/);
      expect(card.genieReaction.line).not.toMatch(/[—–]/);
    }
  });
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `npm run test -- tarot-cards`
Expected: FAIL with "Cannot find module '../tarot-cards'".

- [ ] **Step 3: Write `lib/tarot-cards.ts`**

```ts
import type { GenieLine } from './genie-lines';

export type TarotCardIcon = 'CompassRose' | 'ArrowsClockwise' | 'Heart' | 'Lightning' | 'Star' | 'Sun';

export type TarotCard = {
  id: string;
  name: string;
  icon: TarotCardIcon;
  meaning: string;
  genieReaction: GenieLine;
};

export const TAROT_CARDS: TarotCard[] = [
  {
    id: 'louco',
    name: 'O Louco',
    icon: 'CompassRose',
    meaning:
      'O Louco carrega a coragem de começar sem ter todas as respostas prontas. Representa um salto de fé, não um erro de cálculo.',
    genieReaction: {
      mood: 'excited',
      line: 'Ah, O Louco. Você tem coragem de saltar mesmo sem ver o chão.',
    },
  },
  {
    id: 'roda_fortuna',
    name: 'A Roda da Fortuna',
    icon: 'ArrowsClockwise',
    meaning:
      'A Roda da Fortuna fala de ciclos que giram por conta própria. Alguma coisa está mudando, e não depende só de você.',
    genieReaction: {
      mood: 'thinking',
      line: 'A Roda da Fortuna. Tem coisa girando aí que não tá nas suas mãos.',
    },
  },
  {
    id: 'amantes',
    name: 'Os Amantes',
    icon: 'Heart',
    meaning:
      'Os Amantes falam de escolhas do coração, das que revelam quem você é. Não é só sobre romance, é sobre valores.',
    genieReaction: {
      mood: 'warm',
      line: 'Os Amantes. Uma escolha do coração rondando você, não é?',
    },
  },
  {
    id: 'torre',
    name: 'A Torre',
    icon: 'Lightning',
    meaning:
      'A Torre derruba o que já não sustentava mais. Assusta na hora, mas costuma abrir espaço pra algo mais verdadeiro.',
    genieReaction: {
      mood: 'thinking',
      line: 'A Torre. Uma ruptura que dói, mas que abre caminho. Confia.',
    },
  },
  {
    id: 'estrela',
    name: 'A Estrela',
    icon: 'Star',
    meaning:
      'A Estrela chega depois da tempestade, trazendo um fio de esperança. Não promete que tudo resolve, mas que dá pra respirar.',
    genieReaction: {
      mood: 'pleased',
      line: 'A Estrela. Depois de tanta coisa, um fio de esperança aparecendo.',
    },
  },
  {
    id: 'sol',
    name: 'O Sol',
    icon: 'Sun',
    meaning:
      'O Sol é clareza, vitalidade, as coisas fazendo sentido de novo. Um lembrete de que dias bons também voltam.',
    genieReaction: {
      mood: 'excited',
      line: 'O Sol! Essa carta é praticamente um abraço. Gostei dessa.',
    },
  },
];
```

- [ ] **Step 4: Run the test and verify it passes**

Run: `npm run test -- tarot-cards`
Expected: PASS, 4 tests.

- [ ] **Step 5: Commit**

```bash
git add lib/tarot-cards.ts lib/__tests__/tarot-cards.test.ts
git commit -m "feat: add tarot card content bank for the card picker"
```

---

### Task 2: `CardPicker` component and `/leitura/carta` route

**Files:**
- Create: `components/cards/CardPicker.tsx`
- Create: `app/leitura/carta/page.tsx`

**Interfaces:**
- Consumes: `TAROT_CARDS`, `TarotCard`, `TarotCardIcon` from `lib/tarot-cards.ts` (Task 1); `GenieAvatar` from `components/genie/GenieAvatar.tsx` (`{ mood: GenieMood; size?: 'sm' | 'md' | 'lg'; priority?: boolean }`).
- Produces: `CardPicker()` component, rendered at `/leitura/carta`. Task 3 retargets navigation to this route.

- [ ] **Step 1: Write `components/cards/CardPicker.tsx`**

```tsx
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
```

- [ ] **Step 2: Write `app/leitura/carta/page.tsx`**

```tsx
import { CardPicker } from '@/components/cards/CardPicker';

export default function CartaPage() {
  return <CardPicker />;
}
```

- [ ] **Step 3: Type-check and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

- [ ] **Step 4: Manual check**

Run: `npm run dev`, open `http://localhost:3000/leitura/carta` directly. Confirm: 6 identical card backs render in a 2-column (mobile) / 3-column (`sm:`) grid, all indistinguishable before clicking. Click each one (reload between clicks to reset state) and confirm every card reveals its own name, icon, meaning, and genie reaction line, with `useReducedMotion` degrading the fade/slide to an instant swap. Confirm "Continuar" navigates to `/leitura/preparando` (already exists, should load normally).

- [ ] **Step 5: Commit**

```bash
git add components/cards/CardPicker.tsx app/leitura/carta/page.tsx
git commit -m "feat: add 6-card tarot picker with genie reactions"
```

---

### Task 3: Wire the card picker into the funnel

**Files:**
- Modify: `components/quiz/QuizFlow.tsx:19-22` and `components/quiz/QuizFlow.tsx:27-33`

**Interfaces:**
- Consumes: nothing new - this task only changes two navigation targets already present in `QuizFlow.tsx`.

- [ ] **Step 1: Retarget both end-of-quiz navigation points**

In `components/quiz/QuizFlow.tsx`, change:

```tsx
  if (!question) {
    router.push('/leitura/preparando');
    return null;
  }
```

to:

```tsx
  if (!question) {
    router.push('/leitura/carta');
    return null;
  }
```

and change:

```tsx
  function goNext() {
    if (state.currentStep + 1 >= QUIZ_QUESTIONS.length) {
      router.push('/leitura/preparando');
    } else {
      dispatch({ type: 'NEXT' });
    }
  }
```

to:

```tsx
  function goNext() {
    if (state.currentStep + 1 >= QUIZ_QUESTIONS.length) {
      router.push('/leitura/carta');
    } else {
      dispatch({ type: 'NEXT' });
    }
  }
```

- [ ] **Step 2: Type-check and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

- [ ] **Step 3: Manual check of the full funnel**

Run: `npm run dev`, open `http://localhost:3000/leitura`, answer all 14 questions. Confirm the app lands on `/leitura/carta` (not `/leitura/preparando`) immediately after the birth date question. Pick a card, confirm the reveal, click "Continuar", confirm it lands on `/leitura/preparando`, click through the ritual transition, confirm it lands on `/leitura/resultado` with the report rendering normally. Walk the full path once more on a mobile viewport (390px) to confirm the card grid and reveal panel both fit without horizontal scroll.

- [ ] **Step 4: Commit**

```bash
git add components/quiz/QuizFlow.tsx
git commit -m "feat: route the end of the quiz through the card picker"
```
