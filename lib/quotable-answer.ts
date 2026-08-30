import type { QuizSession } from './report-types';
import { OPEN_POOL } from './quiz-questions';

/**
 * Real answers to "Existe algo que...?" come back as "Sim", "Sim tudo", "sim,
 * relação amorosa" — the prompt is shaped like a yes/no question, so a good
 * share of readers answer it like one. Quoting `"Sim"` back at somebody as
 * "com as suas palavras" reads as broken software, so a quote has to carry
 * something before it earns the quotation marks.
 *
 * Client-safe by design: both the free teaser and the paid report need this
 * filter, and lib/report-full.ts cannot be imported from the browser.
 */
const BARE_AFFIRMATION = /^(sim|s|nao|não|n|talvez|acho que sim|sim tudo|tudo|nada|nenhum[ao]?)[.!…]*$/i;
const MIN_QUOTE_LENGTH = 12;

export function isQuotableAnswer(answer: string): boolean {
  const trimmed = answer.trim();
  if (trimmed.length < MIN_QUOTE_LENGTH) return false;
  return !BARE_AFFIRMATION.test(trimmed);
}

/** Every open answer worth quoting back, in the order the pool defines them. */
export function collectQuotableAnswers(session: QuizSession): string[] {
  return OPEN_POOL.map((question) => session.answers[question.id]?.trim())
    .filter((answer): answer is string => Boolean(answer))
    .filter(isQuotableAnswer);
}
