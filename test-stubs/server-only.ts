// Vitest runs in plain Node, where the real `server-only` package throws on
// import. lib/report-full.ts is exercised directly by the test suite, so this
// no-op stands in for it there — the guard stays real in the Next build.
export {};
