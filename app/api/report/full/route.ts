import { NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/lib/supabase/server';
import { buildFullReport } from '@/lib/report-full';
import type { QuizSession } from '@/lib/report-types';

export const dynamic = 'force-dynamic';

type Body = { sessionId?: string; session?: QuizSession };

/**
 * The paid report, and the only way to reach it.
 *
 * It used to be generated in the browser, which meant the text a reader pays
 * for was sitting in the client bundle for anyone who opened DevTools. Now the
 * paid copy lives in lib/report-full.ts (server-only) and comes out of here
 * exactly once the payment is confirmed.
 *
 * The quiz answers come from the request rather than from `quiz_responses`
 * because those rows are written fire-and-forget from the browser: an ad
 * blocker or a dropped request would leave a paying reader with no answers on
 * file and a broken report. Trusting the client with the *answers* costs
 * nothing — the worst a reader can do is get a reading of a session they made
 * up. What they cannot forge is the payment, which is the part that gates the
 * text, and that is checked here against Supabase with the secret key.
 */
export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: 'Corpo inválido.' }, { status: 400 });
  }

  const sessionId = body.sessionId?.trim();
  const session = body.session;
  if (!sessionId || !session) {
    return NextResponse.json({ error: 'Sessão ausente.' }, { status: 400 });
  }

  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase
    .from('payments')
    .select('status')
    .eq('session_id', sessionId)
    .maybeSingle();

  // A read failure must not hand out the report — fail closed, and let the
  // client keep polling rather than showing a paying reader a permanent error.
  if (error) {
    return NextResponse.json({ error: 'Não foi possível confirmar o pagamento.' }, { status: 503 });
  }
  if (data?.status !== 'paid') {
    return NextResponse.json({ error: 'Pagamento não encontrado.' }, { status: 403 });
  }

  return NextResponse.json(
    { full: buildFullReport(session) },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
