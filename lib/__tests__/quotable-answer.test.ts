import { describe, it, expect } from 'vitest';
import { collectQuotableAnswers, isQuotableAnswer } from '../quotable-answer';

describe('isQuotableAnswer', () => {
  // Every string below is a real answer from the 2026-08-29 export.
  it('rejects the bare yes/no answers the open questions actually attract', () => {
    expect(isQuotableAnswer('Sim')).toBe(false);
    expect(isQuotableAnswer('Sim tudo')).toBe(false);
    expect(isQuotableAnswer('sim')).toBe(false);
    expect(isQuotableAnswer('Não')).toBe(false);
  });

  it('keeps answers that carry something', () => {
    expect(isQuotableAnswer('Vida amorosa 💓')).toBe(true);
    expect(isQuotableAnswer('Medo não dá certo')).toBe(true);
    expect(isQuotableAnswer('situação financeira, amor')).toBe(true);
    expect(isQuotableAnswer('Ainda gosto muito do meu ex mas ele tá namorando com outra')).toBe(true);
  });

  it('keeps a qualified yes, because the qualification is the content', () => {
    expect(isQuotableAnswer('sim, relação amorosa')).toBe(true);
  });

  it('rejects blank and whitespace-only answers', () => {
    expect(isQuotableAnswer('')).toBe(false);
    expect(isQuotableAnswer('   ')).toBe(false);
  });
});

describe('collectQuotableAnswers', () => {
  it('drops the unusable answers and keeps the rest', () => {
    const quotes = collectQuotableAnswers({
      name: 'Ana',
      birthDate: '',
      answers: { sono: 'Vida financeira', medo_nao_dito: 'Sim', pergunta_ao_universo: 'Poq vc me abandonou' },
    });
    expect(quotes).toEqual(['Vida financeira', 'Poq vc me abandonou']);
  });

  it('returns nothing when every answer was a bare yes', () => {
    const quotes = collectQuotableAnswers({
      name: 'Ana',
      birthDate: '',
      answers: { medo_nao_dito: 'Sim', pergunta_ao_universo: 'Sim' },
    });
    expect(quotes).toEqual([]);
  });
});
