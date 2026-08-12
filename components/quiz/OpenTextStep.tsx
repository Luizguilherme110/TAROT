'use client';

import { useState } from 'react';
import type { QuizQuestion } from '@/lib/quiz-questions';

type Props = {
  question: Extract<QuizQuestion, { type: 'open' }>;
  value: string | undefined;
  onSubmit: (value: string) => void;
};

export function OpenTextStep({ question, value, onSubmit }: Props) {
  const [text, setText] = useState(value ?? '');

  return (
    <div className="w-full max-w-md">
      <h2 className="font-display text-2xl leading-snug text-parchment-100">{question.prompt}</h2>
      <textarea
        value={text}
        onChange={(event) => setText(event.target.value.slice(0, question.maxLength))}
        placeholder={question.placeholder}
        rows={4}
        className="mt-8 w-full rounded-2xl border border-white/10 bg-ink-900 px-5 py-4 text-parchment-100 outline-none transition-colors duration-200 placeholder:text-parchment-400/60 focus:border-gold-400"
      />
      <p className="mt-2 text-right text-xs text-parchment-400">
        {text.length}/{question.maxLength}
      </p>
      <button
        type="button"
        disabled={text.trim().length === 0}
        onClick={() => onSubmit(text.trim())}
        className="mt-6 inline-flex items-center justify-center rounded-full bg-gold-400 px-8 py-4 font-display text-sm font-medium text-ink-950 transition-transform duration-300 ease-out hover:-translate-y-0.5 hover:bg-gold-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
      >
        Continuar
      </button>
    </div>
  );
}
