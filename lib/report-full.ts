import 'server-only';

import type { FullReport, QuizSession } from './report-types';
import { collectQuotableAnswers } from './quotable-answer';
import { getLifePathNumber, getZodiacSign } from './birth-chart';

/**
 * Everything a reader pays R$ 19,90 to read.
 *
 * This module is server-only on purpose. It used to live in
 * lib/generate-mock-report.ts, which runs in the browser, so every paid
 * paragraph shipped inside the client bundle and could be read straight out of
 * DevTools without paying. The `server-only` import above turns that mistake
 * into a build error rather than a silent leak: importing this from a client
 * component fails the build.
 *
 * The only way in is app/api/report/full/route.ts, which checks the payment
 * against Supabase before calling buildFullReport.
 */

/**
 * The baseline paid report, keyed by `situacao_atual` alone.
 *
 * This used to *be* the paid report — one lookup, four possible outcomes for
 * every reader who ever paid. It is now the fallback layer: the composition
 * below overrides each section from a different answer whenever the reader was
 * asked that question, and falls back to the matching field here when the
 * randomized pool draw skipped it. Every section therefore always has text,
 * and the fallback text is the copy that was already in production.
 */
const SITUATION_FULL: Record<string, FullReport> = {
  amor: {
    months_ahead:
      'Nos próximos meses, algo que estava travado no campo afetivo começa a se mover. Não espere uma virada de um dia pro outro: é mais um destravar aos poucos, na medida em que você parar de se antecipar ao que o outro vai sentir.',
    love: 'Se você está numa relação, o convite é abrir uma conversa que vem adiando, mesmo com medo da resposta. Se está sozinho(a), o próximo vínculo que importa provavelmente não vai parecer com o que você imaginava — e é bom sinal.',
    career_money:
      'No campo profissional, sua tendência de carregar o emocional do trabalho pra casa (e vice-versa) pode custar uma oportunidade se não for observada agora.',
    attention:
      'Preste atenção em quantas vezes você diz "tá tudo bem" quando não está, especialmente perto de quem você mais confia.',
    warning:
      'Ponto de alerta: mágoas antigas não resolvidas tendem a aparecer disfarçadas de ciúme ou desconfiança num vínculo novo. Vale nomear a origem antes de reagir.',
    your_words: '',
    birth_reading: '',
    final_message:
      'Você já sabe sentir fundo. O que falta agora não é sentir mais, é confiar que o que você sente merece ser dito em voz alta.',
  },
  decisao: {
    months_ahead:
      'A decisão que você vem adiando não vai ficar mais clara com mais tempo de análise — ela vai ficar mais clara com uma ação pequena e reversível que te tire do "e se".',
    love: 'Enquanto essa escolha estiver em aberto, vínculos ao seu redor podem sentir sua ausência mesmo com você presente. Vale avisar quem te importa que sua cabeça está ocupada, não distante.',
    career_money:
      'Financeiramente, essa indecisão tem um custo silencioso: oportunidades que exigem resposta rápida podem estar passando enquanto você pesa prós e contras pela enésima vez.',
    attention:
      'Observe quantas vezes você pede a opinião de outra pessoa antes de admitir, pra si mesmo(a), o que você já sabe que quer.',
    warning:
      'Ponto de alerta: existe uma diferença entre ser cauteloso(a) e usar a análise como desculpa pra não se comprometer com nada. Vale reconhecer em qual dos dois você está agora.',
    your_words: '',
    birth_reading: '',
    final_message:
      'Você não precisa ter certeza absoluta pra dar o próximo passo. Precisa só de coragem suficiente pra dar um passo que você possa corrigir depois.',
  },
  dinheiro: {
    months_ahead:
      'Os próximos meses pedem menos foco em "ganhar mais" e mais foco em entender pra onde o que você já ganha está indo. Uma revisão simples nos hábitos financeiros rende mais do que parece agora.',
    love: 'Questões de dinheiro tendem a aparecer em conversas afetivas neste período — sejam suas ou de alguém próximo. Vale separar autoestima de saldo bancário antes que a mistura pese na relação.',
    career_money:
      'Uma oportunidade de renda extra ou mudança profissional pode surgir, mas só vai valer a pena se você já tiver clareza do padrão que quer romper, não só do valor que quer alcançar.',
    attention: 'Preste atenção em decisões financeiras tomadas por impulso pra aliviar ansiedade — elas tendem a se repetir em ciclo.',
    warning:
      'Ponto de alerta: promessas de ganho fácil ou rápido merecem desconfiança redobrada neste momento, mesmo vindas de gente próxima.',
    your_words: '',
    birth_reading: '',
    final_message:
      'Você já enxerga os padrões que te atrapalham. A próxima camada é agir diferente uma única vez — o resto vem depois, por repetição.',
  },
  fase_nova: {
    months_ahead:
      'O fechamento de ciclo que você sente se confirma nos próximos meses, mas o começo do próximo não vai chegar anunciado — você vai precisar decidir dar o primeiro passo antes de sentir 100% de segurança.',
    love: 'Vínculos que não acompanham essa mudança de fase tendem a se distanciar naturalmente, sem drama. Não force nenhum deles a continuar do jeito que estava.',
    career_money:
      'No campo profissional ou financeiro, essa é uma fase de plantar, não de colher. Decisões tomadas agora rendem resultado visível daqui a alguns meses, não imediatamente.',
    attention: 'Observe o quanto você fica no "quase decidindo" — é aí que a energia mais se perde neste momento.',
    warning:
      'Ponto de alerta: recomeçar sozinho(a) assusta, mas esperar companhia pra dar o primeiro passo pode custar o momento certo de agir.',
    your_words: '',
    birth_reading: '',
    final_message:
      'Você já sabe se adaptar rápido quando decide de verdade. O que falta não é capacidade, é permissão pra começar antes de estar pronto(a).',
  },
};

