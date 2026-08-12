# Fase 1: Core Funnel Skeleton Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a fully clickable funnel (landing → quiz → ritual transition → free report) with mock AI content, in the exact data shape the real AI Gateway will return in Fase 2.

**Architecture:** Next.js 15 App Router + TypeScript + Tailwind v4. Quiz state lives in a React Context backed by `useReducer`, mirrored to `sessionStorage`. Report content comes from a pure `generateMockReport(session)` function whose output type (`Report`) is the exact contract the real AI call will fulfill later — only the data source changes in Fase 2, not the render layer.

**Tech Stack:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4, `motion` (motion/react), `@phosphor-icons/react`, Vitest for unit tests.

## Global Constraints

- Design doc: `docs/superpowers/specs/2026-08-12-fase1-core-funnel-skeleton-design.md`. Parent product spec: `TAROT-AI-SPEC-V2.md`.
- All user-facing copy is Portuguese (PT-BR), warm/intimate tone, no fear-mongering, no medical/financial/legal claims (parent spec §9).
- Palette locked: background `#09090b` (ink-950), elevated surface `#131316` (ink-900), text `#f5f3ef` (parchment-100), muted text `#a8a29e` (parchment-400), single accent `#d4a24e` (gold-400), hover accent `#e8b968` (gold-300). No purple, no pure black/white. One theme (dark) for the whole site, no section flips.
- Fonts: `Outfit` (display/headings) + `Manrope` (body), loaded via `next/font/google`. No Inter, no serif.
- Shape lock: cards and inputs use `rounded-2xl` (16px), buttons use `rounded-full` (pill). No other radius values.
- Zero em-dash (`—` or `–`) anywhere in copy or code comments visible to a reader. Use a plain hyphen `-`.
- Any animation above trivial hover/tap MUST wrap `useReducedMotion()` from `motion/react` and degrade to static.
- No backend in this phase: no DB, no real AI call, no payment, no Meta Pixel, no rate limiting. Quiz session shape (`name`, `birthDate`, `answers`) must match the parent spec's future `quiz_sessions` columns so Fase 2 persistence is a direct mapping, not a reshape.
- Package manager: npm.

---

### Task 1: Project scaffold

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `postcss.config.mjs`
- Create: `eslint.config.mjs`
- Create: `vitest.config.ts`
- Create: `next-env.d.ts`
- Create: `.gitignore`
- Create: `app/layout.tsx` (placeholder, replaced in Task 2)
- Create: `app/page.tsx` (placeholder, replaced in Task 7)
- Create: `app/globals.css` (placeholder, replaced in Task 2)

**Interfaces:**
- Produces: a buildable Next.js App Router project at the repo root, `npm run dev` / `npm run build` / `npm run test` / `npm run lint` all runnable.

- [ ] **Step 1: Write `package.json`**

```json
{
  "name": "tarot-ai",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "test": "vitest run"
  },
  "dependencies": {
    "next": "^15.1.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "motion": "^11.15.0",
    "@phosphor-icons/react": "^2.1.7"
  },
  "devDependencies": {
    "typescript": "^5.7.0",
    "@types/node": "^22.10.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/postcss": "^4.0.0",
    "eslint": "^9.17.0",
    "eslint-config-next": "^15.1.0",
    "@eslint/eslintrc": "^3.2.0",
    "vitest": "^2.1.8"
  }
}
```

- [ ] **Step 2: Write `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 3: Write `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `vitest.config.ts`, `next-env.d.ts`, `.gitignore`**

`next.config.ts`:
```ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {};

export default nextConfig;
```

`postcss.config.mjs`:
```js
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};

export default config;
```

`eslint.config.mjs`:
```js
import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat({ baseDirectory: import.meta.dirname });

const eslintConfig = [...compat.extends('next/core-web-vitals', 'next/typescript')];

export default eslintConfig;
```

`vitest.config.ts`:
```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['lib/**/*.test.ts'],
  },
});
```

`next-env.d.ts`:
```ts
/// <reference types="next" />
/// <reference types="next/image-types/global" />
```

`.gitignore`:
```
node_modules
.next
out
.env*.local
*.log
.DS_Store
```

- [ ] **Step 4: Write placeholder `app/layout.tsx`, `app/page.tsx`, `app/globals.css`**

`app/globals.css`:
```css
@import "tailwindcss";
```

`app/layout.tsx`:
```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
```

`app/page.tsx`:
```tsx
export default function Home() {
  return <main>Em construção</main>;
}
```

- [ ] **Step 5: Install dependencies**

Run: `npm install`
Expected: installs without errors, creates `node_modules` and `package-lock.json`.

- [ ] **Step 6: Verify the project builds**

Run: `npm run build`
Expected: succeeds, creates `.next/`.

- [ ] **Step 7: Init git and commit**

```bash
git init
git add package.json package-lock.json tsconfig.json next.config.ts postcss.config.mjs eslint.config.mjs vitest.config.ts next-env.d.ts .gitignore app docs TAROT-AI-SPEC.md TAROT-AI-SPEC-V2.md
git commit -m "chore: scaffold Next.js 15 project with Tailwind v4 and Vitest"
```

---

### Task 2: Design tokens and root layout

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`

**Interfaces:**
- Produces: Tailwind v4 theme tokens (`bg-ink-950`, `text-parchment-100`, `text-gold-400`, `font-display`, `font-body`, etc.) available to every later component. Root layout applies `font-body` and the dark background globally and honors `prefers-reduced-motion`.

- [ ] **Step 1: Write the theme tokens**

`app/globals.css`:
```css
@import "tailwindcss";

@theme {
  --color-ink-950: #09090b;
  --color-ink-900: #131316;
  --color-parchment-100: #f5f3ef;
  --color-parchment-400: #a8a29e;
  --color-gold-400: #d4a24e;
  --color-gold-300: #e8b968;
  --font-display: var(--font-outfit);
  --font-body: var(--font-manrope);
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 2: Wire fonts and metadata into the root layout**

`app/layout.tsx`:
```tsx
import type { Metadata } from 'next';
import { Outfit, Manrope } from 'next/font/google';
import './globals.css';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit', display: 'swap' });
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope', display: 'swap' });

export const metadata: Metadata = {
  title: 'Sua Leitura de Tarot Personalizada',
  description: 'Uma leitura criada a partir das suas respostas, com IA e simbolismo do Tarot.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${outfit.variable} ${manrope.variable}`}>
      <body className="min-h-dvh bg-ink-950 text-parchment-100 font-body antialiased">
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Verify the build still succeeds**

Run: `npm run build`
Expected: succeeds, no Tailwind or font errors.

- [ ] **Step 4: Commit**

```bash
git add app/globals.css app/layout.tsx
git commit -m "feat: add dark celestial design tokens and root layout fonts"
```

---

### Task 3: Domain types and quiz question data

**Files:**
- Create: `lib/report-types.ts`
- Create: `lib/quiz-questions.ts`
- Test: `lib/__tests__/quiz-questions.test.ts`

