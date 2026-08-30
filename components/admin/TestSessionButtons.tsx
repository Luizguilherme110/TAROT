'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FlaskIcon, CreditCardIcon, TrashIcon } from '@phosphor-icons/react';
import { buildTestSession } from '@/lib/test-session';

// The same keys the real funnel writes. Seeding them from /admin works because
// localStorage is per-origin, and /admin and /leitura share one.
const SESSION_ID_KEY = 'tarot_session_id_v1';
const QUIZ_STATE_KEY = 'tarot_quiz_session_v1';

type Busy = 'unpaid' | 'paid' | 'clear' | null;

/**
 * Fills in a whole quiz session and drops you on the report, so the paywall,
 * the checkout round trip and the paid report can all be checked without
 * clicking through fourteen steps or spending R$ 19,90 each time.
 */
export function TestSessionButtons() {
  const router = useRouter();
  const [busy, setBusy] = useState<Busy>(null);
  const [message, setMessage] = useState<string | null>(null);

  function seed(): string {
    const sessionId = crypto.randomUUID();
    const { state } = buildTestSession(sessionId);
    // Overwrites whatever session this browser was carrying — that is the
    // point: each run starts a clean reader, so a previous test's paid flag
    // never makes the paywall look broken.
    localStorage.setItem(SESSION_ID_KEY, sessionId);
    localStorage.setItem(QUIZ_STATE_KEY, JSON.stringify(state));
    return sessionId;
  }

  function startUnpaid() {
    setBusy('unpaid');
    seed();
    router.push('/leitura/resultado');
  }

  async function startPaid() {
    setBusy('paid');
    setMessage(null);
    const sessionId = seed();
    try {
      const res = await fetch('/admin/test-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setMessage(data.error ?? 'Não foi possível marcar como pago.');
        setBusy(null);
        return;
      }
    } catch {
      setMessage('Não foi possível marcar como pago.');
      setBusy(null);
      return;
    }
    router.push('/leitura/resultado');
  }

  async function clearTests() {
    setBusy('clear');
    setMessage(null);
    try {
      const res = await fetch('/admin/test-session', { method: 'DELETE' });
      const data = (await res.json().catch(() => ({}))) as { removed?: number; error?: string };
      setMessage(res.ok ? `${data.removed ?? 0} pagamento(s) de teste removido(s).` : (data.error ?? 'Falhou.'));
      if (res.ok) router.refresh();
    } catch {
      setMessage('Falhou.');
    }
    setBusy(null);
  }

  return (
    <section className="mx-auto mt-10 max-w-4xl rounded-2xl border border-white/10 bg-ink-900 p-5">
      <h2 className="font-display text-sm uppercase tracking-[0.18em] text-gold-400">Testes</h2>
      <p className="mt-2 text-sm leading-relaxed text-parchment-400">
        Preenche um quiz completo e leva direto pra leitura. Pagamentos de teste são gravados com valor
        zero e não entram no funil, no faturamento nem na contagem de vendas acima.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={startUnpaid}
          disabled={busy !== null}
          className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-parchment-400 transition-colors duration-200 hover:border-gold-400/40 hover:text-parchment-100 disabled:opacity-40"
        >
          <FlaskIcon size={16} weight="bold" />
          {busy === 'unpaid' ? 'Abrindo...' : 'Testar sem pagar'}
        </button>
        <button
          type="button"
          onClick={startPaid}
          disabled={busy !== null}
          className="flex items-center gap-2 rounded-full border border-gold-400/40 px-4 py-2 text-sm text-gold-400 transition-colors duration-200 hover:border-gold-400 hover:text-parchment-100 disabled:opacity-40"
        >
          <CreditCardIcon size={16} weight="bold" />
          {busy === 'paid' ? 'Liberando...' : 'Testar como quem pagou'}
        </button>
        <button
          type="button"
          onClick={clearTests}
          disabled={busy !== null}
          className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-parchment-400 transition-colors duration-200 hover:border-red-400/40 hover:text-parchment-100 disabled:opacity-40"
        >
          <TrashIcon size={16} weight="bold" />
          {busy === 'clear' ? 'Limpando...' : 'Limpar pagamentos de teste'}
        </button>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-parchment-400/70">
        <strong className="text-parchment-400">Sem pagar</strong> abre a leitura no paywall — dali dá pra
        clicar no botão real e ir até a Cakto pra testar a volta, sem concluir o pagamento.{' '}
        <strong className="text-parchment-400">Como quem pagou</strong> libera a leitura completa na hora.
      </p>
      {message && <p className="mt-3 text-sm text-gold-400">{message}</p>}
    </section>
  );
}
