# Identidade do Gênio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the site a mascot identity: the genie image (`genio.png`, supplied by the user) replaces the stock hero photo, reacts to the user's quiz answers with short personality lines, narrates the ritual transition, and greets the user at the top of the report. The landing page also gets a subtle animated celestial/tarot background, and emoji are removed from the quiz.

**Architecture:** Five cropped mood images (`public/images/genie/*.png`) are rendered by a small `GenieAvatar` leaf component. A pure content module (`lib/genie-lines.ts`) maps quiz question/option ids to `{ mood, line }` pairs, kept in sync with `lib/quiz-questions.ts` by a coverage test. `GenieCompanion` (avatar + auto-collapsing speech bubble) is wired into `QuizFlow`, reacting to the *previous* answered question on every render. The report's `genie_intro` line is computed inside the existing `generateMockReport`, reusing the same situation data already used for `current_moment`. The landing background is a self-contained, `transform`/`opacity`-only animated component, isolated to `app/page.tsx`.

**Tech Stack:** Next.js 15 (App Router), React 19, TypeScript, Tailwind v4, `motion/react`, Vitest. One-off asset prep uses `sharp` (installed with `--no-save`, not a project dependency).

## Global Constraints

- Design doc: `docs/superpowers/specs/2026-08-12-genie-mascot-identity-design.md`. Parent specs: `TAROT-AI-SPEC-V2.md`, `docs/superpowers/specs/2026-08-12-fase1-core-funnel-skeleton-design.md`.
- Palette lock stays as-is: `ink-950 #09090b`, `ink-900 #131316`, `parchment-100 #f5f3ef`, `parchment-400 #a8a29e`, `gold-400 #d4a24e`, `gold-300 #e8b968`. No new colors.
- `GenieMood` is exactly `'neutral' | 'thinking' | 'pleased' | 'excited' | 'warm'`, defined once in `lib/genie-lines.ts` and imported everywhere else (never redeclared).
- All animation is `transform`/`opacity` only, wrapped in `useReducedMotion()` from `motion/react` (same pattern as `components/transition/RitualTransition.tsx` and `components/motion/RevealOnScroll.tsx`), degrading to a static frame. No `window.addEventListener('scroll')`, no canvas/WebGL/GSAP.
- The animated background (`CelestialBackdrop`) is used only in `app/page.tsx` (landing). The quiz, transition, and result routes keep their current solid `ink-950` background.
- All user-facing copy is Portuguese (PT-BR), warm/intimate tone, matching the existing voice in `lib/generate-mock-report.ts`. Zero em-dash (`—`/`–`) anywhere.
- This repo has no component-render test harness (no React Testing Library, only Vitest against pure functions in `lib/`). UI component tasks are verified with `npm run lint`, `npx tsc --noEmit`, and a manual check (visual read of the generated image, or `npm run dev` browser walkthrough) — not new automated component tests. Pure-function logic (`lib/genie-lines.ts`, `lib/generate-mock-report.ts`) keeps the existing Vitest pattern (`lib/__tests__/*.test.ts`).
- Package manager: npm. `sharp` is installed transiently for Task 1 only (`npm install --no-save sharp`) and must not appear in `package.json`.

---

### Task 1: Crop the genie sprite sheet into mood images

**Files:**
- Create: `scripts/crop-genie-sprites.mjs`
- Create: `public/images/genie/neutral.png`
- Create: `public/images/genie/thinking.png`
- Create: `public/images/genie/pleased.png`
- Create: `public/images/genie/excited.png`
- Create: `public/images/genie/warm.png`

**Interfaces:**
- Produces: five PNG files at `public/images/genie/{neutral,thinking,pleased,excited,warm}.png`, each a tight, padded crop of one pose from the source sprite sheet (`genio.png`, 5 columns × 2 rows at the repo root). Later tasks (`GenieAvatar`) reference these exact paths.

- [ ] **Step 1: Install sharp for this one-off script**

Run: `npm install --no-save sharp`
Expected: installs into `node_modules` without touching `package.json`/`package-lock.json` dependency entries.

- [ ] **Step 2: Write the crop script**