**Interfaces:**
- Produces: `Report`, `QuizSession` types (from `lib/report-types.ts`); `QuizQuestion`, `ChoiceOption`, `QUIZ_QUESTIONS` (from `lib/quiz-questions.ts`). Every later task that touches quiz or report data imports from these two files.

- [ ] **Step 1: Write `lib/report-types.ts`**

```ts
export type Report = {
  title: string;
  opening: string;
  current_moment: string;
  strengths: string[];
  tensions: string[];
  personalized_teaser: string;
  sections: { title: string; content: string }[];
  final_message: string;
};

export type QuizSession = {
  name: string;
  birthDate: string;
  answers: Record<string, string>;
};
```

- [ ] **Step 2: Write the failing test for question data**

`lib/__tests__/quiz-questions.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { QUIZ_QUESTIONS } from '../quiz-questions';

describe('QUIZ_QUESTIONS', () => {
  it('has exactly 14 questions', () => {
    expect(QUIZ_QUESTIONS).toHaveLength(14);
  });

  it('has unique ids', () => {
    const ids = QUIZ_QUESTIONS.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('has exactly 10 choice, 2 open, 1 name, 1 birthdate question', () => {
    const counts = QUIZ_QUESTIONS.reduce<Record<string, number>>((acc, q) => {
      acc[q.type] = (acc[q.type] ?? 0) + 1;
      return acc;
    }, {});
    expect(counts.choice).toBe(10);
    expect(counts.open).toBe(2);
    expect(counts.name).toBe(1);
    expect(counts.birthdate).toBe(1);
  });
});
```

- [ ] **Step 3: Run the test and verify it fails**

Run: `npx vitest run lib/__tests__/quiz-questions.test.ts`
Expected: FAIL with "Cannot find module '../quiz-questions'".

- [ ] **Step 4: Write `lib/quiz-questions.ts`**

```ts
export type ChoiceOption = { id: string; label: string; emoji?: string };

export type QuizQuestion =
  | { id: string; type: 'choice'; prompt: string; options: ChoiceOption[] }
  | { id: string; type: 'open'; prompt: string; placeholder: string; maxLength: number }
  | { id: 'name'; type: 'name'; prompt: string; placeholder: string }
  | { id: 'birth_date'; type: 'birthdate'; prompt: string; helper: string };

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'situacao_atual',
    type: 'choice',
    prompt: 'Qual dessas situações mais parece com o seu momento atual?',
    options: [
      { id: 'amor', label: 'Estou vivendo algo intenso no amor', emoji: '❤️' },
      { id: 'decisao', label: 'Estou confuso(a) sobre uma decisão', emoji: '💭' },
      { id: 'dinheiro', label: 'Quero mudar minha situação financeira', emoji: '💰' },
      { id: 'fase_nova', label: 'Sinto que estou entrando em uma nova fase', emoji: '🌙' },
    ],
  },
  {
    id: 'rotina_atual',
    type: 'choice',
    prompt: 'Quando você pensa no seu dia a dia agora, o que mais sente?',
    options: [
      { id: 'cansaco', label: 'Cansaço, mesmo fazendo pouco' },
      { id: 'vontade_mudar', label: 'Vontade de mudar tudo' },
      { id: 'calma_alerta', label: 'Calma, mas em alerta' },
      { id: 'ansiedade', label: 'Ansiedade sobre o que vem' },
    ],
  },
  {
    id: 'lida_incerteza',
    type: 'choice',
    prompt: 'Como você costuma lidar com incerteza?',
    options: [
      { id: 'controlar', label: 'Tento controlar tudo que dá' },
      { id: 'fluxo', label: 'Sigo o fluxo e vejo no que dá' },
      { id: 'ajuda', label: 'Peço ajuda ou conselho de alguém' },
      { id: 'evitar', label: 'Evito pensar nisso até precisar decidir' },
    ],
  },
  {
    id: 'peso_relacoes',
    type: 'choice',
    prompt: 'O que mais pesa nas suas relações agora?',
    options: [
      { id: 'medo_abrir', label: 'Medo de me abrir de novo' },
      { id: 'dar_mais', label: 'Sinto que dou mais do que recebo' },
      { id: 'falta_algo', label: 'Está tudo bem, mas falta algo' },
      { id: 'sozinho', label: 'Estou sozinho(a), e tudo bem por enquanto' },
    ],
  },
  {
    id: 'mudar_agora',
    type: 'choice',
    prompt: 'Se pudesse mudar uma coisa agora, seria...',
    options: [
      { id: 'rotina', label: 'Minha rotina' },
      { id: 'relacionamento', label: 'Um relacionamento' },
      { id: 'financeiro', label: 'Minha situação financeira' },
      { id: 'autoimagem', label: 'Como eu me vejo' },
    ],
  },
  {
    id: 'elemento',
    type: 'choice',
    prompt: 'Qual elemento mais combina com o seu momento?',
    options: [
      { id: 'fogo', label: 'Fogo, impulso pra agir', emoji: '🔥' },
      { id: 'agua', label: 'Água, sensibilidade e emoção', emoji: '💧' },
      { id: 'terra', label: 'Terra, precisando de estabilidade', emoji: '🌍' },
      { id: 'ar', label: 'Ar, cabeça cheia de ideias', emoji: '🌬️' },
    ],
  },
  {
    id: 'sono',
    type: 'open',
    prompt: 'O que mais tem tirado seu sono ultimamente?',
    placeholder: 'Escreva com suas palavras...',
    maxLength: 280,
  },
  {
    id: 'depois_do_erro',
    type: 'choice',
    prompt: 'Quando algo dá errado, você costuma...',
    options: [
      { id: 'culpa', label: 'Se culpar primeiro' },
      { id: 'entender', label: 'Buscar entender o porquê' },
      { id: 'seguir', label: 'Seguir em frente rápido' },
      { id: 'remoer', label: 'Ficar remoendo por dias' },
    ],
  },
  {
    id: 'o_que_muda',
    type: 'choice',
    prompt: 'O que você sente que está prestes a mudar na sua vida?',
    options: [
      { id: 'relacionamento', label: 'Um relacionamento' },
      { id: 'trabalho', label: 'Meu trabalho ou carreira' },
      { id: 'autocuidado', label: 'Como eu cuido de mim' },
      { id: 'indefinido', label: 'Não sei, só sinto que algo vem' },
    ],
  },
  {
    id: 'deixar_para_tras',
    type: 'open',
    prompt: 'Existe algo que você sente que precisa deixar para trás?',
    placeholder: 'Escreva com suas palavras...',
    maxLength: 280,
  },
  {
    id: 'esperanca',
    type: 'choice',
    prompt: 'O que mais te dá esperança hoje?',
    options: [
      { id: 'pessoas', label: 'Pessoas que estão comigo' },
      { id: 'planos', label: 'Planos que ainda quero realizar' },
      { id: 'evolucao', label: 'Perceber o quanto já mudei' },
      { id: 'procurando', label: 'Ainda estou procurando' },
    ],
  },
  {
    id: 'dia_dificil',
    type: 'choice',
    prompt: 'Como você se descreveria num dia difícil?',
    options: [
      { id: 'forte_por_fora', label: 'Forte por fora, cansado(a) por dentro' },
      { id: 'processa_sozinho', label: 'Quieto(a), prefiro processar sozinho(a)' },
      { id: 'desabafa', label: 'Busco alguém pra desabafar' },
      { id: 'resolve_rapido', label: 'Tento resolver tudo rápido' },
    ],
  },
  {
    id: 'name',
    type: 'name',
    prompt: 'Antes de continuarmos, como você gostaria de ser chamado(a) na sua leitura?',
    placeholder: 'Seu nome ou apelido',
  },
  {
    id: 'birth_date',
    type: 'birthdate',
    prompt: 'Sua data de nascimento',
    helper:
      'Usaremos sua data para adicionar uma camada numerológica à sua leitura. Não é usada para nenhuma outra finalidade.',
  },
];
```

