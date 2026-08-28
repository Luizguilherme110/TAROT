'use client';

import { useEffect, useState } from 'react';
import { getOrCreateSessionId } from '@/lib/analytics/track';

// Approval is asynchronous: Cakto redirects the reader back (or they navigate
// back) well before the `purchase_approved` webhook has reached us, and PIX can
// take minutes. A single check on mount therefore left paying readers staring
// at the paywall until they thought to reload. Poll instead, and re-check the
// instant the tab regains focus — that is the moment someone returns from the
// checkout, including a bfcache restore where the effect never re-runs.

const FIRST_INTERVAL_MS = 3_000;
const MAX_INTERVAL_MS = 15_000;
// An abandoned tab must not poll forever; focus resets the window.
const MAX_POLL_MS = 15 * 60 * 1_000;

export function usePaymentStatus(): boolean {
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    const sessionId = getOrCreateSessionId();
    if (!sessionId) return;

    let cancelled = false;
    let settled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let interval = FIRST_INTERVAL_MS;
    let startedAt = Date.now();

    async function isPaid(): Promise<boolean> {
      try {
        const res = await fetch(`/api/payments/status?session_id=${encodeURIComponent(sessionId)}`, {
          cache: 'no-store',
        });
        if (!res.ok) return false;
        const data = (await res.json()) as { paid?: boolean };
        return Boolean(data.paid);
      } catch {
        // Offline, blocked, or a transient 5xx — keep polling.
        return false;
      }
    }

    async function tick(): Promise<void> {
      if (cancelled || settled) return;

      if (await isPaid()) {
        if (cancelled) return;
        settled = true;
        setPaid(true);
        return;
      }

      if (cancelled || settled) return;
      // Backgrounded tabs are resumed by the listeners below, not by a timer.
      if (document.visibilityState === 'hidden') return;
      if (Date.now() - startedAt > MAX_POLL_MS) return;

      interval = Math.min(interval * 1.5, MAX_INTERVAL_MS);
      timer = setTimeout(tick, interval);
    }

    function resume(): void {
      if (cancelled || settled || document.visibilityState !== 'visible') return;
      clearTimeout(timer);
      interval = FIRST_INTERVAL_MS;
      startedAt = Date.now();
      void tick();
    }

    void tick();
    document.addEventListener('visibilitychange', resume);
    window.addEventListener('focus', resume);
    window.addEventListener('pageshow', resume);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', resume);
      window.removeEventListener('focus', resume);
      window.removeEventListener('pageshow', resume);
    };
  }, []);

  return paid;
}