```js
// scripts/crop-genie-sprites.mjs
//
// One-off asset prep: slices the genio.png sprite sheet (5 cols x 2 rows,
// solid navy background) into individual, tightly-cropped mood PNGs under
// public/images/genie/. Requires `npm install --no-save sharp` first; sharp
// is intentionally not a project dependency (only needed to regenerate
// these assets, never at runtime).
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const SRC = path.resolve('genio.png');
const OUT_DIR = path.resolve('public/images/genie');

const GRID_COLS = 5;
const GRID_ROWS = 2;

// [col, row] of each mood within the 5x2 sprite grid, zero-indexed.
const MOOD_POSITIONS = {
  neutral: [0, 0], // arms crossed, calm
  thinking: [1, 0], // hand on chin
  pleased: [2, 0], // hands together, sparkles
  excited: [3, 0], // thumbs up
  warm: [3, 1], // heart hands
};

const PAD = 24;
// Matches the sprite sheet's navy background, used both as the trim
// reference color and as fill when padding back out after trimming.
const BG = { r: 10, g: 16, b: 40, alpha: 1 };

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const { width, height } = await sharp(SRC).metadata();
  if (!width || !height) throw new Error('Could not read genio.png dimensions');

  const cellWidth = Math.floor(width / GRID_COLS);
  const cellHeight = Math.floor(height / GRID_ROWS);

  for (const [mood, [col, row]] of Object.entries(MOOD_POSITIONS)) {
    const outPath = path.join(OUT_DIR, `${mood}.png`);
    await sharp(SRC)
      .extract({ left: col * cellWidth, top: row * cellHeight, width: cellWidth, height: cellHeight })
      .trim({ background: BG, threshold: 12 })
      .extend({ top: PAD, bottom: PAD, left: PAD, right: PAD, background: BG })
      .png()
      .toFile(outPath);
    console.log(`wrote ${outPath}`);
  }
}

main();
```

- [ ] **Step 3: Run the script**

Run: `node scripts/crop-genie-sprites.mjs`
Expected: prints 5 `wrote .../public/images/genie/<mood>.png` lines, no errors.

- [ ] **Step 4: Verify the output files**

Run: `ls -la public/images/genie/`
Expected: exactly 5 files (`neutral.png`, `thinking.png`, `pleased.png`, `excited.png`, `warm.png`), each with a non-trivial size (tens of KB, not 0 bytes).

Then use the Read tool on `public/images/genie/neutral.png` (and spot-check one or two others) to visually confirm each crop shows the intended pose, tightly framed with padding, not cut off or showing a neighboring pose.

- [ ] **Step 5: Commit**

```bash
git add scripts/crop-genie-sprites.mjs public/images/genie/
git commit -m "feat: add genie mood image assets cropped from sprite sheet"
```

---

### Task 2: Genie reaction content bank

**Files:**
- Create: `lib/genie-lines.ts`
- Test: `lib/__tests__/genie-lines.test.ts`

**Interfaces:**
- Consumes: `QuizQuestion` type and `QUIZ_QUESTIONS` from `lib/quiz-questions.ts` (`id`, `type`, and for choice questions, `options[].id`).
- Produces: `GenieMood` type, `GenieLine` type (`{ mood: GenieMood; line: string }`), `GENIE_WELCOME: GenieLine`, `GENIE_REACTIONS: Record<string, Record<string, GenieLine>>`, `GENIE_OPEN_TEXT_REACTION: Record<string, GenieLine>`, `getGenieBirthdateGreeting(name: string): GenieLine`, `getGenieReaction(question: QuizQuestion | undefined, answers: Record<string, string>, name: string): GenieLine`. Later tasks (Task 3, 7, 8, 9) import from here.

- [ ] **Step 1: Write the failing tests**

