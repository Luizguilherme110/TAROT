import { NextResponse } from 'next/server';
import { timingSafeEqual } from 'node:crypto';
import { getSupabaseServiceClient } from '@/lib/supabase/server';

function secretsMatch(received: string, expected: string): boolean {
  const a = Buffer.from(received);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

// Cakto sends { secret, event, data } and expects a 2xx within 8s.
// Auth is the body-level `secret` field (compared timing-safe), not a header signature.
export async function POST(request: Request) {
  const expected = process.env.CAKTO_WEBHOOK_SECRET;
  if (!expected) {
    console.error('CAKTO_WEBHOOK_SECRET not configured');
    return NextResponse.json({ error: 'not configured' }, { status: 500 });
  }

  const body = (await request.json().catch(() => null)) as {
    secret?: string;
    event?: string;
    data?: {
      id?: string;
      refId?: string;
      amount?: number;
      paidAt?: string;
      utm_content?: string;
    };
  } | null;

  if (!body || typeof body.secret !== 'string' || !secretsMatch(body.secret, expected)) {
    return NextResponse.json({ error: 'invalid secret' }, { status: 401 });
  }

  // A refund or chargeback has to walk the access back, otherwise a reader who
  // got their money back keeps the unlocked report forever. `payments/status`
  // only ever grants access on the exact string 'paid', so writing anything
  // else here is enough to re-lock the report on the next poll.
  const REVOKE_EVENTS = new Set(['refund', 'refunded', 'chargeback', 'purchase_refunded']);
  const isApproval = body.event === 'purchase_approved';
  const isRevocation = typeof body.event === 'string' && REVOKE_EVENTS.has(body.event);

  if (!isApproval && !isRevocation) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const sessionId = body.data?.utm_content;
  if (!sessionId || !UUID_RE.test(sessionId)) {
    // Cakto's dashboard "Testar" button sends a placeholder utm_content
    // ("example"), not a real session id — nothing to reconcile, not an error.
    return NextResponse.json({ ok: true, skipped: true });
  }

  const supabase = getSupabaseServiceClient();
  const { error } = await supabase.from('payments').upsert(
    {
      session_id: sessionId,
      status: isApproval ? 'paid' : 'refunded',
      cakto_order_id: body.data?.id ?? body.data?.refId ?? null,
      amount_cents: body.data?.amount ? Math.round(body.data.amount * 100) : null,
      // Keep paid_at meaning "when this was approved" — a revocation must not
      // stamp it with the refund time.
      paid_at: isApproval ? (body.data?.paidAt ?? new Date().toISOString()) : null,
    },
    { onConflict: 'session_id' },
  );

  if (error) {
    console.error('cakto webhook upsert failed:', error.message);
    return NextResponse.json({ error: 'db error' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
