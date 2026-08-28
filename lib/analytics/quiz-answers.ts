'use client';

import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { getOrCreateSessionId } from './track';

// The answers are the only place a reader describes their situation in their own
// words. Stored per answer rather than once at the end so the people who quit
// halfway — most of them — still leave their reasons behind.
//
// Fire-and-forget for the same reason as trackEvent: an ad blocker or a dropped
// connection must never stall the quiz the reader is in the middle of.
export function saveQuizAnswer(
  questionId: string,
  questionType: 'choice' | 'open',
  answer: string,
): void {
  if (typeof window === 'undefined') return;
  const trimmed = answer.trim();
  if (!trimmed) return;

  const supabase = getSupabaseBrowserClient();
  supabase
    .from('quiz_responses')
    .insert({
      session_id: getOrCreateSessionId(),
      question_id: questionId,
      question_type: questionType,
      answer: trimmed,
    })
    .then(({ error }) => {
      if (error) console.error('saveQuizAnswer failed:', questionId, error.message);
    });
}
