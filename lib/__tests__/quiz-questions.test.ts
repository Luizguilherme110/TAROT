import { describe, it, expect } from 'vitest';
import {
  QUIZ_QUESTION_POOL,
  ANCHOR_QUESTIONS,
  CHOICE_POOL,
  OPEN_POOL,
  buildQuizSessionOrder,
  getQuestionById,
} from '../quiz-questions';

describe('QUIZ_QUESTION_POOL', () => {
  it('has exactly 32 questions', () => {
    expect(QUIZ_QUESTION_POOL).toHaveLength(32);
  });

  it('has unique ids', () => {
    const ids = QUIZ_QUESTION_POOL.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('has exactly 26 choice, 4 open, 1 name, 1 birthdate question', () => {
    const counts = QUIZ_QUESTION_POOL.reduce<Record<string, number>>((acc, q) => {
      acc[q.type] = (acc[q.type] ?? 0) + 1;
      return acc;
    }, {});
    expect(counts.choice).toBe(26);
    expect(counts.open).toBe(4);
    expect(counts.name).toBe(1);
    expect(counts.birthdate).toBe(1);
  });

  it('has 2 anchor questions, situacao_atual and elemento', () => {
    expect(ANCHOR_QUESTIONS.map((q) => q.id)).toEqual(['situacao_atual', 'elemento']);
  });

  it('has 24 non-anchor choice questions and 4 open questions in the random pools', () => {
    expect(CHOICE_POOL).toHaveLength(24);
    expect(OPEN_POOL).toHaveLength(4);
  });
});

describe('buildQuizSessionOrder', () => {
  it('returns 14 unique question ids', () => {
    const order = buildQuizSessionOrder();
    expect(order).toHaveLength(14);
    expect(new Set(order).size).toBe(14);
  });

  it('always opens with situacao_atual and includes elemento', () => {
    const order = buildQuizSessionOrder();
    expect(order[0]).toBe('situacao_atual');
    expect(order).toContain('elemento');
  });

  it('always ends with name then birth_date', () => {
    const order = buildQuizSessionOrder();
    expect(order.at(-2)).toBe('name');
    expect(order.at(-1)).toBe('birth_date');
  });

  it('draws 8 choice and 2 open questions from the pools', () => {
    const order = buildQuizSessionOrder();
    const middle = order.slice(1, -2);
    const choiceIds = new Set(CHOICE_POOL.map((q) => q.id));
    const openIds = new Set(OPEN_POOL.map((q) => q.id));
    const drawnChoice = middle.filter((id) => choiceIds.has(id));
    const drawnOpen = middle.filter((id) => openIds.has(id));
    expect(drawnChoice).toHaveLength(8);
    expect(drawnOpen).toHaveLength(2);
    expect(middle).toContain('elemento');
  });

  it('every id in the built order resolves to a real question', () => {
    const order = buildQuizSessionOrder();
    for (const id of order) {
      expect(getQuestionById(id)).toBeDefined();
    }
  });

  it('produces different orders across calls (statistically)', () => {
    const orders = Array.from({ length: 20 }, () => buildQuizSessionOrder().join(','));
    expect(new Set(orders).size).toBeGreaterThan(1);
  });

  it('is deterministic given a fixed random source', () => {
    const fixedRandom = (() => {
      let i = 0;
      const seq = [0.1, 0.9, 0.2, 0.8, 0.3, 0.7, 0.4, 0.6, 0.5, 0.05, 0.95, 0.15, 0.85, 0.25];
      return () => seq[i++ % seq.length];
    })();
    const a = buildQuizSessionOrder(fixedRandom);
    const fixedRandom2 = (() => {
      let i = 0;
      const seq = [0.1, 0.9, 0.2, 0.8, 0.3, 0.7, 0.4, 0.6, 0.5, 0.05, 0.95, 0.15, 0.85, 0.25];
      return () => seq[i++ % seq.length];
    })();
    const b = buildQuizSessionOrder(fixedRandom2);
    expect(a).toEqual(b);
  });
});
