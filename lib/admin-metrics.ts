import { getSupabaseServiceClient } from '@/lib/supabase/server';
import { getQuestionById, getAnswerLabel } from '@/lib/quiz-questions';

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

export type PaymentRow = {
  session_id: string;
  amount_cents: number | null;
  cakto_order_id: string | null;
  paid_at: string | null;
};

export async function getRecentPayments(): Promise<PaymentRow[]> {
  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase
    .from('payments')
    .select('session_id, amount_cents, cakto_order_id, paid_at')
    .eq('status', 'paid')
    .order('paid_at', { ascending: false })
    .limit(50);
  if (error || !data) return [];
  return data as PaymentRow[];
}

export async function getPaidCount(): Promise<number> {
  const supabase = getSupabaseServiceClient();
  const { count, error } = await supabase
    .from('payments')
    .select('session_id', { count: 'exact', head: true })
    .eq('status', 'paid');
  if (error) return 0;
  return count ?? 0;
}

export type OpenAnswerRow = { prompt: string; answer: string; created_at: string };

type RawResponse = {
  session_id: string;
  question_id: string;
  answer: string;
  created_at: string;
};

// The table is insert-only (see 0004_quiz_responses.sql), so going back and
// changing an answer leaves both rows. Rows arrive newest first, so the first
// one seen for a session/question pair is the answer that counted.
function latestPerSessionQuestion(rows: RawResponse[]): RawResponse[] {
  const seen = new Set<string>();
  return rows.filter((row) => {
    const key = `${row.session_id}:${row.question_id}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function fetchResponses(questionType: 'choice' | 'open', limit: number): Promise<RawResponse[]> {
  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase
    .from('quiz_responses')
    .select('session_id, question_id, answer, created_at')
    .eq('question_type', questionType)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error || !data) return [];
  return latestPerSessionQuestion(data as RawResponse[]);
}

/** What readers typed in their own words — the raw material for ad copy. */
export async function getOpenAnswers(): Promise<OpenAnswerRow[]> {
  const rows = await fetchResponses('open', 500);
  return rows.map((row) => {
    const question = getQuestionById(row.question_id);
    return {
      prompt: question && 'prompt' in question ? question.prompt : row.question_id,
      answer: row.answer,
      created_at: row.created_at,
    };
  });
}

export type ChoiceBreakdown = {
  questionId: string;
  prompt: string;
  total: number;
  options: { label: string; count: number; share: number }[];
};

/** Which situation each reader picked, so the dominant pain is visible at a glance. */
export async function getChoiceBreakdown(): Promise<ChoiceBreakdown[]> {
  const rows = await fetchResponses('choice', 2000);

  const byQuestion = new Map<string, Map<string, number>>();
  for (const row of rows) {
    const counts = byQuestion.get(row.question_id) ?? new Map<string, number>();
    counts.set(row.answer, (counts.get(row.answer) ?? 0) + 1);
    byQuestion.set(row.question_id, counts);
  }

  return [...byQuestion.entries()]
    .map(([questionId, counts]) => {
      const question = getQuestionById(questionId);
      const total = [...counts.values()].reduce((sum, n) => sum + n, 0);
      return {
        questionId,
        prompt: question && 'prompt' in question ? question.prompt : questionId,
        total,
        options: [...counts.entries()]
          .map(([answerId, count]) => ({
            label: getAnswerLabel(questionId, answerId) ?? answerId,
            count,
            share: total > 0 ? Math.round((count / total) * 100) : 0,
          }))
          .sort((a, b) => b.count - a.count),
      };
    })
    .sort((a, b) => b.total - a.total);
}
