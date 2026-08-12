# Projeto: Leitura Personalizada de Tarot com IA — Spec para Build V2

## 1. Visão Geral

Site standalone (domínio e projeto próprios, separados de qualquer outro produto existente) que entrega uma **experiência de descoberta pessoal baseada em Tarot, simbolismo e IA**, com foco em personalização real a partir das respostas do usuário.

O produto não deve ser percebido como um simples "gerador de texto de Tarot". A IA é o mecanismo de interpretação e personalização; a experiência, a narrativa e a sensação de descoberta são o produto principal.

Funil principal:

1. Landing page com hook emocional + CTA
2. Quiz de personalidade/leitura (12–18 perguntas)
3. Tela de interpretação personalizada
4. Relatório de personalidade **gratuito**, gerado por IA, com pontos positivos e pontos de tensão
5. Teaser personalizado + cliffhanger
6. Oferta paga: **Leitura Completa — "O que o futuro te espera"**, R$ 15,90
7. Checkout Cakto com 1–2 order bumps
8. Página de obrigado + entrega do relatório pago
9. (Fase futura) assinatura recorrente de novas leituras

### Posicionamento

Promessa principal sugerida:

> **Uma leitura personalizada criada a partir das suas respostas — com IA + simbolismo do Tarot.**

Evitar posicionar o produto como ciência, diagnóstico ou previsão factual garantida. A experiência deve ser apresentada como uma leitura simbólica, reflexiva e de entretenimento/autoconhecimento.

Público-alvo: majoritariamente Geração Z (18–28 anos), tráfego frio via Meta Ads, comportamento de compra por impulso/alívio emocional ("doom spending"), forte concentração potencial de conversão em horário noturno/madrugada.

Diferencial de posicionamento: relatório gerado por **IA de verdade** a partir das respostas da pessoa, incluindo detalhes específicos de respostas abertas, em vez de texto pré-escrito com variáveis trocadas.

---

## 2. Princípios de Produto e UX

### 2.1 Experiência acima de "quiz"

O usuário deve sentir que está participando de uma leitura, não preenchendo um formulário.

Princípios:

- mobile-first;
- uma pergunta por tela sempre que possível;
- respostas rápidas e visualmente atraentes;
- barra de progresso visível;
- microtextos que criem curiosidade;
- transições suaves;
- sensação de progressão e descoberta;
- linguagem intimista, acolhedora e contemporânea;
- evitar excesso de elementos visuais ou aparência genérica de site gerado por IA.

### 2.2 Momento da leitura

Antes de revelar o relatório, criar uma pequena transição ritualística:

> **Antes de revelar sua leitura...**
>
> Respire fundo.
>
> Pense na pergunta que você mais gostaria de ver respondida neste momento.
>
> Quando estiver pronto(a), continue.

CTA:

**Revelar minha leitura →**

Essa etapa deve ser curta e opcionalmente pulável para não prejudicar conversão.

### 2.3 Transparência

Não fingir que a IA está realizando operações que não acontecem de fato. Se forem mostradas etapas de análise, elas devem corresponder ao processamento real ou ser apresentadas explicitamente como uma animação de preparação da leitura.

---

## 3. Stack Técnica Recomendada

- Framework: Next.js (App Router) ou outro framework React com SSR — escolha livre, mas priorizar time-to-ship
- Hospedagem: Vercel
- Geração de IA: Vercel AI SDK + AI Gateway (usar string de modelo `"provider/model"` via gateway, não SDK de provider específico)
- Checkout: Cakto (link de checkout + webhook de confirmação de pagamento)
- Pixel: Meta Pixel, suportando múltiplos Pixel IDs simultâneos
- Analytics: eventos próprios + Meta Pixel
- Banco de dados: qualquer Postgres gerenciado (ex: Neon)
- Sem n8n no caminho principal do usuário; n8n pode entrar posteriormente em automações pós-venda

### Requisitos adicionais de backend