```ts
// lib/__tests__/genie-lines.test.ts
import { describe, it, expect } from 'vitest';
import { QUIZ_QUESTIONS } from '../quiz-questions';
import {
  GENIE_REACTIONS,
  GENIE_OPEN_TEXT_REACTION,
  GENIE_WELCOME,
  getGenieReaction,
  getGenieBirthdateGreeting,
} from '../genie-lines';

describe('GENIE_REACTIONS coverage', () => {
  it('has an entry for every choice question and every one of its options', () => {
    const choiceQuestions = QUIZ_QUESTIONS.filter((q) => q.type === 'choice');
    for (const question of choiceQuestions) {
      expect(GENIE_REACTIONS[question.id]).toBeDefined();
      for (const option of question.options) {
        expect(GENIE_REACTIONS[question.id][option.id]).toBeDefined();
      }
    }
  });

  it('has an entry for every open-text question', () => {
    const openQuestions = QUIZ_QUESTIONS.filter((q) => q.type === 'open');
    for (const question of openQuestions) {
      expect(GENIE_OPEN_TEXT_REACTION[question.id]).toBeDefined();
    }
  });
});

describe('getGenieReaction', () => {
  it('returns the welcome line when there is no previous question', () => {
    expect(getGenieReaction(undefined, {}, '')).toEqual(GENIE_WELCOME);
  });

  it('returns the matching reaction for a choice answer', () => {
    const question = QUIZ_QUESTIONS.find((q) => q.id === 'situacao_atual')!;
    const reaction = getGenieReaction(question, { situacao_atual: 'amor' }, '');
    expect(reaction).toEqual(GENIE_REACTIONS.situacao_atual.amor);
  });

  it('falls back to the welcome line for an unanswered or unknown choice option', () => {
    const question = QUIZ_QUESTIONS.find((q) => q.id === 'situacao_atual')!;
    expect(getGenieReaction(question, {}, '')).toEqual(GENIE_WELCOME);
  });

  it('returns the open-text reaction for an open question', () => {
    const question = QUIZ_QUESTIONS.find((q) => q.id === 'sono')!;
    expect(getGenieReaction(question, {}, '')).toEqual(GENIE_OPEN_TEXT_REACTION.sono);
  });

  it('returns a personalized birthdate greeting right after the name question', () => {
    const question = QUIZ_QUESTIONS.find((q) => q.id === 'name')!;
    expect(getGenieReaction(question, {}, 'Ana')).toEqual(getGenieBirthdateGreeting('Ana'));
  });
});

describe('getGenieBirthdateGreeting', () => {
  it('interpolates the trimmed name', () => {
    expect(getGenieBirthdateGreeting('  Ana  ').line).toContain('Prazer, Ana!');
  });

  it('falls back to a name-less greeting when name is blank', () => {
    expect(getGenieBirthdateGreeting('   ').line).toBe(
      'Prazer! Só mais um detalhe antes de eu montar sua leitura.',
    );
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test -- genie-lines`
Expected: FAIL with "Cannot find module '../genie-lines'".

- [ ] **Step 3: Write `lib/genie-lines.ts`**

