import type { QuizSession, Report, SpreadCard } from './report-types';
import { GENIE_REACTIONS } from './genie-lines';
import { getAnswerLabel } from './quiz-questions';
import { collectQuotableAnswers } from './quotable-answer';
import { CARD_POSITIONS, TAROT_CARDS, buildPositionReading } from './tarot-cards';
import { getZodiacSign } from './birth-chart';

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

// Short headings for the answers echoed back to the reader. Keyed by question
// id and covering the whole pool, not just the anchors: a session draws eight
// random choice questions, and every one of them that goes unlabelled is a row
// of proof missing from the echo. Kept to two or three words each — on a phone
// this renders as a label/answer pair per row, and a long heading pushes the
// answer onto its own line.
const ECHO_LABELS: Record<string, string> = {
  situacao_atual: 'Seu momento',
  elemento: 'Seu elemento',
  rotina_atual: 'Sua rotina',
  lida_incerteza: 'Na incerteza',
  peso_relacoes: 'Nas relações',
  mudar_agora: 'Mudaria hoje',
  depois_do_erro: 'Quando erra',
  o_que_muda: 'Prestes a mudar',
  esperanca: 'Sua esperança',
  dia_dificil: 'Em dia difícil',
  medo_atual: 'Seu medo',
  energia_hoje: 'Sua energia',
  sinal_universo: 'Diante dos sinais',
  papel_social: 'Seu papel',
  relacao_passado: 'Com o passado',
  proxima_conquista: 'Quer conquistar',
  reacao_criticas: 'Diante da crítica',
  espaco_pessoal: 'Sua paz',
  padrao_repetido: 'O que se repete',
  forca_interior: 'Sua força',
  bloqueio_atual: 'Seu bloqueio',
  visao_futuro: 'Sobre o futuro',
  relacao_dinheiro: 'Com dinheiro',
  apoio_emocional: 'Busca apoio em',
  intuicao_decisoes: 'Sua intuição',
  sensacao_hoje: 'Seu clima',
};

const DEFAULT_SITUATION = SITUATION_CONTENT.fase_nova;
const DEFAULT_TRAIT = SITUATION_TRAIT.fase_nova;
const DEFAULT_ELEMENT = ELEMENT_CONTENT.agua;

export function generateMockReport(session: QuizSession): Report {
  const name = session.name.trim() || 'você';
  const situationKey = session.answers.situacao_atual;
  const situation = SITUATION_CONTENT[situationKey] ?? DEFAULT_SITUATION;
  const elementContent = ELEMENT_CONTENT[session.answers.elemento] ?? DEFAULT_ELEMENT;
  // Only a quote that carries something: real sessions answer "Existe algo
  // que...?" with a bare "Sim", and `com as suas palavras: "Sim"` sinks the
  // teaser exactly where it has to do its work.
  const excerpt = collectQuotableAnswers(session)[0] ?? 'algo que ainda não coloquei em palavras';
  const cardIds = session.cardIds ?? [];
  const spread: SpreadCard[] = CARD_POSITIONS.reduce<SpreadCard[]>((acc, position, index) => {
    const card = TAROT_CARDS.find((candidate) => candidate.id === cardIds[index]);
    if (!card) return acc;
    acc.push({ position, card, reading: buildPositionReading(position, card.meaning) });
    return acc;
  }, []);

  const birth = getZodiacSign(session.birthDate);

  const personalizedEcho = Object.entries(ECHO_LABELS).flatMap(([questionId, label]) => {
    const answerId = session.answers[questionId];
    const answer = answerId ? getAnswerLabel(questionId, answerId) : undefined;
    return answer ? [{ label, answer }] : [];
  });
  // The sign is the one echo row the reader never picked from a list, which is
  // exactly why it reads as the reading knowing something about them.
  if (birth) {
    personalizedEcho.push({ label: 'Seu signo', answer: birth.label });
  }

  return {
    reader_name: name,
    title: 'Sua Leitura de Hoje',
    opening: `${name}, respire fundo. O que você está prestes a ler foi montado a partir do que você mesmo(a) trouxe até aqui.`,
    current_moment: situation.current_moment,
    strengths: situation.strengths,
    tensions: situation.tensions,
    personalized_teaser: `${name}, com as suas palavras: "${excerpt}".\n\nFoi essa frase, cruzada com o que você marcou acima, que definiu as cartas da sua tiragem. Ninguém que respondeu diferente de você recebe a mesma leitura.\n\nO que vem a seguir parte exatamente daí.`,
    personalized_echo: personalizedEcho,
    sections: [{ title: 'O que seu elemento revela', content: elementContent }],
    final_message: `Essa é só a primeira camada da sua leitura, ${name}. O que vem a seguir mostra pra onde tudo isso está te levando.`,
    spread,
    genie_intro: {
      mood: GENIE_REACTIONS.situacao_atual[situationKey]?.mood ?? 'neutral',
      line: `${name}, vejo que você é ${SITUATION_TRAIT[situationKey] ?? DEFAULT_TRAIT}.`,
    },
  };
}