/**
 * Each paid section is keyed by a *different* quiz question, so the report is
 * assembled rather than looked up. Four situations against four options on each
 * of the four questions below is 1.024 combinations from twenty blocks of copy,
 * before the birth-date layer multiplies it further.
 */
const LOVE_BY_RELATIONSHIP_WEIGHT: Record<string, string> = {
  medo_abrir:
    'No amor, o que te protege hoje é a mesma coisa que te isola. Você aprendeu a medir o quanto se mostra, e essa medida virou automática — inclusive com quem já provou que merecia mais. O próximo passo não é baixar a guarda inteira, é deixar uma frase verdadeira escapar por vez.',
  dar_mais:
    'Nas suas relações existe uma conta que você faz sozinho(a) e nunca apresenta. Você dá primeiro, dá mais, e espera que alguém perceba sem precisar ser avisado. Quase nunca percebem — não por desprezo, mas porque você é bom(boa) demais em não deixar transparecer que está no vermelho.',
  // The most-served fragment in the deck: this is what the open answers say the
  // readers are actually living. It deliberately refuses to promise the person
  // comes back — that promise is the one thing that would turn a R$ 19,90
  // reading into a refund and a screenshot.
  esperando_volta:
    'Existe uma pessoa específica ocupando espaço na sua cabeça, e boa parte da sua energia vai em interpretar sinais: o que aquela mensagem quis dizer, o que significa o silêncio, o que muda se ela aparecer amanhã. O que as cartas apontam não é a resposta dela — é que enquanto a sua próxima semana depender de um movimento que não é seu, você fica em pausa. Voltar a ocupar o próprio espaço não é desistir de ninguém: é parar de esperar de pé na porta.',
  falta_algo:
    'Está tudo bem, e é exatamente esse "tudo bem" que incomoda. Falta alguma coisa que você ainda não conseguiu nomear, e a tentação é procurar o defeito na outra pessoa quando a pergunta real é sobre o que você parou de pedir em algum momento do caminho.',
  sozinho:
    'Estar sozinho(a) agora não é um problema a ser resolvido, e alguém vai tentar te convencer do contrário nos próximos tempos. O ponto de atenção é outro: repare se a sua paz atual é escolha ou é cansaço de tentar. As duas parecem iguais por fora e levam a lugares muito diferentes.',
};