- [ ] **Step 5: Run the test and verify it passes**

Run: `npx vitest run lib/__tests__/quiz-questions.test.ts`
Expected: PASS, 3 tests.

- [ ] **Step 6: Commit**

```bash
git add lib/report-types.ts lib/quiz-questions.ts lib/__tests__/quiz-questions.test.ts
git commit -m "feat: add report and quiz question domain types with 14-question set"
```

---

### Task 4: Quiz reducer

**Files:**
- Create: `lib/quiz-reducer.ts`
- Test: `lib/__tests__/quiz-reducer.test.ts`

**Interfaces:**
- Consumes: `QuizSession` from `lib/report-types.ts`.
- Produces: `QuizState`, `QuizAction`, `initialQuizState`, `quizReducer(state, action): QuizState`. Consumed by `components/providers/QuizProvider.tsx` (Task 6).

- [ ] **Step 1: Write the failing tests**

`lib/__tests__/quiz-reducer.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { quizReducer, initialQuizState } from '../quiz-reducer';

describe('quizReducer', () => {
  it('merges an ANSWER action into answers', () => {
    const next = quizReducer(initialQuizState, {
      type: 'ANSWER',
      questionId: 'situacao_atual',
      value: 'amor',
    });
    expect(next.answers.situacao_atual).toBe('amor');
  });

  it('preserves previous answers when adding a new one', () => {
    const withFirst = quizReducer(initialQuizState, { type: 'ANSWER', questionId: 'a', value: '1' });
    const withSecond = quizReducer(withFirst, { type: 'ANSWER', questionId: 'b', value: '2' });
    expect(withSecond.answers).toEqual({ a: '1', b: '2' });
  });

  it('increments currentStep on NEXT', () => {
    const next = quizReducer(initialQuizState, { type: 'NEXT' });
    expect(next.currentStep).toBe(1);
  });

  it('does not go below 0 on BACK', () => {
    const next = quizReducer(initialQuizState, { type: 'BACK' });
    expect(next.currentStep).toBe(0);
  });

  it('replaces the whole state on HYDRATE', () => {
    const hydrated = { name: 'Ana', birthDate: '2000-01-01', answers: { a: '1' }, currentStep: 3 };
    const next = quizReducer(initialQuizState, { type: 'HYDRATE', state: hydrated });
    expect(next).toEqual(hydrated);
  });
});
```

- [ ] **Step 2: Run the tests and verify they fail**

Run: `npx vitest run lib/__tests__/quiz-reducer.test.ts`
Expected: FAIL with "Cannot find module '../quiz-reducer'".

- [ ] **Step 3: Write `lib/quiz-reducer.ts`**

```ts
import type { QuizSession } from './report-types';

export type QuizState = QuizSession & { currentStep: number };

export type QuizAction =
  | { type: 'ANSWER'; questionId: string; value: string }
  | { type: 'SET_NAME'; value: string }
  | { type: 'SET_BIRTH_DATE'; value: string }
  | { type: 'NEXT' }
  | { type: 'BACK' }
  | { type: 'HYDRATE'; state: QuizState };

export const initialQuizState: QuizState = {
  name: '',
  birthDate: '',
  answers: {},
  currentStep: 0,
};

export function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'ANSWER':
      return { ...state, answers: { ...state.answers, [action.questionId]: action.value } };
    case 'SET_NAME':
      return { ...state, name: action.value };
    case 'SET_BIRTH_DATE':
      return { ...state, birthDate: action.value };
    case 'NEXT':
      return { ...state, currentStep: state.currentStep + 1 };
    case 'BACK':
      return { ...state, currentStep: Math.max(0, state.currentStep - 1) };
    case 'HYDRATE':
      return action.state;
    default:
      return state;
  }
}
```

- [ ] **Step 4: Run the tests and verify they pass**

Run: `npx vitest run lib/__tests__/quiz-reducer.test.ts`
Expected: PASS, 5 tests.

- [ ] **Step 5: Commit**

```bash
git add lib/quiz-reducer.ts lib/__tests__/quiz-reducer.test.ts
git commit -m "feat: add pure quiz state reducer"
```

---

### Task 5: Mock report generator

**Files:**
- Create: `lib/generate-mock-report.ts`
- Test: `lib/__tests__/generate-mock-report.test.ts`

**Interfaces:**
- Consumes: `QuizSession`, `Report` from `lib/report-types.ts`.
- Produces: `generateMockReport(session: QuizSession): Report`. Consumed by `app/leitura/resultado/page.tsx` (Task 10). This is the exact contract the real AI call replaces in Fase 2.

- [ ] **Step 1: Write the failing tests**

`lib/__tests__/generate-mock-report.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { generateMockReport } from '../generate-mock-report';
import type { QuizSession } from '../report-types';

function makeSession(overrides: Partial<QuizSession> = {}): QuizSession {
  return {
    name: 'Ana',
    birthDate: '2000-01-01',
    answers: { situacao_atual: 'amor', elemento: 'agua', sono: 'meu ex ainda aparece nos meus pensamentos' },
    ...overrides,
  };
}

describe('generateMockReport', () => {
  it('uses the situation content matching situacao_atual', () => {
    const report = generateMockReport(
      makeSession({ answers: { situacao_atual: 'dinheiro', elemento: 'terra' } }),
    );
    expect(report.current_moment).toContain('dinheiro');
  });

  it('falls back to fase_nova content for an unknown situation', () => {
    const report = generateMockReport(
      makeSession({ answers: { situacao_atual: 'inexistente', elemento: 'ar' } }),
    );
    expect(report.current_moment).toContain('ciclo');
  });

  it('falls back to agua element content for an unknown elemento', () => {
    const report = generateMockReport(
      makeSession({ answers: { situacao_atual: 'amor', elemento: 'inexistente', sono: 'x' } }),
    );
    expect(report.sections[0].content).toContain('sente antes de entender');
  });

  it('includes the open-text excerpt in the personalized teaser', () => {
    const report = generateMockReport(makeSession());
    expect(report.personalized_teaser).toContain('meu ex ainda aparece nos meus pensamentos');
  });

  it('falls back to "você" when name is empty', () => {
    const report = generateMockReport(makeSession({ name: '' }));
    expect(report.opening.startsWith('você,')).toBe(true);
  });
});
```

