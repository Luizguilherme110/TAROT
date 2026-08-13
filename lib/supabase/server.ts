import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Secret key — bypasses RLS. Import only from server components / route handlers,
// never from a 'use client' file (that would leak it into the browser bundle).
export function getSupabaseServiceClient(): SupabaseClient {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!, {
    auth: { persistSession: false },
  });
}