- geração assíncrona/segura de relatórios;
- retry automático em falhas transitórias;
- modelo fallback quando disponível;
- status de geração persistido no banco;
- `prompt_version` persistido para permitir comparação de prompts;
- impedir geração duplicada desnecessária;
- logs de erro sem expor dados pessoais em ferramentas de observabilidade;
- rate limiting/anti-abuso nos endpoints de IA;
- validação server-side de todos os dados recebidos do client.

---

## 4. Meta Pixel e Tracking

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

### Eventos Meta

- `PageView` — automático
- `Lead` — quiz completo
- `ViewContent` — relatório grátis visualizado
- `InitiateCheckout` — usuário foi para checkout pago
- `Purchase` — confirmado via webhook Cakto, nunca somente no client

### Eventos internos de funil

Além dos eventos Meta, registrar eventos próprios:

- `landing_viewed`
- `quiz_start`
- `quiz_question_viewed`
- `quiz_question_answered`
- `quiz_complete`
- `quiz_abandoned`
- `generation_started`
- `generation_completed`
- `generation_failed`
- `free_report_viewed`
- `free_report_scroll_50`
- `free_report_scroll_90`
- `paywall_viewed`
- `checkout_started`
- `checkout_abandoned`
- `bump_viewed`
- `bump_added`
- `bump_declined`
- `purchase_completed`
- `paid_report_viewed`
- `pdf_generated`
- `pdf_downloaded`

Registrar timestamp, session_id, evento, contexto mínimo necessário e attribution/UTM quando disponível.

---

## 5. Fluxo do Funil

```text
Landing
  ↓
Hook + CTA "Descobrir minha leitura"
  ↓
Quiz 12–18 perguntas
  ↓
Tela de interpretação/preparação
  ↓
Relatório gratuito personalizado
  ↓
Teaser personalizado usando detalhe real da resposta aberta
  ↓
Cliffhanger
  ↓
Oferta: Leitura Completa — R$ 15,90
  ↓
Checkout Cakto + 1–2 order bumps
  ↓
Webhook de pagamento
  ↓
Liberação do relatório pago
  ↓
Página de obrigado
  ↓
Relatório completo na tela + opção de PDF
  ↓
Pós-venda/remarketing (fora da V1)
```

---

## 6. Landing Page

A landing deve ser limpa, mobile-first e emocional, sem excesso de texto.

### Estrutura sugerida

1. Hook principal
2. Subheadline explicando personalização
3. CTA primário
4. Breve explicação de como funciona
5. Demonstração visual de uma leitura
6. Elementos de confiança/transparência
7. CTA repetido

### Direção de copy

Evitar promessas como "descubra exatamente o que vai acontecer".

Preferir linguagem como:

- "Veja o que sua leitura revela sobre o momento que você está vivendo."
- "Uma leitura criada a partir das suas respostas."
- "Tarot + IA para uma experiência de leitura personalizada."

CTA inicial para teste:

**Descobrir minha leitura →**

Variantes para A/B test:

- **Começar minha leitura →**
- **Revelar minha leitura →**

---

## 7. Quiz — Estrutura de Perguntas

- 12 a 18 perguntas no total
- maioria objetiva (múltipla escolha/seleção rápida)
- 2 a 3 perguntas abertas com texto livre curto
- coletar nome e data de nascimento
- barra de progresso visível
- uma pergunta por vez sempre que possível
- evitar perguntas que pareçam obviamente classificatórias
- manter ritmo rápido e sensação de descoberta

### Exemplos de perguntas

> Qual dessas situações mais parece com o seu momento atual?
>
> ❤️ Estou vivendo algo intenso no amor
> 💭 Estou confuso(a) sobre uma decisão
> 💰 Quero mudar minha situação financeira
> 🌙 Sinto que estou entrando em uma nova fase

Pergunta aberta:

> **O que mais tem tirado seu sono ultimamente?**

Outra possibilidade:

> **Existe algo que você sente que precisa deixar para trás?**

### Data de nascimento

A interface deve explicar de forma transparente sua finalidade:

> **Sua data de nascimento**
>
> Usaremos sua data para adicionar uma camada numerológica à sua leitura.

Não apresentar astrologia/numerologia como ciência comprovada.

---

## 8. Geração do Relatório via IA

### 8.1 Relatório gratuito — personalidade

Gerado a partir de todas as respostas do quiz.

Estrutura:

1. abertura calorosa e pessoal;
2. "seu momento atual";
3. 2–3 pontos fortes;
4. 1–2 pontos de tensão/desafio, sempre construtivos;
5. referência natural a pelo menos um detalhe relevante das respostas abertas;
6. teaser personalizado;
7. cliffhanger para a leitura completa.

Tamanho: curto o suficiente para leitura de 1–2 minutos no celular.

### 8.2 Teaser personalizado / Paywall

O teaser é parte importante da conversão e não deve ser apenas um CTA genérico.

Exemplo de estrutura:

> **Existe algo nas suas respostas que chamou nossa atenção...**
>
> Você mencionou que **"[trecho relevante da resposta]"**.
>
> Isso aparece de forma interessante quando cruzamos sua leitura atual com o que você está vivendo.
>
> **E é justamente aqui que começa a parte mais importante da sua leitura.**

Depois apresentar o que será desbloqueado:

### 🔮 Sua Leitura Completa

- próximos meses;
- amor e relacionamentos;
- carreira e dinheiro;
- o que merece sua atenção;
- possível ponto de alerta;
- mensagem final personalizada.

CTA:

**Desbloquear minha leitura completa — R$ 15,90**

### 8.3 Relatório pago — "O que o futuro te espera"

Gerado com prompt separado, mais longo, narrativo e místico, mas sem alarmismo ou afirmações factuais sobre o futuro.

Estrutura:

1. abertura personalizada;
2. energia/momento atual;
3. próximos meses;
4. relacionamentos;
5. carreira e dinheiro;
6. o que pode estar bloqueando o usuário;
7. um ponto de atenção/alerta construtivo;
8. oportunidade ou direção possível;
9. mensagem final;
10. referência natural a detalhes específicos das respostas abertas.

Formato: tela no site + opção de PDF para baixar/guardar.

---

## 9. Prompt Engineering

### Regras gerais

- usar nome e respostas abertas literalmente quando apropriado;
- nunca inventar informações pessoais;
- distinguir claramente fatos fornecidos pelo usuário de interpretação narrativa;
- não transformar respostas abertas em diagnósticos;
- não fazer promessas médicas, financeiras ou legais;
- não induzir medo, dependência ou urgência artificial;
- não afirmar que um evento futuro ocorrerá com certeza;
- tom acolhedor, íntimo, místico e reflexivo;
- evitar frases genéricas que poderiam servir para qualquer pessoa;
- priorizar referências específicas às respostas do usuário.

### Saída estruturada

Retornar JSON validado por schema, por exemplo:

```json
{
  "title": "string",
  "opening": "string",
  "current_moment": "string",
  "strengths": ["string"],
  "tensions": ["string"],
  "personalized_teaser": "string",
  "sections": [
    {
      "title": "string",
      "content": "string"
    }
  ],
  "final_message": "string"
}
```

O schema deve ser validado no backend antes de renderizar.

### Versionamento

Toda geração deve registrar `prompt_version` e `model` para permitir análise posterior de conversão, qualidade e custo.

---

## 10. Resiliência da IA

O fluxo não pode quebrar se a IA falhar.

### Estratégia

1. gerar com modelo principal;
2. retry em erros transitórios;
3. usar modelo fallback quando configurado;
4. se ainda falhar, apresentar mensagem amigável e permitir tentar novamente;
5. registrar `generation_failed` sem expor detalhes técnicos ao usuário.

Status possíveis:

- `pending`
- `generating`
- `completed`
- `failed`

Evitar cobrar ou liberar produto com relatório incompleto.

---

## 11. Oferta Paga

### Produto principal

**Sua Leitura Completa — O que o futuro te espera**

