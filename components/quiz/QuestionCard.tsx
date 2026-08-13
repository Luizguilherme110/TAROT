'use client';

import { motion, useReducedMotion } from 'motion/react';
import type { QuizQuestion } from '@/lib/quiz-questions';

type Props = {
  question: Extract<QuizQuestion, { type: 'choice' }>;
  value: string | undefined;
  onAnswer: (optionId: string) => void;
};

export function QuestionCard({ question, value, onAnswer }: Props) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-md"
    >
      <h2 className="font-display text-2xl leading-snug text-parchment-100">{question.prompt}</h2>
      <div className="mt-8 flex flex-col gap-3">
        {question.options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onAnswer(option.id)}
            aria-pressed={value === option.id}
            className={`rounded-2xl border px-5 py-4 text-left transition-colors duration-200 ${
              value === option.id
                ? 'border-gold-400 bg-gold-400/10 text-parchment-100'
                : 'border-white/10 bg-ink-900 text-parchment-400 hover:border-white/20 hover:text-parchment-100'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
