import type { GenieMood } from './genie-lines';
import type { TarotCard } from './tarot-cards';

export type CardPosition = 'passado' | 'presente' | 'futuro';

export type SpreadCard = {
  position: CardPosition;
  card: TarotCard;
  reading: string;
};

export type FullReport = {
  months_ahead: string;
  love: string;
  career_money: string;
  attention: string;
  warning: string;
  /** The reader's own sentences, quoted back inside the part they paid for. */
  your_words: string;
  /** Sign plus life-path reading, or '' when the birth date was skipped. */
  birth_reading: string;
  final_message: string;
};

export type Report = {
  /** The reader's own name, or 'você' when they skipped it. */
  reader_name: string;
  title: string;
  opening: string;
  current_moment: string;
  strengths: string[];
  tensions: string[];
  personalized_teaser: string;
  /** The reader's own answers, quoted back verbatim as proof the report is theirs. */
  personalized_echo: { label: string; answer: string }[];
  sections: { title: string; content: string }[];
  final_message: string;
  genie_intro: { mood: GenieMood; line: string };
  spread: SpreadCard[];
};

export type QuizSession = {
  name: string;
  birthDate: string;
  answers: Record<string, string>;
  cardIds?: string[];
};
