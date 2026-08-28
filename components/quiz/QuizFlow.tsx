'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuiz } from '@/components/providers/QuizProvider';
import { buildQuizSessionOrder, getQuestionById } from '@/lib/quiz-questions';
import { getGenieReaction } from '@/lib/genie-lines';
import { GenieCompanion } from '@/components/genie/GenieCompanion';
import { trackEvent } from '@/lib/analytics/track';
import { saveQuizAnswer } from '@/lib/analytics/quiz-answers';
import { ProgressBar } from './ProgressBar';
import { QuestionCard } from './QuestionCard';
import { OpenTextStep } from './OpenTextStep';
import { NameStep } from './NameStep';
import { BirthDateStep } from './BirthDateStep';

export function QuizFlow() {
  const router = useRouter();
  const { state, dispatch } = useQuiz();

  // Runs once on mount; a session already restored from sessionStorage carries
  // its own questionOrder (via HYDRATE), so the reducer no-ops when one exists.
  useEffect(() => {
    dispatch({ type: 'INIT_SESSION', questionOrder: buildQuizSessionOrder() });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount
  }, []);

  const question = getQuestionById(state.questionOrder[state.currentStep] ?? '');

  useEffect(() => {
    if (question) trackEvent('quiz_step_view', { step: state.currentStep, questionId: question.id });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fire once per question shown, not on every render
  }, [question?.id]);

  if (state.questionOrder.length === 0) return null;

  if (!question) {
    router.push('/leitura/carta');
    return null;
  }

  const previousQuestion = getQuestionById(state.questionOrder[state.currentStep - 1] ?? '');
  const genieReaction = getGenieReaction(previousQuestion, state.answers, state.name);

  function goNext() {
    if (state.currentStep + 1 >= state.questionOrder.length) {
      router.push('/leitura/carta');
    } else {
      dispatch({ type: 'NEXT' });
    }
  }

  return (
    <div className="relative flex min-h-dvh flex-col items-center px-6 py-12 md:px-12">
      <div className="w-full max-w-md">
        <ProgressBar current={state.currentStep} total={state.questionOrder.length} />
      </div>
      {/* Genie and question grouped into one centered block, instead of the
          genie floating in a viewport corner disconnected from what it's
          reacting to. */}
      <div className="flex w-full flex-1 flex-col items-center justify-center gap-6 py-12">
        <div className="w-full max-w-md">
          <GenieCompanion mood={genieReaction.mood} line={genieReaction.line} />
        </div>
        {question.type === 'choice' && (
          <QuestionCard
            question={question}
            value={state.answers[question.id]}
            onAnswer={(optionId) => {
              dispatch({ type: 'ANSWER', questionId: question.id, value: optionId });
              saveQuizAnswer(question.id, 'choice', optionId);
              goNext();
            }}
          />
        )}
        {question.type === 'open' && (
          <OpenTextStep
            question={question}
            value={state.answers[question.id]}
            onSubmit={(text) => {
              dispatch({ type: 'ANSWER', questionId: question.id, value: text });
              saveQuizAnswer(question.id, 'open', text);
              goNext();
            }}
          />
        )}
        {question.type === 'name' && (
          <NameStep
            value={state.name}
            onSubmit={(name) => {
              dispatch({ type: 'SET_NAME', value: name });
              goNext();
            }}
          />
        )}
        {question.type === 'birthdate' && (
          <BirthDateStep
            value={state.birthDate}
            onSubmit={(date) => {
              dispatch({ type: 'SET_BIRTH_DATE', value: date });
              goNext();
            }}
          />
        )}
      </div>
    </div>
  );
}
