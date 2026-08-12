'use client';

import { createContext, useContext, useEffect, useReducer, type Dispatch, type ReactNode } from 'react';
import { quizReducer, initialQuizState, type QuizState, type QuizAction } from '@/lib/quiz-reducer';

const STORAGE_KEY = 'tarot_quiz_session_v1';

type QuizContextValue = { state: QuizState; dispatch: Dispatch<QuizAction> };

const QuizContext = createContext<QuizContextValue | null>(null);

function readStoredState(): QuizState {
  if (typeof window === 'undefined') return initialQuizState;
  const stored = window.sessionStorage.getItem(STORAGE_KEY);
  if (!stored) return initialQuizState;
  try {
    return JSON.parse(stored) as QuizState;
  } catch {
    return initialQuizState;
  }
}

export function QuizProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(quizReducer, initialQuizState, readStoredState);

  useEffect(() => {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  return <QuizContext.Provider value={{ state, dispatch }}>{children}</QuizContext.Provider>;
}

export function useQuiz(): QuizContextValue {
  const context = useContext(QuizContext);
  if (!context) throw new Error('useQuiz must be used within a QuizProvider');
  return context;
}