```ts
import type { QuizQuestion } from './quiz-questions';

export type GenieMood = 'neutral' | 'thinking' | 'pleased' | 'excited' | 'warm';

export type GenieLine = { mood: GenieMood; line: string };

export const GENIE_WELCOME: GenieLine = {
  mood: 'neutral',
  line: 'Vamos começar. Responda com o que vier primeiro à cabeça.',
};

export const GENIE_REACTIONS: Record<string, Record<string, GenieLine>> = {
  situacao_atual: {
    amor: { mood: 'warm', line: 'Vejo um coração ainda se reorganizando aí dentro.' },
    decisao: { mood: 'thinking', line: 'Uma escolha rondando você há um tempo, não é?' },
    dinheiro: { mood: 'neutral', line: 'Sinto que o dinheiro pesa mais do que devia agora.' },
    fase_nova: { mood: 'pleased', line: 'Um ciclo se fechando. Isso não passa despercebido por mim.' },
  },
  rotina_atual: {
    cansaco: { mood: 'thinking', line: 'Esse cansaço que não combina com o tanto que você faz.' },
    vontade_mudar: { mood: 'excited', line: 'Uma vontade de virar tudo de cabeça pra baixo. Gosto disso.' },
    calma_alerta: { mood: 'neutral', line: 'Calma por fora, radar ligado por dentro. Te entendo.' },
    ansiedade: { mood: 'thinking', line: 'O que ainda não chegou já está pesando em você.' },
  },
  lida_incerteza: {
    controlar: { mood: 'neutral', line: 'Você tenta segurar as rédeas de tudo que dá.' },
    fluxo: { mood: 'pleased', line: 'Deixar a vida te levar tem sua própria sabedoria.' },
    ajuda: { mood: 'warm', line: 'Pedir ajuda é mais coragem do que parece.' },
    evitar: { mood: 'thinking', line: 'Adiar pra não pensar. Eu reconheço esse movimento.' },
  },
  peso_relacoes: {
    medo_abrir: { mood: 'warm', line: 'Um medo de se abrir de novo. Faz sentido, depois de tudo.' },
    dar_mais: { mood: 'thinking', line: 'Você dá mais do que recebe, e sente esse desequilíbrio.' },
    falta_algo: { mood: 'neutral', line: 'Tudo certo por fora, mas falta uma peça. Eu notei.' },
    sozinho: { mood: 'pleased', line: 'Sozinho(a) agora, e ainda assim em paz. Isso é raro.' },
  },
  mudar_agora: {
    rotina: { mood: 'neutral', line: 'A rotina pedindo uma sacudida. Anotado.' },
    relacionamento: { mood: 'warm', line: 'Um relacionamento pesando nos seus pensamentos agora.' },
    financeiro: { mood: 'thinking', line: 'O financeiro puxando sua atenção com mais força.' },
    autoimagem: { mood: 'pleased', line: 'Mudar como você se vê. Esse é um trabalho corajoso.' },
  },
  elemento: {
    fogo: { mood: 'excited', line: 'Fogo. Você age primeiro e processa depois, eu sei.' },
    agua: { mood: 'warm', line: 'Água. Você sente tudo antes de conseguir nomear.' },
    terra: { mood: 'neutral', line: 'Terra. Você busca raiz antes de qualquer passo.' },
    ar: { mood: 'thinking', line: 'Ar. Uma cabeça cheia de possibilidades, típico.' },
  },
  depois_do_erro: {
    culpa: { mood: 'thinking', line: 'Você se culpa primeiro, antes de olhar pro resto.' },
    entender: { mood: 'pleased', line: 'Buscar entender o porquê. Isso é maturidade, viu?' },
    seguir: { mood: 'excited', line: 'Seguir em frente rápido. Você não gosta de ficar parado(a).' },
    remoer: { mood: 'warm', line: 'Ficar remoendo por dias. Eu sei como isso cansa.' },
  },
  o_que_muda: {
    relacionamento: { mood: 'warm', line: 'Um relacionamento prestes a virar. Estou de olho nisso.' },
    trabalho: { mood: 'neutral', line: 'O trabalho, a carreira. Algo se movendo por aí.' },
    autocuidado: { mood: 'pleased', line: 'Como você cuida de si. Isso já é uma virada.' },
    indefinido: { mood: 'thinking', line: 'Você não sabe o quê, só sente que vem algo.' },
  },
  esperanca: {
    pessoas: { mood: 'warm', line: 'As pessoas ao seu lado. Isso te sustenta mais do que imagina.' },
    planos: { mood: 'excited', line: 'Planos ainda por realizar. Gosto dessa energia.' },
    evolucao: { mood: 'pleased', line: 'Perceber o quanto já mudou. Isso merece ser celebrado.' },
    procurando: { mood: 'thinking', line: 'Ainda procurando. Tudo bem, a busca também ensina.' },
  },
  dia_dificil: {
    forte_por_fora: { mood: 'thinking', line: 'Forte por fora, cansado(a) por dentro. Eu vejo os dois lados.' },
    processa_sozinho: { mood: 'neutral', line: 'Quieto(a), processando sozinho(a). Seu jeito, respeito.' },
    desabafa: { mood: 'warm', line: 'Busca alguém pra desabafar. Isso é força, não fraqueza.' },
    resolve_rapido: { mood: 'excited', line: 'Tenta resolver tudo rápido. Sua energia não para, hein?' },
  },
};

export const GENIE_OPEN_TEXT_REACTION: Record<string, GenieLine> = {
  sono: { mood: 'thinking', line: 'Anotei isso. Volto a pensar nessa parte mais pra frente.' },
  deixar_para_tras: { mood: 'thinking', line: 'Isso que você quer deixar pra trás não passou despercebido.' },
};

export function getGenieBirthdateGreeting(name: string): GenieLine {
  const trimmed = name.trim();
  return {
    mood: 'pleased',
    line: trimmed
      ? `Prazer, ${trimmed}! Só mais um detalhe antes de eu montar sua leitura.`
      : 'Prazer! Só mais um detalhe antes de eu montar sua leitura.',
  };
}

export function getGenieReaction(
  question: QuizQuestion | undefined,
  answers: Record<string, string>,
  name: string,
): GenieLine {
  if (!question) return GENIE_WELCOME;

  switch (question.type) {
    case 'choice':
      return GENIE_REACTIONS[question.id]?.[answers[question.id]] ?? GENIE_WELCOME;
    case 'open':
      return GENIE_OPEN_TEXT_REACTION[question.id] ?? GENIE_WELCOME;
    case 'name':
      return getGenieBirthdateGreeting(name);
    case 'birthdate':
      return { mood: 'excited', line: 'Chegamos ao fim das perguntas. Deixa eu juntar tudo isso.' };
    default:
      return GENIE_WELCOME;
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test -- genie-lines`
Expected: PASS, all tests green.

- [ ] **Step 5: Commit**

```bash
git add lib/genie-lines.ts lib/__tests__/genie-lines.test.ts
git commit -m "feat: add genie reaction content bank keyed by quiz question/option"
```

---

### Task 3: `genie_intro` on the report

**Files:**
- Modify: `lib/report-types.ts`
- Modify: `lib/generate-mock-report.ts`
- Modify: `lib/__tests__/generate-mock-report.test.ts`

