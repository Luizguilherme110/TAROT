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
