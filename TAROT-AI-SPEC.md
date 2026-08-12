# Projeto: Quiz de Personalidade/Tarot com IA — Spec para Build

## 1. Visão Geral

Site standalone (domínio e projeto próprios, separados de qualquer outro produto existente) que roda um funil de:

1. Quiz de perguntas estilo tarot/personalidade
2. Relatório de personalidade **gratuito**, gerado por IA, com mix de pontos positivos e negativos
3. Oferta paga: relatório "O que o futuro te espera" — R$ 15,90
4. Order bumps no checkout (produtos extras de baixo ticket, adicionados com um clique)
5. (Fase futura) Assinatura recorrente de novas leituras

Público-alvo: majoritariamente Geração Z (18-28 anos), tráfego frio via Meta Ads, comportamento de compra por impulso/alívio emocional ("doom spending"), forte concentração de conversão em horário noturno/madrugada.

Diferencial de posicionamento: relatório gerado por **IA de verdade** a partir das respostas da pessoa (não texto pré-escrito com variável trocada, que é o padrão da concorrência nesse nicho).

## 2. Stack Técnica Recomendada

- Framework: Next.js (App Router) ou outro framework React com SSR — escolha livre, mas priorizar time-to-ship
- Hospedagem: Vercel
- Geração de IA: Vercel AI SDK + AI Gateway (usar string de modelo `"provider/model"` via gateway, não SDK de provider específico)
- Checkout: Cakto (mesmo padrão de link de checkout + webhook de confirmação de pagamento usado em outros projetos)
- Pixel: Meta Pixel, suportando múltiplos Pixel IDs simultâneos se necessário (init em loop, ver padrão abaixo)
- Analytics de funil: eventos customizados próprios (tabela simples de eventos: quiz_start, quiz_complete, free_report_viewed, checkout_started, purchase_completed, bump_added)
- Banco de dados: qualquer Postgres gerenciado (ex: Neon) — guardar respostas do quiz, relatório gerado, status de pagamento
- Sem n8n no caminho principal do usuário (latência/complexidade desnecessária numa UI em tempo real). n8n pode entrar depois, só na automação pós-venda (ex: follow-up de WhatsApp).

### Padrão de Meta Pixel (multi-ID)

```ts
export const META_PIXEL_IDS = ["<id_1>"]; // adicionar mais conforme necessário

export const metaPixelSnippet = `!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
${META_PIXEL_IDS.map((id) => `fbq('init', '${id}');`).join("\n")}
fbq('track', 'PageView');`;
```

Eventos a disparar: `PageView` (automático), `Lead` (quiz completo), `ViewContent` (relatório grátis visualizado), `InitiateCheckout` (foi pro checkout pago), `Purchase` (confirmado via webhook Cakto, não no client).

## 3. Fluxo do Funil

```
Landing (hook + CTA "Descobrir minha leitura")
  -> Quiz (12-18 perguntas)
  -> Tela de carregamento ("Sua leitura está sendo gerada...", 3-5s, cria expectativa)
  -> Relatório gratuito (personalidade: misto positivo/negativo)
       -> Cliffhanger no final do relatório grátis, gancho pro pago
  -> Oferta paga: "O que o futuro te espera" R$ 15,90
       -> Checkout Cakto com order bumps
  -> Página de obrigado + entrega do relatório pago
  -> (pós-venda, fora do site) automação de recorrência/remarketing
```

## 4. Quiz — Estrutura de Perguntas

- 12 a 18 perguntas no total
- Maioria objetiva (múltipla escolha, decisão rápida, mantém ritmo)
- 2 a 3 perguntas abertas (texto livre curto), ex: "O que mais tem tirado seu sono ultimamente?" — dão material real pra IA personalizar de verdade, não só encaixar em categoria fixa
- Coletar: nome, data de nascimento (usado para dar verniz astrológico/numerológico ao relatório)
- Tom das perguntas: intimista, reflexivo, nem sempre óbvio o que está sendo medido (aumenta engajamento tipo "teste viciante")
- Barra de progresso visível — reduz abandono

## 5. Geração do Relatório via IA

### Relatório gratuito (personalidade)
- Gerado a partir de todas as respostas do quiz
- Estrutura: abertura calorosa e pessoal → 2-3 pontos fortes → 1-2 pontos de tensão/desafio (o "negativo", mas com tom construtivo, nunca agressivo) → fechamento com gancho para o relatório pago
- Tamanho: curto o suficiente para ler em 1-2 minutos no celular

### Relatório pago ("O que o futuro te espera")
- Gerado com prompt separado, mais longo, tom mais místico/narrativo
- Deve referenciar detalhes específicos das respostas abertas do usuário (prova de personalização real)
- Estrutura sugerida: próximos meses → relacionamentos → carreira/dinheiro → um "aviso"/alerta que cria ação (ex: "cuidado com decisões precipitadas em [área]")
- Formato de entrega: tela no site + opção de PDF para baixar/guardar

### Prompt engineering
- Usar o nome e as respostas abertas literalmente no prompt (personalização real, não só metadata)
- Definir tom fixo via system prompt (acolhedor, nunca alarmista, evitar promessas médicas/financeiras/legais que soem como aconselhamento profissional)
- Definir grade de saída (JSON estruturado: título, parágrafos, destaques) para renderizar de forma consistente no front

## 6. Order Bumps (checkout)

Oferecer 1-2 no momento do checkout do relatório pago, cada um com um clique de ativar:

- Compatibilidade amorosa (pede nome + data de nascimento do crush/parceiro) — R$ 9,90
- Relatório de carreira/dinheiro — R$ 9,90
- Versão em áudio narrado ou PDF estilizado para guardar/compartilhar

## 7. Modelo de Dados (mínimo)

- `quiz_sessions`: id, criado_em, nome, data_nascimento, respostas (jsonb), utm/attribution
- `reports`: id, session_id, tipo (free | future | compatibility | career), conteudo (jsonb ou texto), gerado_em
- `orders`: id, session_id, produto(s), valor, status (pending | paid), cakto_order_id, pago_em

## 8. Integração de Pagamento (Cakto)

- Mesmo padrão de outros projetos: link de checkout gerado no painel Cakto por produto/order bump
- Webhook Cakto confirma pagamento no backend → dispara `Purchase` no pixel (server-side, não no client, para não perder conversão por ad-blocker) → libera acesso ao relatório pago vinculado à sessão

## 9. LGPD / Dados Sensíveis

- Nome e data de nascimento são dados pessoais — ter política de privacidade clara, explicar uso (só para gerar o relatório)
- Não vender/compartilhar dados com terceiros
- Dar opção de exclusão de dados mediante solicitação por e-mail

## 10. Fora de Escopo Nesta Primeira Versão

- App mobile nativo
- Login/conta de usuário (fluxo é por sessão, sem cadastro)
- Assinatura recorrente (fica para fase 2, depois de validar conversão do funil único)
- Automação de WhatsApp pós-venda (fica para depois, via n8n, fora do site)

## 11. Critério de Sucesso da V1

- Funil completo rodando: quiz → relatório grátis → checkout pago → entrega
- Pixel e eventos de funil disparando corretamente em cada etapa
- Testável com tráfego pago pequeno antes de escalar orçamento de anúncio
