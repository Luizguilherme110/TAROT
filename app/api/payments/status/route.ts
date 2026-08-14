import { NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const sessionId = new URL(request.url).searchParams.get('session_id');
  if (!sessionId) {
    return NextResponse.json({ error: 'session_id required' }, { status: 400 });
  }

  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase
    .from('payments')
    .select('status')
    .eq('session_id', sessionId)
    .maybeSingle();

  if (error) {
    console.error('payments status lookup failed:', error.message);
    return NextResponse.json({ error: 'db error' }, { status: 500 });
  }

  return NextResponse.json({ paid: data?.status === 'paid' });
}
