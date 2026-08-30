'use client';

import { useEffect, useState } from 'react';
import { getOrCreateSessionId } from '@/lib/analytics/track';
import type { FullReport, QuizSession } from '@/lib/report-types';

export type FullReportState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'ready'; full: FullReport }
  | { status: 'error' };

// The paid report is no longer generated in the browser — it is fetched once
// the payment is confirmed, from a route that re-checks the payment server-side.
// Retries because a reader who has already paid must never be left staring at
// an error: the webhook, the network, or Supabase can all be a second late.
const RETRY_DELAYS_MS = [1_000, 3_000, 6_000];

export function useFullReport(paid: boolean, session: QuizSession): FullReportState {
  const [state, setState] = useState<FullReportState>({ status: 'idle' });

  useEffect(() => {
    if (!paid) return;

    const sessionId = getOrCreateSessionId();
    if (!sessionId) return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    setState({ status: 'loading' });

    async function attempt(index: number): Promise<void> {
      if (cancelled) return;
      try {
        const res = await fetch('/api/report/full', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId, session }),
          cache: 'no-store',
        });
        if (cancelled) return;
        if (res.ok) {
          const data = (await res.json()) as { full: FullReport };
          if (!cancelled) setState({ status: 'ready', full: data.full });
          return;
        }
      } catch {
        // Offline or blocked — falls through to the retry below.
      }
      if (cancelled) return;
      const delay = RETRY_DELAYS_MS[index];
      if (delay === undefined) {
        setState({ status: 'error' });
        return;
      }
      timer = setTimeout(() => void attempt(index + 1), delay);
    }

    void attempt(0);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
    // `session` is a new object on every render of the provider, so depending on
    // it directly would refetch forever. The reader's answers are already fixed
    // by the time the report is shown, so the paid flag is the real trigger.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paid]);

  return state;
}
