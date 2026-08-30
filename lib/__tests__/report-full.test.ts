import { describe, it, expect } from 'vitest';
import { buildFullReport } from '../report-full';
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

describe('composed full report', () => {
  it('keys each paid section off a different answer', () => {
    const full = buildFullReport(
      makeSession({
        answers: {
          situacao_atual: 'amor',
          elemento: 'agua',
          peso_relacoes: 'dar_mais',
          mudar_agora: 'financeiro',
          rotina_atual: 'cansaco',
          lida_incerteza: 'controlar',
        },
      }),
    );
    expect(full.love).toContain('uma conta que você faz sozinho(a)');
    expect(full.career_money).toContain('pra onde vai o que já entra');
    expect(full.attention).toContain('Preste atenção no seu cansaço');
    expect(full.warning).toContain('vontade de controlar tudo');
  });

  it('falls back to the situation baseline for a question the pool never asked', () => {
    const full = buildFullReport(
      makeSession({ answers: { situacao_atual: 'dinheiro', elemento: 'terra' } }),
    );
    expect(full.love).toContain('Questões de dinheiro');
    expect(full.warning).toContain('promessas de ganho fácil');
  });

  it('gives two readers with the same situation different paid text', () => {
    const base = { situacao_atual: 'amor', elemento: 'agua' };
    const first = buildFullReport(makeSession({ answers: { ...base, peso_relacoes: 'medo_abrir' } }));
    const second = buildFullReport(makeSession({ answers: { ...base, peso_relacoes: 'sozinho' } }));
    expect(first.love).not.toBe(second.love);
  });

  it('quotes the reader own sentences inside the paid section', () => {
    const full = buildFullReport(makeSession());
    expect(full.your_words).toContain('meu ex ainda aparece nos meus pensamentos');
    expect(full.your_words).toContain('Ana');
  });

  it('quotes every open answer, not only the first', () => {
    const full = buildFullReport(
      makeSession({
        answers: { situacao_atual: 'amor', sono: 'primeira frase', medo_nao_dito: 'segunda frase' },
      }),
    );
    expect(full.your_words).toContain('primeira frase');
    expect(full.your_words).toContain('segunda frase');
  });

  it('never fabricates a quote when nothing was written', () => {
    const full = buildFullReport(makeSession({ answers: { situacao_atual: 'amor' } }));
    expect(full.your_words).not.toContain('"');
    expect(full.your_words).toContain('escolhas que você marcou');
  });

  it('carries the birth-date reading', () => {
    const full = buildFullReport(makeSession({ birthDate: '1994-07-30' }));
    expect(full.birth_reading).toContain('Leonino');
    expect(full.birth_reading).toContain('Seu número é 6');
  });

  it('leaves the birth reading empty when the date was skipped', () => {
    expect(buildFullReport(makeSession({ birthDate: '' })).birth_reading).toBe('');
  });
});

// The echo is the free half of the personalization and stays client-side, so it
// is checked against the generator rather than the paid builder.
describe('sign echo', () => {
  it('echoes the sign derived from the birth date', () => {
    const report = generateMockReport(makeSession({ birthDate: '1994-07-30' }));
    expect(report.personalized_echo).toContainEqual({ label: 'Seu signo', answer: 'Leão' });
  });

  it('omits the sign when the date was skipped', () => {
    const report = generateMockReport(makeSession({ birthDate: '' }));
    expect(report.personalized_echo.some((entry) => entry.label === 'Seu signo')).toBe(false);
  });

  it('echoes back the pool questions the reader was actually asked', () => {
    const report = generateMockReport(
      makeSession({
        answers: { situacao_atual: 'amor', medo_atual: 'ficar_sozinho', forca_interior: 'intuicao' },
      }),
    );
    expect(report.personalized_echo).toContainEqual({ label: 'Seu medo', answer: 'Ficar sozinho(a)' });
    expect(report.personalized_echo).toContainEqual({ label: 'Sua força', answer: 'Intuição' });
  });
});

describe('your_words against real exported answers', () => {
  it('never quotes a bare "Sim" back at a paying reader', () => {
    const full = buildFullReport(
      makeSession({ answers: { situacao_atual: 'dinheiro', medo_nao_dito: 'Sim', pergunta_ao_universo: 'Sim' } }),
    );
    expect(full.your_words).not.toContain('"Sim"');
    expect(full.your_words).toContain('escolhas que você marcou');
  });

  it('quotes the answers that do carry something', () => {
    const full = buildFullReport(
      makeSession({
        answers: {
          situacao_atual: 'amor',
          sono: 'Vida amorosa 💓',
          pergunta_ao_universo: 'Ainda gosto muito do meu ex mas ele tá namorando com outra',
        },
      }),
    );
    expect(full.your_words).toContain('Vida amorosa 💓');
    expect(full.your_words).toContain('ele tá namorando com outra');
  });
});

describe('the waiting-on-someone fragment', () => {
  it('is served to the readers who picked it', () => {
    const full = buildFullReport(
      makeSession({ answers: { situacao_atual: 'amor', peso_relacoes: 'esperando_volta' } }),
    );
    expect(full.love).toContain('pessoa específica ocupando espaço');
  });

  it('never promises the person comes back', () => {
    const full = buildFullReport(
      makeSession({ answers: { situacao_atual: 'amor', peso_relacoes: 'esperando_volta' } }),
    );
    for (const promise of ['vai voltar', 'volta sim', 'vai te procurar', 'vai retornar']) {
      expect(full.love.toLowerCase()).not.toContain(promise);
    }
  });
});