- [ ] **Step 2: Run the tests and verify they fail**

Run: `npx vitest run lib/__tests__/generate-mock-report.test.ts`
Expected: FAIL with "Cannot find module '../generate-mock-report'".

- [ ] **Step 3: Write `lib/generate-mock-report.ts`**

```ts
import type { QuizSession, Report } from './report-types';

const SITUATION_CONTENT: Record<
  string,
  { current_moment: string; strengths: string[]; tensions: string[] }
> = {
  amor: {
    current_moment:
      'Você está atravessando um momento em que o coração pede mais clareza do que respostas prontas. Alguma coisa no campo afetivo ainda está se reorganizando, e tudo bem que ainda não faça sentido completo.',
    strengths: [
      'Você não finge sentir o que não sente, mesmo quando seria mais fácil.',
      'Consegue perceber quando uma relação deixou de fazer bem, mesmo antes de agir sobre isso.',
    ],
    tensions: [
      'Às vezes você espera demais antes de se permitir pedir o que precisa.',
      'Tende a carregar mágoas antigas para dentro de vínculos novos, sem perceber.',
    ],
  },
  decisao: {
    current_moment:
      'Existe uma escolha rondando sua cabeça há mais tempo do que você admite. Não é falta de opções, é medo de errar que está te travando.',
    strengths: [
      'Você pensa nas consequências antes de agir, o que evita muita dor de cabeça.',
      'Sabe ouvir os dois lados antes de formar uma opinião.',
    ],
    tensions: [
      'Analisar demais tem te impedido de sentir o que você realmente quer.',
      'Você costuma pedir opinião de todo mundo, menos da própria intuição.',
    ],
  },
  dinheiro: {
    current_moment:
      'Sua relação com dinheiro está pedindo uma virada, não necessariamente de quanto entra, mas de como você lida com o que já tem.',
    strengths: [
      'Você já percebeu padrões que te atrapalham financeiramente, o que é o primeiro passo real pra mudar.',
      'Não se deixa levar por promessas fáceis demais.',
    ],
    tensions: [
      'Costuma adiar decisões financeiras importantes até virarem urgência.',
      'Mistura autoestima com quanto está ganhando, e isso pesa mais do que devia.',
    ],
  },
  fase_nova: {
    current_moment:
      'Tem uma sensação de fechamento de ciclo rondando você, mesmo que ainda não saiba nomear o que está começando.',
    strengths: [
      'Você reconhece quando algo não serve mais, mesmo sem ter o próximo passo definido.',
      'Se adapta rápido quando decide se mover de verdade.',
    ],
    tensions: [
      'Fica tempo demais no "quase decidindo", o que cansa mais do que decidir errado.',
      'Tem medo de recomeçar sozinho(a), mesmo sabendo que precisa.',
    ],
  },
};

const ELEMENT_CONTENT: Record<string, string> = {
  fogo: 'Fogo é o elemento de quem age primeiro e processa depois. Sua energia agora pede movimento, mas vale escolher as batalhas: nem tudo precisa ser resolvido hoje.',
  agua: 'Água é sensibilidade que enxerga o que os outros não veem. Você sente antes de entender, e está tudo bem demorar pra colocar isso em palavras.',
  terra: 'Terra pede raiz antes de crescimento. Seu momento não é sobre pressa, é sobre construir uma base que aguente o que vem depois.',
  ar: 'Ar é cabeça cheia de possibilidades. O desafio agora não é ter mais ideias, é escolher qual delas merece virar ação.',
};

const DEFAULT_SITUATION = SITUATION_CONTENT.fase_nova;
const DEFAULT_ELEMENT = ELEMENT_CONTENT.agua;

export function generateMockReport(session: QuizSession): Report {
  const name = session.name.trim() || 'você';
  const situation = SITUATION_CONTENT[session.answers.situacao_atual] ?? DEFAULT_SITUATION;
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
  };
}
```

- [ ] **Step 4: Run the tests and verify they pass**

Run: `npx vitest run lib/__tests__/generate-mock-report.test.ts`
Expected: PASS, 5 tests.

- [ ] **Step 5: Commit**

```bash
git add lib/generate-mock-report.ts lib/__tests__/generate-mock-report.test.ts
git commit -m "feat: add mock report generator matching the Fase 2 AI output contract"
```

---

### Task 6: QuizProvider and `/leitura` layout

**Files:**
- Create: `components/providers/QuizProvider.tsx`
- Create: `app/leitura/layout.tsx`

**Interfaces:**
- Consumes: `QuizState`, `QuizAction`, `quizReducer`, `initialQuizState` from `lib/quiz-reducer.ts`.
- Produces: `QuizProvider` (component), `useQuiz(): { state: QuizState; dispatch: Dispatch<QuizAction> }`. Consumed by `QuizFlow` (Task 8) and `app/leitura/resultado/page.tsx` (Task 10).

- [ ] **Step 1: Write `components/providers/QuizProvider.tsx`**

```tsx
'use client';

import { createContext, useContext, useEffect, useReducer, type Dispatch, type ReactNode } from 'react';
import { quizReducer, initialQuizState, type QuizState, type QuizAction } from '@/lib/quiz-reducer';

const STORAGE_KEY = 'tarot_quiz_session_v1';

type QuizContextValue = { state: QuizState; dispatch: Dispatch<QuizAction> };

const QuizContext = createContext<QuizContextValue | null>(null);

function readStoredState(): QuizState {
  if (typeof window === 'undefined') return initialQuizState;
  const stored = window.sessionStorage.getItem(STORAGE_KEY);
  if (!stored) return initialQuizState;
  try {
    return JSON.parse(stored) as QuizState;
  } catch {
    return initialQuizState;
  }
}

export function QuizProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(quizReducer, initialQuizState, readStoredState);

  useEffect(() => {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  return <QuizContext.Provider value={{ state, dispatch }}>{children}</QuizContext.Provider>;
}

export function useQuiz(): QuizContextValue {
  const context = useContext(QuizContext);
  if (!context) throw new Error('useQuiz must be used within a QuizProvider');
  return context;
}
```

- [ ] **Step 2: Write `app/leitura/layout.tsx`**

```tsx
import { QuizProvider } from '@/components/providers/QuizProvider';

export default function LeituraLayout({ children }: { children: React.ReactNode }) {
  return <QuizProvider>{children}</QuizProvider>;
}
```

- [ ] **Step 3: Verify the build still succeeds**

Run: `npm run build`
Expected: succeeds (no routes consume `useQuiz` yet, so this only checks the provider compiles).

- [ ] **Step 4: Commit**

```bash
git add components/providers/QuizProvider.tsx app/leitura/layout.tsx
git commit -m "feat: add quiz context provider with sessionStorage persistence"
```

---

### Task 7: Landing page

