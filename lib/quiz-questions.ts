export type ChoiceOption = { id: string; label: string };

export type QuizQuestion =
  | { id: string; type: 'choice'; prompt: string; options: ChoiceOption[] }
  | { id: string; type: 'open'; prompt: string; placeholder: string; maxLength: number }
  | { id: 'name'; type: 'name'; prompt: string; placeholder: string }
  | { id: 'birth_date'; type: 'birthdate'; prompt: string; helper: string };

/**
 * Questions that drive the written report content (lib/generate-mock-report.ts
 * keys hand-written narrative by these exact answer ids), so every session
 * must include them — they never come from the randomized pool.
 */
export const ANCHOR_QUESTIONS: QuizQuestion[] = [
  {
    id: 'situacao_atual',
    type: 'choice',
    prompt: 'Qual dessas situações mais parece com o seu momento atual?',
    options: [
      { id: 'amor', label: 'Estou vivendo algo intenso no amor' },
      { id: 'decisao', label: 'Estou confuso(a) sobre uma decisão' },
      { id: 'dinheiro', label: 'Quero mudar minha situação financeira' },
      { id: 'fase_nova', label: 'Sinto que estou entrando em uma nova fase' },
    ],
  },
  {
    id: 'elemento',
    type: 'choice',
    prompt: 'Qual elemento mais combina com o seu momento?',
    options: [
      { id: 'fogo', label: 'Fogo, impulso pra agir' },
      { id: 'agua', label: 'Água, sensibilidade e emoção' },
      { id: 'terra', label: 'Terra, precisando de estabilidade' },
      { id: 'ar', label: 'Ar, cabeça cheia de ideias' },
    ],
  },
];

