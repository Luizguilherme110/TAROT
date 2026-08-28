import { describe, it, expect } from 'vitest';
import { generateMockReport } from '../generate-mock-report';
import type { QuizSession } from '../report-types';

function makeSession(overrides: Partial<QuizSession> = {}): QuizSession {
  return {
    name: 'Ana',
    birthDate: '2000-01-01',
    answers: { situacao_atual: 'amor', elemento: 'agua', sono: 'meu ex ainda aparece nos meus pensamentos' },
    ...overrides,
  };
}

describe('generateMockReport', () => {
  it('uses the situation content matching situacao_atual', () => {
    const report = generateMockReport(
      makeSession({ answers: { situacao_atual: 'dinheiro', elemento: 'terra' } }),
    );
    expect(report.current_moment).toContain('dinheiro');
  });

  it('falls back to fase_nova content for an unknown situation', () => {
    const report = generateMockReport(
      makeSession({ answers: { situacao_atual: 'inexistente', elemento: 'ar' } }),
    );
    expect(report.current_moment).toContain('ciclo');
  });

  it('falls back to agua element content for an unknown elemento', () => {
    const report = generateMockReport(
      makeSession({ answers: { situacao_atual: 'amor', elemento: 'inexistente', sono: 'x' } }),
    );
    expect(report.sections[0].content).toContain('sente antes de entender');
  });

  it('includes the open-text excerpt in the personalized teaser', () => {
    const report = generateMockReport(makeSession());
    expect(report.personalized_teaser).toContain('meu ex ainda aparece nos meus pensamentos');
  });

  it('falls back to "você" when name is empty', () => {
    const report = generateMockReport(makeSession({ name: '' }));
    expect(report.opening.startsWith('você,')).toBe(true);
  });

  it('includes a genie_intro with the situation mood and a trait line mentioning the name', () => {
    const report = generateMockReport(
      makeSession({ name: 'Ana', answers: { situacao_atual: 'dinheiro', elemento: 'terra' } }),
    );
    expect(report.genie_intro.mood).toBe('neutral');
    expect(report.genie_intro.line).toContain('Ana');
  });

  it('falls back to the fase_nova trait for an unknown situation in genie_intro', () => {
    const report = generateMockReport(makeSession({ answers: { situacao_atual: 'inexistente', elemento: 'ar' } }));
    expect(report.genie_intro.line).toContain('virada de ciclo');
  });
});

describe('personalized_echo', () => {
  it('quotes back the labels of the answers the reader actually chose', () => {
    const report = generateMockReport(makeSession());
    expect(report.personalized_echo).toContainEqual({
      label: 'Seu momento',
      answer: 'Estou vivendo algo intenso no amor',
    });
    expect(report.personalized_echo).toContainEqual({
      label: 'Seu elemento',
      answer: 'Água, sensibilidade e emoção',
    });
  });

  it('omits anchor questions the reader never answered', () => {
    const report = generateMockReport(makeSession({ answers: { situacao_atual: 'amor' } }));
    expect(report.personalized_echo).toHaveLength(1);
    expect(report.personalized_echo[0].label).toBe('Seu momento');
  });

  it('is empty rather than throwing when nothing was answered', () => {
    const report = generateMockReport(makeSession({ answers: {} }));
    expect(report.personalized_echo).toEqual([]);
  });

  it('never echoes a raw answer id, only the human label', () => {
    const report = generateMockReport(makeSession());
    for (const entry of report.personalized_echo) {
      expect(entry.answer).not.toMatch(/^[a-z_]+$/);
    }
  });
});

describe('reader_name', () => {
  it('carries the name the reader gave', () => {
    expect(generateMockReport(makeSession()).reader_name).toBe('Ana');
  });

  it('falls back to "você" when the name was skipped', () => {
    expect(generateMockReport(makeSession({ name: '  ' })).reader_name).toBe('você');
  });
});