const CAREER_BY_CHANGE_WISH: Record<string, string> = {
  rotina:
    'Você quer mudar a rotina, mas rotina raramente muda por decisão grande — muda por uma peça pequena trocada de lugar e mantida por tempo suficiente. No campo do trabalho e do dinheiro, essa é a fase de mexer em uma coisa só, não de recomeçar tudo.',
  relacionamento:
    'O que você quer mudar não está no trabalho, e é por isso mesmo que o trabalho anda estranho. Quando a energia está toda alocada numa questão afetiva, o profissional entra em modo de manutenção — e tudo bem por um período, desde que você saiba que é isso que está acontecendo.',
  financeiro:
    'Você quer mudar a situação financeira, e a virada desta fase não vem de um valor a mais entrando: vem de enxergar com honestidade pra onde vai o que já entra. É uma conversa desconfortável com você mesmo(a), e é a que destrava o resto.',
  autoimagem:
    'O que você quer mudar é como se vê, e isso aparece no trabalho antes de aparecer no espelho: em oportunidade que você não pediu, em espaço que não ocupou, em valor que não cobrou. Comece pela cobrança — ela é a mais mensurável das três.',
};

const ATTENTION_BY_DAILY_STATE: Record<string, string> = {
  cansaco:
    'Preste atenção no seu cansaço. Ele não é preguiça e provavelmente não é falta de sono: é o custo de manter, todo dia, alguma coisa que já deveria ter sido dita ou encerrada. Corpo cansado sem motivo aparente costuma ser conta emocional vencida.',
  vontade_mudar:
    'Preste atenção na sua vontade de mudar tudo. Ela é real, mas "tudo" é um plano que nunca começa. Escolha a menor peça que você consegue mudar sozinho(a) esta semana e mude só ela — o resto ganha impulso a partir daí.',
  calma_alerta:
    'Preste atenção nessa calma em alerta. Você está funcionando bem, mas com uma parte de você sempre de guarda, esperando o próximo problema. Isso consome energia mesmo quando nada acontece, e é um gasto que não aparece em lugar nenhum.',
  ansiedade:
    'Preste atenção em quanto do seu dia é gasto ensaiando conversas que talvez nunca aconteçam. A ansiedade sobre o que vem é uma tentativa de controlar o futuro pelo pensamento, e ela cobra o presente inteiro como pagamento.',
};

const WARNING_BY_UNCERTAINTY_STYLE: Record<string, string> = {
  controlar:
    'Ponto de alerta: sua vontade de controlar tudo que dá vai encontrar, nesta fase, algo que não se deixa controlar. A tentação vai ser apertar mais. Apertar mais é justamente o que quebra — tanto a situação quanto você.',
  fluxo:
    'Ponto de alerta: seguir o fluxo tem te poupado de brigas desnecessárias, mas existe uma decisão específica no seu radar que não vai se resolver sozinha. Fluxo é sabedoria em quase tudo, e é adiamento nessa uma.',
  ajuda:
    'Ponto de alerta: você costuma pedir conselho a várias pessoas, e nesta fase os conselhos vão se contradizer. Quando isso acontecer, não procure uma terceira opinião — repare em qual das duas primeiras te deu alívio antes de te dar argumento.',
  evitar:
    'Ponto de alerta: você evita pensar no assunto até virar urgência, e essa estratégia funcionou várias vezes. Nesta fase específica ela cobra caro, porque a janela de escolher com calma é curta e já começou a se fechar.',
};

/**
 * Closes the "suas palavras" section, keyed by the situation the reader picked.
 *
 * These lines must never claim anything about *what* the reader wrote — the
 * generator cannot read free text, so "repare que você não escreveu sobre a
 * outra pessoa" is a coin flip that lands wrong in front of a paying reader.
 * They may only lean on what is actually known: the situation the reader chose
 * from a list, and the fact that they wrote before seeing any card.
 */
