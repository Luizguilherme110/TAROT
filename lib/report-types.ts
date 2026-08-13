import type { GenieMood } from './genie-lines';
import type { TarotCard } from './tarot-cards';

export type Report = {
  title: string;
  opening: string;
  current_moment: string;
  strengths: string[];
  tensions: string[];
  personalized_teaser: string;
  sections: { title: string; content: string }[];
  final_message: string;
  genie_intro: { mood: GenieMood; line: string };
  card: TarotCard | null;
};

export type QuizSession = {
  name: string;
  birthDate: string;
  answers: Record<string, string>;
  cardId?: string;
};
