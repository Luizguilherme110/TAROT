import { describe, it, expect } from 'vitest';
import { buildTestSession } from '../test-session';
import { getQuestionById } from '../quiz-questions';
import { generateMockReport } from '../generate-mock-report';
import { buildFullReport } from '../report-full';

describe('buildTestSession', () => {
  it('answers every question in the order it generated', () => {
    const { state } = buildTestSession('abc');
    for (const questionId of state.questionOrder) {
      const question = getQuestionById(questionId);
      if (question?.type === 'choice' || question?.type === 'open') {
        expect(state.answers[questionId], questionId).toBeTruthy();
      }
    }
  });

  it('only ever picks option ids the question actually offers', () => {
    const { state } = buildTestSession('abc');
    for (const [questionId, answer] of Object.entries(state.answers)) {
      const question = getQuestionById(questionId);
      if (question?.type !== 'choice') continue;
      expect(question.options.map((option) => option.id), questionId).toContain(answer);
    }
  });

  it('produces a birth date the sign lookup accepts', () => {
    const { state } = buildTestSession('abc');
    expect(state.birthDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(buildFullReport(state).birth_reading).not.toBe('');
  });

  it('draws three distinct cards so the spread renders', () => {
    const { state } = buildTestSession('abc');
    expect(state.cardIds).toHaveLength(3);
    expect(new Set(state.cardIds).size).toBe(3);
    expect(generateMockReport(state).spread).toHaveLength(3);
  });

  it('writes open answers that survive the quotable filter', () => {
    const full = buildFullReport(buildTestSession('abc').state);
    expect(full.your_words).toContain('"');
    expect(full.your_words).not.toContain('escolhas que você marcou');
  });

  it('carries the session id it was given', () => {
    expect(buildTestSession('sessao-123').sessionId).toBe('sessao-123');
  });
});