const YOUR_WORDS_BRIDGE: Record<string, string> = {
  amor: 'Você escreveu isso antes de ver qualquer carta. Guarde a frase: no campo afetivo, o que trava quase nunca é a falta de resposta do outro, é uma coisa sua que ainda não foi dita em voz alta — e ela costuma já estar aí, escrita.',
  decisao:
    'Você escreveu isso antes de ver qualquer carta, e sem ninguém pra agradar. Volte nessa frase quando a dúvida apertar: ela foi escrita pela parte de você que não estava pesando prós e contras.',
  dinheiro:
    'Você escreveu isso antes de ver qualquer carta. Repare depois, com calma, quanto dessa frase é sobre valor e quanto é sobre segurança — dinheiro pesa muito além do que ele mede, e os dois pesos pedem soluções diferentes.',
  fase_nova:
    'Você escreveu isso antes de ver qualquer carta, no meio de uma virada que ainda não terminou. Releia daqui a alguns meses: é assim que se percebe que um ciclo fechou de verdade.',
};

const DEFAULT_YOUR_WORDS_BRIDGE = YOUR_WORDS_BRIDGE.fase_nova;

const SIGN_READING: Record<string, string> = {
  aries:
    'Ariano começa antes de ter certeza, e é isso que te tira de lugares onde outros ficam anos parados. O custo é começar coisas demais ao mesmo tempo: quando tudo é urgente, nada termina.',
  touro:
    'Taurino constrói devagar e não desmonta fácil. Sua força é a permanência, mas ela vira teimosia quando você já percebeu que algo não serve e continua ali só porque custou caro chegar.',
  gemeos:
    'Geminiano pensa em voz alta e muda de ideia sem culpa. Isso te faz enxergar saídas que ninguém viu, e também te faz duvidar da decisão certa no dia seguinte de ter tomado.',
  cancer:
    'Canceriano sente antes de entender e guarda o que sente por muito tempo. Você cuida de gente com uma atenção que poucos retribuem no mesmo tamanho, e raramente pede o que dá.',
  leao: 'Leonino carrega os outros no colo e não deixa transparecer o peso. Você quer ser visto de verdade, não só admirado, e essa diferença explica boa parte das suas frustrações com quem está por perto.',
  virgem:
    'Virginiano enxerga o detalhe que ninguém viu, inclusive os próprios. A mesma precisão que resolve problemas de todo mundo vira cobrança silenciosa quando aponta pra dentro.',
  libra:
    'Libriano mede o clima da sala antes de dizer o que pensa. Isso te torna alguém com quem é fácil conviver, e às vezes esconde de você mesmo o que você realmente queria ter dito.',
  escorpiao:
    'Escorpiano não faz nada pela metade, principalmente sentir. Você percebe intenção antes de ser dita, e quando algo quebra a sua confiança, o corte costuma vir inteiro de uma vez.',
  sagitario:
    'Sagitariano precisa de horizonte pra respirar. Rotina fechada te sufoca rápido, e o desafio não é encontrar liberdade: é ficar tempo suficiente em algo pra colher o que plantou.',
  capricornio:
    'Capricorniano assume responsabilidade antes de ser pedido. Você chega onde se propõe, mas costuma adiar o próprio descanso pra depois de uma linha de chegada que nunca fica pronta.',
  aquario:
    'Aquariano pensa fora do combinado e não se encaixa por educação. Sua leitura das coisas costuma estar à frente do grupo, e a distância entre enxergar e ser entendido pesa mais do que você admite.',
  peixes:
    'Pisciano absorve o clima de quem está por perto sem perceber. Sua sensibilidade é um instrumento de precisão, e ela precisa de silêncio regular pra não confundir o que é seu com o que é dos outros.',
};