**Interfaces:**
- Consumes: `GenieMood` and `GENIE_REACTIONS` from `lib/genie-lines.ts` (Task 2).
- Produces: `Report['genie_intro']: { mood: GenieMood; line: string }`, populated by `generateMockReport`. Task 9 (`ReportView`) consumes this field.

- [ ] **Step 1: Write the failing tests**

Add to `lib/__tests__/generate-mock-report.test.ts` (append inside the existing `describe('generateMockReport', ...)` block, after the last `it`):

```ts
  it('includes a genie_intro with the situation mood and a trait line mentioning the name', () => {
    const report = generateMockReport(
      makeSession({ name: 'Ana', answers: { situacao_atual: 'dinheiro', elemento: 'terra' } }),
    );
    expect(report.genie_intro.mood).toBe('neutral');
    expect(report.genie_intro.line).toContain('Ana');
  });

  it('falls back to the fase_nova trait for an unknown situation in genie_intro', () => {
    const report = generateMockReport(makeSession({ answers: { situacao_atual: 'inexistente', elemento: 'ar' } }));
    expect(report.genie_intro.line).toContain('virada de ciclo');
  });
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test -- generate-mock-report`
Expected: FAIL — `report.genie_intro` is `undefined`.

- [ ] **Step 3: Add `genie_intro` to the `Report` type**

Modify `lib/report-types.ts`:

```ts
import type { GenieMood } from './genie-lines';

export type Report = {
  title: string;
  opening: string;
  current_moment: string;
  strengths: string[];
  tensions: string[];
  personalized_teaser: string;
  sections: { title: string; content: string }[];
  final_message: string;
  genie_intro: { mood: GenieMood; line: string };
};

export type QuizSession = {
  name: string;
  birthDate: string;
  answers: Record<string, string>;
};
```

- [ ] **Step 4: Compute `genie_intro` in `generateMockReport`**

Modify `lib/generate-mock-report.ts`. Add the import and the trait map near the top (after the existing `ELEMENT_CONTENT` block):

```ts
import { GENIE_REACTIONS } from './genie-lines';

const SITUATION_TRAIT: Record<string, string> = {
  amor: 'alguém que sente fundo, mesmo quando custa admitir',
  decisao: 'alguém que pensa bem antes de agir',
  dinheiro: 'alguém que já enxerga os próprios padrões',
  fase_nova: 'alguém em plena virada de ciclo',
};

const DEFAULT_TRAIT = SITUATION_TRAIT.fase_nova;
```

Then change the `generateMockReport` function body: keep the existing `name`, `situation`, `elementContent`, `excerpt` lines exactly as they are, but capture the raw key first and add `genie_intro` to the returned object:

```ts
export function generateMockReport(session: QuizSession): Report {
  const name = session.name.trim() || 'você';
  const situationKey = session.answers.situacao_atual;
  const situation = SITUATION_CONTENT[situationKey] ?? DEFAULT_SITUATION;
  const elementContent = ELEMENT_CONTENT[session.answers.elemento] ?? DEFAULT_ELEMENT;
  const excerpt =
    session.answers.sono?.trim() ||
    session.answers.deixar_para_tras?.trim() ||
    'algo que ainda não coloquei em palavras';

  return {
    title: 'Sua Leitura de Hoje',
    opening: `${name}, respire fundo. O que você está prestes a ler foi montado a partir do que você mesmo(a) trouxe até aqui.`,
    current_moment: situation.current_moment,
    strengths: situation.strengths,
    tensions: situation.tensions,
    personalized_teaser: `Existe algo nas suas respostas que chamou nossa atenção...\n\nVocê mencionou que "${excerpt}".\n\nIsso aparece de forma interessante quando cruzamos sua leitura atual com o que você está vivendo.\n\nE é justamente aqui que começa a parte mais importante da sua leitura.`,
    sections: [{ title: 'O que seu elemento revela', content: elementContent }],
    final_message: `Essa é só a primeira camada da sua leitura, ${name}. O que vem a seguir mostra pra onde tudo isso está te levando.`,
    genie_intro: {
      mood: GENIE_REACTIONS.situacao_atual[situationKey]?.mood ?? 'neutral',
      line: `${name}, vejo que você é ${SITUATION_TRAIT[situationKey] ?? DEFAULT_TRAIT}.`,
    },
  };
}
```

Note this only renames the local `const situation = SITUATION_CONTENT[session.answers.situacao_atual]` to read from the new `situationKey` variable first — the rest of the function is unchanged.

