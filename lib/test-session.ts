import type { QuizState } from './quiz-reducer';
import { QUIZ_QUESTION_POOL, buildQuizSessionOrder, getQuestionById } from './quiz-questions';
import { TAROT_CARDS } from './tarot-cards';

/**
 * Builds a complete, plausible quiz session without anyone clicking through the
 * fourteen steps — the admin panel seeds one of these to test the report, the
 * paywall and the checkout round trip.
 *
 * The open answers are modelled on the real 2026-08-29 export rather than
 * lorem ipsum, so a seeded session exercises the same code paths a real one
 * does: the quotable filter, the "suas palavras" section, the echo rows.
 */

const OPEN_ANSWERS: Record<string, string> = {
  sono: 'fico pensando se ele volta ou se eu sigo em frente de vez',
  deixar_para_tras: 'a culpa de ter aguentado tanto tempo',
  medo_nao_dito: 'que eu ainda não superei do jeito que digo que superei',
  pergunta_ao_universo: 'ele ainda pensa em mim?',
};

const FIRST_NAMES = ['Camila', 'Beatriz', 'Fernanda', 'Juliana', 'Patrícia', 'Aline'];

function pick<T>(items: readonly T[], random: () => number): T {
  return items[Math.floor(random() * items.length)];
}

export type TestSessionSeed = { sessionId: string; state: QuizState };

/**
 * @param paidLike when true the session leans on the answers that key the most
 *   distinctive copy, so the paid report is worth reading in a test.
 */
export function buildTestSession(
  sessionId: string,
  random: () => number = Math.random,
  paidLike = true,
): TestSessionSeed {
  const questionOrder = buildQuizSessionOrder(random);
  const answers: Record<string, string> = {};

  for (const questionId of questionOrder) {
    const question = getQuestionById(questionId);
    if (!question) continue;
    if (question.type === 'choice') {
      answers[questionId] = pick(question.options, random).id;
    } else if (question.type === 'open') {
      answers[questionId] = OPEN_ANSWERS[questionId] ?? 'algo que ainda não consegui explicar direito';
    }
  }

  // The two anchors always exist, but a random draw can bury the fragments
  // worth eyeballing. Pin the ones that produce the most specific paid text.
  if (paidLike) {
    answers.situacao_atual = 'amor';
    if (questionOrder.includes('peso_relacoes')) answers.peso_relacoes = 'esperando_volta';
  }

  const year = 1970 + Math.floor(random() * 35);
  const month = 1 + Math.floor(random() * 12);
  const day = 1 + Math.floor(random() * 28);
  const cards = [...TAROT_CARDS]
    .sort(() => random() - 0.5)
    .slice(0, 3)
    .map((card) => card.id);

  return {
    sessionId,
    state: {
      name: pick(FIRST_NAMES, random),
      birthDate: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
      answers,
      cardIds: cards,
      // Past the last step, so the reader lands on the report rather than back
      // inside the quiz if they navigate to /leitura.
      currentStep: QUIZ_QUESTION_POOL.length,
      questionOrder,
    },
  };
}
