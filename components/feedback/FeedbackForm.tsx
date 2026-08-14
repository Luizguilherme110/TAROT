'use client';

import { useState } from 'react';
import { Star } from '@phosphor-icons/react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { getOrCreateSessionId, trackEvent } from '@/lib/analytics/track';

// Sits quietly at the bottom of the page for whoever wants to use it - never a
// popup, never blocks anything, no required field to submit.
export function FeedbackForm() {
  const [rating, setRating] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done'>('idle');

  async function handleSubmit() {
    if (rating === null && message.trim() === '') return;
    setStatus('submitting');
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase
      .from('feedback')
      .insert({ session_id: getOrCreateSessionId(), rating, message: message.trim() || null });
    if (error) {
      console.error('feedback submit failed:', error.message);
      setStatus('idle');
      return;
    }
    trackEvent('feedback_submitted', { rating });
    setStatus('done');
  }

  if (status === 'done') {
    return (
      <p className="mx-auto mt-16 max-w-md text-center text-sm text-parchment-400">
        Obrigado pelo feedback.
      </p>
    );
  }

  return (
    <section className="mx-auto mt-16 max-w-md text-center">
      <p className="font-display text-sm text-parchment-100">O que achou da sua leitura?</p>
      <div className="mt-4 flex justify-center gap-2">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setRating(value)}
            aria-label={`Nota ${value} de 5`}
            aria-pressed={rating === value}
            className="p-1"
          >
            <Star
              size={24}
              weight={rating !== null && value <= rating ? 'fill' : 'light'}
              className={rating !== null && value <= rating ? 'text-gold-400' : 'text-parchment-400/50'}
            />
          </button>
        ))}
      </div>
      <textarea
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        placeholder="Quer contar mais alguma coisa? (opcional)"
        rows={3}
        className="mt-4 w-full resize-none rounded-2xl border border-white/10 bg-ink-900 px-4 py-3 text-sm text-parchment-100 placeholder:text-parchment-400/60 focus:border-gold-400/50 focus:outline-none"
      />
      <button
        type="button"
        onClick={handleSubmit}
        disabled={status === 'submitting' || (rating === null && message.trim() === '')}
        className="mt-4 inline-flex items-center justify-center rounded-full border border-gold-400/40 px-6 py-2 text-sm text-gold-400 transition-colors duration-200 hover:bg-gold-400/10 disabled:opacity-40"
      >
        {status === 'submitting' ? 'Enviando...' : 'Enviar feedback'}
      </button>
    </section>
  );
}
