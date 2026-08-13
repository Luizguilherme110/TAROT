'use client';

import { getSupabaseBrowserClient } from '@/lib/supabase/client';

const SESSION_ID_KEY = 'tarot_session_id_v1';

export function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return '';
  let id = window.sessionStorage.getItem(SESSION_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.sessionStorage.setItem(SESSION_ID_KEY, id);
  }
  return id;
}

// Fire-and-forget: a failed/blocked analytics insert (ad blocker, offline, RLS
// misconfig) must never interrupt the funnel the user is in the middle of.
export function trackEvent(eventName: string, payload?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;
  const supabase = getSupabaseBrowserClient();
  supabase
    .from('funnel_events')
    .insert({ session_id: getOrCreateSessionId(), event_name: eventName, payload: payload ?? null })
    .then(({ error }) => {
      if (error) console.error('trackEvent failed:', eventName, error.message);
    });
}
