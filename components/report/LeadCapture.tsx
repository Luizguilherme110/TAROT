'use client';

import { useEffect, useState } from 'react';
import { EnvelopeSimple } from '@phosphor-icons/react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { getOrCreateSessionId, trackEvent } from '@/lib/analytics/track';
import { browserStorage, readPersisted, writePersisted } from '@/lib/persistent-storage';

const LEAD_STATE_KEY = 'tarot_lead_v1';

// Anyone who leaves without buying is unreachable today, which is most of the
// funnel. This asks for an address and nothing else, never blocks the report,
// and can be dismissed — a hard gate here would cost more sales than the list
// is worth.
//
// The answer is remembered across the Cakto round trip so a reader coming back
// from checkout is not asked a second time.
export function LeadCapture() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'hidden' | 'idle' | 'submitting' | 'done'>('hidden');
  const [invalid, setInvalid] = useState(false);

  useEffect(() => {
    const stored = readPersisted(LEAD_STATE_KEY, browserStorage('local'), browserStorage('session'));
    setState(stored === 'done' || stored === 'dismissed' ? 'hidden' : 'idle');
  }, []);

  function remember(value: 'done' | 'dismissed') {
    writePersisted(LEAD_STATE_KEY, value, browserStorage('local'));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const value = email.trim();
    // Deliberately loose: the point is to catch a typo, not to police addresses.
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setInvalid(true);
      return;
    }

    setInvalid(false);
    setState('submitting');
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase
      .from('leads')
      .insert({ session_id: getOrCreateSessionId(), email: value });

    // 23505 is the unique index on session_id: this session already left an
    // address (localStorage was cleared in between). Nothing failed — the
    // address is stored, so show the reader the same confirmation.
    if (error && error.code !== '23505') {
      console.error('lead capture failed:', error.message);
      setState('idle');
      return;
    }

    trackEvent('lead_captured');
    remember('done');
    setState('done');
  }

  function handleDismiss() {
    trackEvent('lead_dismissed');
    remember('dismissed');
    setState('hidden');
  }

  if (state === 'hidden') return null;

  if (state === 'done') {
    return (
      <section className="mt-8 rounded-2xl border border-gold-400/30 bg-gold-400/5 p-5 text-center">
        <p className="text-sm leading-snug text-parchment-100">
          Pronto. Guardamos sua leitura nesse e-mail.
        </p>
      </section>
    );
  }

  return (
    <section className="mt-8 rounded-2xl border border-white/10 bg-ink-900 p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <EnvelopeSimple size={18} weight="bold" className="mt-[2px] shrink-0 text-gold-400" />
        <div>
          <p className="font-display text-base leading-snug text-parchment-100">
            Quer guardar essa leitura?
          </p>
          <p className="mt-1 text-sm leading-snug text-parchment-400">
            Deixe seu e-mail e a gente guarda sua tiragem pra você voltar quando quiser.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-4">
        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          enterKeyHint="go"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setInvalid(false);
          }}
          placeholder="seu@email.com"
          aria-label="Seu e-mail"
          aria-invalid={invalid}
          // 16px minimum keeps iOS Safari from zooming the whole page on focus.
          className="w-full rounded-xl border border-white/15 bg-ink-950 px-4 py-3.5 text-base text-parchment-100 placeholder:text-parchment-400/60 focus:border-gold-400/60 focus:outline-none"
        />
        {invalid && <p className="mt-2 text-xs text-gold-400">Confira o e-mail digitado.</p>}
        <button
          type="submit"
          disabled={state === 'submitting'}
          className="mt-3 w-full rounded-xl bg-white/10 px-6 py-3.5 font-display text-sm text-parchment-100 transition-colors duration-200 hover:bg-white/15 disabled:opacity-60"
        >
          {state === 'submitting' ? 'Guardando…' : 'Guardar minha leitura'}
        </button>
      </form>

      <button
        type="button"
        onClick={handleDismiss}
        className="mt-3 w-full py-2 text-xs text-parchment-400 underline underline-offset-4"
      >
        Agora não
      </button>
    </section>
  );
}
