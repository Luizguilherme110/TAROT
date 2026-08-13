# Identidade do Gênio — Design

Parent spec: `TAROT-AI-SPEC-V2.md`. Este é o primeiro de três specs derivados de um pedido maior do usuário (mascote do gênio, paywall, picker de cartas), quebrado em sub-projetos independentes:

1. **Identidade do gênio** (este doc) — mascote visual, personalidade/falas, fundo animado da landing, remoção de emoji.
2. Paywall/monetização — relatório mostra só um teaser pequeno de graça, resto trancado atrás de R$19,90 (spec futuro).
3. Picker de 6 cartas no final do quiz — usuário escolhe uma carta, gênio interpreta (spec futuro).

Este spec cobre só o item 1: dar ao site uma identidade visual e uma "voz" através do mascote gênio, e limpar a aparência de "gerado por IA" que os emojis passavam.

## Goals

- O gênio (asset `genio.png`, fornecido pelo usuário) substitui a foto de estoque no hero da landing.
- O gênio se comporta como um "amigo" acompanhando a jornada inteira: landing, quiz (reagindo a cada resposta), transição ritualística, resultado.
- Durante o quiz, o gênio reage ao que a pessoa acabou de responder com uma frase curta e específica (ex: "Vejo que você é um aventureiro"), reforçando a sensação de estar sendo analisada.
- Landing ganha um fundo animado sutil com efeito de tarot (leve, sem custo de performance perceptível).
- Emojis somem do site (só existiam nas opções `situacao_atual` e `elemento` do quiz).

## Non-goals (ficam pros specs 2 e 3, ou fora de escopo)

- Reestruturação do paywall/relatório gratuito vs. pago.
- Picker de cartas no final do quiz.
- Geração de fala do gênio via IA em tempo real — as falas são um banco de conteúdo estático (mesmo padrão de `SITUATION_CONTENT`/`ELEMENT_CONTENT` em `generate-mock-report.ts`), não uma chamada de modelo.
- Alterar a estrutura de rotas, o `QuizProvider`/reducer, ou o formato do `Report`.

## Design system (dials)

Redesign em modo preservação: mantém tokens já existentes (`ink-950` `#09090b`, `ink-900` `#131316`, `parchment-100`/`400`, `gold-400`/`300`, fontes Outfit + Manrope, tema dark único e travado).

- `DESIGN_VARIANCE: 6`, `MOTION_INTENSITY: 5` (camada de fundo animado sobe um pouco o motion só na landing; resto do site mantém o nível atual), `VISUAL_DENSITY: 3`.
- Sem novo design system. Só Tailwind v4 + `motion/react`, já em uso.
- CSS-only para o fundo animado (`transform`/`opacity`), sem canvas/WebGL/GSAP — mantém LCP/INP baixos.

## Asset pipeline

`genio.png` é uma sprite sheet 2×5 (10 poses) sobre fundo azul-marinho sólido, fornecida pelo usuário. Processamento:

- Script one-off (Node + `sharp`, instalado via `npm install --no-save sharp`, não entra no `package.json`) recorta cada pose em PNG individual com padding, salva em `public/images/genie/{mood}.png`.
- Fundo navy do sprite não é removido (sem ferramenta de remoção de fundo confiável disponível). Cada avatar é renderizado dentro de um container circular/blob com leve vinheta nas bordas para fundir com o `ink-950` do site.
- Mapeamento de 5 moods usados no código (das 10 poses disponíveis):
  - `neutral` — braços cruzados, topo-1. Estado padrão/idle, usado na hero e como fallback.
  - `thinking` — mão no queixo, topo-2. Perguntas abertas do quiz, primeiras linhas da transição ritualística.
  - `pleased` — mãos juntas + brilho, topo-3. Respostas reflexivas/positivas.
  - `excited` — joinha, topo-4. Marcos (fim do quiz, revelar leitura).
  - `warm` — coração, baixo-4. Temas de amor/relacionamento.

## Component architecture

Novo diretório `components/genie/`:

- **`GenieAvatar.tsx`** — client component. Props: `mood: GenieMood`, `size?: 'sm' | 'md' | 'lg'`. Renderiza a imagem do mood, com animação idle contínua (leve *bob* via `motion`, `transform`/`opacity` apenas), respeitando `useReducedMotion` (já em uso no projeto, ver `RitualTransition.tsx`).
- **`GenieSpeechBubble.tsx`** — props: `line: string`. Entra com fade+slide (mesma curva de easing do projeto, `[0.16, 1, 0.3, 1]`, ~0.4-0.5s), auto-colapsa depois de alguns segundos (`setTimeout` + `AnimatePresence`), deixando só o avatar visível.
- **`GenieCompanion.tsx`** — combina os dois. Uso principal no quiz: fixo num canto (topo, fora da coluna central onde ficam as opções/`QuestionCard`), avatar sempre visível e pequeno, balão aparece a cada nova resposta e some sozinho — nunca bloqueia o fluxo de responder.