**Files:**
- Create: `components/motion/RevealOnScroll.tsx`
- Create: `components/landing/LandingHero.tsx`
- Create: `components/landing/HowItWorks.tsx`
- Create: `components/landing/TrustSection.tsx`
- Create: `components/landing/FinalCta.tsx`
- Modify: `app/page.tsx`
- Create: `public/images/hero-celestial.jpg` (generated asset)

**Interfaces:**
- Produces: the `/` route fully rendered. No other task consumes these components.

- [ ] **Step 1: Write `components/motion/RevealOnScroll.tsx`**

```tsx
'use client';

import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';

export function RevealOnScroll({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 2: Generate the hero image**

Call the Gamma image generation tool with:
- `prompt`: "A single ornate tarot card partially glowing with warm gold light, floating above a dark near-black night sky scattered with soft stars, cinematic mystical mood, minimal, no text, no human face, premium editorial photography style, on a dark background"
- `type`: `"photo"`
- `sizePreset`: `"social-portrait"`

Poll `get_image_generation_status` until `status` is `"completed"`, then download the returned image URL to `public/images/hero-celestial.jpg`:

```bash
curl -L "<returned-image-url>" -o public/images/hero-celestial.jpg
```

- [ ] **Step 3: Write `components/landing/LandingHero.tsx`**

```tsx
import Image from 'next/image';
import Link from 'next/link';