- [ ] **Step 5: Run tests to verify they pass**

Run: `npm run test -- generate-mock-report`
Expected: PASS, all tests green (including the two new ones and the five pre-existing ones).

- [ ] **Step 6: Commit**

```bash
git add lib/report-types.ts lib/generate-mock-report.ts lib/__tests__/generate-mock-report.test.ts
git commit -m "feat: add genie_intro line to the generated report"
```

---

### Task 4: Remove emoji from the quiz

**Files:**
- Modify: `lib/quiz-questions.ts`
- Modify: `components/quiz/QuestionCard.tsx`

**Interfaces:**
- Produces: `ChoiceOption` type with no `emoji` field. No consumer of `option.emoji` remains anywhere in the codebase.

- [ ] **Step 1: Remove `emoji` from `ChoiceOption` and from every option**

Modify `lib/quiz-questions.ts` line 1:

```ts
export type ChoiceOption = { id: string; label: string };
```

Then remove the `emoji` property from these 8 options (situacao_atual's 4 options and elemento's 4 options), e.g.:

```ts
      { id: 'amor', label: 'Estou vivendo algo intenso no amor' },
      { id: 'decisao', label: 'Estou confuso(a) sobre uma decisão' },
      { id: 'dinheiro', label: 'Quero mudar minha situação financeira' },
      { id: 'fase_nova', label: 'Sinto que estou entrando em uma nova fase' },
```

and:

```ts
      { id: 'fogo', label: 'Fogo, impulso pra agir' },
      { id: 'agua', label: 'Água, sensibilidade e emoção' },
      { id: 'terra', label: 'Terra, precisando de estabilidade' },
      { id: 'ar', label: 'Ar, cabeça cheia de ideias' },
```

- [ ] **Step 2: Remove the emoji render from `QuestionCard`**

Modify `components/quiz/QuestionCard.tsx`. Replace the button body:

```tsx
          <button
            key={option.id}
            type="button"
            onClick={() => onAnswer(option.id)}
            aria-pressed={value === option.id}
            className={`rounded-2xl border px-5 py-4 text-left transition-colors duration-200 ${
              value === option.id
                ? 'border-gold-400 bg-gold-400/10 text-parchment-100'
                : 'border-white/10 bg-ink-900 text-parchment-400 hover:border-white/20 hover:text-parchment-100'
            }`}
          >
            {option.label}
          </button>
```

(This also drops the now-pointless `flex items-center gap-3` wrapper classes, since there is no longer a second child to lay out next to the label.)

- [ ] **Step 3: Run existing tests and lint**

Run: `npm run test -- quiz-questions && npm run lint`
Expected: PASS. `lib/__tests__/quiz-questions.test.ts` doesn't reference `emoji`, so it stays green unchanged.

- [ ] **Step 4: Commit**

```bash
git add lib/quiz-questions.ts components/quiz/QuestionCard.tsx
git commit -m "fix: remove emoji from quiz options"
```

---

### Task 5: `GenieAvatar` component

**Files:**
- Create: `components/genie/GenieAvatar.tsx`

**Interfaces:**
- Consumes: `GenieMood` from `lib/genie-lines.ts` (Task 2); image files from `public/images/genie/*.png` (Task 1).
- Produces: `GenieAvatar({ mood: GenieMood; size?: 'sm' | 'md' | 'lg'; priority?: boolean })`. Consumed by Tasks 7, 8, 9, 11.

- [ ] **Step 1: Write the component**

```tsx
// components/genie/GenieAvatar.tsx
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
  sm: 56,
  md: 120,
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
      className="relative shrink-0 overflow-hidden rounded-full shadow-[inset_0_0_28px_14px_var(--color-ink-950)]"
      style={{ width: pixels, height: pixels }}
    >
      <Image
        key={mood}
        src={MOOD_IMAGE[mood]}
        alt="O gênio, seu guia na leitura"
        fill
        priority={priority}
        sizes={`${pixels}px`}
        className="object-cover"
      />
    </motion.div>
  );
}
```

- [ ] **Step 2: Type-check and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/genie/GenieAvatar.tsx
git commit -m "feat: add GenieAvatar component"
```

---

### Task 6: `GenieSpeechBubble` component

**Files:**
- Create: `components/genie/GenieSpeechBubble.tsx`

**Interfaces:**
- Produces: `GenieSpeechBubble({ line: string })`, self-collapsing after ~4.5s, restarting its timer whenever `line` changes. Consumed by Task 7.

- [ ] **Step 1: Write the component**

```tsx
// components/genie/GenieSpeechBubble.tsx
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
```

- [ ] **Step 2: Type-check and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/genie/GenieSpeechBubble.tsx
git commit -m "feat: add GenieSpeechBubble component"
```

