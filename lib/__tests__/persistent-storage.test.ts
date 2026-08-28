import { describe, it, expect } from 'vitest';
import { readPersisted, writePersisted, type StorageLike } from '../persistent-storage';

class FakeStorage implements StorageLike {
  private map = new Map<string, string>();
  constructor(initial: Record<string, string> = {}) {
    for (const [k, v] of Object.entries(initial)) this.map.set(k, v);
  }
  getItem(key: string) {
    return this.map.get(key) ?? null;
  }
  setItem(key: string, value: string) {
    this.map.set(key, value);
  }
  removeItem(key: string) {
    this.map.delete(key);
  }
  get size() {
    return this.map.size;
  }
}

class ThrowingStorage implements StorageLike {
  getItem(): string | null {
    throw new Error('storage disabled');
  }
  setItem(): void {
    throw new Error('storage disabled');
  }
  removeItem(): void {
    throw new Error('storage disabled');
  }
}

describe('readPersisted', () => {
  it('returns the value already in localStorage', () => {
    const local = new FakeStorage({ k: 'abc' });
    expect(readPersisted('k', local, new FakeStorage())).toBe('abc');
  });

  it('returns null when neither storage holds the key', () => {
    expect(readPersisted('k', new FakeStorage(), new FakeStorage())).toBeNull();
  });

  it('migrates a legacy sessionStorage value into localStorage', () => {
    const local = new FakeStorage();
    const session = new FakeStorage({ k: 'legacy' });
    expect(readPersisted('k', local, session)).toBe('legacy');
    expect(local.getItem('k')).toBe('legacy');
  });

  it('prefers localStorage over a stale sessionStorage value', () => {
    const local = new FakeStorage({ k: 'current' });
    const session = new FakeStorage({ k: 'stale' });
    expect(readPersisted('k', local, session)).toBe('current');
  });

  it('still returns the legacy value when writing it back to localStorage fails', () => {
    const session = new FakeStorage({ k: 'legacy' });
    expect(readPersisted('k', new ThrowingStorage(), session)).toBe('legacy');
  });

  it('returns null instead of throwing when both storages are unavailable', () => {
    expect(readPersisted('k', new ThrowingStorage(), new ThrowingStorage())).toBeNull();
  });

  it('treats a null storage as absent', () => {
    expect(readPersisted('k', null, null)).toBeNull();
  });
});

describe('writePersisted', () => {
  it('writes the value to localStorage', () => {
    const local = new FakeStorage();
    writePersisted('k', 'v', local);
    expect(local.getItem('k')).toBe('v');
  });

  it('swallows storage errors so the funnel is never interrupted', () => {
    expect(() => writePersisted('k', 'v', new ThrowingStorage())).not.toThrow();
    expect(() => writePersisted('k', 'v', null)).not.toThrow();
  });
});
