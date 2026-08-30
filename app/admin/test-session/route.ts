import { NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/lib/supabase/server';
import { TEST_ORDER_PREFIX } from '@/lib/admin-metrics';

export const dynamic = 'force-dynamic';

/**
 * Marks a seeded session as paid so the full report can be checked without
 * spending R$ 19,90 on every test.
 *
 * Lives under /admin rather than /api so it is covered by the same two locks as
 * the panel itself: the middleware matcher and the admin cookie's `path=/admin`
 * scope. There is deliberately no public route that can write a paid row.
 *
 * Test rows are written with a `TEST-` order id and zero cents, and every admin
 * metric filters them out — otherwise a few minutes of testing would quietly
 * turn into fake revenue on the dashboard.
 */
export async function POST(request: Request) {
  let sessionId: string | undefined;
  try {
    sessionId = ((await request.json()) as { sessionId?: string }).sessionId?.trim();
  } catch {
    return NextResponse.json({ error: 'Corpo inválido.' }, { status: 400 });
  }
  if (!sessionId) {
    return NextResponse.json({ error: 'sessionId ausente.' }, { status: 400 });
  }

  const supabase = getSupabaseServiceClient();
  const { error } = await supabase.from('payments').upsert(
    {
      session_id: sessionId,
      status: 'paid',
      cakto_order_id: `${TEST_ORDER_PREFIX}${sessionId}`,
      amount_cents: 0,
      paid_at: new Date().toISOString(),
    },
    { onConflict: 'session_id' },
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

/** Removes every test payment, so the table goes back to real sales only. */
export async function DELETE() {
  const supabase = getSupabaseServiceClient();
  const { error, count } = await supabase
    .from('payments')
    .delete({ count: 'exact' })
    .like('cakto_order_id', `${TEST_ORDER_PREFIX}%`);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, removed: count ?? 0 });
}