---

### Task 7: `GenieCompanion` wired into the quiz

**Files:**
- Create: `components/genie/GenieCompanion.tsx`
- Modify: `components/quiz/QuizFlow.tsx`

**Interfaces:**
- Consumes: `GenieAvatar` (Task 5), `GenieSpeechBubble` (Task 6), `GenieLine`/`getGenieReaction` (Task 2).
- Produces: `GenieCompanion({ mood: GenieMood; line: string })`, fixed to a screen corner, never covering the centered `QuestionCard` column.

- [ ] **Step 1: Write `GenieCompanion`**

```tsx
// components/genie/GenieCompanion.tsx
import { GenieAvatar } from './GenieAvatar';
import { GenieSpeechBubble } from './GenieSpeechBubble';
import type { GenieLine } from '@/lib/genie-lines';

export function GenieCompanion({ mood, line }: GenieLine) {
  return (
    <div className="pointer-events-none fixed right-4 top-4 z-20 flex flex-col items-end gap-2 md:right-8 md:top-8">
      <div className="pointer-events-auto">
        <GenieSpeechBubble line={line} />
      </div>
      <div className="pointer-events-auto">
        <GenieAvatar mood={mood} size="sm" />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Wire it into `QuizFlow`**

Modify `components/quiz/QuizFlow.tsx`. Add imports:

```tsx
import { getGenieReaction } from '@/lib/genie-lines';
import { GenieCompanion } from '@/components/genie/GenieCompanion';
```

After the existing `const question = QUIZ_QUESTIONS[state.currentStep];` line and the `if (!question) { ... }` guard, add:

```tsx
  const previousQuestion = QUIZ_QUESTIONS[state.currentStep - 1];
  const genieReaction = getGenieReaction(previousQuestion, state.answers, state.name);
```

Then render `<GenieCompanion mood={genieReaction.mood} line={genieReaction.line} />` as the first child inside the returned `<div className="flex min-h-dvh flex-col items-center px-6 py-12 md:px-12">`, right before `<div className="w-full max-w-md">` (the progress bar wrapper).

- [ ] **Step 3: Type-check and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

- [ ] **Step 4: Manual check**

Run: `npm run dev`, open `/leitura`. Confirm the genie avatar appears in the top-right corner with a welcome bubble, and that answering each question swaps the bubble to a reaction that matches the answer just given, without ever overlapping the question card or option buttons. Confirm the bubble auto-hides after a few seconds, leaving just the avatar.

- [ ] **Step 5: Commit**

```bash
git add components/genie/GenieCompanion.tsx components/quiz/QuizFlow.tsx
git commit -m "feat: react to quiz answers with the genie companion"
```

---

### Task 8: Genie in the ritual transition

**Files:**
- Modify: `components/transition/RitualTransition.tsx`

**Interfaces:**
- Consumes: `GenieAvatar` (Task 5), `GenieMood` (Task 2).

- [ ] **Step 1: Add the avatar and a per-step mood**

Modify `components/transition/RitualTransition.tsx`. Add the imports:

```tsx
import { GenieAvatar } from '@/components/genie/GenieAvatar';
import type { GenieMood } from '@/lib/genie-lines';
```

Add, alongside the existing `const LINES = [...]` constant:

```tsx
const MOODS: GenieMood[] = ['thinking', 'thinking', 'pleased'];
```

In the JSX, add `<GenieAvatar mood={MOODS[step]} size="md" />` immediately before the `<AnimatePresence mode="wait">` block, so the avatar sits above the narrated line and changes mood in step with it.

- [ ] **Step 2: Type-check and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

- [ ] **Step 3: Manual check**

Run: `npm run dev`, open `/leitura/preparando`. Confirm the genie is visible above each line, changes to the `pleased` pose on the final line ("Quando estiver pronto(a)..."), and that reduced-motion (OS setting) leaves the avatar static.

- [ ] **Step 4: Commit**

```bash
git add components/transition/RitualTransition.tsx
git commit -m "feat: show the genie narrating the ritual transition"
```

---

### Task 9: Genie intro on the report

**Files:**
- Modify: `components/report/ReportView.tsx`

**Interfaces:**
- Consumes: `GenieAvatar` (Task 5), `report.genie_intro` (Task 3).

- [ ] **Step 1: Add the genie intro block**

Modify `components/report/ReportView.tsx`. Add the import:

```tsx
import { GenieAvatar } from '@/components/genie/GenieAvatar';
```

Insert, as the first child inside `<article className="mx-auto max-w-2xl px-6 py-16 md:px-0">`, before the existing `<p className="font-display text-sm uppercase ...">Sua leitura gratuita</p>` line:

```tsx
      <div className="flex items-center gap-4">
        <GenieAvatar mood={report.genie_intro.mood} size="sm" priority />
        <p className="font-display text-lg leading-snug text-parchment-100">{report.genie_intro.line}</p>
      </div>
