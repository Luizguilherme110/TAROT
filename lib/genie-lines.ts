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
    esperando_volta: { mood: 'warm', line: 'Esperando a resposta de alguém que se afastou. Eu senti esse peso.' },
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
  medo_atual: {
    perder_controle: { mood: 'thinking', line: 'Medo de perder o controle. Isso diz muito sobre o quanto você segura sozinho(a).' },
    ficar_sozinho: { mood: 'warm', line: 'Medo de ficar sozinho(a). Um medo mais comum do que você imagina.' },
    ficar_para_tras: { mood: 'thinking', line: 'Medo de ficar pra trás. Essa comparação pesa mais do que deveria.' },
    decepcionar: { mood: 'warm', line: 'Medo de decepcionar alguém. Você carrega expectativas que nem sempre são suas.' },
  },
  energia_hoje: {
    alta_dispersa: { mood: 'excited', line: 'Energia alta, mas espalhada. Falta só direcionar isso.' },
    baixa_mas_estavel: { mood: 'neutral', line: 'Energia baixa, mas firme. Você está se sustentando do seu jeito.' },
    oscilando: { mood: 'thinking', line: 'Uma energia que sobe e desce. Isso cansa mais do que parece de fora.' },
    no_limite: { mood: 'warm', line: 'No limite. Eu percebi, e não é fraqueza admitir isso.' },
  },
  sinal_universo: {
    sim_sempre: { mood: 'pleased', line: 'Você presta atenção nos sinais. Isso é mais raro do que parece.' },
    as_vezes: { mood: 'thinking', line: 'Às vezes você percebe, às vezes passa direto. Faz parte.' },
    so_depois: { mood: 'neutral', line: 'Você entende os sinais só depois, olhando pra trás. Também vale.' },
    nunca: { mood: 'thinking', line: 'Você não costuma parar pra procurar sinais. Talvez seja hora de olhar diferente.' },
  },
  papel_social: {
    cuidador: { mood: 'warm', line: 'Você cuida de todo mundo. Quem cuida de você?' },
    ouvinte: { mood: 'pleased', line: 'Você ouve mais do que fala. Isso é um presente raro.' },
    resolvedor: { mood: 'excited', line: 'Você resolve os problemas dos outros. Energia de quem não para.' },
    observador: { mood: 'thinking', line: 'Você observa antes de agir. Vê mais do que aparenta.' },
  },
  relacao_passado: {
    enterro_e_sigo: { mood: 'excited', line: 'Você enterra o passado e segue. Nem sempre é fácil, mas funciona pra você.' },
    revisito_sempre: { mood: 'thinking', line: 'Você revisita o passado com frequência. Isso ainda pede um fechamento.' },
    aprendo_e_solto: { mood: 'pleased', line: 'Aprender e soltar. Essa é uma maturidade que poucos alcançam.' },
    evito_falar: { mood: 'warm', line: 'Você evita falar sobre isso. Tudo bem, no seu tempo.' },
  },
  proxima_conquista: {
    estabilidade: { mood: 'neutral', line: 'Estabilidade. Você já correu o suficiente, quer um chão firme agora.' },
    reconhecimento: { mood: 'excited', line: 'Reconhecimento. Você quer que o esforço seja visto, e faz sentido.' },
    liberdade: { mood: 'excited', line: 'Liberdade. Você não aguenta mais se sentir preso(a) a nada.' },
    paz: { mood: 'warm', line: 'Paz. Depois de tanta coisa, é isso que você mais busca agora.' },
  },
  reacao_criticas: {
    defender: { mood: 'thinking', line: 'Você se defende primeiro. É instintivo, mas nem sempre necessário.' },
    refletir: { mood: 'pleased', line: 'Você para pra refletir antes de reagir. Isso é maduro.' },
    magoar: { mood: 'warm', line: 'A crítica te machuca, mesmo quando você não mostra.' },
    ignorar: { mood: 'neutral', line: 'Você ignora e segue. Às vezes é proteção, às vezes é fuga.' },
  },
  espaco_pessoal: {
    silencio: { mood: 'neutral', line: 'Silêncio. Você recarrega longe do barulho.' },
    companhia: { mood: 'warm', line: 'Companhia. Estar perto de quem você ama te acalma.' },
    natureza: { mood: 'pleased', line: 'Natureza. Lá fora, tudo fica mais simples pra você.' },
    criar_algo: { mood: 'excited', line: 'Criar algo. Suas mãos ocupadas acalmam sua cabeça.' },
  },
  padrao_repetido: {
    relacoes_parecidas: { mood: 'thinking', line: 'Relações parecidas se repetindo. Esse padrão já apareceu, não é?' },
    mesma_frustracao_trabalho: { mood: 'thinking', line: 'A mesma frustração no trabalho, de novo. Isso pede uma mudança maior.' },
    ciclo_financeiro: { mood: 'neutral', line: 'Um ciclo financeiro que se repete. Você já percebeu, o que ajuda.' },
    nao_percebi_ainda: { mood: 'warm', line: 'Ainda não percebeu o padrão. Às vezes ele só aparece quando menos se espera.' },
  },
  forca_interior: {
    resiliencia: { mood: 'pleased', line: 'Resiliência. Você levanta de novo, sempre que precisa.' },
    intuicao: { mood: 'excited', line: 'Intuição. Você sente antes de entender, e confia nisso.' },
    disciplina: { mood: 'neutral', line: 'Disciplina. Você segue mesmo quando a vontade falta.' },
    empatia: { mood: 'warm', line: 'Empatia. Você sente o que o outro sente, quase sem esforço.' },
  },
  bloqueio_atual: {
    medo_julgamento: { mood: 'thinking', line: 'Medo do julgamento alheio. Isso te trava mais do que deveria.' },
    falta_clareza: { mood: 'thinking', line: 'Falta de clareza. Você não sabe bem qual caminho seguir ainda.' },
    falta_apoio: { mood: 'warm', line: 'Falta de apoio. Fazer isso sozinho(a) pesa mais.' },
    falta_tempo: { mood: 'neutral', line: 'Falta de tempo. Ou talvez falta de prioridade pra isso.' },
  },
  visao_futuro: {
    expectativa: { mood: 'excited', line: 'Expectativa. Você espera coisas boas vindo por aí.' },
    ansiedade: { mood: 'thinking', line: 'Ansiedade sobre o que vem. O desconhecido pesa em você.' },
    curiosidade: { mood: 'pleased', line: 'Curiosidade. Você quer ver no que vai dar, sem tanto medo.' },
    indiferenca: { mood: 'neutral', line: 'Indiferença, por enquanto. Talvez seja um jeito de se proteger.' },
  },
  relacao_dinheiro: {
    guardo_demais: { mood: 'thinking', line: 'Você guarda demais, até quando podia aproveitar mais.' },
    gasto_no_impulso: { mood: 'warm', line: 'Gasto por impulso, geralmente pra aliviar alguma coisa.' },
    nunca_e_suficiente: { mood: 'thinking', line: 'A sensação de que nunca é suficiente. Isso cansa.' },
    esta_equilibrado: { mood: 'pleased', line: 'Equilibrado. Você já achou um jeito que funciona pra você.' },
  },
  apoio_emocional: {
    familia: { mood: 'warm', line: 'Família. Ela é seu porto, mesmo com as complicações.' },
    amigos: { mood: 'pleased', line: 'Amigos. Sua família escolhida segura sua barra.' },
    sozinho: { mood: 'thinking', line: 'Sozinho(a), na maior parte das vezes. Isso também é uma escolha.' },
    terapia_ou_similar: { mood: 'pleased', line: 'Terapia ou algo parecido. Cuidar da mente é coragem.' },
  },
  intuicao_decisoes: {
    confio_totalmente: { mood: 'excited', line: 'Confia totalmente na intuição. Isso te guia bem.' },
    confio_mas_checo: { mood: 'neutral', line: 'Confia, mas checa antes. Equilíbrio entre sentir e pensar.' },
    quase_nunca: { mood: 'thinking', line: 'Quase nunca confia na intuição. Talvez ela mereça mais espaço.' },
    gostaria_de_confiar_mais: { mood: 'warm', line: 'Gostaria de confiar mais nela. Esse desejo já é um começo.' },
  },
  sensacao_hoje: {
    tempestade: { mood: 'thinking', line: 'Tempestade. Tudo em movimento, difícil de conter.' },
    nublado_clareando: { mood: 'neutral', line: 'Nublado, mas clareando. As coisas estão começando a fazer sentido.' },
    sol_forte: { mood: 'excited', line: 'Sol forte. Um momento de clareza e energia.' },
    calmaria: { mood: 'pleased', line: 'Calmaria. Um raro momento de paz, aproveite.' },
  },
};

export const GENIE_OPEN_TEXT_REACTION: Record<string, GenieLine> = {
  sono: { mood: 'thinking', line: 'Anotei isso. Volto a pensar nessa parte mais pra frente.' },
  deixar_para_tras: { mood: 'thinking', line: 'Isso que você quer deixar pra trás não passou despercebido.' },
  medo_nao_dito: { mood: 'warm', line: 'Isso que você nem sempre admite pra si mesmo(a). Eu guardei com cuidado.' },
  pergunta_ao_universo: { mood: 'thinking', line: 'Essa pergunta ficou comigo. Vamos ver o que as cartas dizem sobre ela.' },
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
