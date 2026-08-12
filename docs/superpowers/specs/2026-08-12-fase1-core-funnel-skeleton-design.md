# Fase 1: Core Funnel Skeleton — Design

Parent spec: `TAROT-AI-SPEC-V2.md`. This is the first of four build phases:

1. **Core funnel skeleton** (this doc) — landing, quiz, mock report, no backend.
2. AI generation engine — real Vercel AI SDK/Gateway wiring, DB persistence.
3. Payment path — Cakto checkout/webhook, order bumps, paid report delivery.
4. Tracking/compliance — Meta Pixel, internal events, LGPD pages, rate limiting.

Each phase gets its own spec → plan → build cycle. This phase produces a fully clickable funnel with mock AI content, structured so later phases swap in real backends without reshaping the frontend.

## Goals

- User can go landing → quiz (14 questions) → ritual transition → free report → paywall CTA, entirely client-side.
- Visual language: dark celestial mystical, premium, not generic AI-purple-gradient, not cheap horoscope-app.
- Mock report generation uses the exact JSON shape the real AI will return later (spec §9), so Fase 2 swaps one function, not a rewrite.
- Mobile-first, one question per screen, visible progress, reduced-motion respected.

## Non-goals (later phases)

Real AI calls, Postgres persistence, Cakto checkout/webhook, Meta Pixel, internal event logging, LGPD pages, rate limiting, A/B testing infra.

## Stack

- Next.js 15 App Router, TypeScript, Tailwind v4.
- `motion/react` for animation (isolated client components).
- `@phosphor-icons/react` for icons.
- No state library — React Context + `sessionStorage` mirror for quiz answers.

## Design system (dials)

- `DESIGN_VARIANCE: 7`, `MOTION_INTENSITY: 6`, `VISUAL_DENSITY: 3`.
- Palette: `zinc-950` base, warm gold/amber single accent, off-white text. No purple, no pure black/white.
- Type: sans display (Cabinet Grotesk / Geist Display) + Geist body. No serif — avoids the "creative brief = serif" AI tell.
- Real generated imagery (hero + supporting mystical/card visual) via available image-gen tool. No CSS gradient blobs as hero, no div-based fake screenshots.
- One theme (dark) for the whole site, locked per taste-skill §4.11.

## Routes

```
/                      landing
/leitura               quiz shell — 1 question per screen, progress bar
/leitura/preparando    ritual transition (skippable, per parent spec §2.2)
/leitura/resultado     free report (mock) + personalized teaser + paywall CTA (inert in this phase)
```

## Data flow

`QuizContext` holds `{ name, birthDate, answers: Record<questionId, value> }`, mirrored to `sessionStorage` on change so a refresh mid-quiz doesn't lose progress. Shape matches the parent spec's future `quiz_sessions.answers jsonb` column so Fase 2 persistence is a direct mapping.

## Mock report generation

A pure function `generateMockReport(session: QuizSession): Report` interpolates name + one open-text excerpt into the JSON shape from parent spec §9:

```json
{
  "title": "string",
  "opening": "string",
  "current_moment": "string",
  "strengths": ["string"],
  "tensions": ["string"],
  "personalized_teaser": "string",
  "sections": [{ "title": "string", "content": "string" }],
  "final_message": "string"
}
```

This is the same contract the real AI Gateway call returns in Fase 2 — the render layer (`ReportView` component) never changes, only the data source does.

## Quiz content

14 questions total: 10 multiple-choice (situação atual, amor, trabalho/dinheiro, momento de vida, etc.), 2 open-text ("o que tem tirado seu sono ultimamente", "existe algo que você sente que precisa deixar para trás"), name capture, birth date capture with the transparent numerology explainer from parent spec §7. Copy in PT-BR, warm/intimate tone, no fear-mongering or medical/financial claims, per parent spec §9 rules. Full question list is drafted during implementation, not fixed in this design doc.

## Ritual transition screen

Per parent spec §2.2: "Antes de revelar sua leitura... respire fundo..." Short, skippable, CTA "Revelar minha leitura →". Honors `prefers-reduced-motion`.

## Components (indicative, not exhaustive)

- `LandingHero`, `HowItWorks`, `TrustSection` (landing)
- `QuizShell`, `QuestionCard`, `ProgressBar`, `OpenTextQuestion`, `BirthDateQuestion` (quiz)
- `RitualTransition` (preparing screen)
- `ReportView`, `TeaserBlock`, `PaywallCTA` (result screen, CTA inert this phase)

## Mobile & accessibility

Single-column collapse below 768px is the default (quiz is already single-question, single-column at all sizes). All motion above intensity 3 wrapped in `useReducedMotion()`. WCAG AA contrast on the dark palette, checked on the accent color against `zinc-950`.

## Testing

Manual click-through of the full funnel on mobile viewport + desktop, both with and without reduced-motion, before calling this phase done. No backend to unit-test yet; report-shape function gets a basic test since Fase 2 depends on its contract staying stable.
