'use client';

import { createContext, useContext, useEffect, useReducer, useState, type Dispatch, type ReactNode } from 'react';
import { quizReducer, initialQuizState, type QuizState, type QuizAction } from '@/lib/quiz-reducer';

const STORAGE_KEY = 'tarot_quiz_session_v1';

type QuizContextValue = { state: QuizState; dispatch: Dispatch<QuizAction> };

const QuizContext = createContext<QuizContextValue | null>(null);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(quizReducer, initialQuizState);
  const [hasHydrated, setHasHydrated] = useState(false);

  // Runs once on mount, client-only. Server and client both render `initialQuizState`
  // on the first pass (no lazy initializer reading sessionStorage), so there is no
  // server/client markup mismatch. Once mounted, read any stored session and
  // dispatch it in, producing a second client-only render/commit.
  useEffect(() => {
    const stored = window.sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as QuizState;
        dispatch({ type: 'HYDRATE', state: parsed });
      } catch {
        // Corrupt/unparseable data: ignore and keep initialQuizState.
      }
    }
    setHasHydrated(true);
  }, []);

  // Mirrors state to sessionStorage on every change, but only after the hydration
  // read above has run. Without this gate, this effect would fire on the initial
  // mount with `state === initialQuizState` (before HYDRATE's dispatch has been
  // committed) and clobber any real in-progress session with the initial state.
  useEffect(() => {
    if (!hasHydrated) return;
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, hasHydrated]);

  return <QuizContext.Provider value={{ state, dispatch }}>{children}</QuizContext.Provider>;
}

export function useQuiz(): QuizContextValue {
  const context = useContext(QuizContext);
  if (!context) throw new Error('useQuiz must be used within a QuizProvider');
  return context;
}