Preço inicial: **R$ 15,90**.

A oferta deve deixar claro o que será entregue, em vez de depender apenas do nome do produto.

### Entregáveis

- leitura dos próximos meses;
- amor e relacionamentos;
- carreira e dinheiro;
- ponto de atenção;
- possíveis oportunidades/direções;
- mensagem final personalizada;
- versão digital para leitura;
- opção de PDF para guardar.

---

## 12. Order Bumps

Oferecer 1–2 no checkout, com ativação em um clique.

### Bump 1 — Compatibilidade Amorosa

**R$ 9,90**

Pede nome + data de nascimento do crush/parceiro.

Deve ser apresentado como uma leitura simbólica de compatibilidade, não como diagnóstico ou certeza sobre relacionamento.

### Bump 2 — Carreira & Dinheiro

**R$ 9,90**

Leitura complementar focada em carreira, decisões e relação simbólica com dinheiro.

### Teste separado

Versão em áudio narrado ou PDF estilizado pode ser testada posteriormente como oferta adicional, mas não precisa ser prioridade na V1.

---

## 13. Checkout e Pagamento — Cakto

- usar links de checkout configurados no painel Cakto;
- order bumps configurados no checkout;
- webhook Cakto confirma pagamento no backend;
- nunca considerar `Purchase` confirmado somente pelo client;
- após confirmação, vincular pagamento à sessão correta;
- liberar relatório pago apenas após confirmação válida;
- evitar duplicidade de pedidos/webhooks com idempotência.

### Meta Purchase

O evento `Purchase` deve ser disparado a partir da confirmação do backend/webhook, preferencialmente server-side quando a infraestrutura adotada suportar isso corretamente.

---

## 14. Página de Obrigado e Entrega

Após pagamento confirmado:

1. mostrar confirmação;
2. gerar ou recuperar o relatório pago;
3. exibir a leitura na própria página;
4. oferecer geração/download de PDF;
5. registrar `paid_report_viewed`;
6. registrar `pdf_generated` e `pdf_downloaded` quando aplicável.

A página deve evitar que o usuário fique esperando indefinidamente. Se a geração ainda estiver em andamento, mostrar estado claro de processamento e permitir atualização segura.

---

## 15. Modelo de Dados

### `quiz_sessions`

- `id`
- `created_at`
- `name`
- `birth_date`
- `answers` (jsonb)
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `fbclid`
- `consent_at`
- `privacy_policy_version`
- `deleted_at`

### `reports`

- `id`
- `session_id`
- `type` (`free | future | compatibility | career`)
- `content` (jsonb)
- `generation_status`
- `model`
- `prompt_version`
- `generated_at`
- `generation_error` (sanitizado, quando aplicável)

### `orders`

- `id`
- `session_id`
- `products` (jsonb)
- `value`
- `status` (`pending | paid | failed | refunded`)
- `cakto_order_id`
- `paid_at`
- `created_at`

### `events`

- `id`
- `session_id`
- `event_name`
- `created_at`
- `metadata` (jsonb mínimo)

Não armazenar dados desnecessários em `metadata`.

---

## 16. LGPD / Privacidade

Nome, data de nascimento e respostas abertas podem constituir dados pessoais e, dependendo do conteúdo, podem revelar informações adicionais sobre a pessoa.

A V1 deve ter:

- Política de Privacidade acessível;
- explicação clara de por que os dados são coletados;
- consentimento quando necessário;
- indicação de como os dados são usados para gerar a leitura;
- não vender/compartilhar dados para terceiros sem base legal apropriada;
- mecanismo de solicitação de exclusão;
- processo para atender solicitações de titulares;
- minimização de dados;
- retenção apenas pelo tempo necessário;
- não enviar dados pessoais desnecessários para logs/analytics;
- proteção de endpoints e banco;
- cuidado especial com respostas abertas.

Não prometer "não compartilhar dados" de maneira absoluta se houver operadores/processadores necessários à prestação do serviço; a Política de Privacidade deve explicar os terceiros/processadores relevantes de forma transparente.