export const CHOICE_POOL: QuizQuestion[] = [
  {
    id: 'rotina_atual',
    type: 'choice',
    prompt: 'Quando você pensa no seu dia a dia agora, o que mais sente?',
    options: [
      { id: 'cansaco', label: 'Cansaço, mesmo fazendo pouco' },
      { id: 'vontade_mudar', label: 'Vontade de mudar tudo' },
      { id: 'calma_alerta', label: 'Calma, mas em alerta' },
      { id: 'ansiedade', label: 'Ansiedade sobre o que vem' },
    ],
  },
  {
    id: 'lida_incerteza',
    type: 'choice',
    prompt: 'Como você costuma lidar com incerteza?',
    options: [
      { id: 'controlar', label: 'Tento controlar tudo que dá' },
      { id: 'fluxo', label: 'Sigo o fluxo e vejo no que dá' },
      { id: 'ajuda', label: 'Peço ajuda ou conselho de alguém' },
      { id: 'evitar', label: 'Evito pensar nisso até precisar decidir' },
    ],
  },
  {
    id: 'peso_relacoes',
    type: 'choice',
    prompt: 'O que mais pesa nas suas relações agora?',
    options: [
      { id: 'medo_abrir', label: 'Medo de me abrir de novo' },
      { id: 'dar_mais', label: 'Sinto que dou mais do que recebo' },
      { id: 'falta_algo', label: 'Está tudo bem, mas falta algo' },
      { id: 'sozinho', label: 'Estou sozinho(a), e tudo bem por enquanto' },
    ],
  },
  {
    id: 'mudar_agora',
    type: 'choice',
    prompt: 'Se pudesse mudar uma coisa agora, seria...',
    options: [
      { id: 'rotina', label: 'Minha rotina' },
      { id: 'relacionamento', label: 'Um relacionamento' },
      { id: 'financeiro', label: 'Minha situação financeira' },
      { id: 'autoimagem', label: 'Como eu me vejo' },
    ],
  },
  {
    id: 'depois_do_erro',
    type: 'choice',
    prompt: 'Quando algo dá errado, você costuma...',
    options: [
      { id: 'culpa', label: 'Se culpar primeiro' },
      { id: 'entender', label: 'Buscar entender o porquê' },
      { id: 'seguir', label: 'Seguir em frente rápido' },
      { id: 'remoer', label: 'Ficar remoendo por dias' },
    ],
  },
  {
    id: 'o_que_muda',
    type: 'choice',
    prompt: 'O que você sente que está prestes a mudar na sua vida?',
    options: [
      { id: 'relacionamento', label: 'Um relacionamento' },
      { id: 'trabalho', label: 'Meu trabalho ou carreira' },
      { id: 'autocuidado', label: 'Como eu cuido de mim' },
      { id: 'indefinido', label: 'Não sei, só sinto que algo vem' },
    ],
  },
  {
    id: 'esperanca',
    type: 'choice',
    prompt: 'O que mais te dá esperança hoje?',
    options: [
      { id: 'pessoas', label: 'Pessoas que estão comigo' },
      { id: 'planos', label: 'Planos que ainda quero realizar' },
      { id: 'evolucao', label: 'Perceber o quanto já mudei' },
      { id: 'procurando', label: 'Ainda estou procurando' },
    ],
  },
  {
    id: 'dia_dificil',
    type: 'choice',
    prompt: 'Como você se descreveria num dia difícil?',
    options: [
      { id: 'forte_por_fora', label: 'Forte por fora, cansado(a) por dentro' },
      { id: 'processa_sozinho', label: 'Quieto(a), prefiro processar sozinho(a)' },
      { id: 'desabafa', label: 'Busco alguém pra desabafar' },
      { id: 'resolve_rapido', label: 'Tento resolver tudo rápido' },
    ],
  },
  {
    id: 'medo_atual',
    type: 'choice',
    prompt: 'Qual desses medos mais ronda você agora?',
    options: [
      { id: 'perder_controle', label: 'Perder o controle da situação' },
      { id: 'ficar_sozinho', label: 'Ficar sozinho(a)' },
      { id: 'ficar_para_tras', label: 'Ficar para trás em relação aos outros' },
      { id: 'decepcionar', label: 'Decepcionar alguém importante' },
    ],
  },
  {
    id: 'energia_hoje',
    type: 'choice',
    prompt: 'Como está sua energia nos últimos dias?',
    options: [
      { id: 'alta_dispersa', label: 'Alta, mas dispersa' },
      { id: 'baixa_mas_estavel', label: 'Baixa, mas estável' },
      { id: 'oscilando', label: 'Oscilando bastante' },
      { id: 'no_limite', label: 'No limite' },
    ],
  },
  {
    id: 'sinal_universo',
    type: 'choice',
    prompt: 'Se algo estivesse tentando te avisar de alguma coisa, você perceberia?',
    options: [
      { id: 'sim_sempre', label: 'Sim, sempre percebo os sinais' },
      { id: 'as_vezes', label: 'Às vezes, dependendo do dia' },
      { id: 'so_depois', label: 'Só entendo depois, olhando pra trás' },
      { id: 'nunca', label: 'Nunca paro pra procurar sinais' },
    ],
  },
  {
    id: 'papel_social',
    type: 'choice',
    prompt: 'No seu grupo de amigos ou família, qual papel você mais assume?',
    options: [
      { id: 'cuidador', label: 'O(a) que cuida de todo mundo' },
      { id: 'ouvinte', label: 'O(a) que ouve mais do que fala' },
      { id: 'resolvedor', label: 'O(a) que resolve os problemas' },
      { id: 'observador', label: 'O(a) que observa de longe' },
    ],
  },
  {
    id: 'relacao_passado',
    type: 'choice',
    prompt: 'Como você lida com coisas do seu passado?',
    options: [
      { id: 'enterro_e_sigo', label: 'Enterro e sigo em frente' },
      { id: 'revisito_sempre', label: 'Revisito com frequência' },
      { id: 'aprendo_e_solto', label: 'Aprendo com elas e solto' },
      { id: 'evito_falar', label: 'Evito falar sobre isso' },
    ],
  },
  {
    id: 'proxima_conquista',
    type: 'choice',
    prompt: 'Qual conquista você mais deseja nos próximos meses?',
    options: [
      { id: 'estabilidade', label: 'Estabilidade' },
      { id: 'reconhecimento', label: 'Reconhecimento' },
      { id: 'liberdade', label: 'Liberdade' },
      { id: 'paz', label: 'Paz' },
    ],
  },
  {
    id: 'reacao_criticas',
    type: 'choice',
    prompt: 'Quando alguém te critica, sua primeira reação é...',
    options: [
      { id: 'defender', label: 'Me defender' },
      { id: 'refletir', label: 'Parar pra refletir' },
      { id: 'magoar', label: 'Me magoar, mesmo sem mostrar' },
      { id: 'ignorar', label: 'Ignorar e seguir' },
    ],
  },
  {
    id: 'espaco_pessoal',
    type: 'choice',
    prompt: 'O que mais te faz sentir em paz?',
    options: [
      { id: 'silencio', label: 'Silêncio' },
      { id: 'companhia', label: 'Companhia de quem eu amo' },
      { id: 'natureza', label: 'Estar na natureza' },
      { id: 'criar_algo', label: 'Criar alguma coisa' },
    ],
  },
  {
    id: 'padrao_repetido',
    type: 'choice',
    prompt: 'Existe algo que se repete na sua vida e você já percebeu?',
    options: [
      { id: 'relacoes_parecidas', label: 'Relações parecidas se repetindo' },
      { id: 'mesma_frustracao_trabalho', label: 'A mesma frustração no trabalho' },
      { id: 'ciclo_financeiro', label: 'Um ciclo financeiro que se repete' },
      { id: 'nao_percebi_ainda', label: 'Ainda não percebi qual é' },
    ],
  },
  {
    id: 'forca_interior',
    type: 'choice',
    prompt: 'Qual dessas forças mais te define hoje?',
    options: [
      { id: 'resiliencia', label: 'Resiliência' },
      { id: 'intuicao', label: 'Intuição' },
      { id: 'disciplina', label: 'Disciplina' },
      { id: 'empatia', label: 'Empatia' },
    ],
  },
  {
    id: 'bloqueio_atual',
    type: 'choice',
    prompt: 'O que mais trava você de seguir em frente agora?',
    options: [
      { id: 'medo_julgamento', label: 'Medo do julgamento alheio' },
      { id: 'falta_clareza', label: 'Falta de clareza sobre o caminho' },
      { id: 'falta_apoio', label: 'Falta de apoio' },
      { id: 'falta_tempo', label: 'Falta de tempo' },
    ],
  },
  {
    id: 'visao_futuro',
    type: 'choice',
    prompt: 'Quando você imagina seu futuro, o que sente?',
    options: [
      { id: 'expectativa', label: 'Expectativa' },
      { id: 'ansiedade', label: 'Ansiedade' },
      { id: 'curiosidade', label: 'Curiosidade' },
      { id: 'indiferenca', label: 'Indiferença' },
    ],
  },
  {
    id: 'relacao_dinheiro',
    type: 'choice',
    prompt: 'Qual frase mais combina com sua relação com dinheiro?',
    options: [
      { id: 'guardo_demais', label: 'Guardo demais, quase não aproveito' },
      { id: 'gasto_no_impulso', label: 'Gasto por impulso' },
      { id: 'nunca_e_suficiente', label: 'Tenho a sensação de que nunca é suficiente' },
      { id: 'esta_equilibrado', label: 'Está equilibrado' },
    ],
  },
  {
    id: 'apoio_emocional',
    type: 'choice',
    prompt: 'Quando as coisas ficam difíceis, você busca apoio em...',
    options: [
      { id: 'familia', label: 'Família' },
      { id: 'amigos', label: 'Amigos' },
      { id: 'sozinho', label: 'Prefiro lidar sozinho(a)' },
      { id: 'terapia_ou_similar', label: 'Terapia ou algo parecido' },
    ],
  },
  {
    id: 'intuicao_decisoes',
    type: 'choice',
    prompt: 'O quanto você confia na sua intuição pra decidir coisas importantes?',
    options: [
      { id: 'confio_totalmente', label: 'Confio totalmente' },
      { id: 'confio_mas_checo', label: 'Confio, mas sempre checo' },
      { id: 'quase_nunca', label: 'Quase nunca' },
      { id: 'gostaria_de_confiar_mais', label: 'Gostaria de confiar mais' },
    ],
  },
  {
    id: 'sensacao_hoje',
    type: 'choice',
    prompt: 'Se sua vida fosse um clima agora, seria...',
    options: [
      { id: 'tempestade', label: 'Tempestade' },
      { id: 'nublado_clareando', label: 'Nublado, mas clareando' },
      { id: 'sol_forte', label: 'Sol forte' },
      { id: 'calmaria', label: 'Calmaria' },
    ],
  },
];

