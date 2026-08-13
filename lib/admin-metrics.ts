import { getSupabaseServiceClient } from '@/lib/supabase/server';

const FUNNEL_STEPS = [
  { event: 'landing_view', label: 'Visitou a landing' },
  { event: 'quiz_step_view', label: 'Entrou no quiz' },
  { event: 'card_picker_view', label: 'Chegou na escolha da carta' },
  { event: 'card_picked', label: 'Escolheu uma carta' },
  { event: 'report_view', label: 'Viu a prévia da leitura' },
  { event: 'feedback_submitted', label: 'Deixou feedback' },
] as const;

export type FunnelStepCount = { event: string; label: string; count: number };

export async function getFunnelCounts(): Promise<FunnelStepCount[]> {
  const supabase = getSupabaseServiceClient();

  return Promise.all(
    FUNNEL_STEPS.map(async (step) => {
      const { data, error } = await supabase.from('funnel_events').select('session_id').eq('event_name', step.event);
      if (error || !data) return { ...step, count: 0 };
      return { ...step, count: new Set(data.map((row) => row.session_id as string)).size };
    }),
  );
}

export type FeedbackRow = { rating: number | null; message: string | null; created_at: string };

export async function getRecentFeedback(): Promise<FeedbackRow[]> {
  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase
    .from('feedback')
    .select('rating, message, created_at')
    .order('created_at', { ascending: false })
    .limit(50);
  if (error || !data) return [];
  return data as FeedbackRow[];
}
