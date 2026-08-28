'use client';

import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { browserStorage, readPersisted, writePersisted } from '@/lib/persistent-storage';

const SESSION_ID_KEY = 'tarot_session_id_v1';

// The session id is the only link between a Cakto payment (sent as utm_content)
// and the reader who paid for it, so it must outlive the tab. It is kept in
// localStorage; ids written by the older sessionStorage build are migrated on
// first read so payments made just before this change still resolve.
export function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return '';
  const local = browserStorage('local');
  let id = readPersisted(SESSION_ID_KEY, local, browserStorage('session'));
  if (!id) {
    id = crypto.randomUUID();
    writePersisted(SESSION_ID_KEY, id, local);
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
