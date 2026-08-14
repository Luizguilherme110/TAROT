import type { QuizSession } from './report-types';

export type QuizState = QuizSession & { currentStep: number };

export type QuizAction =
  | { type: 'ANSWER'; questionId: string; value: string }
  | { type: 'SET_NAME'; value: string }
  | { type: 'SET_BIRTH_DATE'; value: string }
  | { type: 'ADD_CARD'; cardId: string }
  | { type: 'NEXT' }
  | { type: 'BACK' }
  | { type: 'HYDRATE'; state: QuizState };

export const initialQuizState: QuizState = {
  name: '',
  birthDate: '',
  answers: {},
  currentStep: 0,
};

export function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'ANSWER':
      return { ...state, answers: { ...state.answers, [action.questionId]: action.value } };
    case 'SET_NAME':
      return { ...state, name: action.value };
    case 'SET_BIRTH_DATE':
      return { ...state, birthDate: action.value };
    case 'ADD_CARD':
      return { ...state, cardIds: [...(state.cardIds ?? []), action.cardId] };
    case 'NEXT':
      return { ...state, currentStep: state.currentStep + 1 };
    case 'BACK':
      return { ...state, currentStep: Math.max(0, state.currentStep - 1) };
    case 'HYDRATE':
      return action.state;
    default:
      return state;
  }
}