export function LandingHero() {
  return (
    <section className="relative flex min-h-[100dvh] flex-col justify-center px-6 pt-16 pb-12 md:px-12 lg:grid lg:grid-cols-2 lg:items-center lg:gap-12">
      <div className="relative z-10 max-w-xl">
        <p className="mb-4 font-display text-sm uppercase tracking-[0.18em] text-gold-400">Tarot + IA</p>
        <h1 className="font-display text-4xl leading-[1.05] tracking-tight text-parchment-100 md:text-5xl lg:text-6xl">
          Uma leitura criada a partir das suas respostas.
        </h1>
        <p className="mt-6 max-w-[42ch] text-base leading-relaxed text-parchment-400">
          Responda algumas perguntas sobre o seu momento. A partir delas, uma IA monta uma leitura simbólica só sua.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/leitura"
            className="inline-flex items-center justify-center rounded-full bg-gold-400 px-8 py-4 font-display text-sm font-medium text-ink-950 transition-transform duration-300 ease-out hover:-translate-y-0.5 hover:bg-gold-300 active:translate-y-0 active:scale-[0.98]"
          >
            Descobrir minha leitura
          </Link>
        </div>
      </div>
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
    </section>
  );
}
```

- [ ] **Step 4: Write `components/landing/HowItWorks.tsx`**

```tsx
export function HowItWorks() {
  return (
    <section className="px-6 py-20 md:px-12 md:py-28">
      <h2 className="max-w-2xl font-display text-3xl leading-tight tracking-tight text-parchment-100 md:text-4xl">
        Como funciona, do jeito mais simples possível.
      </h2>
      <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-ink-900 to-gold-400/10 p-8 md:col-span-2">
          <span className="font-display text-4xl text-gold-400">01</span>
          <h3 className="mt-4 font-display text-xl text-parchment-100">Você responde</h3>
          <p className="mt-2 max-w-[46ch] text-parchment-400">
            Perguntas rápidas sobre o seu momento agora: amor, decisões, dinheiro, fases da vida. Sem enrolação.
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-ink-900 p-8">
          <span className="font-display text-4xl text-gold-400">02</span>
          <h3 className="mt-4 font-display text-xl text-parchment-100">A IA monta sua leitura</h3>
          <p className="mt-2 text-parchment-400">
            Suas respostas viram uma leitura simbólica, escrita pra você, não um texto genérico.
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-ink-900 p-8 md:col-span-3">
          <span className="font-display text-4xl text-gold-400">03</span>
          <h3 className="mt-4 font-display text-xl text-parchment-100">Você recebe, na hora</h3>
          <p className="mt-2 max-w-[60ch] text-parchment-400">
            Um relatório gratuito aparece na tela em minutos, com pontos fortes, pontos de atenção e um gancho pro
            que vem a seguir.
          </p>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Write `components/landing/TrustSection.tsx`**

```tsx
import { ShieldCheck, Sparkle, LockKey } from '@phosphor-icons/react/dist/ssr';

const POINTS = [
  {
    icon: Sparkle,
    title: 'Leitura simbólica, não científica',
    body: 'Tarot e numerologia aqui são ferramentas de reflexão e autoconhecimento, não previsão garantida.',
  },
  {
    icon: ShieldCheck,
    title: 'Suas respostas moldam o resultado',
    body: 'Nada de texto genérico: a IA usa o que você escreveu de verdade.',
  },
  {
    icon: LockKey,
    title: 'Seus dados, protegidos',
    body: 'Usamos suas respostas só pra gerar sua leitura. Nada de venda de dados.',
  },
];

export function TrustSection() {
  return (
    <section className="border-t border-white/10 px-6 py-20 md:px-12 md:py-28">
      <h2 className="max-w-xl font-display text-2xl text-parchment-100 md:text-3xl">
        Transparência antes de qualquer coisa.
      </h2>
      <div className="mt-10 divide-y divide-white/10 border-t border-white/10">
        {POINTS.map(({ icon: Icon, title, body }) => (
          <div key={title} className="flex items-start gap-5 py-6">
            <Icon size={24} weight="light" className="mt-1 shrink-0 text-gold-400" />
            <div>
              <h3 className="font-display text-lg text-parchment-100">{title}</h3>
              <p className="mt-1 max-w-[60ch] text-parchment-400">{body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 6: Write `components/landing/FinalCta.tsx`**

```tsx
import Link from 'next/link';

export function FinalCta() {
  return (
    <section className="border-t border-white/10 px-6 py-20 text-center md:px-12 md:py-28">
      <h2 className="mx-auto max-w-xl font-display text-3xl text-parchment-100 md:text-4xl">
        Veja o que sua leitura revela sobre o momento que você está vivendo.
      </h2>
      <Link
        href="/leitura"
        className="mt-8 inline-flex items-center justify-center rounded-full bg-gold-400 px-8 py-4 font-display text-sm font-medium text-ink-950 transition-transform duration-300 ease-out hover:-translate-y-0.5 hover:bg-gold-300 active:translate-y-0 active:scale-[0.98]"
      >
        Descobrir minha leitura
      </Link>
    </section>
  );
}
```

- [ ] **Step 7: Wire the landing page**

`app/page.tsx`:
```tsx
import { LandingHero } from '@/components/landing/LandingHero';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { TrustSection } from '@/components/landing/TrustSection';
import { FinalCta } from '@/components/landing/FinalCta';
import { RevealOnScroll } from '@/components/motion/RevealOnScroll';

export default function LandingPage() {
  return (
    <main>
      <LandingHero />
      <RevealOnScroll>
        <HowItWorks />
      </RevealOnScroll>
      <RevealOnScroll delay={0.1}>
        <TrustSection />
      </RevealOnScroll>
      <FinalCta />
    </main>
  );
}
```

- [ ] **Step 8: Verify the build succeeds and check the page manually**

Run: `npm run build`, then `npm run dev` and open `http://localhost:3000`.
Expected: hero renders with the generated image, headline fits two lines, CTA is a single line, sections below render without layout shift.

- [ ] **Step 9: Commit**

```bash
git add components/motion components/landing app/page.tsx public/images/hero-celestial.jpg
git commit -m "feat: build landing page with hero, how-it-works, trust section, final CTA"
```

---

### Task 8: Quiz UI and `/leitura` route

**Files:**
- Create: `components/quiz/ProgressBar.tsx`
- Create: `components/quiz/QuestionCard.tsx`
- Create: `components/quiz/OpenTextStep.tsx`
- Create: `components/quiz/NameStep.tsx`
- Create: `components/quiz/BirthDateStep.tsx`
- Create: `components/quiz/QuizFlow.tsx`
- Create: `app/leitura/page.tsx`

**Interfaces:**
- Consumes: `useQuiz` from `components/providers/QuizProvider.tsx` (Task 6); `QUIZ_QUESTIONS`, `QuizQuestion` from `lib/quiz-questions.ts` (Task 3).
- Produces: the `/leitura` route, fully interactive.

- [ ] **Step 1: Write `components/quiz/ProgressBar.tsx`**

```tsx
export function ProgressBar({ current, total }: { current: number; total: number }) {
  const percent = Math.round((current / total) * 100);
  return (
    <div
      className="h-1 w-full rounded-full bg-white/10"
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full rounded-full bg-gold-400 transition-[width] duration-500 ease-out"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
```

- [ ] **Step 2: Write `components/quiz/QuestionCard.tsx`**

```tsx
'use client';

import { motion, useReducedMotion } from 'motion/react';
import type { QuizQuestion } from '@/lib/quiz-questions';

type Props = {
  question: Extract<QuizQuestion, { type: 'choice' }>;
  value: string | undefined;
  onAnswer: (optionId: string) => void;
};

export function QuestionCard({ question, value, onAnswer }: Props) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-md"
    >
      <h2 className="font-display text-2xl leading-snug text-parchment-100">{question.prompt}</h2>
      <div className="mt-8 flex flex-col gap-3">
        {question.options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onAnswer(option.id)}
            aria-pressed={value === option.id}
            className={`flex items-center gap-3 rounded-2xl border px-5 py-4 text-left transition-colors duration-200 ${
              value === option.id
                ? 'border-gold-400 bg-gold-400/10 text-parchment-100'
                : 'border-white/10 bg-ink-900 text-parchment-400 hover:border-white/20 hover:text-parchment-100'
            }`}
          >
            {option.emoji ? <span className="text-xl">{option.emoji}</span> : null}
            <span>{option.label}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 3: Write `components/quiz/OpenTextStep.tsx`**

```tsx
'use client';

import { useState } from 'react';
import type { QuizQuestion } from '@/lib/quiz-questions';

type Props = {
  question: Extract<QuizQuestion, { type: 'open' }>;
  value: string | undefined;
  onSubmit: (value: string) => void;
};

export function OpenTextStep({ question, value, onSubmit }: Props) {
  const [text, setText] = useState(value ?? '');

  return (
    <div className="w-full max-w-md">
      <h2 className="font-display text-2xl leading-snug text-parchment-100">{question.prompt}</h2>
      <textarea
        value={text}
        onChange={(event) => setText(event.target.value.slice(0, question.maxLength))}
        placeholder={question.placeholder}
        rows={4}
        className="mt-8 w-full rounded-2xl border border-white/10 bg-ink-900 px-5 py-4 text-parchment-100 outline-none transition-colors duration-200 placeholder:text-parchment-400/60 focus:border-gold-400"
      />
      <p className="mt-2 text-right text-xs text-parchment-400">
        {text.length}/{question.maxLength}
      </p>
      <button
        type="button"
        disabled={text.trim().length === 0}
        onClick={() => onSubmit(text.trim())}
        className="mt-6 inline-flex items-center justify-center rounded-full bg-gold-400 px-8 py-4 font-display text-sm font-medium text-ink-950 transition-transform duration-300 ease-out hover:-translate-y-0.5 hover:bg-gold-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
      >
        Continuar
      </button>
    </div>
  );
}
```

- [ ] **Step 4: Write `components/quiz/NameStep.tsx` and `components/quiz/BirthDateStep.tsx`**

`components/quiz/NameStep.tsx`:
```tsx
'use client';

import { useState } from 'react';

export function NameStep({ value, onSubmit }: { value: string; onSubmit: (value: string) => void }) {
  const [name, setName] = useState(value);
  return (
    <div className="w-full max-w-md">
      <h2 className="font-display text-2xl leading-snug text-parchment-100">
        Antes de continuarmos, como você gostaria de ser chamado(a) na sua leitura?
      </h2>
      <input
        type="text"
        value={name}
        onChange={(event) => setName(event.target.value.slice(0, 60))}
        placeholder="Seu nome ou apelido"
        className="mt-8 w-full rounded-2xl border border-white/10 bg-ink-900 px-5 py-4 text-parchment-100 outline-none transition-colors duration-200 placeholder:text-parchment-400/60 focus:border-gold-400"
      />
      <button
        type="button"
        disabled={name.trim().length === 0}
        onClick={() => onSubmit(name.trim())}
        className="mt-6 inline-flex items-center justify-center rounded-full bg-gold-400 px-8 py-4 font-display text-sm font-medium text-ink-950 transition-transform duration-300 ease-out hover:-translate-y-0.5 hover:bg-gold-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
      >
        Continuar
      </button>
    </div>
  );
}
```

`components/quiz/BirthDateStep.tsx`:
```tsx
'use client';

import { useState } from 'react';

export function BirthDateStep({ value, onSubmit }: { value: string; onSubmit: (value: string) => void }) {
  const [date, setDate] = useState(value);
  return (
    <div className="w-full max-w-md">
      <h2 className="font-display text-2xl leading-snug text-parchment-100">Sua data de nascimento</h2>
      <p className="mt-3 text-parchment-400">
        Usaremos sua data para adicionar uma camada numerológica à sua leitura. Não é usada para nenhuma outra
        finalidade.
      </p>
      <input
        type="date"
        value={date}
        onChange={(event) => setDate(event.target.value)}
        className="mt-8 w-full rounded-2xl border border-white/10 bg-ink-900 px-5 py-4 text-parchment-100 outline-none transition-colors duration-200 focus:border-gold-400"
      />
      <button
        type="button"
        disabled={date.length === 0}
        onClick={() => onSubmit(date)}
        className="mt-6 inline-flex items-center justify-center rounded-full bg-gold-400 px-8 py-4 font-display text-sm font-medium text-ink-950 transition-transform duration-300 ease-out hover:-translate-y-0.5 hover:bg-gold-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
      >
        Continuar
      </button>
    </div>
  );
}
```

- [ ] **Step 5: Write `components/quiz/QuizFlow.tsx`**

```tsx
'use client';

import { useRouter } from 'next/navigation';
import { useQuiz } from '@/components/providers/QuizProvider';
import { QUIZ_QUESTIONS } from '@/lib/quiz-questions';
import { ProgressBar } from './ProgressBar';
import { QuestionCard } from './QuestionCard';
import { OpenTextStep } from './OpenTextStep';
import { NameStep } from './NameStep';
import { BirthDateStep } from './BirthDateStep';

export function QuizFlow() {
  const router = useRouter();
  const { state, dispatch } = useQuiz();
  const question = QUIZ_QUESTIONS[state.currentStep];

  if (!question) {
    router.push('/leitura/preparando');
    return null;
  }

  function goNext() {
    if (state.currentStep + 1 >= QUIZ_QUESTIONS.length) {
      router.push('/leitura/preparando');
    } else {
      dispatch({ type: 'NEXT' });
    }
  }

  return (
    <div className="flex min-h-dvh flex-col items-center px-6 py-12 md:px-12">
      <div className="w-full max-w-md">
        <ProgressBar current={state.currentStep} total={QUIZ_QUESTIONS.length} />
      </div>
      <div className="flex w-full flex-1 items-center justify-center py-12">
        {question.type === 'choice' && (
          <QuestionCard
            question={question}
            value={state.answers[question.id]}
            onAnswer={(optionId) => {
              dispatch({ type: 'ANSWER', questionId: question.id, value: optionId });
              goNext();
            }}
          />
        )}
        {question.type === 'open' && (
          <OpenTextStep
            question={question}
            value={state.answers[question.id]}
            onSubmit={(text) => {
              dispatch({ type: 'ANSWER', questionId: question.id, value: text });
              goNext();
            }}
          />
        )}
        {question.type === 'name' && (
          <NameStep
            value={state.name}
            onSubmit={(name) => {
              dispatch({ type: 'SET_NAME', value: name });
              goNext();
            }}
          />
        )}
        {question.type === 'birthdate' && (
          <BirthDateStep
            value={state.birthDate}
            onSubmit={(date) => {
              dispatch({ type: 'SET_BIRTH_DATE', value: date });
              goNext();
            }}
          />
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Wire the quiz route**

`app/leitura/page.tsx`:
```tsx
import { QuizFlow } from '@/components/quiz/QuizFlow';

export default function LeituraPage() {
  return <QuizFlow />;
}
```

- [ ] **Step 7: Verify manually**

Run: `npm run dev`, open `http://localhost:3000/leitura`.
Expected: progress bar fills as you answer, all 14 question types render correctly in order, refreshing mid-quiz keeps your answers (sessionStorage), finishing question 14 navigates to `/leitura/preparando` (will 404 until Task 9 - expected for now).

- [ ] **Step 8: Commit**

```bash
git add components/quiz app/leitura/page.tsx
git commit -m "feat: build interactive 14-question quiz flow"
```

---

### Task 9: Ritual transition and `/leitura/preparando` route

**Files:**
- Create: `components/transition/RitualTransition.tsx`
- Create: `app/leitura/preparando/page.tsx`

**Interfaces:**
- Produces: the `/leitura/preparando` route.

- [ ] **Step 1: Write `components/transition/RitualTransition.tsx`**

```tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useReducedMotion, AnimatePresence } from 'motion/react';

const LINES = [
  'Respire fundo.',
  'Pense na pergunta que você mais gostaria de ver respondida neste momento.',
  'Quando estiver pronto(a), continue.',
];

export function RitualTransition() {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);

  function goToResult() {
    router.push('/leitura/resultado');
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <p className="font-display text-sm uppercase tracking-[0.18em] text-gold-400">
        Antes de revelar sua leitura...
      </p>
      <AnimatePresence mode="wait">
        <motion.p
          key={step}
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: 0.5 }}
          className="mt-8 max-w-md font-display text-2xl leading-snug text-parchment-100"
        >
          {LINES[step]}
        </motion.p>
      </AnimatePresence>
      <div className="mt-12 flex flex-col items-center gap-4">
        {step < LINES.length - 1 ? (
          <button
            type="button"
            onClick={() => setStep((current) => current + 1)}
            className="inline-flex items-center justify-center rounded-full bg-gold-400 px-8 py-4 font-display text-sm font-medium text-ink-950 transition-transform duration-300 ease-out hover:-translate-y-0.5 hover:bg-gold-300 active:scale-[0.98]"
          >
            Continuar
          </button>
        ) : (
          <button
            type="button"
            onClick={goToResult}
            className="inline-flex items-center justify-center rounded-full bg-gold-400 px-8 py-4 font-display text-sm font-medium text-ink-950 transition-transform duration-300 ease-out hover:-translate-y-0.5 hover:bg-gold-300 active:scale-[0.98]"
          >
            Revelar minha leitura
          </button>
        )}
        <button
          type="button"
          onClick={goToResult}
          className="text-sm text-parchment-400 underline-offset-4 hover:underline"
        >
          Pular
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Wire the route**

`app/leitura/preparando/page.tsx`:
```tsx
import { RitualTransition } from '@/components/transition/RitualTransition';

export default function PreparandoPage() {
  return <RitualTransition />;
}
```

- [ ] **Step 3: Verify manually**

Run: `npm run dev`, open `http://localhost:3000/leitura/preparando`.
Expected: lines advance on "Continuar", "Pular" and the final "Revelar minha leitura" both navigate to `/leitura/resultado` (will 404 until Task 10 - expected for now). With OS-level reduced motion on, the text swap has no animation but still works.

- [ ] **Step 4: Commit**

```bash
git add components/transition app/leitura/preparando
git commit -m "feat: add skippable ritual transition screen"
```

---

### Task 10: Free report view and `/leitura/resultado` route

**Files:**
- Create: `components/report/ReportView.tsx`
- Create: `components/report/TeaserBlock.tsx`
- Create: `components/report/PaywallCta.tsx`
- Create: `app/leitura/resultado/page.tsx`
- Create: `public/images/card-motif.jpg` (generated asset)

**Interfaces:**
- Consumes: `useQuiz` from `components/providers/QuizProvider.tsx` (Task 6); `generateMockReport` from `lib/generate-mock-report.ts` (Task 5); `Report` from `lib/report-types.ts` (Task 3).
- Produces: the `/leitura/resultado` route.

- [ ] **Step 1: Generate the supporting image**

Call the Gamma image generation tool with:
- `prompt`: "Close-up illustration of an ornate tarot card resting on dark velvet fabric, warm golden rim light, faint constellations in the background, moody and elegant, no visible text on the card, no human face"
- `type`: `"scene"`
- `sizePreset`: `"banner"`

Poll `get_image_generation_status` until `status` is `"completed"`, then download the returned image URL to `public/images/card-motif.jpg`:

```bash
curl -L "<returned-image-url>" -o public/images/card-motif.jpg
```

- [ ] **Step 2: Write `components/report/TeaserBlock.tsx`**

```tsx
export function TeaserBlock({ teaser, finalMessage }: { teaser: string; finalMessage: string }) {
  return (
    <section className="mt-14 rounded-2xl border border-gold-400/30 bg-gold-400/5 p-8">
      {teaser.split('\n\n').map((paragraph, index) => (
        <p key={index} className="mt-3 leading-relaxed text-parchment-100 first:mt-0">
          {paragraph}
        </p>
      ))}
      <p className="mt-6 leading-relaxed text-parchment-400">{finalMessage}</p>
    </section>
  );
}
```

- [ ] **Step 3: Write `components/report/PaywallCta.tsx`**

```tsx
import { Check } from '@phosphor-icons/react/dist/ssr';

const DELIVERABLES = [
  'Próximos meses',
  'Amor e relacionamentos',
  'Carreira e dinheiro',
  'O que merece sua atenção',
  'Possível ponto de alerta',
  'Mensagem final personalizada',
];

export function PaywallCta() {
  return (
    <section className="mt-10 rounded-2xl border border-white/10 bg-ink-900 p-8 text-center">
      <h2 className="font-display text-2xl text-parchment-100">Sua Leitura Completa</h2>
      <ul className="mx-auto mt-6 flex max-w-sm flex-col gap-2 text-left text-parchment-400">
        {DELIVERABLES.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <Check size={16} weight="bold" className="mt-1 shrink-0 text-gold-400" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <button
        type="button"
        disabled
        className="mt-8 inline-flex items-center justify-center rounded-full bg-gold-400 px-8 py-4 font-display text-sm font-medium text-ink-950 opacity-60"
      >
        Desbloquear leitura completa
      </button>
      <p className="mt-3 text-sm text-gold-400">R$ 15,90</p>
      <p className="mt-1 text-xs text-parchment-400">O checkout chega na próxima etapa do projeto.</p>
    </section>
  );
}
```

- [ ] **Step 4: Write `components/report/ReportView.tsx`**

```tsx
import Image from 'next/image';
import type { Report } from '@/lib/report-types';
import { TeaserBlock } from './TeaserBlock';
import { PaywallCta } from './PaywallCta';

export function ReportView({ report }: { report: Report }) {
  return (
    <article className="mx-auto max-w-2xl px-6 py-16 md:px-0">
      <p className="font-display text-sm uppercase tracking-[0.18em] text-gold-400">Sua leitura gratuita</p>
      <h1 className="mt-4 font-display text-3xl leading-tight text-parchment-100 md:text-4xl">{report.title}</h1>
      <p className="mt-6 text-lg leading-relaxed text-parchment-400">{report.opening}</p>

      <div className="relative mt-10 aspect-[16/9] w-full overflow-hidden rounded-2xl">
        <Image
          src="/images/card-motif.jpg"
          alt="Carta de tarot iluminada por luz dourada sobre tecido escuro"
          fill
          sizes="(min-width: 768px) 42rem, 100vw"
          className="object-cover"
        />
      </div>

      <section className="mt-10">
        <h2 className="font-display text-xl text-parchment-100">Seu momento atual</h2>
        <p className="mt-3 leading-relaxed text-parchment-400">{report.current_moment}</p>
      </section>

      <section className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <h2 className="font-display text-xl text-parchment-100">Pontos fortes</h2>
          <ul className="mt-3 flex flex-col gap-3 text-parchment-400">
            {report.strengths.map((item) => (
              <li key={item} className="leading-relaxed">
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-display text-xl text-parchment-100">Pontos de atenção</h2>
          <ul className="mt-3 flex flex-col gap-3 text-parchment-400">
            {report.tensions.map((item) => (
              <li key={item} className="leading-relaxed">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {report.sections.map((section) => (
        <section key={section.title} className="mt-10">
          <h2 className="font-display text-xl text-parchment-100">{section.title}</h2>
          <p className="mt-3 leading-relaxed text-parchment-400">{section.content}</p>
        </section>
      ))}

      <TeaserBlock teaser={report.personalized_teaser} finalMessage={report.final_message} />
      <PaywallCta />
    </article>
  );
}
```

- [ ] **Step 5: Wire the result route**

`app/leitura/resultado/page.tsx`:
```tsx
'use client';

import { useMemo } from 'react';
import { useQuiz } from '@/components/providers/QuizProvider';
import { generateMockReport } from '@/lib/generate-mock-report';
import { ReportView } from '@/components/report/ReportView';

export default function ResultadoPage() {
  const { state } = useQuiz();
  const report = useMemo(() => generateMockReport(state), [state]);

  return <ReportView report={report} />;
}
```

- [ ] **Step 6: Verify manually**

Run: `npm run dev`, complete the quiz at `http://localhost:3000/leitura`, click through the transition, land on `/leitura/resultado`.
Expected: report content reflects your actual answers (situation category, element, and open-text excerpt all show up), image renders, paywall CTA is visibly disabled with "O checkout chega na próxima etapa do projeto."

- [ ] **Step 7: Commit**

```bash
git add components/report app/leitura/resultado public/images/card-motif.jpg
git commit -m "feat: render free report from mock generator with teaser and inert paywall"
```

---

### Task 11: Full funnel QA pass

**Files:** none created or modified; this task only verifies.

- [ ] **Step 1: Run the full automated check suite**

```bash
npm run lint
npm run test
npm run build
```

Expected: all three succeed with zero errors.

- [ ] **Step 2: Manual click-through on mobile viewport**

Run: `npm run dev`. Using a browser at a 390x844 viewport (or an available browser/screenshot tool), walk `/` → `/leitura` → `/leitura/preparando` → `/leitura/resultado`.

Verify:
- Landing hero headline is 2 lines or fewer, CTA is visible without scrolling, image loads.
- Every quiz question is readable without horizontal scroll, progress bar advances each step.
- Refreshing mid-quiz (e.g. after question 5) preserves answers.
- The ritual transition lines advance and "Pular" skips straight to the result.
- The free report shows the situation/element content matching the answers actually given, and the open-text excerpt appears verbatim inside the teaser block.
- No em-dash character appears anywhere on any screen.

- [ ] **Step 3: Manual click-through on desktop viewport**

Repeat the same walk at a 1440x900 viewport. Verify the hero's asymmetric split renders correctly, the `HowItWorks` bento grid shows the 2-span/1/3-span rhythm (not three equal cards), and hover states on buttons show the lift/scale transition.

- [ ] **Step 4: Reduced-motion pass**

Enable OS-level "reduce motion" and repeat the walk. Verify the scroll-reveal sections on the landing page appear instantly (no slide-up), the ritual transition text swap has no animation, and nothing on the page depends on an animation completing to become usable.

- [ ] **Step 5: Commit any fixes found during QA**

If any issue surfaces, fix it, then:

```bash
git add -A
git commit -m "fix: address issues found in Fase 1 funnel QA pass"
```

If no issues are found, skip this step - Fase 1 is complete.
