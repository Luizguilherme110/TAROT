'use client';

import { createContext, useContext, useEffect, useReducer, useState, type Dispatch, type ReactNode } from 'react';
import { quizReducer, initialQuizState, type QuizState, type QuizAction } from '@/lib/quiz-reducer';
import { browserStorage, readPersisted, writePersisted } from '@/lib/persistent-storage';

const STORAGE_KEY = 'tarot_quiz_session_v1';

type QuizContextValue = {
  state: QuizState;
  dispatch: Dispatch<QuizAction>;
  /**
   * False until the stored session has been read back on mount. Anything that
   * acts on the reader's answers must wait for it — the paid report is built
   * from `state`, and firing while `state` is still `initialQuizState` would
   * hand a paying reader a reading of an empty session.
   */
  hasHydrated: boolean;
};

const QuizContext = createContext<QuizContextValue | null>(null);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(quizReducer, initialQuizState);
  const [hasHydrated, setHasHydrated] = useState(false);

  // Runs once on mount, client-only. Server and client both render `initialQuizState`
  // on the first pass (no lazy initializer reading sessionStorage), so there is no
  // server/client markup mismatch. Once mounted, read any stored session and
  // dispatch it in, producing a second client-only render/commit.
  useEffect(() => {
    const stored = readPersisted(STORAGE_KEY, browserStorage('local'), browserStorage('session'));
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

  // Mirrors state to localStorage on every change, but only after the hydration
  // read above has run. Without this gate, this effect would fire on the initial
  // mount with `state === initialQuizState` (before HYDRATE's dispatch has been
  // committed) and clobber any real in-progress session with the initial state.
  useEffect(() => {
    if (!hasHydrated) return;
    writePersisted(STORAGE_KEY, JSON.stringify(state), browserStorage('local'));
  }, [state, hasHydrated]);

  return <QuizContext.Provider value={{ state, dispatch, hasHydrated }}>{children}</QuizContext.Provider>;
}

export function useQuiz(): QuizContextValue {
  const context = useContext(QuizContext);
  if (!context) throw new Error('useQuiz must be used within a QuizProvider');
  return context;
}
