import { describe, it, expect } from 'vitest';
import { quizReducer, initialQuizState } from '../quiz-reducer';

describe('quizReducer', () => {
  it('merges an ANSWER action into answers', () => {
    const next = quizReducer(initialQuizState, {
      type: 'ANSWER',
      questionId: 'situacao_atual',
      value: 'amor',
    });
    expect(next.answers.situacao_atual).toBe('amor');
  });

  it('preserves previous answers when adding a new one', () => {
    const withFirst = quizReducer(initialQuizState, { type: 'ANSWER', questionId: 'a', value: '1' });
    const withSecond = quizReducer(withFirst, { type: 'ANSWER', questionId: 'b', value: '2' });
    expect(withSecond.answers).toEqual({ a: '1', b: '2' });
  });

  it('increments currentStep on NEXT', () => {
    const next = quizReducer(initialQuizState, { type: 'NEXT' });
    expect(next.currentStep).toBe(1);
  });

  it('does not go below 0 on BACK', () => {
    const next = quizReducer(initialQuizState, { type: 'BACK' });
    expect(next.currentStep).toBe(0);
  });

  it('replaces the whole state on HYDRATE', () => {
    const hydrated = { name: 'Ana', birthDate: '2000-01-01', answers: { a: '1' }, currentStep: 3 };
    const next = quizReducer(initialQuizState, { type: 'HYDRATE', state: hydrated });
    expect(next).toEqual(hydrated);
  });
});
