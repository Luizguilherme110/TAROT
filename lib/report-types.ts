export type Report = {
  title: string;
  opening: string;
  current_moment: string;
  strengths: string[];
  tensions: string[];
  personalized_teaser: string;
  sections: { title: string; content: string }[];
  final_message: string;
};

export type QuizSession = {
  name: string;
  birthDate: string;
  answers: Record<string, string>;
};