export const OPEN_POOL: QuizQuestion[] = [
  {
    id: 'sono',
    type: 'open',
    prompt: 'O que mais tem tirado seu sono ultimamente?',
    placeholder: 'Escreva com suas palavras...',
    maxLength: 280,
  },
  {
    id: 'deixar_para_tras',
    type: 'open',
    prompt: 'Existe algo que você sente que precisa deixar para trás?',
    placeholder: 'Escreva com suas palavras...',
    maxLength: 280,
  },
  {
    id: 'medo_nao_dito',
    type: 'open',
    prompt: 'Existe algo que você tem medo de admitir, mesmo pra si mesmo(a)?',
    placeholder: 'Escreva com suas palavras...',
    maxLength: 280,
  },
  {
    id: 'pergunta_ao_universo',
    type: 'open',
    prompt: 'Se pudesse fazer uma pergunta e ter certeza da resposta, qual seria?',
    placeholder: 'Escreva com suas palavras...',
    maxLength: 280,
  },
];

export const NAME_QUESTION: QuizQuestion = {
  id: 'name',
  type: 'name',
  prompt: 'Antes de continuarmos, como você gostaria de ser chamado(a) na sua leitura?',
  placeholder: 'Seu nome ou apelido',
};

export const BIRTHDATE_QUESTION: QuizQuestion = {
  id: 'birth_date',
  type: 'birthdate',
  prompt: 'Sua data de nascimento',
  helper:
    'Usaremos sua data para adicionar uma camada numerológica à sua leitura. Não é usada para nenhuma outra finalidade.',
};

