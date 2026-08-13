'use client';

import { useRouter } from 'next/navigation';
import { useQuiz } from '@/components/providers/QuizProvider';
import { QUIZ_QUESTIONS } from '@/lib/quiz-questions';
import { getGenieReaction } from '@/lib/genie-lines';
import { GenieCompanion } from '@/components/genie/GenieCompanion';
import { ProgressBar } from './ProgressBar';
import { QuestionCard } from './QuestionCard';
import { OpenTextStep } from './OpenTextStep';
import { NameStep } from './NameStep';
import { BirthDateStep } from './BirthDateStep';

export function QuizFlow() {
  const router = useRouter();
  const { state, dispatch } = useQuiz();
  const question = QUIZ_QUESTIONS[state.currentStep];

  if (!question) {
    router.push('/leitura/carta');
    return null;
  }

  const previousQuestion = QUIZ_QUESTIONS[state.currentStep - 1];
  const genieReaction = getGenieReaction(previousQuestion, state.answers, state.name);

  function goNext() {
    if (state.currentStep + 1 >= QUIZ_QUESTIONS.length) {
      router.push('/leitura/carta');
    } else {
      dispatch({ type: 'NEXT' });
    }
  }

  return (
    <div className="relative flex min-h-dvh flex-col items-center px-6 py-12 md:px-12">
      <div className="w-full max-w-md">
        <ProgressBar current={state.currentStep} total={QUIZ_QUESTIONS.length} />
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
