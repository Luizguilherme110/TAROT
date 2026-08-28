// Funnel state (session id, quiz answers) used to live in sessionStorage, which
// is dropped the moment the tab closes. A user who finished checkout in a fresh
// tab — or who closed the tab mid-payment — came back with a brand new session
// id, so the approved payment stayed bound to an id nothing could read again.
// These helpers keep the data in localStorage and transparently promote any
// value still sitting in the old sessionStorage location.
//
// Every access is guarded: Safari private mode and "block all cookies" make the
// storage getters themselves throw, and losing analytics must never break the
// page the user is in the middle of.

export type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

function safeGet(storage: StorageLike | null, key: string): string | null {
  if (!storage) return null;
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(storage: StorageLike | null, key: string, value: string): void {
  if (!storage) return;
  try {
    storage.setItem(key, value);
  } catch {
    // Storage unavailable — the caller keeps working with the in-memory value.
  }
}

export function readPersisted(
  key: string,
  local: StorageLike | null,
  session: StorageLike | null,
): string | null {
  const current = safeGet(local, key);
  if (current !== null) return current;

  const legacy = safeGet(session, key);
  if (legacy !== null) safeSet(local, key, legacy);
  return legacy;
}

export function writePersisted(key: string, value: string, local: StorageLike | null): void {
  safeSet(local, key, value);
}

// Storage accessors throw on property access in some privacy configurations,
// so even reaching for `window.localStorage` needs a guard.
export function browserStorage(kind: 'local' | 'session'): StorageLike | null {
  if (typeof window === 'undefined') return null;
  try {
    return kind === 'local' ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
}
