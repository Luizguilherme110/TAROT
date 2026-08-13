'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/analytics/track';

// Lets server components (e.g. app/page.tsx) fire a client-only analytics
// event without themselves becoming client components.
export function TrackOnMount({ event, payload }: { event: string; payload?: Record<string, unknown> }) {
  useEffect(() => {
    trackEvent(event, payload);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fire once per mount, not on every payload identity change
  }, [event]);

  return null;
}
