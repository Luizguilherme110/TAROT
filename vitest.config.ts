import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['lib/**/*.test.ts'],
  },
  resolve: {
    alias: {
      // `server-only` throws on import outside a Server Component, which is the
      // whole point of it guarding lib/report-full.ts. Vitest runs in plain
      // Node, so point it at a local no-op to keep the paid report testable
      // without weakening the guard in the real build.
      'server-only': fileURLToPath(new URL('./test-stubs/server-only.ts', import.meta.url)),
    },
  },
});