// Life path number, the one piece of numerology this audience actually expects
// to see. Master numbers (11, 22) are reduced too — an eleventh and twelfth
// block of copy buys very little on top of the twelve signs already here.
const NUMBER_READING: Record<number, string> = {
  1: 'Seu número é 1, o do começo. Você foi feito(a) pra abrir caminho, não pra seguir o que já está pronto, e o preço disso é aprender a pedir ajuda antes de estar exausto(a).',
  2: 'Seu número é 2, o da ligação. Você lê o que o outro precisa antes de ele falar, e a sua tarefa desta fase é aplicar essa mesma escuta em você.',
  3: 'Seu número é 3, o da expressão. O que você sente precisa sair em palavra, imagem ou conversa: guardado por muito tempo, vira peso sem nome.',
  4: 'Seu número é 4, o da base. Você constrói pra durar e desconfia de atalho, e é justamente por isso que uma mudança arriscada te assusta mais do que deveria.',
  5: 'Seu número é 5, o do movimento. Você aprende mudando de lugar, e o desafio não é ter coragem de partir: é escolher o que merece você ficando.',
  6: 'Seu número é 6, o do cuidado. Você assume o que é dos outros com naturalidade, e costuma descobrir tarde demais quanto disso nunca foi sua responsabilidade.',
  7: 'Seu número é 7, o da profundidade. Você precisa entender antes de aceitar, e a resposta que procura agora provavelmente não vem de mais informação, vem de silêncio.',
  8: 'Seu número é 8, o da realização. Você sabe transformar esforço em resultado concreto, e a armadilha é medir o próprio valor pelo tamanho do que já entregou.',
  9: 'Seu número é 9, o do fechamento. Sua vida é feita de ciclos que terminam por inteiro, e você costuma segurar o encerramento mais tempo do que precisaria.',
};

/**
 * Sign paragraph plus life-path paragraph: twelve signs against nine numbers is
 * 108 distinct readings from twenty-one hand-written blocks, and two readers who
 * answered the quiz identically still land on different text.
 */
function buildBirthReading(isoDate: string): string {
  const zodiac = getZodiacSign(isoDate);
  const number = getLifePathNumber(isoDate);
  if (!zodiac || number === undefined) return '';
  return `${SIGN_READING[zodiac.sign]}\n\n${NUMBER_READING[number]}`;
}

/**
 * Picks the fragment matching the answer the reader gave, or the baseline text
 * for their situation when the randomized pool never asked them that question.
 */
function composeSection(
  fragments: Record<string, string>,
  answerId: string | undefined,
  fallback: string,
): string {
  return (answerId ? fragments[answerId] : undefined) ?? fallback;
}

function buildYourWords(name: string, quotes: string[], situationKey: string): string {
  const bridge = YOUR_WORDS_BRIDGE[situationKey] ?? DEFAULT_YOUR_WORDS_BRIDGE;
  if (quotes.length === 0) {
    // Nothing quotable was typed, so there is nothing to quote — say what the
    // reading was built from instead of presenting an empty pair of quotes.
    return `${name}, sua leitura foi montada a partir das escolhas que você marcou e da sua data de nascimento.\n\n${bridge}`;
  }
  const quoted = quotes.map((quote) => `"${quote}"`).join('\n\n');
  return `${name}, estas são as suas palavras, do jeito que você escreveu:\n\n${quoted}\n\n${bridge}`;
}

export function buildFullReport(session: QuizSession): FullReport {
  const name = session.name.trim() || 'você';
  const situationKey = session.answers.situacao_atual;
  const baseline = SITUATION_FULL[situationKey] ?? SITUATION_FULL.fase_nova;

  return {
    months_ahead: baseline.months_ahead,
    love: composeSection(LOVE_BY_RELATIONSHIP_WEIGHT, session.answers.peso_relacoes, baseline.love),
    career_money: composeSection(CAREER_BY_CHANGE_WISH, session.answers.mudar_agora, baseline.career_money),
    attention: composeSection(ATTENTION_BY_DAILY_STATE, session.answers.rotina_atual, baseline.attention),
    warning: composeSection(WARNING_BY_UNCERTAINTY_STYLE, session.answers.lida_incerteza, baseline.warning),
    your_words: buildYourWords(name, collectQuotableAnswers(session), situationKey),
    birth_reading: buildBirthReading(session.birthDate),
    final_message: baseline.final_message,
  };
}
