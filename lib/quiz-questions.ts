export type ChoiceOption = { id: string; label: string; emoji?: string };

export type QuizQuestion =
  | { id: string; type: 'choice'; prompt: string; options: ChoiceOption[] }
  | { id: string; type: 'open'; prompt: string; placeholder: string; maxLength: number }
  | { id: 'name'; type: 'name'; prompt: string; placeholder: string }
  | { id: 'birth_date'; type: 'birthdate'; prompt: string; helper: string };

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'situacao_atual',
    type: 'choice',
    prompt: 'Qual dessas situações mais parece com o seu momento atual?',
    options: [
      { id: 'amor', label: 'Estou vivendo algo intenso no amor', emoji: '❤️' },
      { id: 'decisao', label: 'Estou confuso(a) sobre uma decisão', emoji: '💭' },
      { id: 'dinheiro', label: 'Quero mudar minha situação financeira', emoji: '💰' },
      { id: 'fase_nova', label: 'Sinto que estou entrando em uma nova fase', emoji: '🌙' },
    ],
  },
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
    id: 'elemento',
    type: 'choice',
    prompt: 'Qual elemento mais combina com o seu momento?',
    options: [
      { id: 'fogo', label: 'Fogo, impulso pra agir', emoji: '🔥' },
      { id: 'agua', label: 'Água, sensibilidade e emoção', emoji: '💧' },
      { id: 'terra', label: 'Terra, precisando de estabilidade', emoji: '🌍' },
      { id: 'ar', label: 'Ar, cabeça cheia de ideias', emoji: '🌬️' },
    ],
  },
  {
    id: 'sono',
    type: 'open',
    prompt: 'O que mais tem tirado seu sono ultimamente?',
    placeholder: 'Escreva com suas palavras...',
    maxLength: 280,
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
    id: 'deixar_para_tras',
    type: 'open',
    prompt: 'Existe algo que você sente que precisa deixar para trás?',
    placeholder: 'Escreva com suas palavras...',
    maxLength: 280,
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
    id: 'name',
    type: 'name',
    prompt: 'Antes de continuarmos, como você gostaria de ser chamado(a) na sua leitura?',
    placeholder: 'Seu nome ou apelido',
  },
  {
    id: 'birth_date',
    type: 'birthdate',
    prompt: 'Sua data de nascimento',
    helper:
      'Usaremos sua data para adicionar uma camada numerológica à sua leitura. Não é usada para nenhuma outra finalidade.',
  },
];
