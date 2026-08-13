import type { GenieLine } from './genie-lines';

export type TarotCardIcon = 'CompassRose' | 'ArrowsClockwise' | 'Heart' | 'Lightning' | 'Star' | 'Sun';

export type TarotCard = {
  id: string;
  name: string;
  icon: TarotCardIcon;
  meaning: string;
  genieReaction: GenieLine;
};

export const TAROT_CARDS = [
  {
    id: 'louco',
    name: 'O Louco',
    icon: 'CompassRose',
    meaning:
      'O Louco carrega a coragem de começar sem ter todas as respostas prontas. Representa um salto de fé, não um erro de cálculo.',
    genieReaction: {
      mood: 'excited',
      line: 'Ah, O Louco. Você tem coragem de saltar mesmo sem ver o chão.',
    },
  },
  {
    id: 'roda_fortuna',
    name: 'A Roda da Fortuna',
    icon: 'ArrowsClockwise',
    meaning:
      'A Roda da Fortuna fala de ciclos que giram por conta própria. Alguma coisa está mudando, e não depende só de você.',
    genieReaction: {
      mood: 'thinking',
      line: 'A Roda da Fortuna. Tem coisa girando aí que não tá nas suas mãos.',
    },
  },
  {
    id: 'amantes',
    name: 'Os Amantes',
    icon: 'Heart',
    meaning:
      'Os Amantes falam de escolhas do coração, das que revelam quem você é. Não é só sobre romance, é sobre valores.',
    genieReaction: {
      mood: 'warm',
      line: 'Os Amantes. Uma escolha do coração rondando você, não é?',
    },
  },
  {
    id: 'torre',
    name: 'A Torre',
    icon: 'Lightning',
    meaning:
      'A Torre derruba o que já não sustentava mais. Assusta na hora, mas costuma abrir espaço pra algo mais verdadeiro.',
    genieReaction: {
      mood: 'thinking',
      line: 'A Torre. Uma ruptura que dói, mas que abre caminho. Confia.',
    },
  },
  {
    id: 'estrela',
    name: 'A Estrela',
    icon: 'Star',
    meaning:
      'A Estrela chega depois da tempestade, trazendo um fio de esperança. Não promete que tudo resolve, mas que dá pra respirar.',
    genieReaction: {
      mood: 'pleased',
      line: 'A Estrela. Depois de tanta coisa, um fio de esperança aparecendo.',
    },
  },
  {
    id: 'sol',
    name: 'O Sol',
    icon: 'Sun',
    meaning:
      'O Sol é clareza, vitalidade, as coisas fazendo sentido de novo. Um lembrete de que dias bons também voltam.',
    genieReaction: {
      mood: 'excited',
      line: 'O Sol! Essa carta é praticamente um abraço. Gostei dessa.',
    },
  },
] as const satisfies TarotCard[];
