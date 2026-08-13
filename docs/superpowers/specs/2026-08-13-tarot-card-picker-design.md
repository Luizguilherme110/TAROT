# Picker de 6 Cartas de Tarot — Design

Parent spec: `TAROT-AI-SPEC-V2.md`. Terceiro dos três sub-projetos derivados do pedido do usuário sobre mascote/paywall/cartas:

1. Identidade do gênio (`docs/superpowers/specs/2026-08-12-genie-mascot-identity-design.md`) — implementado.
2. Paywall/teaser (design aprovado em chat, sem doc de spec, mudança confinada em `ReportView`/`PaywallCta`) — implementado.
3. **Picker de 6 cartas** (este doc).

## Goals

- Nova etapa `/leitura/carta` entre o fim do quiz e a transição ritualística: usuário escolhe 1 de 6 cartas de tarot reais.
- Ao escolher, a carta vira (animação, `useReducedMotion` degrada pra troca instantânea), revela nome + símbolo + significado curto, e o gênio comenta a escolha com uma fala própria daquela carta.
- Momento isolado: não persiste a escolha, não afeta `Report`/`generateMockReport`, não toca `QuizState`/reducer. Puro flavor/imersão antes do resultado.

## Non-goals

- Baralho completo (78 cartas). Usa 6 fixas, sempre as mesmas, sem sorteio (evita risco de mismatch de hidratação servidor/cliente).
- Nenhuma influência no conteúdo do relatório gratuito ou pago.
- Arte ilustrada por carta — usa ícone Phosphor + tipografia, mesmo padrão visual do resto do site.

## Design system (dials)

Modo preservação, mesmos tokens já existentes (`ink-950`, `ink-900`, `parchment-100`/`400`, `gold-400`/`300`, Outfit + Manrope). Sem cor nova. `rounded-2xl` nos cards do grid (mantém o shape lock do resto do site).

## As 6 cartas

Arcanos Maiores reais, escolhidos por variedade temática (ecoa as categorias já usadas em `situacao_atual`/`elemento`) e por terem símbolo Phosphor óbvio:

| id | Nome | Ícone Phosphor | Tema |
|---|---|---|---|
| `louco` | O Louco | `CompassRose` | começos, coragem de saltar sem saber tudo |
| `roda_fortuna` | A Roda da Fortuna | `ArrowsClockwise` | ciclos, o que muda por conta própria |
| `amantes` | Os Amantes | `Heart` | escolhas do coração, vínculos |
| `torre` | A Torre | `Lightning` | ruptura que abre espaço (tom construtivo) |
| `estrela` | A Estrela | `Star` | esperança depois de um momento difícil |
| `sol` | O Sol | `Sun` | clareza, vitalidade, coisas dando certo |

Cada carta tem: `name`, `icon` (nome do componente Phosphor), `meaning` (1-2 frases, tom acolhedor/reflexivo, sem afirmação de certeza factual sobre o futuro — mesma regra de `TAROT-AI-SPEC-V2.md` §9), e `genieReaction: { mood: GenieMood; line: string }` (reutiliza `GenieMood` de `lib/genie-lines.ts`, nunca redeclara). "A Torre" recebe cuidado especial de tom: ruptura como abertura, não como desgraça — mesma régua que já existe pra "pontos de tensão" em `generate-mock-report.ts`.

## Arquitetura

- **`lib/tarot-cards.ts`** (novo) — `TarotCard` type + `TAROT_CARDS: TarotCard[]` (array fixo, ordem fixa, 6 entradas). Mesmo padrão de conteúdo estático que `genie-lines.ts`/`generate-mock-report.ts` (nada de chamada de IA em tempo real).
- **`components/cards/CardPicker.tsx`** (novo, client component) — grid do verso das 6 cartas (visual idêntico entre elas: sigilo dourado sobre `ink-900`, sem indicar qual é qual antes do clique). Estado local (`useState`, não entra no `QuizState`/reducer): `selectedId: string | null`. Ao clicar, anima a virada (`motion`, `useReducedMotion` guardado), mostra nome + ícone + significado + `GenieAvatar` (`size="md"`) + `GenieSpeechBubble`-like linha reativa, e um botão "Continuar" que `router.push('/leitura/preparando')`. Antes de escolher, sem botão de continuar (força a escolha, é o ponto da etapa).
- **`app/leitura/carta/page.tsx`** (novo) — renderiza `CardPicker`. Herda `QuizProvider` do `app/leitura/layout.tsx` existente (não precisa, mas não atrapalha).
- **`components/quiz/QuizFlow.tsx`** (modifica 1 linha) — `goNext()` no fim das 14 perguntas aponta pra `/leitura/carta` em vez de `/leitura/preparando`.

## Fluxo

```
/leitura (14 perguntas)
  ↓ (última resposta)
/leitura/carta (escolhe 1 de 6, gênio comenta)
  ↓ (Continuar)
/leitura/preparando (transição ritualística, já existe)
  ↓
/leitura/resultado (relatório, já existe)
```

## Testing / verification

- `lib/__tests__/tarot-cards.test.ts`: exatamente 6 cartas, ids únicos, cada uma com `name`/`icon`/`meaning`/`genieReaction` preenchidos, zero em-dash em `meaning`/`genieReaction.line` de todas as 6.
- `npm run lint`, `npx tsc --noEmit`.
- Manual: `npm run dev`, completar o quiz, conferir que cai em `/leitura/carta`, escolher cada uma das 6 cartas (uma de cada vez, recarregando) pra ver as 6 reações, confirmar reduced-motion deixa a virada instantânea mas ainda troca o conteúdo, confirmar mobile (grid 2 colunas, nada corta).
