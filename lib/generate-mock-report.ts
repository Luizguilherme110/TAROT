import type { FullReport, QuizSession, Report, SpreadCard } from './report-types';
import { GENIE_REACTIONS } from './genie-lines';
import { CARD_POSITIONS, TAROT_CARDS, buildPositionReading } from './tarot-cards';

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

const SITUATION_TRAIT: Record<string, string> = {
  amor: 'alguém que sente fundo, mesmo quando custa admitir',
  decisao: 'alguém que pensa bem antes de agir',
  dinheiro: 'alguém que já enxerga os próprios padrões',
  fase_nova: 'alguém em plena virada de ciclo',
};

const FULL_REPORT_CONTENT: Record<string, FullReport> = {
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
    final_message:
      'Você já sabe se adaptar rápido quando decide de verdade. O que falta não é capacidade, é permissão pra começar antes de estar pronto(a).',
  },
};

const DEFAULT_SITUATION = SITUATION_CONTENT.fase_nova;
const DEFAULT_TRAIT = SITUATION_TRAIT.fase_nova;
const DEFAULT_ELEMENT = ELEMENT_CONTENT.agua;

export function generateMockReport(session: QuizSession): Report {
  const name = session.name.trim() || 'você';
  const situationKey = session.answers.situacao_atual;
  const situation = SITUATION_CONTENT[situationKey] ?? DEFAULT_SITUATION;
  const elementContent = ELEMENT_CONTENT[session.answers.elemento] ?? DEFAULT_ELEMENT;
  const excerpt =
    session.answers.sono?.trim() ||
    session.answers.deixar_para_tras?.trim() ||
    'algo que ainda não coloquei em palavras';
  const cardIds = session.cardIds ?? [];
  const spread: SpreadCard[] = CARD_POSITIONS.reduce<SpreadCard[]>((acc, position, index) => {
    const card = TAROT_CARDS.find((candidate) => candidate.id === cardIds[index]);
    if (!card) return acc;
    acc.push({ position, card, reading: buildPositionReading(position, card.meaning) });
    return acc;
  }, []);
  const full = FULL_REPORT_CONTENT[situationKey] ?? FULL_REPORT_CONTENT.fase_nova;

  return {
    title: 'Sua Leitura de Hoje',
    opening: `${name}, respire fundo. O que você está prestes a ler foi montado a partir do que você mesmo(a) trouxe até aqui.`,
    current_moment: situation.current_moment,
    strengths: situation.strengths,
    tensions: situation.tensions,
    personalized_teaser: `Existe algo nas suas respostas que chamou nossa atenção...\n\nVocê mencionou que "${excerpt}".\n\nIsso aparece de forma interessante quando cruzamos sua leitura atual com o que você está vivendo.\n\nE é justamente aqui que começa a parte mais importante da sua leitura.`,
    sections: [{ title: 'O que seu elemento revela', content: elementContent }],
    final_message: `Essa é só a primeira camada da sua leitura, ${name}. O que vem a seguir mostra pra onde tudo isso está te levando.`,
    spread,
    genie_intro: {
      mood: GENIE_REACTIONS.situacao_atual[situationKey]?.mood ?? 'neutral',
      line: `${name}, vejo que você é ${SITUATION_TRAIT[situationKey] ?? DEFAULT_TRAIT}.`,
    },
    full,
  };
}
