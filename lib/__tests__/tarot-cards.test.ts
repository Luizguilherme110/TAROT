import { describe, it, expect } from 'vitest';
import { TAROT_CARDS } from '../tarot-cards';

describe('TAROT_CARDS', () => {
  it('has exactly 6 cards', () => {
    expect(TAROT_CARDS).toHaveLength(6);
  });

  it('has unique ids', () => {
    const ids = TAROT_CARDS.map((card) => card.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('has name, icon, meaning, and a genie reaction line filled in for every card', () => {
    for (const card of TAROT_CARDS) {
      expect(card.name.length).toBeGreaterThan(0);
      expect(card.icon.length).toBeGreaterThan(0);
      expect(card.meaning.length).toBeGreaterThan(0);
      expect(card.genieReaction.line.length).toBeGreaterThan(0);
    }
  });

  it('has zero em-dash or en-dash in meaning or genie reaction text', () => {
    for (const card of TAROT_CARDS) {
      expect(card.name).not.toMatch(/[—–]/);
      expect(card.meaning).not.toMatch(/[—–]/);
      expect(card.genieReaction.line).not.toMatch(/[—–]/);
    }
  });

  it('has a fixed order (louco, roda_fortuna, amantes, torre, estrela, sol)', () => {
    expect(TAROT_CARDS.map((card) => card.id)).toEqual([
      'louco',
      'roda_fortuna',
      'amantes',
      'torre',
      'estrela',
      'sol',
    ]);
  });
});