`lib/genie-lines.ts` (novo) — banco de falas, mesmo padrão de `SITUATION_CONTENT`/`ELEMENT_CONTENT`:

```ts
export type GenieMood = 'neutral' | 'thinking' | 'pleased' | 'excited' | 'warm';

export const GENIE_REACTIONS: Record<string, Record<string, { mood: GenieMood; line: string }>> = {
  situacao_atual: { amor: {...}, decisao: {...}, dinheiro: {...}, fase_nova: {...} },
  rotina_atual: { ... },
  // ... uma entrada por pergunta de múltipla escolha (10 perguntas x 4 opções = ~40 linhas)
};

export const GENIE_OPEN_TEXT_REACTION: Record<string, { mood: GenieMood; line: string }> = {
  sono: { mood: 'thinking', line: '...' },
  deixar_para_tras: { mood: 'thinking', line: '...' },
};
```

Perguntas `name`/`birth_date` usam uma linha fixa de saudação (mood `pleased`), interpolando o nome quando disponível.

## Onde o gênio aparece

- **`LandingHero.tsx`**: troca a imagem `hero-celestial.jpg` (foto de estoque) pelo `GenieAvatar` (`mood="neutral"`, `size="lg"`), flutuando sobre o `CelestialBackdrop` em vez de dentro de uma moldura retangular de foto. Mantém a estrutura split (texto à esquerda, visual à direita) e a copy atual.
- **`QuizFlow.tsx`**: adiciona `GenieCompanion` fixo. A cada resposta (`dispatch({ type: 'ANSWER', ... })`), busca a reação em `GENIE_REACTIONS[question.id][optionId]` (ou `GENIE_OPEN_TEXT_REACTION[question.id]` pra perguntas abertas) e atualiza mood + linha do balão.
- **`RitualTransition.tsx`**: `GenieAvatar` centralizado, maior, ao lado das 3 linhas existentes (que continuam sendo o texto principal). Mood muda de `thinking` (linhas 1-2) para `pleased` (linha 3, "Quando estiver pronto(a)...").
- **`ReportView.tsx`**: uma linha curta do gênio no topo, antes do título ("Vejo que você é [traço]..."). `ReportView` só recebe `report: Report`, não a `session` inteira, então essa linha entra como novo campo `genie_intro: { mood: GenieMood; line: string }` no tipo `Report`, calculado dentro de `generateMockReport` junto com `situation`/`elementContent` (mesma fonte, sem duplicar lógica).

## Fundo animado da landing (`CelestialBackdrop.tsx`)

Client component novo, `fixed inset-0 -z-10 pointer-events-none`, usado só dentro de `app/page.tsx` (não entra no `layout.tsx` global — quiz/transição/resultado mantêm fundo sólido `ink-950` por foco e performance, per decisão do usuário).

Camadas, todas CSS/`transform`+`opacity` via `motion`, sem listener de scroll:

1. 2-3 blobs radiais dourado/tinta, drift lento (~20-30s, `ease: 'linear'`, loop).
2. Campo de estrelinhas com twinkle (opacity pulsando, delays escalonados).
3. Um SVG line-art sutil (~5-8% opacidade) de símbolo celeste (lua crescente + estrela de 8 pontas), rotação bem lenta atrás do gênio na hero.

Sob `useReducedMotion`, todas as camadas renderizam paradas (frame estático), sem animação.

## Remoção de emoji

- `lib/quiz-questions.ts`: remove o campo `emoji` das 8 opções que têm (`situacao_atual`: ❤️💭💰🌙, `elemento`: 🔥💧🌍🌬️). `ChoiceOption` perde `emoji?: string`.
- `components/quiz/QuestionCard.tsx`: remove o bloco `{option.emoji ? <span>...</span> : null}`.
- Grep confirmou que nenhum outro arquivo `.ts`/`.tsx` do projeto usa emoji — escopo fechado.

## Testing / verification

- `npm run lint` e `npm run test` (vitest) depois de cada mudança.
- `npm run dev`, percorrer o funil completo no navegador: landing (gênio na hero, fundo animado, com e sem `prefers-reduced-motion`) → quiz (14 perguntas, balão reagindo a cada resposta, sem sobrepor botões) → transição ritualística (gênio narrando as 3 linhas) → resultado (linha do gênio no topo).
- Conferir em viewport mobile (produto é mobile-first) que o avatar/balão nunca cobre elementos clicáveis.
- Lighthouse na landing para confirmar que o fundo animado não regride LCP/CLS.
