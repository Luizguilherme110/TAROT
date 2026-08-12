import { describe, it, expect } from 'vitest';
import { QUIZ_QUESTIONS } from '../quiz-questions';

describe('QUIZ_QUESTIONS', () => {
  it('has exactly 14 questions', () => {
    expect(QUIZ_QUESTIONS).toHaveLength(14);
  });

  it('has unique ids', () => {
    const ids = QUIZ_QUESTIONS.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('has exactly 10 choice, 2 open, 1 name, 1 birthdate question', () => {
    const counts = QUIZ_QUESTIONS.reduce<Record<string, number>>((acc, q) => {
      acc[q.type] = (acc[q.type] ?? 0) + 1;
      return acc;
    }, {});
    expect(counts.choice).toBe(10);
    expect(counts.open).toBe(2);
    expect(counts.name).toBe(1);
    expect(counts.birthdate).toBe(1);
  });
});