---

## 17. Segurança e Anti-Abuso

Implementar desde a V1:

- rate limiting nos endpoints de IA;
- validação e sanitização de inputs;
- limite de tamanho para respostas abertas;
- proteção contra prompt injection nas respostas do usuário;
- nunca permitir que texto do usuário altere as instruções de sistema do modelo;
- autenticação/assinatura segura de webhook quando suportada;
- idempotência de webhook;
- não expor chaves de API no client;
- não confiar em preço/status enviados pelo navegador;
- checagem server-side de pagamento antes de liberar conteúdo pago.

---

## 18. A/B Testing

Implementar estrutura simples para testar:

### Landing

- Hook emocional vs hook de personalização
- "Descobrir minha leitura" vs "Começar minha leitura"

### Quiz

- 12 vs 15 vs 18 perguntas
- ordem das perguntas
- número de perguntas abertas

### Relatório grátis

- teaser curto vs teaser detalhado
- diferentes posições do CTA

### Paywall

- diferentes headlines
- diferentes listas de entregáveis
- preço/oferta quando fizer sentido

### Order bumps

- ordem dos bumps
- copy
- preço
- benefício principal

Toda variante precisa ser identificável nos eventos para comparação posterior.

---

## 19. Métricas e Critérios de Sucesso

### Funil

Monitorar pelo menos:

- landing → quiz start;
- quiz start → quiz complete;
- quiz complete → free report viewed;
- free report → paywall viewed;
- paywall → checkout started;
- checkout → purchase;
- purchase → paid report viewed;
- purchase → PDF downloaded;
- bump viewed → bump added;
- geração concluída vs falha.

### Métricas financeiras

- CAC;
- taxa de conversão;
- receita por visitante;
- receita por sessão de quiz;
- AOV;
- take rate dos bumps;
- custo médio de IA por relatório;
- margem por venda;
- ROAS.

### Critério de sucesso da V1

- funil completo rodando: quiz → relatório grátis → checkout → pagamento → entrega;
- geração de IA confiável com fallback;
- Pixel e eventos internos disparando corretamente;
- webhook Cakto idempotente;
- dados essenciais sendo registrados;
- experiência otimizada para mobile;
- possibilidade de medir cada etapa do funil;
- testável com tráfego pago pequeno antes de escalar orçamento de anúncio.

---

## 20. Fora de Escopo da V1

- app mobile nativo;
- login/conta de usuário;
- assinatura recorrente;
- automação de WhatsApp pós-venda;
- sistema complexo de experimentação;
- painel administrativo completo;
- marketplace de leitores humanos.

Esses itens podem entrar após validação da oferta principal.

---

## 21. Roadmap Pós-Validação

### Fase 2

- assinatura recorrente de novas leituras;
- WhatsApp pós-venda;
- biblioteca de leituras anteriores;
- painel administrativo;
- mais tipos de leitura;
- personalização de PDF;
- áudio narrado.

### Fase 3

- segmentação comportamental;
- recomendações personalizadas de novas leituras;
- CRM/remarketing avançado;
- testes automatizados de copy e oferta;
- otimização por LTV.

---

## 22. Resumo da Experiência Ideal

O usuário deve sentir que:

**1.** entrou por curiosidade;

**2.** respondeu perguntas que parecem realmente sobre ele;

**3.** forneceu detalhes pessoais que foram efetivamente considerados;

**4.** recebeu uma primeira leitura útil e específica gratuitamente;

**5.** percebeu um gancho legítimo para continuar;

**6.** entendeu exatamente o que receberia pagando R$ 15,90;

**7.** recebeu uma leitura completa com personalização perceptível;

**8.** conseguiu guardar sua leitura em PDF;

**9.** teve uma experiência segura, transparente e sem promessas alarmistas.

### Direção central do produto

> **Não construir apenas um "site de Tarot com IA". Construir uma experiência emocional de descoberta pessoal que utiliza Tarot + IA como mecanismo narrativo e de personalização.**