export const QUIZ_QUESTION_POOL: QuizQuestion[] = [
  ...ANCHOR_QUESTIONS,
  ...CHOICE_POOL,
  ...OPEN_POOL,
  NAME_QUESTION,
  BIRTHDATE_QUESTION,
];

const QUESTIONS_BY_ID = new Map(QUIZ_QUESTION_POOL.map((question) => [question.id, question]));

export function getQuestionById(id: string): QuizQuestion | undefined {
  return QUESTIONS_BY_ID.get(id);
}

/**
 * The human label a reader actually picked, so the report can quote their own
 * words back at them instead of paraphrasing. Only choice questions have
 * labels; open, name and birthdate answers are already free text.
 */
export function getAnswerLabel(questionId: string, answerId: string): string | undefined {
  const question = getQuestionById(questionId);
  if (!question || question.type !== 'choice') return undefined;
  return question.options.find((option) => option.id === answerId)?.label;
}

function shuffle<T>(items: T[], random: () => number): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function sample<T>(pool: T[], count: number, random: () => number): T[] {
  return shuffle(pool, random).slice(0, count);
}

const CHOICE_SAMPLE_SIZE = 8;
const OPEN_SAMPLE_SIZE = 2;

/**
 * Builds one quiz session's question order: `situacao_atual` always opens
 * (it's the intro question), the rest of the anchors and a random draw from
 * the pools are shuffled together, then name and birth date always close.
 */
export function buildQuizSessionOrder(random: () => number = Math.random): string[] {
  const [situacaoAtual, ...otherAnchors] = ANCHOR_QUESTIONS;
  const sampledChoice = sample(CHOICE_POOL, CHOICE_SAMPLE_SIZE, random);
  const sampledOpen = sample(OPEN_POOL, OPEN_SAMPLE_SIZE, random);
  const middle = shuffle([...otherAnchors, ...sampledChoice, ...sampledOpen], random);
  return [situacaoAtual.id, ...middle.map((question) => question.id), NAME_QUESTION.id, BIRTHDATE_QUESTION.id];
}
