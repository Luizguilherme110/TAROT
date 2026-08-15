import { describe, it, expect } from 'vitest';
import { QUIZ_QUESTION_POOL as QUIZ_QUESTIONS } from '../quiz-questions';
import {
  GENIE_REACTIONS,
  GENIE_OPEN_TEXT_REACTION,
  GENIE_WELCOME,
  getGenieReaction,
  getGenieBirthdateGreeting,
} from '../genie-lines';

describe('GENIE_REACTIONS coverage', () => {
  it('has an entry for every choice question and every one of its options', () => {
    const choiceQuestions = QUIZ_QUESTIONS.filter((q) => q.type === 'choice');
    for (const question of choiceQuestions) {
      expect(GENIE_REACTIONS[question.id]).toBeDefined();
      for (const option of question.options) {
        expect(GENIE_REACTIONS[question.id][option.id]).toBeDefined();
      }
    }
  });

  it('has an entry for every open-text question', () => {
    const openQuestions = QUIZ_QUESTIONS.filter((q) => q.type === 'open');
    for (const question of openQuestions) {
      expect(GENIE_OPEN_TEXT_REACTION[question.id]).toBeDefined();
    }
  });
});

describe('getGenieReaction', () => {
  it('returns the welcome line when there is no previous question', () => {
    expect(getGenieReaction(undefined, {}, '')).toEqual(GENIE_WELCOME);
  });

  it('returns the matching reaction for a choice answer', () => {
    const question = QUIZ_QUESTIONS.find((q) => q.id === 'situacao_atual')!;
    const reaction = getGenieReaction(question, { situacao_atual: 'amor' }, '');
    expect(reaction).toEqual(GENIE_REACTIONS.situacao_atual.amor);
  });

  it('falls back to the welcome line for an unanswered or unknown choice option', () => {
    const question = QUIZ_QUESTIONS.find((q) => q.id === 'situacao_atual')!;
    expect(getGenieReaction(question, {}, '')).toEqual(GENIE_WELCOME);
  });

  it('returns the open-text reaction for an open question', () => {
    const question = QUIZ_QUESTIONS.find((q) => q.id === 'sono')!;
    expect(getGenieReaction(question, {}, '')).toEqual(GENIE_OPEN_TEXT_REACTION.sono);
  });

  it('returns a personalized birthdate greeting right after the name question', () => {
    const question = QUIZ_QUESTIONS.find((q) => q.id === 'name')!;
    expect(getGenieReaction(question, {}, 'Ana')).toEqual(getGenieBirthdateGreeting('Ana'));
  });
});

describe('getGenieBirthdateGreeting', () => {
  it('interpolates the trimmed name', () => {
    expect(getGenieBirthdateGreeting('  Ana  ').line).toContain('Prazer, Ana!');
  });

  it('falls back to a name-less greeting when name is blank', () => {
    expect(getGenieBirthdateGreeting('   ').line).toBe(
      'Prazer! Só mais um detalhe antes de eu montar sua leitura.',
    );
  });
});