```

- [ ] **Step 2: Type-check and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

- [ ] **Step 3: Manual check**

Run: `npm run dev`, complete the quiz, land on `/leitura/resultado`. Confirm the genie line appears at the very top of the report, above "Sua leitura gratuita", and that it mentions the name entered earlier.

- [ ] **Step 4: Commit**

```bash
git add components/report/ReportView.tsx
git commit -m "feat: show the genie's intro line at the top of the report"
```

---

### Task 10: Animated celestial background on the landing page

**Files:**
- Create: `components/landing/CelestialBackdrop.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Produces: `CelestialBackdrop()`, a `fixed inset-0 -z-10 pointer-events-none` layer, self-contained (no props).

- [ ] **Step 1: Write the component**

```tsx
// components/landing/CelestialBackdrop.tsx
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
```

- [ ] **Step 2: Wire it into the landing page**

Modify `app/page.tsx`:

```tsx
import { LandingHero } from '@/components/landing/LandingHero';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { TrustSection } from '@/components/landing/TrustSection';
import { FinalCta } from '@/components/landing/FinalCta';
import { RevealOnScroll } from '@/components/motion/RevealOnScroll';
import { CelestialBackdrop } from '@/components/landing/CelestialBackdrop';

export default function LandingPage() {
  return (
    <>
      <CelestialBackdrop />
      <main className="relative">
        <LandingHero />
        <RevealOnScroll>
          <HowItWorks />
        </RevealOnScroll>
        <RevealOnScroll delay={0.1}>
          <TrustSection />
        </RevealOnScroll>
        <FinalCta />
      </main>
    </>
  );
}
```

- [ ] **Step 3: Type-check and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

- [ ] **Step 4: Manual check**

Run: `npm run dev`, open `/`. Confirm the background blobs drift and stars twinkle slowly and subtly (not distracting, not covering text), and that toggling OS reduced-motion freezes them to a static frame. Confirm `/leitura`, `/leitura/preparando`, and `/leitura/resultado` still show the plain solid `ink-950` background (no backdrop leaking into those routes). Run a Lighthouse pass on `/` and confirm LCP stays under ~2.5s.

- [ ] **Step 5: Commit**

```bash
git add components/landing/CelestialBackdrop.tsx app/page.tsx
git commit -m "feat: add animated celestial background to the landing page"
```

---

### Task 11: Genie in the landing hero

**Files:**
- Modify: `components/landing/LandingHero.tsx`

**Interfaces:**
- Consumes: `GenieAvatar` (Task 5).

- [ ] **Step 1: Replace the stock photo with the genie**

Modify `components/landing/LandingHero.tsx`. Remove the `import Image from 'next/image';` line (no longer used). Add:

```tsx
import { GenieAvatar } from '@/components/genie/GenieAvatar';
```

Replace the block:

```tsx
      <div className="relative mt-12 aspect-[4/5] w-full overflow-hidden rounded-2xl lg:mt-0">
        <Image
          src="/images/hero-celestial.jpg"
          alt="Ilustração mística de uma carta de tarot iluminada sob um céu estrelado"
          fill
          priority
          sizes="(min-width: 1024px) 40vw, 90vw"
          className="object-cover"
        />
      </div>
```

with:

```tsx
      <div className="relative mt-12 flex flex-col items-center gap-4 lg:mt-0">
        <GenieAvatar mood="neutral" size="lg" priority />
        <p className="max-w-[26ch] text-center font-display text-base text-parchment-400">
          Sou seu guia nessa leitura. Vamos começar?
        </p>
      </div>
```

- [ ] **Step 2: Type-check and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

- [ ] **Step 3: Manual check**

Run: `npm run dev`, open `/`. Confirm the genie (not the old stock photo) appears in the hero, floating over the animated backdrop from Task 10, with the greeting line beneath it. Check mobile width (< 768px) to confirm it stacks cleanly above/below the text column.

- [ ] **Step 4: Commit**

```bash
git add components/landing/LandingHero.tsx
git commit -m "feat: replace stock hero photo with the genie"
```
