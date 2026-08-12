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
});
